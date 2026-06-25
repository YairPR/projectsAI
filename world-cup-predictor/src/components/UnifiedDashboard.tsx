import React, { useState, useEffect } from 'react';
import type { Team, Player } from '../data/teamsData';
import { teamsData } from '../data/teamsData';
import type { ModelWeights, MatchBettingMarkets, LineupData } from '../utils/simulatorEngine';
import { calculateMatchBettingMarkets } from '../utils/simulatorEngine';
import { mockLineups } from '../data/lineupsMock';
import { 
  Sliders, Trophy, Award, Search, Activity, Zap, AlertCircle, RefreshCw
} from 'lucide-react';

interface UnifiedDashboardProps {
  weights: ModelWeights;
  messiImpact: number;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  weights,
  messiImpact
}) => {
  // Select default matchup: Argentina vs Brazil
  const [teamAId, setTeamAId] = useState<string>('ARG');
  const [teamBId, setTeamBId] = useState<string>('BRA');

  // Interactive slider modifiers (0.5 to 1.5 multiplier relative to base weights)
  const [sliderForm, setSliderForm] = useState<number>(68);
  const [sliderSquad, setSliderSquad] = useState<number>(82);
  const [sliderHistory, setSliderHistory] = useState<number>(70);
  const [sliderVenue, setSliderVenue] = useState<number>(55);
  const [sliderWeather, setSliderWeather] = useState<number>(60);

  // Active Live Lineups States
  const [useOfficialLineups, setUseOfficialLineups] = useState<boolean>(true);
  const [lineupA, setLineupA] = useState<LineupData | undefined>(undefined);
  const [lineupB, setLineupB] = useState<LineupData | undefined>(undefined);

  // Calculated markets state
  const [markets, setMarkets] = useState<MatchBettingMarkets | null>(null);

  // Search filter for teams
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected player for Player Analysis
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState<Team | null>(null);

  // Today's matches list
  const featuredMatches = [
    { id: 1, hId: 'ARG', hName: 'Argentina', aId: 'BRA', aName: 'Brasil', desc: 'Súperclásico de las Américas' },
    { id: 2, hId: 'ECU', hName: 'Ecuador', aId: 'GER', aName: 'Alemania', desc: 'Grupo E · Hoy 18:00' },
    { id: 3, hId: 'CUR', hName: 'Curazao', aId: 'CIV', aName: 'Costa de Marfil', desc: 'Grupo E · Hoy 21:00' },
    { id: 4, hId: 'SUI', hName: 'Suiza', aId: 'CAN', aName: 'Canadá', desc: 'Grupo B · Hoy 21:00' }
  ];

  // List of picks
  const myPicks = [
    { rank: 1, team: 'Argentina', flag: '🇦🇷', prob: '18.4%' },
    { rank: 2, team: 'Brasil', flag: '🇧🇷', prob: '14.2%' },
    { rank: 3, team: 'Alemania', flag: '🇩🇪', prob: '11.8%' }
  ];

  // Latest predictions feed
  const [latestPredictions, setLatestPredictions] = useState<Array<{
    match: string;
    result: string;
    stage: string;
    color: string;
  }>>([
    { match: 'ARG vs BRA', result: 'Final 2 - 1', stage: 'Final', color: '#00f2fe' },
    { match: 'FRA vs NED', result: '3 - 2 (TE)', stage: 'Cuartos', color: '#a855f7' },
    { match: 'GER vs ITA', result: '4 - 1', stage: 'Cuartos', color: '#fbbf24' },
    { match: 'ECU vs CIV', result: '2 - 2 (Pen)', stage: 'Octavos', color: '#10b981' }
  ]);

  const teamA = teamsData.find(t => t.id === teamAId)!;
  const teamB = teamsData.find(t => t.id === teamBId)!;

  // Initialize Lineups
  useEffect(() => {
    if (useOfficialLineups) {
      // Load mock lineups if exists, otherwise generate basic lineups
      setLineupA(mockLineups[teamAId] || createDefaultLineup(teamA));
      setLineupB(mockLineups[teamBId] || createDefaultLineup(teamB));
    } else {
      setLineupA(undefined);
      setLineupB(undefined);
    }
  }, [teamAId, teamBId, useOfficialLineups]);

  // Set default player to Messi or first player of team A on load
  useEffect(() => {
    const messi = teamA.players.find(p => p.name.includes('Messi'));
    if (messi) {
      setSelectedPlayer(messi);
      setSelectedPlayerTeam(teamA);
    } else if (teamA.players.length > 0) {
      setSelectedPlayer(teamA.players[0]);
      setSelectedPlayerTeam(teamA);
    }
  }, [teamAId]);

  // Update latest predictions feed in real-time
  useEffect(() => {
    if (markets) {
      const scoreResult = `${markets.scoreA} – ${markets.scoreB}`;
      setLatestPredictions(prev => {
        const filtered = prev.filter(x => x.match !== `${teamA.id} vs ${teamB.id}`);
        return [
          { match: `${teamA.id} vs ${teamB.id}`, result: scoreResult, stage: 'Proyección', color: '#00f2fe' },
          ...filtered.slice(0, 3)
        ];
      });
    }
  }, [teamAId, teamBId, markets?.scoreA, markets?.scoreB]);

  // Recalculate markets when inputs change
  useEffect(() => {
    // Build custom weights based on sliders
    const customWeights: ModelWeights = {
      fifaRank: weights.fifaRank * (sliderHistory / 70),
      gdp: weights.gdp,
      population: weights.population,
      climate: weights.climate * (sliderWeather / 60),
      host: weights.host * (sliderVenue / 55),
      squadValue: weights.squadValue * (sliderSquad / 82),
      luck: weights.luck * (1 - sliderForm / 100)
    };

    const res = calculateMatchBettingMarkets(
      teamA,
      teamB,
      customWeights,
      messiImpact,
      lineupA,
      lineupB
    );
    setMarkets(res);
  }, [teamAId, teamBId, sliderForm, sliderSquad, sliderHistory, sliderVenue, sliderWeather, lineupA, lineupB, weights]);

  // Helper to create basic lineups if mock is not available
  function createDefaultLineup(team: Team): LineupData {
    return {
      formation: '4-3-3',
      startingXI: team.players.map(p => p.name),
      substitutes: []
    };
  }

  // Toggle a player starter status (Last minute lineup change!)
  const handleTogglePlayer = (player: Player, isTeamA: boolean) => {
    const activeLineup = isTeamA ? lineupA : lineupB;
    const setActive = isTeamA ? setLineupA : setLineupB;

    if (!activeLineup) return;

    const inStarting = activeLineup.startingXI.includes(player.name);
    let newStarting = [...activeLineup.startingXI];
    let newSubs = [...activeLineup.substitutes];

    if (inStarting) {
      // Remove from starters, put in subs
      newStarting = newStarting.filter(n => n !== player.name);
      if (!newSubs.includes(player.name)) newSubs.push(player.name);
    } else {
      // Remove from subs, put in starters
      newSubs = newSubs.filter(n => n !== player.name);
      if (!newStarting.includes(player.name)) newStarting.push(player.name);
    }

    setActive({
      ...activeLineup,
      startingXI: newStarting,
      substitutes: newSubs
    });
  };

  // Hexagon Radar coordinates generator
  const getRadarPoints = (player: Player) => {
    // Generate values (attacking, passing, dribbling, defending, physical, shooting)
    // Map player position to mock radar statistics
    let stats = [80, 80, 80, 50, 70, 80]; // default
    if (player.name.includes('Messi')) {
      stats = [98, 96, 97, 42, 64, 93]; // exact mockup stats
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

  // Filtered teams list for searching
  const filteredTeams = teamsData.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="unified-dashboard-container">
      
      {/* 🚀 Glassmorphic Unified Grid Dashboard */}
      <div className="ud-grid">
        
        {/* ================================================== */}
        {/* COLUMN 1: PREDICTOR SIDEBAR */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-5">
          <div className="panel-header-row">
            <Sliders size={18} className="text-cyan" />
            <h3 className="panel-title-text">Predictor Sidebar</h3>
            <Zap size={14} className="text-muted blink" style={{ marginLeft: 'auto' }} />
          </div>

          {/* Win Probability Circular Card */}
          <div className="win-prob-card">
            <div className="wpc-header">
              <span className="wpc-team">{teamA.name.toUpperCase()} WIN</span>
              <span className="wpc-prob text-cyan">{markets ? `${markets.probA}%` : '50%'}</span>
            </div>
            
            {/* Glowing progress line */}
            <div className="glowing-progress-track">
              <div 
                className="glowing-progress-bar bg-cyan" 
                style={{ width: markets ? `${markets.probA}%` : '50%' }}
              >
                <div className="glowing-progress-head"></div>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Sliders */}
          <div className="sliders-section flex-col gap-4">
            
            {/* Slider: Form */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span>form</span>
                <span className="text-cyan">{sliderForm}%</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={sliderForm} 
                onChange={(e) => setSliderForm(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            {/* Slider: Squad Strength */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span>squad strength</span>
                <span className="text-cyan">{sliderSquad}%</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="100" 
                value={sliderSquad} 
                onChange={(e) => setSliderSquad(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            {/* Slider: History */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span>history</span>
                <span className="text-cyan">{sliderHistory}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="100" 
                value={sliderHistory} 
                onChange={(e) => setSliderHistory(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            {/* Slider: Venue */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span>venue</span>
                <span className="text-cyan">{sliderVenue}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderVenue} 
                onChange={(e) => setSliderVenue(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            {/* Slider: Weather */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span>weather</span>
                <span className="text-cyan">{sliderWeather}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderWeather} 
                onChange={(e) => setSliderWeather(Number(e.target.value))}
                className="custom-range"
              />
            </div>
          </div>

          {/* Quick Team Search and Match Selection */}
          <div className="team-picker-section">
            <div className="ud-section-title">Enfrentamiento Rápido</div>
            <div className="team-search-box">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar selección..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clean-search-input"
              />
            </div>

            {searchQuery && (
              <div className="quick-search-results">
                {filteredTeams.slice(0, 5).map(t => (
                  <div key={t.id} className="search-result-row">
                    <span>{t.flag} {t.name}</span>
                    <div className="flex gap-2">
                      <button className="small-action-btn local" onClick={() => { setTeamAId(t.id); setSearchQuery(''); }}>Local</button>
                      <button className="small-action-btn visit" onClick={() => { setTeamBId(t.id); setSearchQuery(''); }}>Visita</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="matchup-versus-display">
              <div className="team-badge-circle" onClick={() => { setSelectedPlayerTeam(teamA); setSelectedPlayer(teamA.players[0]); }}>
                <span className="big-flag">{teamA.flag}</span>
                <span className="circle-team-name">{teamA.name}</span>
              </div>
              <div className="vs-badge">VS</div>
              <div className="team-badge-circle" onClick={() => { setSelectedPlayerTeam(teamB); setSelectedPlayer(teamB.players[0]); }}>
                <span className="big-flag">{teamB.flag}</span>
                <span className="circle-team-name">{teamB.name}</span>
              </div>
            </div>
          </div>

          {/* Today's Featured Matches Quick Select */}
          <div className="flex-col gap-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '1.25rem' }}>
            <div className="ud-section-title">Partidos de Hoy</div>
            <div className="flex-col gap-2" style={{ marginTop: '0.25rem' }}>
              {featuredMatches.map(m => {
                const active = (teamAId === m.hId && teamBId === m.aId) || (teamAId === m.aId && teamBId === m.hId);
                return (
                  <div
                    key={m.id}
                    onClick={() => { setTeamAId(m.hId); setTeamBId(m.aId); }}
                    className={`pick-row ${active ? 'active-node' : ''}`}
                    style={{
                      cursor: 'pointer',
                      border: active ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.03)',
                      background: active ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255,255,255,0.01)',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'white' }}>{m.hName} vs {m.aName}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Predecir →</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Picks Card list */}
          <div className="my-picks-section flex-col gap-3">
            <div className="ud-section-title">My Picks</div>
            <div className="picks-list flex-col gap-2">
              {myPicks.map(p => (
                <div key={p.rank} className="pick-row">
                  <span className="pick-rank">{p.rank}.</span>
                  <span className="pick-flag">{p.flag}</span>
                  <span className="pick-name">{p.team}</span>
                  <span className="pick-val text-cyan" style={{ marginLeft: 'auto' }}>{p.prob}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* COLUMN 2: TOURNAMENT BRACKET TREE */}
        {/* ================================================== */}
        <div className="ud-col glass-panel flex-col gap-5 justify-center relative">
          <div className="panel-header-row" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <Trophy size={18} className="text-gold" />
            <h3 className="panel-title-text">Tournament Bracket Tree</h3>
            <span className="source-label text-muted" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>Opta Data</span>
          </div>

          {/* Interactive Knockout Bracket Branch Visualizer */}
          <div className="bracket-tree-container">
            
            {/* Semifinal Left Column */}
            <div className="bracket-column">
              <div className={`bracket-node ${teamAId === 'ARG' ? 'active-node' : ''}`} onClick={() => setTeamAId('ARG')}>
                <span className="node-flag">🇦🇷</span>
                <span className="node-team">Argentina</span>
              </div>
              
              <div className="bracket-connector-flow">
                <div className="connector-horizontal"></div>
                <div className="connector-vertical-half top"></div>
              </div>

              <div className="bracket-node-placeholder">[Semi 1]</div>

              <div className="bracket-connector-flow">
                <div className="connector-vertical-half bottom"></div>
                <div className="connector-horizontal"></div>
              </div>

              <div className={`bracket-node ${teamAId === 'NED' ? 'active-node' : ''}`} onClick={() => setTeamAId('NED')}>
                <span className="node-flag">🇳🇱</span>
                <span className="node-team">Países Bajos</span>
              </div>
            </div>

            {/* Final Center Column */}
            <div className="bracket-column center-final justify-center">
              <div className="connector-hub">
                <div className="connector-hub-line"></div>
                <div className="glowing-node-circle cyan"></div>
              </div>

              <div className="final-glass-card">
                <div className="final-title-badge">FINAL</div>
                <div className="final-matchup-row">
                  <div className="final-team">
                    <span style={{ fontSize: '1.25rem' }}>{teamA.flag}</span>
                    <span>{teamA.id}</span>
                  </div>
                  <span className="final-vs">vs.</span>
                  <div className="final-team">
                    <span>{teamB.id}</span>
                    <span style={{ fontSize: '1.25rem' }}>{teamB.flag}</span>
                  </div>
                </div>
                <div className="final-winner-prediction text-cyan">
                  {markets && markets.probA > markets.probB ? teamA.name : teamB.name}
                </div>
              </div>

              <div className="connector-hub">
                <div className="glowing-node-circle purple"></div>
                <div className="connector-hub-line"></div>
              </div>
            </div>

            {/* Semifinal Right Column */}
            <div className="bracket-column">
              <div className={`bracket-node ${teamBId === 'BRA' ? 'active-node' : ''}`} onClick={() => setTeamBId('BRA')}>
                <span className="node-flag">🇧🇷</span>
                <span className="node-team">Brasil</span>
              </div>

              <div className="bracket-connector-flow-right">
                <div className="connector-horizontal"></div>
                <div className="connector-vertical-half top"></div>
              </div>

              <div className="bracket-node-placeholder">[Semi 2]</div>

              <div className="bracket-connector-flow-right">
                <div className="connector-vertical-half bottom"></div>
                <div className="connector-horizontal"></div>
              </div>

              <div className={`bracket-node ${teamBId === 'POR' ? 'active-node' : ''}`} onClick={() => setTeamBId('POR')}>
                <span className="node-flag">🇵🇹</span>
                <span className="node-team">Portugal</span>
              </div>
            </div>

          </div>

          {/* Interactive Lineup Star Player Live Editor */}
          <div className="active-lineup-editor glass-subcard">
            <div className="editor-header">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="text-cyan animate-spin-slow" />
                <span className="editor-title">Alineaciones de Último Minuto</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Usar En Vivo</span>
                <input 
                  type="checkbox" 
                  checked={useOfficialLineups} 
                  onChange={(e) => setUseOfficialLineups(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {useOfficialLineups ? (
              <div className="lineup-editor-split">
                
                {/* Team A Lineup Starter Toggle */}
                <div className="lineup-col">
                  <div className="lineup-team-title">
                    <span>{teamA.flag} {teamA.name}</span>
                    <span className="formation-badge">{lineupA?.formation || '4-3-3'}</span>
                  </div>
                  <div className="players-starters-list">
                    {teamA.players.map(p => {
                      const starting = lineupA?.startingXI.includes(p.name);
                      return (
                        <div 
                          key={p.name} 
                          className={`player-toggle-row ${starting ? 'starter' : 'benched'}`}
                          onClick={() => handleTogglePlayer(p, true)}
                        >
                          <span className="p-pos">{p.position}</span>
                          <span className="p-name">{p.name}</span>
                          <span className="p-status-indicator">{starting ? 'Titular' : 'Banca'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team B Lineup Starter Toggle */}
                <div className="lineup-col">
                  <div className="lineup-team-title">
                    <span>{teamB.flag} {teamB.name}</span>
                    <span className="formation-badge">{lineupB?.formation || '4-3-3'}</span>
                  </div>
                  <div className="players-starters-list">
                    {teamB.players.map(p => {
                      const starting = lineupB?.startingXI.includes(p.name);
                      return (
                        <div 
                          key={p.name} 
                          className={`player-toggle-row ${starting ? 'starter' : 'benched'}`}
                          onClick={() => handleTogglePlayer(p, false)}
                        >
                          <span className="p-pos">{p.position}</span>
                          <span className="p-name">{p.name}</span>
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
                <span>Modo estático activo. Activa "Usar En Vivo" para gestionar alineaciones y formaciones en tiempo real.</span>
              </div>
            )}
          </div>
        </div>

        {/* ================================================== */}
        {/* COLUMN 3: PLAYER ANALYSIS & LATEST PREDICTIONS */}
        {/* ================================================== */}
        <div className="ud-col flex-col gap-5">
          
          {/* PLAYER ANALYSIS CARD WITH GLOWING GREEN RADAR */}
          <div className="glass-panel flex-col gap-4 relative" style={{ flex: '1 1 auto' }}>
            <div className="panel-header-row">
              <Award size={18} className="text-gold" />
              <h3 className="panel-title-text">Player Analysis</h3>
              <span className="team-selector-dropdown text-gold" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                {selectedPlayerTeam?.name || 'Selección'}
              </span>
            </div>

            {selectedPlayer && selectedPlayerTeam ? (
              <div className="player-analysis-widget">
                
                {/* Player Profile Info */}
                <div className="player-profile-top">
                  <span className="player-avatar-large">👤</span>
                  <div>
                    <h4 className="pa-name">{selectedPlayer.name}</h4>
                    <div className="pa-meta-text">
                      <span>{selectedPlayerTeam.flag} {selectedPlayerTeam.name}</span>
                      <span> · </span>
                      <span>{selectedPlayer.position}</span>
                      <span> · </span>
                      <span>{selectedPlayer.age} años</span>
                    </div>
                  </div>
                </div>

                {/* Glowing Green Radar Hexagon Chart */}
                <div className="radar-chart-container">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="radar-svg">
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

                    {/* Outer Label helper lines */}
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

                    {/* Glowing Green Player Skill Polygon */}
                    <polygon 
                      points={getRadarPoints(selectedPlayer)} 
                      fill="rgba(16, 185, 129, 0.15)" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      className="radar-poly-glow"
                    />

                    {/* Data Points Dots */}
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
                    
                    {/* SVG Labels */}
                    <text x="100" y="22" className="radar-label" textAnchor="middle">Attacking</text>
                    <text x="168" y="78" className="radar-label" textAnchor="start">Passing</text>
                    <text x="168" y="132" className="radar-label" textAnchor="start">Dribbling</text>
                    <text x="100" y="184" className="radar-label" textAnchor="middle">Defending</text>
                    <text x="32" y="132" className="radar-label" textAnchor="end">Physical</text>
                    <text x="32" y="78" className="radar-label" textAnchor="end">Shooting</text>
                  </svg>
                </div>

                {/* Grid of stats values in radar */}
                <div className="radar-values-grid">
                  <div className="radar-val-box">
                    <span className="rv-label">Attacking</span>
                    <span className="rv-value text-green">{getStatValue(selectedPlayer, 0)}</span>
                  </div>
                  <div className="radar-val-box">
                    <span className="rv-label">Passing</span>
                    <span className="rv-value text-green">{getStatValue(selectedPlayer, 1)}</span>
                  </div>
                  <div className="radar-val-box">
                    <span className="rv-label">Dribbling</span>
                    <span className="rv-value text-green">{getStatValue(selectedPlayer, 2)}</span>
                  </div>
                  <div className="radar-val-box">
                    <span className="rv-label">Defending</span>
                    <span className="rv-value text-green">{getStatValue(selectedPlayer, 3)}</span>
                  </div>
                  <div className="radar-val-box">
                    <span className="rv-label">Physical</span>
                    <span className="rv-value text-green">{getStatValue(selectedPlayer, 4)}</span>
                  </div>
                  <div className="radar-val-box">
                    <span className="rv-label">Shooting</span>
                    <span className="rv-value text-green">{getStatValue(selectedPlayer, 5)}</span>
                  </div>
                </div>

                {/* Bottom Accumulates Stats Row */}
                <div className="accumulated-stats-row">
                  <div className="ast-box">
                    <span className="ast-title">Gls</span>
                    <span className="ast-number">{selectedPlayer.name.includes('Messi') ? 5 : selectedPlayer.goals}</span>
                  </div>
                  <div className="ast-box">
                    <span className="ast-title">Asts</span>
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
              <div className="flex-center" style={{ height: '200px', color: 'var(--text-muted)' }}>
                Selecciona un jugador para ver su análisis táctico
              </div>
            )}
          </div>

          {/* LATEST PREDICTIONS PANEL */}
          <div className="glass-panel flex-col gap-3" style={{ flex: '0 0 auto', maxHeight: '250px' }}>
            <div className="panel-header-row">
              <Activity size={18} className="text-cyan" />
              <h3 className="panel-title-text">Latest Predictions</h3>
            </div>

            <div className="latest-preds-list flex-col gap-2">
              {latestPredictions.map((pred, i) => (
                <div key={i} className="pred-feed-row">
                  <div className="feed-status-dot" style={{ background: pred.color, boxShadow: `0 0 8px ${pred.color}` }}></div>
                  <span className="feed-match">{pred.match}</span>
                  <span className="feed-stage">{pred.stage}</span>
                  <span className="feed-result" style={{ marginLeft: 'auto', fontWeight: 600 }}>{pred.result}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
