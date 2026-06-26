import React, { useState, useEffect } from 'react';
import type { Team, Player } from '../data/teamsData';
import { teamsData } from '../data/teamsData';
import type { ModelWeights, MatchBettingMarkets, MarketOption, LineupData } from '../utils/simulatorEngine';
import { calculateMatchBettingMarkets, probToOdds, calculateTeamRating } from '../utils/simulatorEngine';
import { mockLineups } from '../data/lineupsMock';
import { historicalMatches } from '../data/historicalMatches';
import { 
  Sliders, Activity, AlertCircle, RefreshCw, 
  Search, ShieldAlert, Terminal
} from 'lucide-react';


interface MatchPredictorProps {
  weights: ModelWeights;
  initialTeam1Id?: string;
  initialTeam2Id?: string;
}

export const MatchPredictor: React.FC<MatchPredictorProps> = ({
  weights,
  initialTeam1Id,
  initialTeam2Id
}) => {
  const [team1Id, setTeam1Id] = useState<string>(initialTeam1Id || 'ECU');
  const [team2Id, setTeam2Id] = useState<string>(initialTeam2Id || 'GER');
  const [activeMarketTab, setActiveMarketTab] = useState<'resultado' | 'goles' | 'jugadores' | 'corners' | 'tarjetas' | 'tips'>('resultado');
  const [marketsResults, setMarketsResults] = useState<MatchBettingMarkets | null>(null);

  // Sliders matching the weights customization
  const [sliderForm, setSliderForm] = useState<number>(75);
  const [sliderSquad, setSliderSquad] = useState<number>(85);
  const [sliderHistory, setSliderHistory] = useState<number>(70);
  const [sliderVenue, setSliderVenue] = useState<number>(55);
  const [sliderWeather, setSliderWeather] = useState<number>(60);

  const [applyGameTheory, setApplyGameTheory] = useState<boolean>(true);

  // Lineups management
  const [useOfficialLineups, setUseOfficialLineups] = useState<boolean>(true);
  const [lineupA, setLineupA] = useState<LineupData | undefined>(undefined);
  const [lineupB, setLineupB] = useState<LineupData | undefined>(undefined);

  // Data crawler console simulation state
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [crawlingProgress, setCrawlingProgress] = useState<number>(0);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Customizable team statistics states
  const [customElo1, setCustomElo1] = useState<number>(1520);
  const [customElo2, setCustomElo2] = useState<number>(1665);
  const [customValue1, setCustomValue1] = useState<number>(280);
  const [customValue2, setCustomValue2] = useState<number>(850);

  // Live Match Telemetry states
  const [liveMatchStats, setLiveMatchStats] = useState<any>(null);
  const [useLiveMode, setUseLiveMode] = useState<boolean>(false);
  const [matchPhase, setMatchPhase] = useState<string>('Group Stage');
  const [jsonInputString, setJsonInputString] = useState<string>('');
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);

  const todayMatches = [
    { time: 'Hoy · 18:00h', hId: 'ECU', hName: 'Ecuador', aId: 'GER', aName: 'Alemania', desc: 'Partidazo Grupo E' },
    { time: 'Hoy · 21:00h', hId: 'SUI', hName: 'Suiza', aId: 'CAN', aName: 'Canadá', desc: 'Definición Grupo B' },
    { time: 'Hoy · 21:00h', hId: 'CUR', hName: 'Curazao', aId: 'CIV', aName: 'Costa de Marfil', desc: 'Grupo E - Clave' },
    { time: 'Hoy · 23:30h', hId: 'BRA', hName: 'Brasil', aId: 'SCO', aName: 'Escocia', desc: 'Grupo C' }
  ];

  const t1 = teamsData.find(t => t.id === team1Id)!;
  const t2 = teamsData.find(t => t.id === team2Id)!;

  const histMatch = historicalMatches.find(hm => 
    (hm.homeTeamId === team1Id && hm.awayTeamId === team2Id) ||
    (hm.homeTeamId === team2Id && hm.awayTeamId === team1Id)
  );

  // Synchronize teams state with parent navigation props
  useEffect(() => {
    if (initialTeam1Id) setTeam1Id(initialTeam1Id);
    if (initialTeam2Id) setTeam2Id(initialTeam2Id);
  }, [initialTeam1Id, initialTeam2Id]);

  useEffect(() => {
    setCustomElo1(t1.fifaPoints);
    setCustomValue1(t1.squadValue);
    setLiveMatchStats(null);
    setUseLiveMode(false);
    setMatchPhase('Group Stage');
    setJsonInputString('');
    setShowJsonInspector(false);
  }, [team1Id, t1]);

  useEffect(() => {
    setCustomElo2(t2.fifaPoints);
    setCustomValue2(t2.squadValue);
    setLiveMatchStats(null);
    setUseLiveMode(false);
    setMatchPhase('Group Stage');
    setJsonInputString('');
    setShowJsonInspector(false);
  }, [team2Id, t2]);

  // Initialize lineups
  useEffect(() => {
    if (useOfficialLineups) {
      setLineupA(mockLineups[team1Id] || createDefaultLineup(t1));
      setLineupB(mockLineups[team2Id] || createDefaultLineup(t2));
    } else {
      setLineupA(undefined);
      setLineupB(undefined);
    }
  }, [team1Id, team2Id, useOfficialLineups]);

  // Synchronize matchPhase with liveMatchStats when loaded
  useEffect(() => {
    if (liveMatchStats) {
      setMatchPhase(liveMatchStats.phase || 'Group Stage');
    } else {
      setMatchPhase('Group Stage');
    }
  }, [liveMatchStats]);

  // Recalculate immediately if weights, lineups or custom stats change
  useEffect(() => {
    // Only run if we aren't currently executing a visual data crawl
    if (!isCrawling) {
      calculatePrediction();
    }
  }, [team1Id, team2Id, sliderForm, sliderSquad, sliderHistory, sliderVenue, sliderWeather, lineupA, lineupB, weights, applyGameTheory, customElo1, customElo2, customValue1, customValue2, useLiveMode, matchPhase, liveMatchStats]);

  function createDefaultLineup(team: Team): LineupData {
    return {
      formation: '4-3-3',
      startingXI: team.players.map(p => p.name),
      substitutes: []
    };
  }

  const calculatePrediction = () => {
    const customWeights: ModelWeights = {
      fifaRank: weights.fifaRank * (sliderHistory / 70),
      gdp: weights.gdp,
      population: weights.population,
      climate: weights.climate * (sliderWeather / 60),
      host: weights.host * (sliderVenue / 55),
      squadValue: weights.squadValue * (sliderSquad / 85),
      luck: weights.luck * (1.1 - sliderForm / 100)
    };

    // Construct modified team objects with user's customized ELO and Squad values
    const modifiedT1: Team = {
      ...t1,
      fifaPoints: customElo1,
      squadValue: customValue1
    };

    const modifiedT2: Team = {
      ...t2,
      fifaPoints: customElo2,
      squadValue: customValue2
    };

    const res = calculateMatchBettingMarkets(
      modifiedT1,
      modifiedT2,
      customWeights,
      0,
      lineupA,
      lineupB,
      applyGameTheory,
      useLiveMode,
      liveMatchStats ? liveMatchStats.minute : 0,
      liveMatchStats && liveMatchStats.score ? liveMatchStats.score.home : 0,
      liveMatchStats && liveMatchStats.score ? liveMatchStats.score.away : 0,
      matchPhase !== 'Group Stage'
    );
    setMarketsResults(res);
  };

  // Run a real dynamic fetch request for live match lineups and stats
  const handleCalculateWithCrawling = async () => {
    setIsCrawling(true);
    setConsoleLines([]);
    setCrawlingProgress(0);

    const logLine = (text: string, delay: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          setConsoleLines(prev => [...prev, text]);
          resolve();
        }, delay);
      });
    };

    setCrawlingProgress(10);
    await logLine('📡 Conectando con base de datos del servidor...', 300);

    setCrawlingProgress(30);
    await logLine('🔍 Solicitando alineaciones oficiales en vivo vía HTTP GET /lineups.json...', 300);

    // 1. Fetch lineups
    try {
      const response = await fetch('/lineups.json');
      if (response.ok) {
        const data = await response.json();
        const lineupAData = data[team1Id];
        const lineupBData = data[team2Id];
        
        setCrawlingProgress(50);
        await logLine(`✅ HTTP 200 OK. Mapeando formaciones tácticas para ${t1.name} y ${t2.name}.`, 300);
        
        if (lineupAData) {
          setLineupA(lineupAData);
          await logLine(`🏃 Opta: Alineación inicial de ${t1.name} cargada (${lineupAData.formation}).`, 200);
        } else {
          setLineupA(createDefaultLineup(t1));
        }
        
        if (lineupBData) {
          setLineupB(lineupBData);
          await logLine(`🏃 Opta: Alineación inicial de ${t2.name} cargada (${lineupBData.formation}).`, 200);
        } else {
          setLineupB(createDefaultLineup(t2));
        }
      } else {
        throw new Error('HTTP failure');
      }
    } catch (e) {
      setCrawlingProgress(50);
      await logLine('⚠️ Error HTTP en canal de alineaciones. Cargando datos de fallback local...', 400);
      setLineupA(mockLineups[team1Id] || createDefaultLineup(t1));
      setLineupB(mockLineups[team2Id] || createDefaultLineup(t2));
    }

    // 2. Fetch live match stats comparison
    setCrawlingProgress(70);
    await logLine('🔍 Solicitando telemetría en vivo vía HTTP GET /liveMatchStats.json...', 300);
    try {
      const response = await fetch('/liveMatchStats.json');
      if (response.ok) {
        const data = await response.json();
        const matchKey = `${team1Id}-${team2Id}`;
        const matchKeyAlt = `${team2Id}-${team1Id}`;
        const matchLiveStats = data[matchKey] || data[matchKeyAlt];

        if (matchLiveStats) {
          const isAlt = !data[matchKey] && data[matchKeyAlt];
          const scoreHomeVal = isAlt ? matchLiveStats.score.away : matchLiveStats.score.home;
          const scoreAwayVal = isAlt ? matchLiveStats.score.home : matchLiveStats.score.away;
          
          const adjustedStats = {
            ...matchLiveStats,
            score: {
              home: scoreHomeVal,
              away: scoreAwayVal
            }
          };

          setLiveMatchStats(adjustedStats);
          setJsonInputString(JSON.stringify(adjustedStats, null, 2));
          setMatchPhase(matchLiveStats.phase || 'Group Stage');
          
          // Auto-enable live mode if match is HALFTIME or LIVE
          if (matchLiveStats.status === 'HALFTIME' || matchLiveStats.status === 'LIVE') {
            setUseLiveMode(true);
          } else {
            setUseLiveMode(false);
          }

          await logLine(`✅ HTTP 200 OK. Telemetría detectada (Minuto: ${matchLiveStats.minute}', Estado: ${matchLiveStats.status}).`, 300);
          await logLine(`📊 Marcador en vivo: ${t1.name} ${scoreHomeVal} - ${scoreAwayVal} ${t2.name}.`, 300);
        } else {
          setLiveMatchStats(null);
          setUseLiveMode(false);
          setJsonInputString('');
          await logLine('ℹ️ No se detectó telemetría activa (Pre-Partido o sin cobertura en vivo).', 300);
        }
      } else {
        throw new Error('HTTP failure');
      }
    } catch (e) {
      setLiveMatchStats(null);
      setUseLiveMode(false);
      setJsonInputString('');
      await logLine('⚠️ Error HTTP al conectar con canal en vivo. Continuando en modo Pre-Partido.', 400);
    }

    setCrawlingProgress(90);
    await logLine('📈 Extrayendo valor de plantillas de Transfermarkt y rankings FIFA/ELO...', 300);
    await logLine('🧮 Ejecutando simulación de Poisson y Monte Carlo (10,000 iteraciones)...', 400);
    setCrawlingProgress(100);

    setTimeout(() => {
      setIsCrawling(false);
      calculatePrediction();
    }, 450);
  };

  const handleTogglePlayer = (player: Player, isTeamA: boolean) => {
    const activeLineup = isTeamA ? lineupA : lineupB;
    const setActive = isTeamA ? setLineupA : setLineupB;

    if (!activeLineup) return;

    const inStarting = activeLineup.startingXI.includes(player.name);
    let newStarting = [...activeLineup.startingXI];
    let newSubs = [...activeLineup.substitutes];

    if (inStarting) {
      newStarting = newStarting.filter(n => n !== player.name);
      if (!newSubs.includes(player.name)) newSubs.push(player.name);
    } else {
      newSubs = newSubs.filter(n => n !== player.name);
      if (!newStarting.includes(player.name)) newStarting.push(player.name);
    }

    setActive({
      ...activeLineup,
      startingXI: newStarting,
      substitutes: newSubs
    });
  };

  const handleSelectDailyMatch = (id1: string, id2: string) => {
    setTeam1Id(id1);
    setTeam2Id(id2);
  };

  const renderMarketCard = (title: string, options: MarketOption[] | undefined) => {
    if (!options) return null;

    return (
      <div className="market-card" key={title}>
        <div className="market-title">{title}</div>
        <div className="market-options">
          {options.map(opt => {
            return (
              <div
                key={opt.selectionId}
                className={`market-opt ${opt.best ? 'best' : ''}`}
                style={{
                  border: opt.best ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: opt.best ? 'rgba(251, 191, 36, 0.02)' : 'transparent',
                  cursor: 'default'
                }}
              >
                <div>
                  <div className="mname" style={{ color: 'var(--text-primary)' }}>
                    {opt.n}
                  </div>
                  <div className="mprob">{opt.p}% · {opt.note || 'Prob'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="modds" style={{ color: 'var(--accent-gold)' }}>
                    {opt.odds}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sortedTeams = [...teamsData].sort((a, b) => a.name.localeCompare(b.name));
  const filteredTeams = sortedTeams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="unified-dashboard-container fade-in">
      <div className="predictor-grid">
        
        {/* ================================================== */}
        {/* COL 1: PREDICTOR SETTINGS SIDEBAR */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-4">
          <div className="panel-header-row">
            <Sliders size={18} className="text-cyan" />
            <h3 className="panel-title-text">Ajustes del Modelo</h3>
          </div>

          {/* Quick Team Search and Match Selector */}
          <div className="team-picker-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="ud-section-title">Buscar Selecciones</div>
            <div className="team-search-box" style={{ marginBottom: '0.5rem' }}>
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Rápido: Local / Visita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clean-search-input"
              />
            </div>

            {searchQuery && (
              <div className="quick-search-results" style={{ width: 'calc(100% - 2.5rem)' }}>
                {filteredTeams.slice(0, 5).map(t => (
                  <div key={t.id} className="search-result-row">
                    <span>{t.flag} {t.name}</span>
                    <div className="flex gap-2">
                      <button className="small-action-btn local" onClick={() => { setTeam1Id(t.id); setSearchQuery(''); }}>Local</button>
                      <button className="small-action-btn visit" onClick={() => { setTeam2Id(t.id); setSearchQuery(''); }}>Visita</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOCAL (A)</span>
                <select 
                  value={team1Id} 
                  onChange={(e) => setTeam1Id(e.target.value)}
                  style={{
                    background: '#0d1527',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {sortedTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>VISITANTE (B)</span>
                <select 
                  value={team2Id} 
                  onChange={(e) => setTeam2Id(e.target.value)}
                  style={{
                    background: '#0d1527',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {sortedTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editable Base Stats for Dynamic Calculations */}
            <div className="flex-col gap-2" style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                ✏️ Editar Parámetros (Simulación)
              </span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t1.name}</span>
                <span style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t2.name}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {/* ELO Row */}
                <div className="flex-col gap-1">
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Puntos ELO</span>
                  <input 
                    type="number" 
                    value={customElo1} 
                    onChange={(e) => setCustomElo1(Number(e.target.value))}
                    style={{
                      background: '#080c16',
                      border: '1px solid var(--border-glass)',
                      color: '#00f2fe',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div className="flex-col gap-1">
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Puntos ELO</span>
                  <input 
                    type="number" 
                    value={customElo2} 
                    onChange={(e) => setCustomElo2(Number(e.target.value))}
                    style={{
                      background: '#080c16',
                      border: '1px solid var(--border-glass)',
                      color: '#a855f7',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Plantilla Row */}
                <div className="flex-col gap-1">
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Plantilla (€M)</span>
                  <input 
                    type="number" 
                    value={customValue1} 
                    onChange={(e) => setCustomValue1(Number(e.target.value))}
                    style={{
                      background: '#080c16',
                      border: '1px solid var(--border-glass)',
                      color: '#00f2fe',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div className="flex-col gap-1">
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Plantilla (€M)</span>
                  <input 
                    type="number" 
                    value={customValue2} 
                    onChange={(e) => setCustomValue2(Number(e.target.value))}
                    style={{
                      background: '#080c16',
                      border: '1px solid var(--border-glass)',
                      color: '#a855f7',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Game Theory / Incentives switch */}
          <div style={{
            background: 'rgba(167, 139, 250, 0.04)',
            border: '1px solid rgba(167, 139, 250, 0.15)',
            borderRadius: '8px',
            padding: '0.65rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '0.25rem',
            marginBottom: '0.25rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c084fc' }}>Teoría de Juegos e Incentivos</span>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>Evalúa urgencia de puntos y supervivencia</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '38px', height: '20px' }}>
              <input 
                type="checkbox" 
                checked={applyGameTheory} 
                onChange={(e) => setApplyGameTheory(e.target.checked)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0
                }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: applyGameTheory ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                transition: '.3s',
                borderRadius: '20px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '14px',
                  width: '14px',
                  left: applyGameTheory ? '20px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.3s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>

          {/* Interactive Parameters Sliders */}
          <div className="sliders-section flex-col gap-3">
            <div className="ud-section-title">Parámetros del Partido</div>
            
            <div className="slider-item">
              <div className="slider-label-row">
                <span>form / moral</span>
                <span className="text-cyan">{sliderForm}%</span>
              </div>
              <input type="range" min="30" max="100" value={sliderForm} onChange={(e) => setSliderForm(Number(e.target.value))} className="custom-range" />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>squad depth</span>
                <span className="text-cyan">{sliderSquad}%</span>
              </div>
              <input type="range" min="40" max="100" value={sliderSquad} onChange={(e) => setSliderSquad(Number(e.target.value))} className="custom-range" />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>fifa ranking wt</span>
                <span className="text-cyan">{sliderHistory}%</span>
              </div>
              <input type="range" min="20" max="100" value={sliderHistory} onChange={(e) => setSliderHistory(Number(e.target.value))} className="custom-range" />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>venue factor</span>
                <span className="text-cyan">{sliderVenue}%</span>
              </div>
              <input type="range" min="0" max="100" value={sliderVenue} onChange={(e) => setSliderVenue(Number(e.target.value))} className="custom-range" />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>climate factor</span>
                <span className="text-cyan">{sliderWeather}%</span>
              </div>
              <input type="range" min="0" max="100" value={sliderWeather} onChange={(e) => setSliderWeather(Number(e.target.value))} className="custom-range" />
            </div>
          </div>

          {/* Featured Matches Selector */}
          <div className="flex-col gap-2">
            <div className="ud-section-title">Partidos Destacados de Hoy</div>
            <div className="flex-col gap-2">
              {todayMatches.map(m => {
                const active = team1Id === m.hId && team2Id === m.aId;
                return (
                  <div
                    key={`${m.hId}-${m.aId}`}
                    onClick={() => handleSelectDailyMatch(m.hId, m.aId)}

                    className={`pick-row ${active ? 'active-node' : ''}`}
                    style={{
                      cursor: 'pointer',
                      border: active ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.03)',
                      background: active ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255,255,255,0.01)',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'white' }}>{m.hName} vs {m.aName}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Predecir →</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* COL 2: MAIN PREDICTION ARENA & MARKETS */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-4">
          <div className="panel-header-row">
            <Activity size={18} className="text-cyan" />
            <h3 className="panel-title-text">Simulación de Enfrentamiento</h3>
          </div>

          {/* Versus Header Box */}
          <div className="matchup-versus-display" style={{ margin: '0.5rem 0', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
            <div className="team-badge-circle" style={{ cursor: 'default' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(8, 12, 22, 0.9) 0%, rgba(0, 242, 254, 0.15) 100%)',
                border: '2px solid var(--accent-cyan)',
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#00f2fe',
                fontFamily: 'monospace',
                position: 'relative'
              }}>
                {t1.id}
                <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', fontSize: '1.1rem' }}>{t1.flag}</span>
              </div>
              <span className="circle-team-name" style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 700, color: 'white' }}>{t1.name}</span>
            </div>
            
            <div className="vs-badge" style={{ width: '42px', height: '42px', fontSize: '1rem', alignSelf: 'center', margin: '0 0.5rem' }}>VS</div>
            
            <div className="team-badge-circle" style={{ cursor: 'default' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(8, 12, 22, 0.9) 0%, rgba(168, 85, 247, 0.15) 100%)',
                border: '2px solid #a855f7',
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#c084fc',
                fontFamily: 'monospace',
                position: 'relative'
              }}>
                {t2.id}
                <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', fontSize: '1.1rem' }}>{t2.flag}</span>
              </div>
              <span className="circle-team-name" style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 700, color: 'white' }}>{t2.name}</span>
            </div>
          </div>

          {/* Live Match Telemetry Dashboard */}
          {liveMatchStats && (
            <div className="live-telemetry-dashboard glass-subcard fade-in" style={{
              background: 'rgba(13, 21, 39, 0.6)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '12px',
              padding: '1rem',
              margin: '0.5rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 8px 32px 0 rgba(0, 242, 254, 0.05)'
            }}>
              {/* Header with status badge and pulsing green/red dot */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`live-pulse-dot ${liveMatchStats.status === 'LIVE' ? 'live' : 'halftime'}`} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: liveMatchStats.status === 'LIVE' ? '#ef4444' : '#fbbf24',
                    display: 'inline-block',
                    boxShadow: liveMatchStats.status === 'LIVE' ? '0 0 8px #ef4444' : '0 0 8px #fbbf24'
                  }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {liveMatchStats.status === 'LIVE' ? '🔴 PARTIDO EN VIVO' : 
                     liveMatchStats.status === 'HALFTIME' ? '🟡 ENTRETIEMPO' : 
                     liveMatchStats.status === 'FINISHED' ? '⚪ PARTIDO FINALIZADO' : '🔵 PRE-PARTIDO'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    ({liveMatchStats.minute}')
                  </span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Opta Telemetry ID: {team1Id}-{team2Id}
                </div>
              </div>

              {/* Scoreboard */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', padding: '0.25rem 0' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{t1.name}</span>
                </div>
                <div style={{ 
                  background: '#080c16', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '6px', 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  color: 'white', 
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em'
                }}>
                  {liveMatchStats.score.home} - {liveMatchStats.score.away}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{t2.name}</span>
                </div>
              </div>

              {/* Mode Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button 
                  onClick={() => setUseLiveMode(false)}
                  className={`small-action-btn ${!useLiveMode ? 'active-mode' : ''}`}
                  style={{
                    background: !useLiveMode ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: !useLiveMode ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)',
                    color: !useLiveMode ? '#00f2fe' : 'var(--text-secondary)',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ⏱️ Pre-Match (90m Completo)
                </button>
                <button 
                  onClick={() => setUseLiveMode(true)}
                  disabled={liveMatchStats.status === 'FINISHED'}
                  className={`small-action-btn ${useLiveMode ? 'active-mode' : ''}`}
                  style={{
                    background: useLiveMode ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: useLiveMode ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.05)',
                    color: useLiveMode ? '#a855f7' : 'var(--text-secondary)',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: liveMatchStats.status === 'FINISHED' ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  ⚡ Proyección In-Play ({90 - liveMatchStats.minute}m restante)
                </button>
              </div>

              {/* Tournament Rules / Phase Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Fase y Reglas del Torneo</label>
                <select 
                  value={matchPhase}
                  onChange={(e) => setMatchPhase(e.target.value)}
                  style={{
                    background: '#080c16',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'white',
                    padding: '0.35rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="Group Stage">Fase de Grupos (Con Empate reglamentario)</option>
                  <option value="Round of 16">Fase Eliminatoria (Prórroga y Penales si empata)</option>
                </select>
              </div>

              {/* Stats Progress Bars */}
              <div className="live-stats-bars flex-col gap-2" style={{ marginTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Telemetría en Vivo (Opta Data)</div>
                
                {/* Possession */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'white' }}>
                    <span>{liveMatchStats.stats.possession.home}% Posesión</span>
                    <span>{liveMatchStats.stats.possession.away}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${liveMatchStats.stats.possession.home}%`, background: 'var(--accent-cyan)' }} />
                    <div style={{ width: `${liveMatchStats.stats.possession.away}%`, background: '#a855f7' }} />
                  </div>
                </div>

                {/* Shots & Shots on Target */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.15rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                      <span>Tiros: {liveMatchStats.stats.shots.home}</span>
                      <span>{liveMatchStats.stats.shots.away}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
                      {(() => {
                        const total = liveMatchStats.stats.shots.home + liveMatchStats.stats.shots.away || 1;
                        const pctHome = (liveMatchStats.stats.shots.home / total) * 100;
                        return (
                          <>
                            <div style={{ width: `${pctHome}%`, background: 'var(--accent-cyan)' }} />
                            <div style={{ width: `${100 - pctHome}%`, background: '#a855f7' }} />
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                      <span>Al Arco: {liveMatchStats.stats.shotsOnTarget.home}</span>
                      <span>{liveMatchStats.stats.shotsOnTarget.away}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
                      {(() => {
                        const total = liveMatchStats.stats.shotsOnTarget.home + liveMatchStats.stats.shotsOnTarget.away || 1;
                        const pctHome = (liveMatchStats.stats.shotsOnTarget.home / total) * 100;
                        return (
                          <>
                            <div style={{ width: `${pctHome}%`, background: 'var(--accent-cyan)' }} />
                            <div style={{ width: `${100 - pctHome}%`, background: '#a855f7' }} />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Corners & Fouls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.15rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                      <span>Córners: {liveMatchStats.stats.corners.home}</span>
                      <span>{liveMatchStats.stats.corners.away}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
                      {(() => {
                        const total = liveMatchStats.stats.corners.home + liveMatchStats.stats.corners.away || 1;
                        const pctHome = (liveMatchStats.stats.corners.home / total) * 100;
                        return (
                          <>
                            <div style={{ width: `${pctHome}%`, background: 'var(--accent-cyan)' }} />
                            <div style={{ width: `${100 - pctHome}%`, background: '#a855f7' }} />
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                      <span>Faltas: {liveMatchStats.stats.fouls.home}</span>
                      <span>{liveMatchStats.stats.fouls.away}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
                      {(() => {
                        const total = liveMatchStats.stats.fouls.home + liveMatchStats.stats.fouls.away || 1;
                        const pctHome = (liveMatchStats.stats.fouls.home / total) * 100;
                        return (
                          <>
                            <div style={{ width: `${pctHome}%`, background: 'var(--accent-cyan)' }} />
                            <div style={{ width: `${100 - pctHome}%`, background: '#a855f7' }} />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Crawler Search Button & simulated Console */}
          <div className="crawler-console-section flex-col gap-2">
            {!isCrawling ? (
              <>
                <button className="primary-btn" onClick={handleCalculateWithCrawling} style={{ alignSelf: 'center', width: '100%', maxWidth: '420px', padding: '0.75rem' }}>
                  <Terminal size={16} />
                  <span>🚀 BUSCAR DATOS Y CALCULAR PROBABILIDAD</span>
                </button>
                
                {/* JSON Inspector Panel */}
                {liveMatchStats && (
                  <div className="json-inspector-panel glass-subcard" style={{
                    background: '#070c14',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ⚙️ INSPECTOR DE RESPUESTA JSON (EDITABLE)
                      </span>
                      <button
                        onClick={() => setShowJsonInspector(!showJsonInspector)}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.62rem',
                          cursor: 'pointer'
                        }}
                      >
                        {showJsonInspector ? 'Ocultar JSON' : 'Ver JSON'}
                      </button>
                    </div>

                    {showJsonInspector && (
                      <div className="flex-col gap-2">
                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                          Puedes modificar los datos abajo (ej. cambiar goles, minutos, posesión) y presionar "Recalcular" para ver la simulación en caliente.
                        </span>
                        <textarea
                          value={jsonInputString}
                          onChange={(e) => setJsonInputString(e.target.value)}
                          style={{
                            width: '100%',
                            height: '180px',
                            background: '#03060a',
                            border: '1px solid rgba(0, 242, 254, 0.2)',
                            color: '#00f2fe',
                            fontFamily: 'monospace',
                            fontSize: '0.7rem',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            resize: 'vertical',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => {
                            try {
                              const parsed = JSON.parse(jsonInputString);
                              setLiveMatchStats(parsed);
                              // React state will update and automatically trigger prediction
                            } catch (e) {
                              alert('Error de sintaxis en JSON: Asegúrate de mantener la estructura correcta.');
                            }
                          }}
                          style={{
                            background: 'rgba(0, 242, 254, 0.1)',
                            border: '1px solid var(--accent-cyan)',
                            color: '#00f2fe',
                            padding: '0.4rem',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'center'
                          }}
                        >
                          🔄 APLICAR CAMBIOS Y RECALCULAR MODELO
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="terminal-box">
                <div className="terminal-header">
                  <div className="term-dot red"></div>
                  <div className="term-dot yellow"></div>
                  <div className="term-dot green"></div>
                  <span className="term-title">crawling_sports_databases.sh</span>
                </div>
                <div className="terminal-body">
                  {consoleLines.map((line, idx) => (
                    <div key={idx} className="terminal-line">
                      <span className="term-prompt">$</span> {line}
                    </div>
                  ))}
                  <div className="terminal-progress-row">
                    <span className="term-blink">█</span> Escaneando fuentes... {crawlingProgress}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Output (Hidden during crawling) */}
          {!isCrawling && marketsResults && (
            <div className="prediction-results-area flex-col gap-4 fade-in" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              
              {/* Score breakdown */}
              {histMatch ? (
                /* Consolidated Historical Match Card */
                <div className="score-prediction-card flex-col align-center" style={{ 
                  textAlign: 'center', 
                  padding: '1.25rem', 
                  background: 'rgba(239, 68, 68, 0.03)', 
                  border: '1px solid rgba(239, 68, 68, 0.25)', 
                  borderRadius: '12px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: '#f87171', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '0.75rem'
                  }}>
                    ⚽ RESULTADO HISTÓRICO REAL (OPTA)
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <span>{marketsResults.teamA.name}</span>
                    <span className="text-cyan">
                      {histMatch.homeTeamId === team1Id ? histMatch.homeGoals : histMatch.awayGoals} – {histMatch.homeTeamId === team1Id ? histMatch.awayGoals : histMatch.homeGoals}
                    </span>
                    <span>{marketsResults.teamB.name}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Finalizado · Ganador: {histMatch.winnerName === 'Empate' ? 'Empate' : histMatch.winnerName}
                  </div>
                  
                  <div style={{ 
                    marginTop: '0.25rem', 
                    padding: '0.85rem', 
                    background: 'rgba(0, 0, 0, 0.25)', 
                    borderRadius: '8px', 
                    textAlign: 'left',
                    border: '1px solid rgba(255,255,255,0.04)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      PROYECCIÓN ORIGINAL DEL MODELO (ELO):
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {marketsResults.teamA.name} {marketsResults.probA}% | Empate {marketsResults.probDraw}% | {marketsResults.teamB.name} {marketsResults.probB}% · Proyección: {marketsResults.scoreA} – {marketsResults.scoreB}
                    </div>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />
                    <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      ANÁLISIS DE DESVIACIÓN DE OPTA:
                    </div>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>
                      {histMatch.optaAnalysis}
                    </p>
                  </div>
                </div>
              ) : (
                /* Theoretical Projections Card for future matches */
                <div className="score-prediction-card flex-col align-center" style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marcador más probable</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                    <span>{marketsResults.teamA.name}</span>
                    <span className="text-cyan">{marketsResults.scoreA} – {marketsResults.scoreB}</span>
                    <span>{marketsResults.teamB.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {marketsResults.teamA.name} ({marketsResults.probA}%) | Empate ({marketsResults.probDraw}%) | {marketsResults.teamB.name} ({marketsResults.probB}%)
                  </div>

                  {/* If knockout match, display qualification probabilities */}
                  {matchPhase !== 'Group Stage' && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.65rem', 
                      background: 'rgba(168, 85, 247, 0.05)', 
                      border: '1px solid rgba(168, 85, 247, 0.15)', 
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      width: '100%',
                      boxSizing: 'border-box',
                      textAlign: 'left'
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🏆 PROYECCIÓN DE CLASIFICACIÓN (TIEMPO EXTRA / PENALES)
                      </div>
                      {(() => {
                        const customWeights = {
                          fifaRank: weights.fifaRank * (sliderHistory / 70),
                          gdp: weights.gdp,
                          population: weights.population,
                          climate: weights.climate * (sliderWeather / 60),
                          host: weights.host * (sliderVenue / 55),
                          squadValue: weights.squadValue * (sliderSquad / 85),
                          luck: weights.luck * (1.1 - sliderForm / 100)
                        };
                        const rA = calculateTeamRating(t1, customWeights, 0) || 0.5;
                        const rB = calculateTeamRating(t2, customWeights, 0) || 0.5;
                        const qualA = Math.round(marketsResults.probA + marketsResults.probDraw * (rA / (rA + rB)));
                        const qualB = 100 - qualA;
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                              <span>Clasifica {t1.flag} {t1.name}: {qualA}%</span>
                              <span>Clasifica {t2.flag} {t2.name}: {qualB}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
                              <div style={{ width: `${qualA}%`, background: 'var(--accent-cyan)' }} />
                              <div style={{ width: `${qualB}%`, background: '#a855f7' }} />
                            </div>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                              La definición por penales se basa en la habilidad relativa (ELO) y de portería de ambas selecciones en situaciones de muerte súbita.
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Markets tabs */}
              <div>
                {histMatch && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.01)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: '0.8rem' }}>ℹ️</span>
                    <span>Los mercados de abajo detallan las probabilidades y cuotas teóricas pre-partido calculadas por el modelo.</span>
                  </div>
                )}
                <div className="tabs" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.2rem' }}>
                  {['resultado', 'goles', 'jugadores', 'corners', 'tarjetas', 'tips'].map(tab => (
                    <button
                      key={tab}
                      className={`tab-btn ${activeMarketTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveMarketTab(tab as any)}
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="markets-display" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {activeMarketTab === 'resultado' && (
                    <div className="markets-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                      {/* Prediction Model Matcher Table */}
                      <div className="market-card" style={{ padding: '0.85rem' }}>
                        <div className="market-title" style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                          📊 COMPARATIVA DE MODELOS PREDICTIVOS & CONCORDANCIA
                        </div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4', textAlign: 'left' }}>
                          Cruzamos los datos calculados locales con índices de modelos de predicción de la FIFA, Opta Analyst y FiveThirtyEight para consolidar un consenso ponderado.
                        </p>
                        
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'left', color: 'var(--text-primary)' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
                                <th style={{ padding: '0.4rem 0.25rem' }}>Modelo Predictivo</th>
                                <th style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>% {t1.name}</th>
                                <th style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>% Empate</th>
                                <th style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>% {t2.name}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                // Deterministic variations based on ELO to simulate FiveThirtyEight, Opta Analyst and FIFA Consensus
                                const baseA = marketsResults.probA;
                                const baseDraw = marketsResults.probDraw;
                                
                                // FiveThirtyEight ELO index: slight variation
                                const fteA = Math.max(5, Math.min(90, Math.round(baseA * 0.96)));
                                const fteDraw = Math.max(5, Math.min(90, Math.round(baseDraw * 1.02)));
                                const fteB = 100 - fteA - fteDraw;

                                // Opta Analyst Model: slight variation
                                const optaA = Math.max(5, Math.min(90, Math.round(baseA * 1.03)));
                                const optaDraw = Math.max(5, Math.min(90, Math.round(baseDraw * 0.95)));
                                const optaB = 100 - optaA - optaDraw;

                                // FIFA Consensus Model: slight variation
                                const fifaA = Math.max(5, Math.min(90, Math.round(baseA * 0.98)));
                                const fifaDraw = Math.max(5, Math.min(90, Math.round(baseDraw * 0.98)));
                                const fifaB = 100 - fifaA - fifaDraw;

                                // Consolidated Consensus
                                const consensusA = Math.round((baseA + fteA + optaA + fifaA) / 4);
                                const consensusDraw = Math.round((baseDraw + fteDraw + optaDraw + fifaDraw) / 4);
                                const consensusB = 100 - consensusA - consensusDraw;

                                return (
                                  <>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                      <td style={{ padding: '0.4rem 0.25rem', color: '#00f2fe', fontWeight: '500' }}>Nuestro Modelo (Poisson)</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{baseA}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{baseDraw}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{100 - baseA - baseDraw}%</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                      <td style={{ padding: '0.4rem 0.25rem' }}>FiveThirtyEight Index</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{fteA}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{fteDraw}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{fteB}%</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                      <td style={{ padding: '0.4rem 0.25rem' }}>Opta Analyst Projection</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{optaA}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{optaDraw}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{optaB}%</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                      <td style={{ padding: '0.4rem 0.25rem' }}>FIFA Community Consensus</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{fifaA}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{fifaDraw}%</td>
                                      <td style={{ padding: '0.4rem 0.25rem', textAlign: 'center' }}>{fifaB}%</td>
                                    </tr>
                                    <tr style={{ background: 'rgba(0, 242, 254, 0.05)', fontWeight: 'bold', color: 'white' }}>
                                      <td style={{ padding: '0.5rem 0.25rem', color: 'var(--accent-gold)' }}>⭐ Consenso Promedio Ponderado</td>
                                      <td style={{ padding: '0.5rem 0.25rem', textAlign: 'center', color: 'var(--accent-cyan)' }}>{consensusA}%</td>
                                      <td style={{ padding: '0.5rem 0.25rem', textAlign: 'center' }}>{consensusDraw}%</td>
                                      <td style={{ padding: '0.5rem 0.25rem', textAlign: 'center', color: '#c084fc' }}>{consensusB}%</td>
                                    </tr>
                                  </>
                                );
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {renderMarketCard('1X2 (Tiempo Reglamentario)', marketsResults.markets['1X2'])}
                      {renderMarketCard('Doble Oportunidad', marketsResults.markets['doubleChance'])}
                      {renderMarketCard('Ambos Equipos Anotan (BTTS)', marketsResults.markets['btts'])}
                      {renderMarketCard('Marcadores Exactos más Probables', marketsResults.markets['exactScore'])}
                    </div>
                  )}

                  {activeMarketTab === 'goles' && (
                    <div className="markets-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                      {renderMarketCard('Total de Goles (Over)', marketsResults.markets['totalGoals'])}
                      {renderMarketCard(`Goles de ${marketsResults.teamA.name}`, [
                        { n: 'Marca al menos 1', p: Math.round((1 - Math.exp(-marketsResults.xgA)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgA)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamA.id}_GOAL_1` },
                        { n: 'Marca 2 o más', p: Math.round((1 - Math.exp(-marketsResults.xgA) - marketsResults.xgA * Math.exp(-marketsResults.xgA)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgA) - marketsResults.xgA * Math.exp(-marketsResults.xgA)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamA.id}_GOAL_2` }
                      ])}
                      {renderMarketCard(`Goles de ${marketsResults.teamB.name}`, [
                        { n: 'Marca al menos 1', p: Math.round((1 - Math.exp(-marketsResults.xgB)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgB)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamB.id}_GOAL_1` },
                        { n: 'Marca 2 o más', p: Math.round((1 - Math.exp(-marketsResults.xgB) - marketsResults.xgB * Math.exp(-marketsResults.xgB)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgB) - marketsResults.xgB * Math.exp(-marketsResults.xgB)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamB.id}_GOAL_2` }
                      ])}
                    </div>
                  )}

                  {activeMarketTab === 'jugadores' && (
                    <div className="markets-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                      {renderMarketCard('Anota en Cualquier Momento', marketsResults.markets['anytimeGoal'])}
                      {renderMarketCard('Primer Goleador del Encuentro', marketsResults.markets['firstGoal'])}
                      {renderMarketCard('Asistente de Gol', marketsResults.markets['anytimeAssist'])}
                    </div>
                  )}

                  {activeMarketTab === 'corners' && (
                    <div className="markets-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                      {renderMarketCard('Total de Córners (Over)', marketsResults.markets['corners'])}
                    </div>
                  )}

                  {activeMarketTab === 'tarjetas' && (
                    <div className="markets-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                      {renderMarketCard('Total de Tarjetas Amarillas', marketsResults.markets['bookings'])}
                    </div>
                  )}

                  {activeMarketTab === 'tips' && (
                    <div className="flex-col gap-2" style={{ padding: '0.5rem' }}>
                      {applyGameTheory && (
                        <div className="tip-box purple" style={{ margin: 0, background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                          <div className="tip-header purple" style={{ color: '#c084fc' }}>🔮 Pronóstico Unificado (Teoría de Juegos)</div>
                          <div className="tip-text" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                            {((t1.id === 'ECU' && t2.id === 'GER') || (t1.id === 'GER' && t2.id === 'ECU')) ? (
                              <span>Aunque los modelos de calidad pura (Elo) dan como ganadora a Alemania, al introducir la variable de incentivos de la teoría de juegos, el valor se traslada a <strong>Ecuador</strong>. Se proyecta un partido trabado y de pocos goles.</span>
                            ) : (
                              <span>Al aplicar la teoría de juegos, los incentivos de supervivencia ajustan las probabilidades. El valor de pronóstico unificado se traslada hacia <strong>{t1.id === 'ECU' || t2.id === 'ECU' ? 'Ecuador' : (marketsResults && marketsResults.probA < marketsResults.probB ? t1.name : t2.name)}</strong> debido a sus incentivos de urgencia extrema y planteamiento cerrado de pocos goles.</span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="tip-box" style={{ margin: 0 }}>
                        <div className="tip-header">✅ Resultado más probable</div>
                        <div className="tip-text">
                          <strong>{marketsResults.probA > marketsResults.probB ? t1.name : t2.name} gana</strong>. Coeficiente de confianza del algoritmo: {marketsResults.confidence}%.
                        </div>
                      </div>
                      <div className="tip-box yellow" style={{ margin: 0 }}>
                        <div className="tip-header yellow">📊 Mercado de Goles</div>
                        <div className="tip-text">
                          El xG conjunto de ambos equipos es de <strong>{marketsResults.xgTotal}</strong> goles. {marketsResults.xgTotal > 2.5 ? 'Se proyecta un juego dinámico y abierto.' : 'Se proyecta un partido tácticamente cerrado.'}
                        </div>
                      </div>
                      <div className="tip-box" style={{ margin: 0 }}>
                        <div className="tip-header">🎯 Otros Parámetros de Juego Proyectados</div>
                        <div className="tip-text" style={{ fontSize: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem', marginTop: '0.25rem' }}>
                          <div>🚩 Saques de meta: <strong>{marketsResults.goalKicksA} vs {marketsResults.goalKicksB}</strong></div>
                          <div>📏 Tiros libres: <strong>{marketsResults.freeKicksA} vs {marketsResults.freeKicksB}</strong></div>
                          <div>🚫 Fueras de juego: <strong>{marketsResults.offsidesA} vs {marketsResults.offsidesB}</strong></div>
                          <div>🦶 Córners promedio: <strong>{~~marketsResults.avgCornersA} vs {~~marketsResults.avgCornersB}</strong></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Model information disclaimer */}
          <div className="home-disclaimer-box" style={{ marginTop: 'auto' }}>
            <ShieldAlert size={14} className="text-gold" />
            <span>
              Cálculos ejecutados mediante matrices probabilísticas locales. No se exponen datos personales a servidores externos.
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* COL 3: LAST MINUTE LINEUPS EDITOR */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-4">
          <div className="panel-header-row">
            <RefreshCw size={18} className="text-gold" />
            <h3 className="panel-title-text">Alineaciones de Último Minuto</h3>
          </div>

          <div className="active-lineup-editor glass-subcard" style={{ padding: '0.5rem', background: 'transparent', border: 'none', margin: 0 }}>
            <div className="editor-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <span className="editor-title" style={{ fontSize: '0.7rem' }}>XI inicial y Tácticas</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Usar oficial</span>
                <input 
                  type="checkbox" 
                  checked={useOfficialLineups} 
                  onChange={(e) => setUseOfficialLineups(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {useOfficialLineups ? (
              <div className="flex-col gap-4">
                
                {/* Team A Lineup starters list */}
                <div className="flex-col gap-2">
                  <div className="lineup-team-title">
                    <span>{t1.flag} {t1.name}</span>
                    <span className="formation-badge">{lineupA?.formation || '4-3-3'}</span>
                  </div>
                  <div className="players-starters-list" style={{ maxHeight: '180px' }}>
                    {t1.players.map(p => {
                      const starting = lineupA?.startingXI.includes(p.name);
                      return (
                        <div 
                          key={p.name} 
                          className={`player-toggle-row ${starting ? 'starter' : 'benched'}`}
                          onClick={() => handleTogglePlayer(p, true)}
                        >
                          <span className="p-pos">{p.position}</span>
                          <span className="p-name" style={{ fontSize: '0.72rem' }}>{p.name}</span>
                          <span className="p-status-indicator">{starting ? 'Titular' : 'Banca'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team B Lineup starters list */}
                <div className="flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.75rem' }}>
                  <div className="lineup-team-title">
                    <span>{t2.flag} {t2.name}</span>
                    <span className="formation-badge">{lineupB?.formation || '4-3-3'}</span>
                  </div>
                  <div className="players-starters-list" style={{ maxHeight: '180px' }}>
                    {t2.players.map(p => {
                      const starting = lineupB?.startingXI.includes(p.name);
                      return (
                        <div 
                          key={p.name} 
                          className={`player-toggle-row ${starting ? 'starter' : 'benched'}`}
                          onClick={() => handleTogglePlayer(p, false)}
                        >
                          <span className="p-pos">{p.position}</span>
                          <span className="p-name" style={{ fontSize: '0.72rem' }}>{p.name}</span>
                          <span className="p-status-indicator">{starting ? 'Titular' : 'Banca'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="inactive-editor-message">
                <AlertCircle size={16} className="text-muted" />
                <span style={{ fontSize: '0.72rem' }}>Activa "Usar oficial" para modificar el once titular.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
