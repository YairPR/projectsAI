import React from 'react';
import { Trophy, Sliders, GitPullRequest, Percent, ArrowRight, ShieldAlert } from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: 'dashboard' | 'simulator' | 'bracket' | 'messi' | 'predictor') => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const todayMatches = [
    { time: 'Hoy · 18:00h', hFlag: '🇪🇨', hName: 'Ecuador', aFlag: '🇩🇪', aName: 'Alemania', note: 'Partidazo Grupo E' },
    { time: 'Hoy · 21:00h', hFlag: '🇨🇭', hName: 'Suiza', aFlag: '🇨🇦', aName: 'Canadá', note: 'Definición Grupo B' },
    { time: 'Hoy · 21:00h', hFlag: '🇨🇼', hName: 'Curazao', aFlag: '🇨🇮', aName: 'Costa de Marfil', note: 'Grupo E - Clave' },
    { time: 'Hoy · 23:30h', hFlag: '🇧🇷', hName: 'Brasil', aFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', aName: 'Escocia', note: 'Grupo C' }
  ];

  return (
    <div className="home-container fade-in">
      {/* Hero Welcome Banner */}
      <div className="home-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <SparklesIcon />
            <span>MUNDIAL 2026 · MODELO CIENTÍFICO</span>
          </div>
          <h1 className="hero-title">
            Predictor & Simulador Econométrico
          </h1>
          <p className="hero-subtitle">
            Combina los principios de la econometría de <strong>Joachim Klement</strong> (PIB, población, temperatura media y localía) con la distribución de Poisson y datos de rendimiento físico, edad y esquemas tácticos de <strong>Opta Sports</strong>.
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
        <div className="hero-icon">🏆</div>
      </div>

      {/* Grid of Main Navigation Cards */}
      <div className="card-grid-2" style={{ marginTop: '1.5rem' }}>
        
        {/* Navigation Cards Left */}
        <div className="flex-col gap-4">
          <div className="ud-section-title" style={{ paddingLeft: '0.5rem' }}>Módulos de Simulación</div>
          
          <div className="home-action-card glass-panel" onClick={() => onNavigate('predictor')}>
            <div className="hac-icon bg-cyan-glow text-cyan">
              <Percent size={24} />
            </div>
            <div className="hac-content">
              <h3 className="hac-title">Predictor Avanzado 1v1</h3>
              <p className="hac-desc">
                Coteja enfrentamientos directos utilizando una consola de rastreo de datos en tiempo real (FIFA, Transfermarkt, Opta). Incluye boleto de apuestas con parlays.
              </p>
            </div>
            <ChevronRightIcon />
          </div>

          <div className="home-action-card glass-panel" onClick={() => onNavigate('dashboard')}>
            <div className="hac-icon bg-gold-glow text-gold">
              <Trophy size={24} />
            </div>
            <div className="hac-content">
              <h3 className="hac-title">Dashboard Táctico & Jugadores</h3>
              <p className="hac-desc">
                Busca cualquier jugador de las 48 selecciones para analizar su radar SVG de habilidades en vivo y revisa las tablas oficiales del mundial.
              </p>
            </div>
            <ChevronRightIcon />
          </div>

          <div className="home-action-card glass-panel" onClick={() => onNavigate('simulator')}>
            <div className="hac-icon bg-purple-glow text-purple">
              <Sliders size={24} />
            </div>
            <div className="hac-content">
              <h3 className="hac-title">Simulador Econométrico</h3>
              <p className="hac-desc">
                Corre simulaciones Monte Carlo del torneo manipulando la importancia del PIB, población, clima y suerte para ver la probabilidad de campeonar.
              </p>
            </div>
            <ChevronRightIcon />
          </div>

          <div className="home-action-card glass-panel" onClick={() => onNavigate('bracket')}>
            <div className="hac-icon bg-green-glow text-green">
              <GitPullRequest size={24} />
            </div>
            <div className="hac-content">
              <h3 className="hac-title">Llaves del Torneo (Bracket)</h3>
              <p className="hac-desc">
                Visualiza y pronostica las llaves de eliminación directa desde dieciseisavos de final hasta coronar al campeón del mundo.
              </p>
            </div>
            <ChevronRightIcon />
          </div>
        </div>

        {/* Schedule & Model Information Right */}
        <div className="flex-col gap-4">
          <div className="ud-section-title" style={{ paddingLeft: '0.5rem' }}>Partidos Destacados de Hoy</div>
          
          <div className="glass-panel flex-col gap-3" style={{ flexGrow: 1 }}>
            <div className="panel-header-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <CalendarIcon />
              <span className="panel-title-text" style={{ fontSize: '0.8rem' }}>Calendario de Juego Activo</span>
            </div>

            <div className="home-matches-list flex-col gap-3">
              {todayMatches.map((m, idx) => (
                <div key={idx} className="home-match-row">
                  <span className="hm-time">{m.time}</span>
                  <div className="hm-teams">
                    <span className="hm-team-cell">
                      <span className="hm-flag">{m.hFlag}</span>
                      <span>{m.hName}</span>
                    </span>
                    <span className="hm-vs">vs</span>
                    <span className="hm-team-cell justify-end">
                      <span>{m.aName}</span>
                      <span className="hm-flag">{m.aFlag}</span>
                    </span>
                  </div>
                  <div className="hm-footer">
                    <span className="hm-note">{m.note}</span>
                    <button className="hm-predict-btn" onClick={() => onNavigate('predictor')}>
                      Predecir →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer notice */}
            <div className="home-disclaimer-box">
              <ShieldAlert size={14} className="text-gold" />
              <span>
                <strong>Aviso de Análisis:</strong> Los cálculos aplican variables complejas de econometría y rendimiento físico. El fútbol contiene un ~45% de azar inherente.
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

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hac-chevron">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
