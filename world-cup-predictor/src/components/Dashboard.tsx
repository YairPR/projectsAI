import React, { useState } from 'react';
import type { Team } from '../data/teamsData';
import type { SimulationStats, GroupStanding } from '../utils/simulatorEngine';
import { Search, Trophy, Award, ListFilter, Percent } from 'lucide-react';

interface DashboardProps {
  teams: Team[];
  predictions: Record<string, SimulationStats>;
  groupStandings: Record<string, GroupStanding[]>;
}

export const Dashboard: React.FC<DashboardProps> = ({ teams, predictions, groupStandings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');
  const [activeGroupView, setActiveGroupView] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'>('A');

  // Filter teams for prediction table
  const filteredPredictions = Object.values(predictions)
    .filter(p => {
      const team = teams.find(t => t.id === p.teamId);
      if (!team) return false;
      
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = selectedContinent === 'ALL' || team.continent === selectedContinent;
      
      return matchesSearch && matchesContinent;
    })
    // Sort by win probability by default
    .sort((a, b) => b.winProb - a.winProb);

  const getProbBadgeClass = (prob: number) => {
    if (prob > 12) return 'prob-badge prob-high';
    if (prob > 4) return 'prob-badge prob-med';
    return 'prob-badge prob-low';
  };

  const continents = ['ALL', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.95) 0%, rgba(8, 12, 22, 0.95) 100%)',
        borderColor: 'var(--accent-glow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Predicciones & Simulación FIFA 2026
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', fontSize: '0.95rem' }}>
            Bienvenido al panel avanzado de probabilidades de la Copa Mundial 2026. Los datos por defecto
            reflejan las estimaciones combinadas del superordenador de <strong>Opta (The Analyst)</strong> y
            las variables socioeconómicas y climáticas de <strong>Joachim Klement</strong>.
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '-20%',
          fontSize: '9rem',
          opacity: 0.05,
          pointerEvents: 'none',
          color: 'var(--accent-cyan)'
        }}>
          ⚽
        </div>
      </div>

      {/* Grid Container for Table & Groups */}
      <div className="card-grid-2">
        
        {/* Left Side: Predictions Table */}
        <div className="glass-card">
          <div className="panel-title">
            <Trophy size={20} className="text-gold" />
            <span>Probabilidades de Victoria (Opta & Klement)</span>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <input
                type="text"
                placeholder="Buscar selección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.6rem 1rem 0.6rem 2.2rem',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
              <Search size={16} style={{
                position: 'absolute',
                left: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>

            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <ListFilter size={16} style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }} />
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                style={{
                  background: '#0d1527',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {continents.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'Confederaciones' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Predictions Table */}
          <div className="table-container" style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>Pos</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>Equipo</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>1/16</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>1/4</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>Final</th>
                  <th style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, textAlign: 'center' }}>Ganador</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.length > 0 ? (
                  filteredPredictions.map((p, idx) => (
                    <tr key={p.teamId}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div className="team-cell">
                          <span className="team-flag">{p.flag}</span>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }} className="prob-cell">{p.r32Prob}%</td>
                      <td style={{ textAlign: 'center' }} className="prob-cell">{p.quarterProb}%</td>
                      <td style={{ textAlign: 'center' }} className="prob-cell">{p.finalProb}%</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={getProbBadgeClass(p.winProb)}>{p.winProb}%</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No se encontraron selecciones.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Groups & Standings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Group Tab Selector */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} className="text-cyan" />
                <span>Clasificación de Grupos Mundial 2026</span>
              </h3>
            </div>
            
            {/* Horizontal Group Selector tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '0.25rem', 
              overflowX: 'auto', 
              paddingBottom: '0.5rem',
              scrollbarWidth: 'thin'
            }}>
              {(Object.keys(groupStandings) as Array<keyof typeof groupStandings>).map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGroupView(g as any)}
                  style={{
                    background: activeGroupView === g ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.03)',
                    color: activeGroupView === g ? '#020617' : 'var(--text-secondary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Grupo {g}
                </button>
              ))}
            </div>
          </div>

          {/* Standing details of active group */}
          <div className="glass-card" style={{ flex: 1 }}>
            <div className="group-card-title">
              <span>GRUPO {activeGroupView}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fase de grupos</span>
            </div>

            <div className="table-container">
              <table className="premium-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Selección</th>
                    <th style={{ textAlign: 'center' }}>PJ</th>
                    <th style={{ textAlign: 'center' }}>PTS</th>
                    <th style={{ textAlign: 'center' }}>DG</th>
                    <th style={{ textAlign: 'center' }}>GF</th>
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
                        <div className="team-cell" style={{ gap: '0.5rem' }}>
                          <span className="team-flag">{standing.team.flag}</span>
                          <span>{standing.team.name}</span>
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
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{standing.goalsFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></div>
                <span>Clasificación Directa (Top 2)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)' }}></div>
                <span>Posible Clasificación (8 mejores 3° puestos)</span>
              </div>
            </div>
          </div>

          {/* Quick stats panel */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Percent size={18} className="text-cyan" />
              <span>Opta Supercomputer Predictions Summary</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="flex-space" style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🇳🇱 Países Bajos (Favorito Klement)</span>
                <span className="prob-cell" style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {predictions['NED']?.winProb}% de ganar
                </span>
              </div>
              <div className="flex-space" style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🇦🇷 Argentina (Campeón Defensor)</span>
                <span className="prob-cell" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {predictions['ARG']?.winProb}% de ganar
                </span>
              </div>
              <div className="flex-space" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🇫🇷 Francia (Favorito Opta)</span>
                <span className="prob-cell" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {predictions['FRA']?.winProb}% de ganar
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
