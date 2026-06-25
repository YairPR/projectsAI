import React, { useState, useEffect } from 'react';
import { teamsData } from '../data/teamsData';
import type { ModelWeights, MatchBettingMarkets, MarketOption } from '../utils/simulatorEngine';
import { calculateMatchBettingMarkets, probToOdds } from '../utils/simulatorEngine';
import type { BetSelection } from './BettingSlip';
import { Trophy, Calendar, ShieldAlert } from 'lucide-react';

interface MatchPredictorProps {
  weights: ModelWeights;
  messiImpact: number;
  selections: BetSelection[];
  onAddSelection: (sel: BetSelection) => void;
  onRemoveSelection: (id: string) => void;
  onToggleSlip: () => void;
}

export const MatchPredictor: React.FC<MatchPredictorProps> = ({
  weights,
  messiImpact,
  selections,
  onAddSelection,
  onRemoveSelection,
  onToggleSlip
}) => {
  const [team1Id, setTeam1Id] = useState<string>('ECU');
  const [team2Id, setTeam2Id] = useState<string>('GER');
  const [activeMarketTab, setActiveMarketTab] = useState<'resultado' | 'goles' | 'jugadores' | 'corners' | 'tarjetas' | 'tips'>('resultado');
  const [marketsResults, setMarketsResults] = useState<MatchBettingMarkets | null>(null);

  // Pre-calculate on load
  useEffect(() => {
    handlePredict();
  }, [weights, messiImpact]);

  const handlePredict = () => {
    if (!team1Id || !team2Id || team1Id === team2Id) {
      alert('Por favor selecciona dos equipos diferentes.');
      return;
    }

    const t1 = teamsData.find(t => t.id === team1Id)!;
    const t2 = teamsData.find(t => t.id === team2Id)!;

    const res = calculateMatchBettingMarkets(t1, t2, weights, messiImpact);
    setMarketsResults(res);
  };

  const handleSelectDailyMatch = (id1: string, id2: string) => {
    setTeam1Id(id1);
    setTeam2Id(id2);
    // Predict immediately
    const t1 = teamsData.find(t => t.id === id1)!;
    const t2 = teamsData.find(t => t.id === id2)!;
    const res = calculateMatchBettingMarkets(t1, t2, weights, messiImpact);
    setMarketsResults(res);
  };

  // Check if a bet is already in the Betting Slip
  const isSelected = (selectionId: string) => {
    const slipId = `${team1Id}_${team2Id}_${selectionId}`;
    return selections.some(sel => sel.id === slipId);
  };

  const handleMarketOptionClick = (opt: MarketOption) => {
    if (!marketsResults) return;

    const slipId = `${team1Id}_${team2Id}_${opt.selectionId}`;
    if (isSelected(opt.selectionId)) {
      onRemoveSelection(slipId);
    } else {
      const newSel: BetSelection = {
        id: slipId,
        matchName: `${marketsResults.teamA.name} vs ${marketsResults.teamB.name}`,
        selectionName: opt.n,
        odds: opt.odds,
        prob: opt.p,
        marketType: opt.marketType,
        selectionId: opt.selectionId
      };
      onAddSelection(newSel);
      onToggleSlip(); // Automatically show slip when adding a bet
    }
  };

  const getConfClass = (conf: number) => {
    if (conf >= 60) return 'conf-fill high';
    if (conf >= 42) return 'conf-fill med';
    return 'conf-fill low';
  };

  // Pre-defined daily matches schedule
  const dailyMatches = [
    { date: 'Hoy · 18:00h', hId: 'ECU', hName: 'Ecuador', aId: 'GER', aName: 'Alemania', note: 'Partidazo Grupo E' },
    { date: 'Hoy · 21:00h', hId: 'SUI', hName: 'Suiza', aId: 'CAN', aName: 'Canadá', note: 'Definición Grupo B' },
    { date: 'Hoy · 21:00h', hId: 'CUR', hName: 'Curazao', aId: 'CIV', aName: 'Costa de Marfil', note: 'Grupo E - Clave' },
    { date: 'Hoy · 23:30h', hId: 'BRA', hName: 'Brasil', aId: 'SCO', aName: 'Escocia', note: 'Grupo C' }
  ];

  // Golden Boot data
  const goldenBootList = [
    { rank: 1, name: 'L. Messi', flag: '🇦🇷', team: 'Argentina', g: 4, a: 1, gp: 2, min: 180, pb: 28 },
    { rank: 2, name: 'E. Haaland', flag: '🇳🇴', team: 'Noruega', g: 4, a: 0, gp: 2, min: 180, pb: 22 },
    { rank: 3, name: 'Jonathan David', flag: '🇨🇦', team: 'Canadá', g: 3, a: 0, gp: 2, min: 180, pb: 12 },
    { rank: 4, name: 'D. Undav', flag: '🇩🇪', team: 'Alemania', g: 3, a: 2, gp: 2, min: 90, pb: 10 },
    { rank: 5, name: 'K. Mbappé', flag: '🇫🇷', team: 'Francia', g: 3, a: 1, gp: 2, min: 180, pb: 20 }
  ];

  const renderMarketCard = (title: string, options: MarketOption[] | undefined) => {
    if (!options) return null;

    return (
      <div className="market-card" key={title}>
        <div className="market-title">{title}</div>
        <div className="market-options">
          {options.map(opt => {
            const active = isSelected(opt.selectionId);
            return (
              <div
                key={opt.selectionId}
                className={`market-opt ${opt.best ? 'best' : ''} ${active ? 'active-bet' : ''}`}
                onClick={() => handleMarketOptionClick(opt)}
                style={{
                  cursor: 'pointer',
                  border: active ? '1px solid var(--accent-gold)' : '',
                  background: active ? 'rgba(251, 191, 36, 0.12)' : ''
                }}
              >
                <div>
                  <div className="mname" style={{ color: active ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                    {opt.n}
                  </div>
                  <div className="mprob">{opt.p}% · {opt.note || 'Prob'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="modds" style={{ color: active ? '#ffffff' : 'var(--accent-gold)' }}>
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

  // Sort teams alphabetically for selector options
  const sortedTeams = [...teamsData].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Disclaimer Alert */}
      <div style={{
        background: 'rgba(244, 63, 94, 0.05)',
        border: '1px solid rgba(244, 63, 94, 0.15)',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <ShieldAlert size={18} className="text-cyan" style={{ flexShrink: 0 }} />
        <span>
          <strong>⚠️ Aviso de Análisis:</strong> Las probabilidades calculan formaciones, condición física y GDP del modelo. El fútbol contiene un ~45% de suerte aleatoria inherente. Apuesta con cautela.
        </span>
      </div>

      {/* Match Selector Panel */}
      <div className="glass-card">
        <div className="group-card-title" style={{ color: 'var(--text-primary)' }}>
          <span>⚽ PREDECIR ENFRENTAMIENTO DIRECTO</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filtros Avanzados</span>
        </div>

        <div className="match-selector-grid">
          <div className="team-picker">
            <label>🏠 LOCAL (EQUIPO A)</label>
            <select
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
            >
              {sortedTeams.map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name} (FIFA #{t.fifaRank})</option>
              ))}
            </select>
          </div>
          <div className="vs-badge">
            <span>VS</span>
          </div>
          <div className="team-picker">
            <label>✈️ VISITANTE (EQUIPO B)</label>
            <select
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
            >
              {sortedTeams.map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name} (FIFA #{t.fifaRank})</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn-predict" onClick={handlePredict}>
          🔮 CALCULAR PREDICCIÓN Y MERCADOS DE HOY
        </button>
      </div>

      {/* Predictions Output Results Panel */}
      {marketsResults && (
        <div className="glass-card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          
          {/* Big Score Card */}
          <div className="result-score">
            <div className="teams-display">
              <div className="team-name-big">
                {marketsResults.teamA.flag} {marketsResults.teamA.name}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="score-pred">
                  {marketsResults.scoreA} – {marketsResults.scoreB}
                </div>
                <div className="score-sub">Marcador más probable</div>
              </div>
              <div className="team-name-big">
                {marketsResults.teamB.flag} {marketsResults.teamB.name}
              </div>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '1rem' }}>
              {marketsResults.teamA.name} ({marketsResults.probA}%) | Empate ({marketsResults.probDraw}%) | {marketsResults.teamB.name} ({marketsResults.probB}%)
            </div>
          </div>

          {/* Confidence Slider Bar */}
          <div className="confidence" style={{ padding: '1.25rem 1.5rem 1rem' }}>
            <div className="conf-label">Confianza del Modelo Predictivo</div>
            <div className="conf-bar">
              <div
                className={getConfClass(marketsResults.confidence)}
                style={{ width: `${marketsResults.confidence}%` }}
              ></div>
            </div>
            <div className="conf-note">
              {marketsResults.confidence}% de confianza. Goles esperados xG: {marketsResults.xgA} – {marketsResults.xgB} (Total: {+(marketsResults.xgA + marketsResults.xgB).toFixed(2)})
            </div>
          </div>

          {/* Key Match Analytics Factors list */}
          <div className="factors-list" style={{ padding: '0.2rem 1.5rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Factores clave del análisis
            </div>
            <div className="factor-item">
              <span className="ficon">📊</span>
              <div className="ftext">
                <strong>Clasificación Deportiva:</strong> {marketsResults.teamA.name} (FIFA #{marketsResults.teamA.fifaRank}) frente a {marketsResults.teamB.name} (FIFA #{marketsResults.teamB.fifaRank}).
              </div>
            </div>
            <div className="factor-item">
              <span className="ficon">🏃</span>
              <div className="ftext">
                <strong>Condición y Edad:</strong> {marketsResults.teamA.name} (Edad: {marketsResults.teamA.averageAge} a., Forma: {marketsResults.teamA.physicalForm}%) vs {marketsResults.teamB.name} (Edad: {marketsResults.teamB.averageAge} a., Forma: {marketsResults.teamB.physicalForm}%).
              </div>
            </div>
            <div className="factor-item">
              <span className="ficon">📉</span>
              <div className="ftext">
                <strong>Econometría Klement:</strong> PIB per cápita A: ${marketsResults.teamA.gdpPerCapita.toLocaleString()} vs PIB per cápita B: ${marketsResults.teamB.gdpPerCapita.toLocaleString()}.
              </div>
            </div>
          </div>

          {/* Betting Markets Tab Options */}
          <div style={{ padding: '0 1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button
                className={`tab-btn ${activeMarketTab === 'resultado' ? 'active' : ''}`}
                onClick={() => setActiveMarketTab('resultado')}
              >
                Resultado
              </button>
              <button
                className={`tab-btn ${activeMarketTab === 'goles' ? 'active' : ''}`}
                onClick={() => setActiveMarketTab('goles')}
              >
                Goles
              </button>
              <button
                className={`tab-btn ${activeMarketTab === 'jugadores' ? 'active' : ''}`}
                onClick={() => setActiveMarketTab('jugadores')}
              >
                Jugadores
              </button>
              <button
                className={`tab-btn ${activeMarketTab === 'corners' ? 'active' : ''}`}
                onClick={() => setActiveMarketTab('corners')}
              >
                Córners
              </button>
              <button
                className={`tab-btn ${activeMarketTab === 'tarjetas' ? 'active' : ''}`}
                onClick={() => setActiveMarketTab('tarjetas')}
              >
                Tarjetas
              </button>
              <button
                className={`tab-btn ${activeMarketTab === 'tips' ? 'active' : ''}`}
                onClick={() => setActiveMarketTab('tips')}
              >
                💡 Tips de Valor
              </button>
            </div>
          </div>

          {/* Active Tab Panel Markets */}
          <div style={{ paddingBottom: '1rem' }}>
            {activeMarketTab === 'resultado' && (
              <div className="markets-grid fade-in">
                {renderMarketCard('1X2 (Tiempo Reglamentario)', marketsResults.markets['1X2'])}
                {renderMarketCard('Doble Oportunidad', marketsResults.markets['doubleChance'])}
                {renderMarketCard('Ambos Equipos Anotan (BTTS)', marketsResults.markets['btts'])}
                {renderMarketCard('Marcadores Exactos más Probables', marketsResults.markets['exactScore'])}
              </div>
            )}

            {activeMarketTab === 'goles' && (
              <div className="markets-grid fade-in">
                {renderMarketCard('Total de Goles (Over)', marketsResults.markets['totalGoals'])}
                {renderMarketCard(`Goles de ${marketsResults.teamA.name}`, [
                  { n: 'Marca al menos 1', p: Math.round((1 - Math.exp(-marketsResults.xgA)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgA)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamA.id}_GOAL_1` },
                  { n: 'Marca 2 o más', p: Math.round((1 - Math.exp(-marketsResults.xgA) - marketsResults.xgA * Math.exp(-marketsResults.xgA)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgA) - marketsResults.xgA * Math.exp(-marketsResults.xgA)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamA.id}_GOAL_2` }
                ])}
                {renderMarketCard(`Goles de ${marketsResults.teamB.name}`, [
                  { n: 'Marca al menos 1', p: Math.round((1 - Math.exp(-marketsResults.xgB)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgB)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamB.id}_GOAL_1` },
                  { n: 'Marca 2 o más', p: Math.round((1 - Math.exp(-marketsResults.xgB) - marketsResults.xgB * Math.exp(-marketsResults.xgB)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgB) - marketsResults.xgB * Math.exp(-marketsResults.xgB)) * 100)), marketType: 'TEAM_GOALS', selectionId: `${marketsResults.teamB.id}_GOAL_2` }
                ])}
                {renderMarketCard('Estadísticas en Mitades', [
                  { n: 'Gol en 1ª Mitad', p: Math.round((1 - Math.exp(-marketsResults.xgA * 0.45 - marketsResults.xgB * 0.45)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgA * 0.45 - marketsResults.xgB * 0.45)) * 100)), marketType: 'HALF_STATS', selectionId: 'GOAL_1ST_HALF' },
                  { n: 'Gol en 2ª Mitad', p: Math.round((1 - Math.exp(-marketsResults.xgA * 0.55 - marketsResults.xgB * 0.55)) * 100), odds: probToOdds(Math.round((1 - Math.exp(-marketsResults.xgA * 0.55 - marketsResults.xgB * 0.55)) * 100)), marketType: 'HALF_STATS', selectionId: 'GOAL_2ND_HALF' }
                ])}
              </div>
            )}

            {activeMarketTab === 'jugadores' && (
              <div className="markets-grid fade-in">
                {renderMarketCard('Anota en Cualquier Momento', marketsResults.markets['anytimeGoal'])}
                {renderMarketCard('Primer Goleador del Encuentro', marketsResults.markets['firstGoal'])}
                {renderMarketCard('Asistente de Gol', marketsResults.markets['anytimeAssist'])}
              </div>
            )}

            {activeMarketTab === 'corners' && (
              <div className="markets-grid fade-in">
                {renderMarketCard('Total de Córners (Over)', marketsResults.markets['corners'])}
                {renderMarketCard(`Córners de ${marketsResults.teamA.name}`, [
                  { n: `Más de ${Math.round(marketsResults.avgCornersA - 1)}.5 Córners`, p: 65, odds: probToOdds(65), marketType: 'TEAM_CORNERS', selectionId: `${marketsResults.teamA.id}_CORNERS_LOW` },
                  { n: `Más de ${Math.round(marketsResults.avgCornersA)}.5 Córners`, p: 40, odds: probToOdds(40), marketType: 'TEAM_CORNERS', selectionId: `${marketsResults.teamA.id}_CORNERS_MID` }
                ])}
                {renderMarketCard(`Córners de ${marketsResults.teamB.name}`, [
                  { n: `Más de ${Math.round(marketsResults.avgCornersB - 1)}.5 Córners`, p: 62, odds: probToOdds(62), marketType: 'TEAM_CORNERS', selectionId: `${marketsResults.teamB.id}_CORNERS_LOW` },
                  { n: `Más de ${Math.round(marketsResults.avgCornersB)}.5 Córners`, p: 38, odds: probToOdds(38), marketType: 'TEAM_CORNERS', selectionId: `${marketsResults.teamB.id}_CORNERS_MID` }
                ])}
              </div>
            )}

            {activeMarketTab === 'tarjetas' && (
              <div className="markets-grid fade-in">
                {renderMarketCard('Total de Tarjetas Amarillas', marketsResults.markets['bookings'])}
                {renderMarketCard(`Tarjetas de ${marketsResults.teamA.name}`, [
                  { n: 'Al menos 1 tarjeta', p: 70, odds: probToOdds(70), marketType: 'TEAM_CARDS', selectionId: `${marketsResults.teamA.id}_CARD_1` },
                  { n: '2 o más tarjetas', p: 35, odds: probToOdds(35), marketType: 'TEAM_CARDS', selectionId: `${marketsResults.teamA.id}_CARD_2` }
                ])}
                {renderMarketCard(`Tarjetas de ${marketsResults.teamB.name}`, [
                  { n: 'Al menos 1 tarjeta', p: 68, odds: probToOdds(68), marketType: 'TEAM_CARDS', selectionId: `${marketsResults.teamB.id}_CARD_1` },
                  { n: '2 o más tarjetas', p: 32, odds: probToOdds(32), marketType: 'TEAM_CARDS', selectionId: `${marketsResults.teamB.id}_CARD_2` }
                ])}
              </div>
            )}

            {activeMarketTab === 'tips' && (
              <div style={{ padding: '1rem 1.5rem' }} className="fade-in">
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Análisis estratégico del algoritmo para {marketsResults.teamA.name} vs {marketsResults.teamB.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div className="tip-box" style={{ margin: 0 }}>
                    <div className="tip-header">✅ Resultado más probable</div>
                    <div className="tip-text">
                      <strong>
                        {marketsResults.probA > marketsResults.probB
                          ? `${marketsResults.teamA.name} gana (${marketsResults.probA}%)`
                          : `${marketsResults.teamB.name} gana (${marketsResults.probB}%)`}
                      </strong>{' '}
                      — Basado en la ventaja del Ranking FIFA y la forma física de los planteles.
                    </div>
                  </div>
                  <div className="tip-box yellow" style={{ margin: 0 }}>
                    <div className="tip-header yellow">📊 Mercado de Goles</div>
                    <div className="tip-text">
                      <strong>{marketsResults.xgTotal > 2.5 ? 'Más de 2.5 goles' : 'Menos de 2.5 goles'}</strong> — Los goles proyectados conjuntos son de {marketsResults.xgTotal}. El modelo espera un partido {marketsResults.xgTotal > 2.5 ? 'muy dinámico y abierto.' : 'tácticamente cerrado y rocoso.'}
                    </div>
                  </div>
                  <div className="tip-box" style={{ margin: 0 }}>
                    <div className="tip-header">🎯 Otros Parámetros de Juego Simulados</div>
                    <div className="tip-text" style={{ fontSize: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div>🚩 Saques de meta: <strong>{marketsResults.goalKicksA} vs {marketsResults.goalKicksB}</strong></div>
                      <div>📏 Tiros libres: <strong>{marketsResults.freeKicksA} vs {marketsResults.freeKicksB}</strong></div>
                      <div>🚫 Fueras de juego: <strong>{marketsResults.offsidesA} vs {marketsResults.offsidesB}</strong></div>
                      <div>🦶 Córners promedio: <strong>{~~marketsResults.avgCornersA} vs {~~marketsResults.avgCornersB}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid for Schedule and Golden Boot */}
      <div className="card-grid-2">
        
        {/* Daily Schedule Matches */}
        <div className="glass-card">
          <div className="panel-title">
            <Calendar size={18} className="text-gold" />
            <span>Partidos Destacados de Hoy</span>
          </div>
          <div className="next-matches">
            {dailyMatches.map(m => {
              const active = team1Id === m.hId && team2Id === m.aId;
              return (
                <div
                  key={m.hId + '_' + m.aId}
                  className="match-row"
                  onClick={() => handleSelectDailyMatch(m.hId, m.aId)}
                  style={{
                    border: active ? '1px solid var(--accent-cyan)' : '',
                    background: active ? 'rgba(0, 242, 254, 0.05)' : ''
                  }}
                >
                  <div className="mdate" style={{ color: active ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    {m.date}
                  </div>
                  <div className="mteams">
                    <span>{m.hName}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.75rem' }}>vs</span>
                    <span>{m.aName}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.note}</span>
                  <button className="mbtn" style={{ borderColor: active ? 'var(--accent-cyan)' : '' }}>
                    Predecir →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Golden Boot Widget */}
        <div className="glass-card">
          <div className="panel-title">
            <Trophy size={18} className="text-gold" />
            <span>🥇 Líderes Bota de Oro Mundial 2026</span>
          </div>
          
          <div className="table-container">
            <table className="golden-boot-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  <th style={{ textAlign: 'center' }}>Goles</th>
                  <th style={{ textAlign: 'center' }}>Asist.</th>
                  <th style={{ textAlign: 'center' }}>Bota %</th>
                </tr>
              </thead>
              <tbody>
                {goldenBootList.map((p, idx) => (
                  <tr key={p.name}>
                    <td>
                      <span className={`rank-badge ${idx === 0 ? 'r1' : (idx === 1 ? 'r2' : (idx === 2 ? 'r3' : ''))}`}>
                        {p.rank}
                      </span>
                    </td>
                    <td>
                      <div className="player-cell">
                        <span className="pflag">{p.flag}</span>
                        <div>
                          <div className="pname" style={{ fontSize: '0.85rem' }}>{p.name}</div>
                          <div className="pteam" style={{ fontSize: '0.75rem' }}>{p.team}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }} className="goals-big">{p.g}</td>
                    <td style={{ textAlign: 'center', color: 'var(--accent-blue)', fontWeight: 'bold' }}>{p.a}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="prob-chip" style={{ fontSize: '0.75rem' }}>{p.pb}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
