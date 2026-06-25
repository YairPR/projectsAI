import React, { useState } from 'react';
import type { ModelWeights, SimulationStats } from '../utils/simulatorEngine';
import { Sliders, RefreshCw, BarChart2, Globe, TrendingUp, HelpCircle } from 'lucide-react';

interface KlementSimulatorProps {
  weights: ModelWeights;
  onWeightsChange: (newWeights: ModelWeights) => void;
  onRunSimulation: (iterations: number) => Promise<void>;
  predictions: Record<string, SimulationStats>;
  isSimulating: boolean;
  simulationProgress: number;
}

export const KlementSimulator: React.FC<KlementSimulatorProps> = ({
  weights,
  onWeightsChange,
  onRunSimulation,
  predictions,
  isSimulating,
  simulationProgress
}) => {
  const [iterations, setIterations] = useState<number>(2000);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSliderChange = (key: keyof ModelWeights, val: number) => {
    onWeightsChange({
      ...weights,
      [key]: val
    });
  };

  const resetWeights = () => {
    onWeightsChange({
      fifaRank: 0.60,
      squadValue: 0.25,
      gdp: 0.03,
      population: 0.02,
      climate: 0.03,
      host: 0.07,
      luck: 0.15
    });
  };

  // Get Top 10 teams for bar chart visualization
  const topTeams = Object.values(predictions)
    .sort((a, b) => b.winProb - a.winProb)
    .slice(0, 10);

  // Maximum probability to scale the chart width
  const maxProb = Math.max(...topTeams.map(t => t.winProb), 1.0);

  const variableDetails: Record<keyof ModelWeights, { title: string; desc: string }> = {
    fifaRank: {
      title: 'Puntos Ranking FIFA',
      desc: 'Mide la calidad deportiva actual de la selección y su rendimiento histórico reciente en competiciones oficiales.'
    },
    gdp: {
      title: 'PIB per cápita (GDP)',
      desc: 'Mide la capacidad económica del país para financiar academias, centros de alto rendimiento e infraestructura de fútbol base.'
    },
    population: {
      title: 'Población del País',
      desc: 'El tamaño de la población representa el pool total de talentos disponibles. A mayor población, mayor probabilidad de detectar estrellas.'
    },
    climate: {
      title: 'Factor Clima (Temp Anual)',
      desc: 'El modelo de Klement define una temperatura media anual óptima de 14°C para la práctica y el desarrollo del fútbol. Desviaciones extremas penalizan.'
    },
    host: {
      title: 'Ventaja de Localía',
      desc: 'Ponderación adicional por jugar en casa. Aplica a los anfitriones (EE.UU., México, Canadá) y da bonus moderado a los países de su misma confederación.'
    },
    squadValue: {
      title: 'Valor de Plantilla',
      desc: 'Valor de mercado agregado de los 26 convocados oficiales. Altamente correlacionado con la calidad individual de las grandes ligas.'
    },
    luck: {
      title: 'Suerte / Aleatoriedad',
      desc: 'Pondera el nivel de azar y sucesos imprevistos (lesiones, fallos arbitrales, penaltis) añadidos a cada partido simulado por Monte Carlo.'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Simulation Modal overlay */}
      {isSimulating && (
        <div className="sim-overlay">
          <div className="sim-loader-card">
            <div className="sim-spinner"></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Simulando Torneo...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              El motor Monte Carlo está jugando {iterations.toLocaleString()} campeonatos completos en tiempo real.
            </p>
            <div className="sim-progress-bar">
              <div className="sim-progress-fill" style={{ width: `${simulationProgress}%` }}></div>
            </div>
            <div style={{ marginTop: '0.75rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
              {simulationProgress}%
            </div>
          </div>
        </div>
      )}

      {/* Intro Header */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={22} className="text-cyan" />
          <span>Simulador Econométrico Joachim Klement</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configura los pesos del modelo de Joachim Klement y simula el mundial con variables demográficas,
          económicas y de localía. Al terminar, podrás ver el impacto en las probabilidades de ganar el título.
        </p>
      </div>

      <div className="simulator-layout">
        
        {/* Sliders Panel */}
        <div className="glass-card">
          <div className="panel-title flex-space">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} className="text-cyan" />
              <span>Parámetros del Modelo</span>
            </div>
            <button 
              onClick={resetWeights}
              title="Restaurar por defecto"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.keys(variableDetails).map((keyString) => {
              const key = keyString as keyof ModelWeights;
              const details = variableDetails[key];
              const isLuck = key === 'luck';
              
              return (
                <div key={key} className="slider-group" style={{ position: 'relative' }}>
                  <div className="slider-label">
                    <span className="slider-name">
                      {details.title}
                      <HelpCircle 
                        size={13} 
                        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                        onMouseEnter={() => setShowTooltip(key)}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                    </span>
                    <span className="slider-value" style={{ color: isLuck ? 'var(--accent-purple)' : 'var(--accent-cyan)' }}>
                      {Math.round(weights[key] * 100)}%
                    </span>
                  </div>

                  {/* Tooltip Popup */}
                  {showTooltip === key && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid var(--border-glass)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)',
                      zIndex: 10,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>{details.title}:</strong> {details.desc}
                    </div>
                  )}

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights[key]}
                    onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
                    className="custom-slider"
                    style={{
                      accentColor: isLuck ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                      background: isLuck ? 'rgba(168, 85, 247, 0.1)' : 'rgba(0, 242, 254, 0.05)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Iteraciones de Monte Carlo:
            </label>
            <select
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              style={{
                width: '100%',
                background: '#0d1527',
                border: '1px solid var(--border-glass)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value={1000}>1,000 Simulaciones (Rápido)</option>
              <option value={2000}>2,000 Simulaciones (Recomendado)</option>
              <option value={5000}>5,000 Simulaciones (Preciso)</option>
            </select>

            <button 
              className="btn-primary" 
              onClick={() => onRunSimulation(iterations)}
              style={{ width: '100%' }}
            >
              <TrendingUp size={18} />
              <span>Simular Mundial 2026</span>
            </button>
          </div>
        </div>

        {/* Chart Visualization Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-title">
            <BarChart2 size={20} className="text-gold" />
            <span>Top 10 Probabilidad de Campeonar</span>
          </div>

          {/* SVG Bar Chart */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg 
              viewBox="0 0 500 350" 
              className="radar-svg" 
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '350px' }}
            >
              {topTeams.map((team, idx) => {
                // Width calculations
                const baseWidth = 320;
                const barWidth = (team.winProb / maxProb) * baseWidth;
                const yPos = 20 + idx * 32;

                return (
                  <g key={team.teamId} style={{ transition: 'all 0.5s ease-in-out' }}>
                    {/* Index rank */}
                    <text 
                      x="10" 
                      y={yPos + 18} 
                      fill="var(--text-muted)" 
                      fontSize="12" 
                      fontWeight="bold"
                      fontFamily="var(--font-heading)"
                    >
                      #{idx + 1}
                    </text>

                    {/* Flag & Team Name */}
                    <text 
                      x="35" 
                      y={yPos + 18} 
                      fill="var(--text-primary)" 
                      fontSize="12.5" 
                      fontWeight="600"
                    >
                      {team.flag} {team.name}
                    </text>

                    {/* Background track for bar */}
                    <rect 
                      x="150" 
                      y={yPos + 6} 
                      width={baseWidth} 
                      height="12" 
                      rx="6" 
                      fill="rgba(255, 255, 255, 0.02)" 
                    />

                    {/* Filled bar with cyan gradient/color */}
                    <rect 
                      x="150" 
                      y={yPos + 6} 
                      width={Math.max(12, barWidth)} // Minimum width to show bar
                      height="12" 
                      rx="6" 
                      fill={idx === 0 ? 'url(#goldGradient)' : 'url(#cyanGradient)'} 
                      style={{
                        filter: idx === 0 
                          ? 'drop-shadow(0px 0px 5px var(--accent-gold-glow))' 
                          : 'drop-shadow(0px 0px 4px var(--accent-cyan-glow))',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />

                    {/* Probability percentage value */}
                    <text 
                      x={150 + Math.max(12, barWidth) + 10} 
                      y={yPos + 18} 
                      fill={idx === 0 ? 'var(--accent-gold)' : 'var(--accent-cyan)'} 
                      fontSize="11.5" 
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {team.winProb}%
                    </text>
                  </g>
                );
              })}

              {/* Define gradients for the chart bars */}
              <defs>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="var(--accent-cyan)" />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="var(--accent-gold)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
};
