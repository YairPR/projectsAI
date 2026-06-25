import { useState, useEffect } from 'react';
import type { Team } from './data/teamsData';
import { teamsData } from './data/teamsData';
import type { ModelWeights, SimulationStats, GroupStanding } from './utils/simulatorEngine';
import { runMonteCarloSimulation, simulateGroup } from './utils/simulatorEngine';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { MatchPredictor } from './components/MatchPredictor';
import { Trophy, Percent, Home as HomeIcon } from 'lucide-react';


export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'predictor'>('home');
  
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
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div className="logo-container">
          <span style={{ fontSize: '2rem' }}>🏆</span>
          <div>
            <h1 className="logo-text">Mundial 2026</h1>
            <span className="logo-subtext">Predicción Analítica</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <HomeIcon size={16} />
            <span>Inicio</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictor')}
          >
            <Percent size={16} />
            <span>Herramienta de predicción</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Trophy size={16} />
            <span>Dashboard</span>
          </button>
        </nav>
      </header>

      {/* Main body area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <Home onNavigate={setActiveTab} />
        )}

        {activeTab === 'predictor' && (
          <MatchPredictor
            weights={weights}
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
        <p>© 2026 FIFA World Cup Predictor. Desarrollado con datos estadísticos y alineaciones en vivo de Opta Sports.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
          Diseño Premium • Alojado de forma estática en GitHub Pages
        </p>
      </footer>
    </div>
  );
}
