import { useState, useEffect } from 'react';
import type { Team } from './data/teamsData';
import { teamsData } from './data/teamsData';
import type { ModelWeights, SimulationStats, GroupStanding } from './utils/simulatorEngine';
import { runMonteCarloSimulation, simulateGroup } from './utils/simulatorEngine';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { KlementSimulator } from './components/KlementSimulator';
import { BracketSimulator } from './components/BracketSimulator';
import { PlayerProfile } from './components/PlayerProfile';
import { MatchPredictor } from './components/MatchPredictor';
import { BettingSlip } from './components/BettingSlip';
import type { BetSelection } from './components/BettingSlip';
import { Trophy, Sliders, GitPullRequest, Award, Percent, Home as HomeIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'simulator' | 'bracket' | 'messi' | 'predictor'>('home');
  
  // Model weights state (defaults close to Joachim Klement's findings, with a 25% luck factor)
  const [weights, setWeights] = useState<ModelWeights>({
    fifaRank: 0.45,
    gdp: 0.15,
    population: 0.10,
    climate: 0.08,
    host: 0.12,
    squadValue: 0.10,
    luck: 0.25
  });

  const [messiImpact, setMessiImpact] = useState<number>(0.5);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  
  // Simulation results
  const [predictions, setPredictions] = useState<Record<string, SimulationStats>>({});
  const [groupStandings, setGroupStandings] = useState<Record<string, GroupStanding[]>>({});

  // Betting Slip State
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState<boolean>(false);

  const handleAddSelection = (sel: BetSelection) => {
    // Prevent duplicate selections of the same market type in the same match
    setSelections(prev => {
      const filtered = prev.filter(x => !(x.matchName === sel.matchName && x.marketType === sel.marketType));
      return [...filtered, sel];
    });
  };

  const handleRemoveSelection = (id: string) => {
    setSelections(prev => prev.filter(x => x.id !== id));
  };

  const handleClearSelections = () => {
    setSelections([]);
    setIsSlipOpen(false);
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
      standings[g] = simulateGroup(groups[g], weights, messiImpact);
    });
    setGroupStandings(standings);

    if (Object.keys(predictions).length === 0) {
      const initialPreds = runMonteCarloSimulation(weights, 500, messiImpact);
      setPredictions(initialPreds);
    }
  };

  const handleRunFullSimulation = async (iterations: number) => {
    setIsSimulating(true);
    setSimulationProgress(0);

    setTimeout(() => {
      try {
        const results = runMonteCarloSimulation(weights, iterations, messiImpact, (progress) => {
          setSimulationProgress(progress);
        });
        
        setPredictions(results);
        
        const groups: Record<string, Team[]> = {};
        teamsData.forEach(t => {
          if (!groups[t.group]) groups[t.group] = [];
          groups[t.group].push(t);
        });
        
        const standings: Record<string, GroupStanding[]> = {};
        Object.keys(groups).forEach(g => {
          standings[g] = simulateGroup(groups[g], weights, messiImpact);
        });
        setGroupStandings(standings);

      } catch (err) {
        console.error('Error running Monte Carlo simulation:', err);
      } finally {
        setTimeout(() => {
          setIsSimulating(false);
        }, 300);
      }
    }, 100);
  };

  useEffect(() => {
    computeInitialResults();
  }, [weights, messiImpact]);

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div className="logo-container">
          <span style={{ fontSize: '2rem' }}>🏆</span>
          <div>
            <h1 className="logo-text">Mundial 2026</h1>
            <span className="logo-subtext">Predictor & Apuestas</span>
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
            <span>Predictor 1v1</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Trophy size={16} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Sliders size={16} />
            <span>Simulador Econométrico</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'bracket' ? 'active' : ''}`}
            onClick={() => setActiveTab('bracket')}
          >
            <GitPullRequest size={16} />
            <span>Llaves (Bracket)</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'messi' ? 'active' : ''}`}
            onClick={() => setActiveTab('messi')}
          >
            <Award size={16} />
            <span>Perfil Messi (xG)</span>
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
            messiImpact={messiImpact}
            selections={selections}
            onAddSelection={handleAddSelection}
            onRemoveSelection={handleRemoveSelection}
            onToggleSlip={() => setIsSlipOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            teams={teamsData} 
            predictions={predictions} 
            groupStandings={groupStandings} 
          />
        )}
        
        {activeTab === 'simulator' && (
          <KlementSimulator
            weights={weights}
            onWeightsChange={setWeights}
            onRunSimulation={handleRunFullSimulation}
            predictions={predictions}
            isSimulating={isSimulating}
            simulationProgress={simulationProgress}
          />
        )}

        {activeTab === 'bracket' && (
          <BracketSimulator 
            weights={weights} 
            messiImpact={messiImpact} 
          />
        )}

        {activeTab === 'messi' && (
          <PlayerProfile 
            messiImpact={messiImpact} 
            onMessiImpactChange={setMessiImpact} 
          />
        )}
      </main>

      {/* Floating Betting Slip */}
      <BettingSlip
        selections={selections}
        onRemoveSelection={handleRemoveSelection}
        onClearSelections={handleClearSelections}
        isSlipOpen={isSlipOpen}
        onToggleSlip={() => setIsSlipOpen(!isSlipOpen)}
      />

      <footer className="footer">
        <p>© 2026 FIFA World Cup Predictor. Desarrollado con datos estadísticos de Opta y econométricos de Joachim Klement.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
          Diseño Premium • Alojado de forma estática en GitHub Pages
        </p>
      </footer>
    </div>
  );
}
