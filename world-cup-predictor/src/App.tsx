import { useState, useEffect } from 'react';
import type { Team } from './data/teamsData';
import { teamsData } from './data/teamsData';
import type { ModelWeights, SimulationStats, GroupStanding } from './utils/simulatorEngine';
import { runMonteCarloSimulation, simulateGroup } from './utils/simulatorEngine';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { MatchPredictor } from './components/MatchPredictor';
import { Trophy, Percent, Home as HomeIcon, Menu, X } from 'lucide-react';


export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'predictor'>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Model weights state calibrated to represent 85% of rating weights (60% FIFA Rank, 25% Squad value)
  // Luck / variance reduced to 15%. GDP/Population demographic weights set to 0.00 to prevent distortion.
  const [weights] = useState<ModelWeights>({
    fifaRank: 0.60,
    squadValue: 0.25,
    gdp: 0.00,
    population: 0.00,
    climate: 0.05,
    host: 0.10,
    luck: 0.15
  });

  // Simulation results
  const [predictions, setPredictions] = useState<Record<string, SimulationStats>>({});
  const [groupStandings, setGroupStandings] = useState<Record<string, GroupStanding[]>>({});
  
  // Lifted selection state for interactive navigation from Home
  const [selectedTeams, setSelectedTeams] = useState<{ t1: string; t2: string }>({ t1: 'ECU', t2: 'GER' });

  const handleNavigate = (tab: 'home' | 'dashboard' | 'predictor', matchTeams?: { team1Id: string; team2Id: string }) => {
    if (matchTeams) {
      setSelectedTeams({ t1: matchTeams.team1Id, t2: matchTeams.team2Id });
    }
    setActiveTab(tab);
  };

  // Compute standings and initial predictions on load or weight change
  const computeInitialResults = () => {
    const groups: Record<string, Team[]> = {};
    teamsData.forEach(t => {
      if (!groups[t.group]) groups[t.group] = [];
      groups[t.group].push(t);
    });

    const standings: Record<string, GroupStanding[]> = {};
    Object.keys(groups).forEach(g => {
      standings[g] = simulateGroup(groups[g], weights, 0);
    });
    setGroupStandings(standings);

    if (Object.keys(predictions).length === 0) {
      const initialPreds = runMonteCarloSimulation(weights, 500, 0);
      setPredictions(initialPreds);
    }
  };

  useEffect(() => {
    computeInitialResults();
  }, [weights]);

  return (
    <div className={`app-container ${activeTab === 'home' ? 'home-active-bg' : ''}`}>
      {/* Premium Header */}
      <header className="header">
        <div className="logo-container" onClick={() => handleNavigate('home')}>
          <div className="logo-badge-neon">
            <span className="logo-emoji-trophy">🏆</span>
            <div className="logo-pulse-dot"></div>
          </div>
          <div>
            <h1 className="logo-text">Mundial 2026</h1>
            <span className="logo-subtext">Predicción Analítica</span>
          </div>
        </div>

        {/* Hamburger Menu Toggle Button */}
        <button className="menu-toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Tabs */}
        <nav className={`nav-tabs ${menuOpen ? 'mobile-open' : ''}`}>
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { handleNavigate('home'); setMenuOpen(false); }}
          >
            <HomeIcon size={16} />
            <span>Inicio</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'predictor' ? 'active' : ''}`}
            onClick={() => { handleNavigate('predictor'); setMenuOpen(false); }}
          >
            <Percent size={16} />
            <span>Herramienta de predicción</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { handleNavigate('dashboard'); setMenuOpen(false); }}
          >
            <Trophy size={16} />
            <span>Dashboard</span>
          </button>
        </nav>
      </header>

      {/* Main body area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {activeTab === 'predictor' && (
          <MatchPredictor
            weights={weights}
            initialTeam1Id={selectedTeams.t1}
            initialTeam2Id={selectedTeams.t2}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            teams={teamsData} 
            predictions={predictions} 
            groupStandings={groupStandings} 
          />
        )}
      </main>

      <footer className="footer">
        <p>© 2026 FIFA World Cup Predictor. Desarrollado por <strong>Yair PR</strong> con datos estadísticos y alineaciones en vivo de Opta Sports.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
          Diseño Premium & Inteligencia de Datos • Alojado de forma estática en GitHub Pages
        </p>
      </footer>
    </div>
  );
}
