import React from 'react';
import { Trophy, ArrowRight, ShieldAlert, TrendingUp, Cpu, Award } from 'lucide-react';
import { tournamentSchedule } from '../data/tournamentSchedule';

interface HomeProps {
  onNavigate: (tab: 'home' | 'dashboard' | 'predictor', matchTeams?: { team1Id: string; team2Id: string }) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const dateStr = getTodayDateString();
  const todayMatches = tournamentSchedule[dateStr] || tournamentSchedule["2026-06-26"];

  const contenders = [
    { rank: '#1', name: 'España', flag: '🇪🇸', elo: 1820, value: '€980M', prob: 15.2 },
    { rank: '#2', name: 'Francia', flag: '🇫🇷', elo: 1845, value: '€1.04B', prob: 14.5 },
    { rank: '#3', name: 'Brasil', flag: '🇧🇷', elo: 1785, value: '€1.05B', prob: 13.8 },
    { rank: '#4', name: 'Argentina', flag: '🇦🇷', elo: 1860, value: '€800M', prob: 12.8 },
    { rank: '#5', name: 'Inglaterra', flag: '🏴\u200d󠁥󠁮󠁧󠁿', elo: 1740, value: '€1.20B', prob: 11.2 }
  ];

  return (
    <div className="home-container fade-in">
      {/* Hero Welcome Banner with Stadium Background */}
      <div className="home-hero glass-panel stadium-hero-bg">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <SparklesIcon />
            <span>MUNDIAL 2026 · SIMULADOR MATEMÁTICO</span>
          </div>
          <h1 className="hero-title">
            Herramienta de Predicción Analítica
          </h1>
          <p className="hero-subtitle">
            Proporciona proyecciones avanzadas y probabilidades para cada enfrentamiento del Mundial 2026. Utiliza un modelo Poisson calibrado con datos de rendimiento deportivo reales de <strong>Opta Sports</strong>, valor de mercado de <strong>Transfermarkt</strong> y rankings ELO de la <strong>FIFA</strong>.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => onNavigate('predictor')}>
              <span>Abrir Predictor 1v1</span>
              <ArrowRight size={16} />
            </button>
            <button className="secondary-btn" onClick={() => onNavigate('dashboard')}>
              <span>Explorar Dashboard</span>
            </button>
          </div>
        </div>
        
        {/* Floating Cup Container using the Uploaded Trophy Image */}
        <div className="hero-trophy-container">
          <div className="trophy-glow-behind"></div>
          <img src="/trophy_classic.jpg" alt="Copa del Mundo" className="trophy-image-floating" />
          <div className="trophy-sparkle s1">✨</div>
          <div className="trophy-sparkle s2">⭐</div>
          <div className="trophy-sparkle s3">✨</div>
        </div>
      </div>

      {/* Grid of Main Dashboard Widgets */}
      <div className="card-grid-2" style={{ marginTop: '1rem' }}>
        
        {/* Left Side: Highlighted Matches with interactive ELO progress bars */}
        <div className="flex-col gap-4">
          <div className="ud-section-title" style={{ paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={14} className="text-cyan" />
            <span>Partidos Destacados de la Jornada</span>
          </div>
          
          <div className="home-matches-list flex-col gap-3">
            {todayMatches.map((m, idx) => (
              <div key={idx} className="home-match-card glass-panel">
                <div className="hm-header">
                  <span className="hm-time">{m.time}</span>
                  <span className="hm-note">{m.note}</span>
                </div>
                
                <div className="hm-teams">
                  <span className="hm-team-cell">
                    <span className="hm-flag">{m.hFlag}</span>
                    <span>{m.hName}</span>
                  </span>
                  <span className="hm-vs">VS</span>
                  <span className="hm-team-cell justify-end">
                    <span>{m.aName}</span>
                    <span className="hm-flag">{m.aFlag}</span>
                  </span>
                </div>

                {/* Win probabilities visual bar */}
                <div className="hm-prob-container">
                  <div className="hm-prob-bar">
                    <div className="hm-prob-fill home" style={{ width: `${m.pHome}%` }} title={`Local: ${m.pHome}%`}></div>
                    <div className="hm-prob-fill draw" style={{ width: `${m.pDraw}%` }} title={`Empate: ${m.pDraw}%`}></div>
                    <div className="hm-prob-fill away" style={{ width: `${m.pAway}%` }} title={`Visitante: ${m.pAway}%`}></div>
                  </div>
                  <div className="hm-prob-labels">
                    <span className="text-cyan">{m.pHome}%</span>
                    <span className="text-muted">Empate {m.pDraw}%</span>
                    <span className="text-purple">{m.pAway}%</span>
                  </div>
                </div>

                <div className="hm-footer">
                  <span className="hm-desc">Precalculado con ELO y alineaciones en vivo</span>
                  <button className="hm-predict-btn" onClick={() => onNavigate('predictor', { team1Id: m.hId, team2Id: m.aId })}>
                    Analizar 1v1 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Favorites Widget & Overall Stats */}
        <div className="flex-col gap-4">
          <div className="ud-section-title" style={{ paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={14} className="text-gold" />
            <span>Favoritos al Título (Top 5)</span>
          </div>

          <div className="glass-panel flex-col gap-4" style={{ flexGrow: 1 }}>
            <div className="contenders-list flex-col gap-3">
              {contenders.map((c, idx) => (
                <div key={idx} className="contender-row">
                  <div className="contender-info">
                    <span className="contender-rank">{c.rank}</span>
                    <span className="contender-flag">{c.flag}</span>
                    <span className="contender-name">{c.name}</span>
                  </div>
                  <div className="contender-metrics">
                    <span className="contender-elo">ELO {c.elo}</span>
                    <span className="contender-value">{c.value}</span>
                  </div>
                  <div className="contender-progress-container">
                    <div className="contender-progress-bar" style={{ width: `${c.prob * 5}%` }}></div>
                    <span className="contender-prob">{c.prob}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick interactive counters block */}
            <div className="stats-counters-grid">
              <div className="counter-item">
                <Cpu size={16} className="text-cyan" />
                <div className="counter-val">10,000+</div>
                <div className="counter-lbl">Simulaciones Monte Carlo</div>
              </div>
              <div className="counter-item">
                <Trophy size={16} className="text-gold" />
                <div className="counter-val">48</div>
                <div className="counter-lbl">Selecciones Oficiales</div>
              </div>
            </div>

            {/* Disclaimer notice */}
            <div className="home-disclaimer-box" style={{ marginTop: 'auto' }}>
              <ShieldAlert size={14} className="text-gold" style={{ flexShrink: 0 }} />
              <span>
                <strong>Aviso de Análisis:</strong> Los cálculos emplean distribuciones probabilísticas basadas en rendimiento deportivo puro y alineaciones en vivo. No se consideran variables macroeconómicas.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// SVG Icons helpers
const SparklesIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);
