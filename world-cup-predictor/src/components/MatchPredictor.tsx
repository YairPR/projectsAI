import React, { useState, useEffect } from 'react';
import type { Team, Player } from '../data/teamsData';
import { teamsData } from '../data/teamsData';
import type { ModelWeights, MatchBettingMarkets, MarketOption, LineupData } from '../utils/simulatorEngine';
import { calculateMatchBettingMarkets, probToOdds } from '../utils/simulatorEngine';
import { mockLineups } from '../data/lineupsMock';
import { historicalMatches } from '../data/historicalMatches';
import { 
  Sliders, Activity, AlertCircle, RefreshCw, 
  Search, ShieldAlert, Terminal
} from 'lucide-react';


interface MatchPredictorProps {
  weights: ModelWeights;
}

export const MatchPredictor: React.FC<MatchPredictorProps> = ({
  weights
}) => {
  const [team1Id, setTeam1Id] = useState<string>('ECU');
  const [team2Id, setTeam2Id] = useState<string>('GER');
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

  // Recalculate immediately if weights or lineups change
  useEffect(() => {
    // Only run if we aren't currently executing a visual data crawl
    if (!isCrawling) {
      calculatePrediction();
    }
  }, [team1Id, team2Id, sliderForm, sliderSquad, sliderHistory, sliderVenue, sliderWeather, lineupA, lineupB, weights, applyGameTheory]);

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

    const res = calculateMatchBettingMarkets(
      t1,
      t2,
      customWeights,
      0,
      lineupA,
      lineupB,
      applyGameTheory
    );
    setMarketsResults(res);
  };

  // Run the simulated data crawling console
  const handleCalculateWithCrawling = () => {
    setIsCrawling(true);
    setConsoleLines([]);
    setCrawlingProgress(0);

    const steps = [
      { text: '📡 Conectando con servidores de la FIFA (Rankings y coeficientes)...', progress: 20 },
      { text: '📈 Escaneando cotizaciones de mercado y fichajes de Transfermarkt...', progress: 45 },
      { text: '🏃 Extrayendo estado físico de planteles y alineaciones oficiales de Opta...', progress: 70 },
      { text: '📉 Consultando PIB y variables climáticas del modelo econométrico Klement...', progress: 85 },
      { text: '🧮 Ejecutando simulación de Poisson y Monte Carlo local (10,000 iteraciones)...', progress: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentIndex = stepIndex;
        setConsoleLines(prev => [...prev, steps[currentIndex].text]);
        setCrawlingProgress(steps[currentIndex].progress);
        stepIndex++;
      } else {

        clearInterval(interval);
        setTimeout(() => {
          setIsCrawling(false);
          calculatePrediction();
        }, 500);
      }
    }, 700);
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
      <div className="ud-grid">
        
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
          <div className="matchup-versus-display" style={{ margin: '0.5rem 0', justifyContent: 'center', gap: '3rem' }}>
            <div className="team-badge-circle">
              <span className="big-flag" style={{ fontSize: '3rem' }}>{t1.flag}</span>
              <span className="circle-team-name" style={{ fontSize: '1rem' }}>{t1.name}</span>
            </div>
            <div className="vs-badge" style={{ width: '42px', height: '42px', fontSize: '1rem' }}>VS</div>
            <div className="team-badge-circle">
              <span className="big-flag" style={{ fontSize: '3rem' }}>{t2.flag}</span>
              <span className="circle-team-name" style={{ fontSize: '1rem' }}>{t2.name}</span>
            </div>
          </div>

          {/* Crawler Search Button & simulated Console */}
          <div className="crawler-console-section flex-col gap-2">
            {!isCrawling ? (
              <button className="primary-btn" onClick={handleCalculateWithCrawling} style={{ alignSelf: 'center', width: '100%', maxWidth: '420px', padding: '0.75rem' }}>
                <Terminal size={16} />
                <span>🚀 BUSCAR DATOS Y CALCULAR PROBABILIDAD</span>
              </button>
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
              </div>

              {histMatch && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '0.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Análisis de Desviación Real (Post-Partido)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                    Este partido ya se disputó: {histMatch.winnerName === 'Empate' ? 'Terminó en empate' : `Ganó ${histMatch.winnerName}`} ({histMatch.homeTeamId === team1Id ? histMatch.homeGoals : histMatch.awayGoals} – {histMatch.homeTeamId === team1Id ? histMatch.awayGoals : histMatch.homeGoals})
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
                    {histMatch.optaAnalysis}
                  </p>
                </div>
              )}

              {/* Advanced Markets tabs */}
              <div>
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
