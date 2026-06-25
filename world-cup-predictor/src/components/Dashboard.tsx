import React, { useState, useEffect } from 'react';
import type { Team, Player } from '../data/teamsData';
import type { SimulationStats, GroupStanding } from '../utils/simulatorEngine';
import { Search, Trophy, Award } from 'lucide-react';

interface DashboardProps {
  teams: Team[];
  predictions: Record<string, SimulationStats>;
  groupStandings: Record<string, GroupStanding[]>;
}

export const Dashboard: React.FC<DashboardProps> = ({ teams, predictions, groupStandings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');
  const [activeGroupView, setActiveGroupView] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'>('A');

  // Dynamic player analysis state
  const [playerTeamId, setPlayerTeamId] = useState<string>('ARG');
  const [playerIndex, setPlayerIndex] = useState<number>(0);

  const selectedTeam = teams.find(t => t.id === playerTeamId) || teams[0];
  const selectedPlayer = selectedTeam.players[playerIndex] || selectedTeam.players[0] || null;

  // Auto-reset player index if team changes
  useEffect(() => {
    setPlayerIndex(0);
  }, [playerTeamId]);

  // Filter teams for prediction table
  const filteredPredictions = Object.values(predictions)
    .filter(p => {
      const team = teams.find(t => t.id === p.teamId);
      if (!team) return false;
      
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = selectedContinent === 'ALL' || team.continent === selectedContinent;
      
      return matchesSearch && matchesContinent;
    })
    .sort((a, b) => b.winProb - a.winProb);

  const getProbBadgeClass = (prob: number) => {
    if (prob > 12) return 'prob-badge prob-high';
    if (prob > 4) return 'prob-badge prob-med';
    return 'prob-badge prob-low';
  };

  // Hexagon Radar coordinates generator
  const getRadarPoints = (player: Player) => {
    let stats = [80, 80, 80, 50, 70, 80]; // default
    if (player.name.includes('Messi')) {
      stats = [98, 96, 97, 42, 64, 93];
    } else {
      const isDel = player.position === 'DEL';
      const isMed = player.position === 'MED';
      stats = [
        isDel ? 88 : (isMed ? 75 : 45), // attacking
        isMed ? 90 : (isDel ? 78 : 65), // passing
        isDel ? 86 : (isMed ? 82 : 55), // dribbling
        player.position === 'DEF' ? 90 : (isMed ? 70 : 35), // defending
        player.position === 'DEF' ? 85 : (isDel ? 70 : 80), // physical
        isDel ? 90 : (isMed ? 72 : 40)  // shooting
      ];
    }

    const center = 100;
    const maxRadius = 65;
    const angles = [-Math.PI/2, -Math.PI/6, Math.PI/6, Math.PI/2, 5*Math.PI/6, 7*Math.PI/6];

    return angles.map((angle, i) => {
      const r = (stats[i] / 100) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const getStatValue = (player: Player, statIndex: number) => {
    if (player.name.includes('Messi')) {
      const values = [98, 96, 97, 42, 64, 93];
      return values[statIndex];
    }
    const isDel = player.position === 'DEL';
    const isMed = player.position === 'MED';
    const values = [
      isDel ? 88 : (isMed ? 75 : 45), // Attacking
      isMed ? 90 : (isDel ? 78 : 65), // Passing
      isDel ? 86 : (isMed ? 82 : 55), // Dribbling
      player.position === 'DEF' ? 90 : (isMed ? 70 : 35), // Defending
      player.position === 'DEF' ? 85 : (isDel ? 70 : 80), // Physical
      isDel ? 90 : (isMed ? 72 : 40)  // Shooting
    ];
    return values[statIndex];
  };

  const continents = ['ALL', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
  const sortedTeamsList = [...teams].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="fade-in">
      
      {/* 3-Column Premium Dashboard Layout */}
      <div className="ud-grid">
        
        {/* ================================================== */}
        {/* COLUMN 1: GROUPS & STANDINGS */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-4">
          <div className="panel-header-row">
            <Award size={18} className="text-cyan" />
            <h3 className="panel-title-text">Clasificación de Grupos</h3>
          </div>
          
          {/* Group Tab Selector */}
          <div style={{ display: 'flex', gap: '0.2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {(Object.keys(groupStandings) as Array<keyof typeof groupStandings>).map(g => (
              <button
                key={g}
                onClick={() => setActiveGroupView(g as any)}
                style={{
                  background: activeGroupView === g ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.02)',
                  color: activeGroupView === g ? '#020617' : 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  padding: '0.3rem 0.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Standing details of active group */}
          <div className="table-container" style={{ flexGrow: 1 }}>
            <table className="premium-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Selección</th>
                  <th style={{ textAlign: 'center' }}>PJ</th>
                  <th style={{ textAlign: 'center' }}>PTS</th>
                  <th style={{ textAlign: 'center' }}>DG</th>
                </tr>
              </thead>
              <tbody>
                {groupStandings[activeGroupView]?.map((standing, idx) => (
                  <tr key={standing.team.id}>
                    <td style={{ 
                      fontWeight: 700, 
                      color: idx < 2 ? 'var(--accent-green)' : (idx === 2 ? 'var(--accent-gold)' : 'var(--text-muted)') 
                    }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div className="team-cell" style={{ gap: '0.4rem' }}>
                        <span className="team-flag" style={{ fontSize: '1.1rem' }}>{standing.team.flag}</span>
                        <span style={{ fontWeight: 600 }}>{standing.team.name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{standing.played}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--text-primary)' }}>{standing.points}</td>
                    <td style={{ 
                      textAlign: 'center', 
                      fontWeight: 600, 
                      color: standing.goalDifference > 0 ? 'var(--accent-green)' : (standing.goalDifference < 0 ? 'var(--accent-red)' : 'var(--text-secondary)')
                    }}>
                      {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color Indicators */}
          <div className="flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }}></div>
              <span>Clasificación Directa (Top 2)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)' }}></div>
              <span>Mejores Terceros</span>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* COLUMN 2: GLOBAL PREDICTIONS TABLE */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-4">
          <div className="panel-header-row">
            <Trophy size={18} className="text-gold" />
            <h3 className="panel-title-text">Probabilidades de Victoria</h3>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
              <input
                type="text"
                placeholder="Buscar selección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.45rem 0.75rem 0.45rem 1.8rem',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <Search size={12} style={{
                position: 'absolute',
                left: '0.65rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>

            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
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
              {continents.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'Todos' : c}</option>
              ))}
            </select>
          </div>

          {/* Predictions Table */}
          <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="premium-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>Pos</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>Equipo</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>1/4</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>Final</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>Campeón</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.length > 0 ? (
                  filteredPredictions.map((p, idx) => (
                    <tr key={p.teamId}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div className="team-cell" style={{ gap: '0.4rem' }}>
                          <span className="team-flag">{p.flag}</span>
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{p.quarterProb}%</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{p.finalProb}%</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={getProbBadgeClass(p.winProb)} style={{ fontSize: '0.72rem', padding: '0.15rem 0.40rem' }}>
                          {p.winProb}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No se encontraron selecciones.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================== */}
        {/* COLUMN 3: DYNAMIC PLAYER TACTICAL ANALYSIS */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-4">
          <div className="panel-header-row">
            <Award size={18} className="text-gold" />
            <h3 className="panel-title-text">Análisis de Jugador</h3>
          </div>

          {/* Dynamic Selectors */}
          <div className="flex-col gap-2">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Selección</span>
                <select
                  value={playerTeamId}
                  onChange={(e) => setPlayerTeamId(e.target.value)}
                  style={{
                    background: '#0d1527',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  {sortedTeamsList.map(t => (
                    <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-col gap-1">
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Jugador</span>
                <select
                  value={playerIndex}
                  onChange={(e) => setPlayerIndex(Number(e.target.value))}
                  style={{
                    background: '#0d1527',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  {selectedTeam.players.map((p, idx) => (
                    <option key={p.name} value={idx}>{p.name} ({p.position})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedPlayer ? (
            <div className="player-analysis-widget" style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>
              
              {/* Profile Card */}
              <div className="player-profile-top">
                <span className="player-avatar-large">👤</span>
                <div>
                  <h4 className="pa-name">{selectedPlayer.name}</h4>
                  <div className="pa-meta-text">
                    <span>{selectedTeam.flag} {selectedTeam.name}</span>
                    <span> · </span>
                    <span>{selectedPlayer.position}</span>
                    <span> · </span>
                    <span>{selectedPlayer.age} años</span>
                  </div>
                </div>
              </div>

              {/* Hexagon Skill Radar */}
              <div className="radar-chart-container">
                <svg width="180" height="180" viewBox="0 0 200 200" className="radar-svg">
                  {/* Background hexagons */}
                  {[1.0, 0.75, 0.5, 0.25].map(scale => {
                    const r = 65 * scale;
                    const angles = [-Math.PI/2, -Math.PI/6, Math.PI/6, Math.PI/2, 5*Math.PI/6, 7*Math.PI/6];
                    const points = angles.map(angle => {
                      const x = 100 + r * Math.cos(angle);
                      const y = 100 + r * Math.sin(angle);
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <polygon 
                        key={scale}
                        points={points} 
                        fill="none" 
                        stroke="rgba(16, 185, 129, 0.15)" 
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Axis lines */}
                  {[-Math.PI/2, -Math.PI/6, Math.PI/6, Math.PI/2, 5*Math.PI/6, 7*Math.PI/6].map((angle, i) => {
                    const x = 100 + 65 * Math.cos(angle);
                    const y = 100 + 65 * Math.sin(angle);
                    return (
                      <line 
                        key={i}
                        x1="100" 
                        y1="100" 
                        x2={x} 
                        y2={y} 
                        stroke="rgba(16, 185, 129, 0.1)" 
                        strokeWidth="1" 
                      />
                    );
                  })}

                  {/* Glowing Green Skills Polygon */}
                  <polygon 
                    points={getRadarPoints(selectedPlayer)} 
                    fill="rgba(16, 185, 129, 0.15)" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    className="radar-poly-glow"
                  />

                  {/* Data Dots */}
                  {getRadarPoints(selectedPlayer).split(' ').map((pt, i) => {
                    const [x, y] = pt.split(',');
                    return (
                      <circle 
                        key={i}
                        cx={x} 
                        cy={y} 
                        r="3" 
                        fill="#ffffff" 
                        stroke="#10b981" 
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  
                  {/* Labels */}
                  <text x="100" y="22" className="radar-label" textAnchor="middle">ATAQUE</text>
                  <text x="168" y="78" className="radar-label" textAnchor="start">PASES</text>
                  <text x="168" y="132" className="radar-label" textAnchor="start">REGATE</text>
                  <text x="100" y="184" className="radar-label" textAnchor="middle">DEFENSA</text>
                  <text x="32" y="132" className="radar-label" textAnchor="end">FÍSICO</text>
                  <text x="32" y="78" className="radar-label" textAnchor="end">DISPARO</text>
                </svg>
              </div>

              {/* Stats Value Grid */}
              <div className="radar-values-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                <div className="radar-val-box">
                  <span className="rv-label">Ataque</span>
                  <span className="rv-value text-green">{getStatValue(selectedPlayer, 0)}</span>
                </div>
                <div className="radar-val-box">
                  <span className="rv-label">Pases</span>
                  <span className="rv-value text-green">{getStatValue(selectedPlayer, 1)}</span>
                </div>
                <div className="radar-val-box">
                  <span className="rv-label">Regate</span>
                  <span className="rv-value text-green">{getStatValue(selectedPlayer, 2)}</span>
                </div>
                <div className="radar-val-box">
                  <span className="rv-label">Defensa</span>
                  <span className="rv-value text-green">{getStatValue(selectedPlayer, 3)}</span>
                </div>
                <div className="radar-val-box">
                  <span className="rv-label">Físico</span>
                  <span className="rv-value text-green">{getStatValue(selectedPlayer, 4)}</span>
                </div>
                <div className="radar-val-box">
                  <span className="rv-label">Disparo</span>
                  <span className="rv-value text-green">{getStatValue(selectedPlayer, 5)}</span>
                </div>
              </div>

              {/* Bottom Accumulates Stats Row */}
              <div className="accumulated-stats-row" style={{ marginTop: '0.75rem' }}>
                <div className="ast-box">
                  <span className="ast-title">Goles</span>
                  <span className="ast-number">{selectedPlayer.name.includes('Messi') ? 5 : selectedPlayer.goals}</span>
                </div>
                <div className="ast-box">
                  <span className="ast-title">Asist.</span>
                  <span className="ast-number">{selectedPlayer.name.includes('Messi') ? 3 : selectedPlayer.assists}</span>
                </div>
                <div className="ast-box">
                  <span className="ast-title">xG</span>
                  <span className="ast-number text-cyan">{selectedPlayer.name.includes('Messi') ? '4.8' : (selectedPlayer.scoringProb * 7.5).toFixed(1)}</span>
                </div>
                <div className="ast-box">
                  <span className="ast-title">xA</span>
                  <span className="ast-number text-purple">{selectedPlayer.name.includes('Messi') ? '3.1' : (selectedPlayer.assistProb * 5.2).toFixed(1)}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-center" style={{ height: '200px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Selecciona un jugador para ver su análisis táctico
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
