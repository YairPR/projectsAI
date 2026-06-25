import React, { useState, useEffect } from 'react';
import type { Team } from '../data/teamsData';
import { teamsData } from '../data/teamsData';
import type { ModelWeights, GroupStanding } from '../utils/simulatorEngine';
import { simulateMatch, calculateTeamRating, simulateGroup } from '../utils/simulatorEngine';
import { GitPullRequest, HelpCircle, Award } from 'lucide-react';

interface BracketSimulatorProps {
  weights: ModelWeights;
  messiImpact: number;
}

interface KnockoutMatch {
  id: string;
  stage: 'R32' | 'R16' | 'QF' | 'SF' | 'F';
  teamA?: Team;
  teamB?: Team;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
  wasPenalties?: boolean;
}

export const BracketSimulator: React.FC<BracketSimulatorProps> = ({ weights, messiImpact }) => {
  const [isGroupStageSimulated, setIsGroupStageSimulated] = useState(false);
  const [knockoutMatches, setKnockoutMatches] = useState<Record<string, KnockoutMatch>>({});

  // Initialize/Reset the entire tournament
  const initTournament = () => {
    setIsGroupStageSimulated(false);
    setKnockoutMatches({});
  };

  useEffect(() => {
    initTournament();
  }, [weights, messiImpact]);

  // Simulate group stage matches and calculate who advances
  const handleSimulateGroups = () => {
    const groups: Record<string, Team[]> = {};
    teamsData.forEach(t => {
      if (!groups[t.group]) groups[t.group] = [];
      groups[t.group].push(t);
    });

    const standings: Record<string, GroupStanding[]> = {};
    const thirds: GroupStanding[] = [];

    // Simulate each group
    Object.keys(groups).forEach(g => {
      const groupStandings = simulateGroup(groups[g], weights, messiImpact);
      standings[g] = groupStandings;
      thirds.push(groupStandings[2]); // 3rd placed team
    });

    // Sort thirds
    const sortedThirds = thirds.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return calculateTeamRating(b.team, weights, messiImpact) - calculateTeamRating(a.team, weights, messiImpact);
    });

    setIsGroupStageSimulated(true);

    // Setup Round of 32 matches
    const winners = Object.keys(standings).map(g => standings[g][0].team);
    const runners = Object.keys(standings).map(g => standings[g][1].team);
    const top8Thirds = sortedThirds.slice(0, 8).map(g => g.team);

    // Create Round of 32 Matches (16 matches)
    const matches: Record<string, KnockoutMatch> = {};
    
    // Structure pairings for a clean bracket path
    for (let i = 0; i < 8; i++) {
      matches[`R32-M${i+1}`] = {
        id: `R32-M${i+1}`,
        stage: 'R32',
        teamA: winners[i],
        teamB: top8Thirds[i]
      };
    }
    matches[`R32-M9`] = { id: `R32-M9`, stage: 'R32', teamA: winners[8], teamB: runners[0] };
    matches[`R32-M10`] = { id: `R32-M10`, stage: 'R32', teamA: winners[9], teamB: runners[1] };
    matches[`R32-M11`] = { id: `R32-M11`, stage: 'R32', teamA: winners[10], teamB: runners[2] };
    matches[`R32-M12`] = { id: `R32-M12`, stage: 'R32', teamA: winners[11], teamB: runners[3] };
    
    matches[`R32-M13`] = { id: `R32-M13`, stage: 'R32', teamA: runners[4], teamB: runners[5] };
    matches[`R32-M14`] = { id: `R32-M14`, stage: 'R32', teamA: runners[6], teamB: runners[7] };
    matches[`R32-M15`] = { id: `R32-M15`, stage: 'R32', teamA: runners[8], teamB: runners[9] };
    matches[`R32-M16`] = { id: `R32-M16`, stage: 'R32', teamA: runners[10], teamB: runners[11] };

    setKnockoutMatches(matches);
  };

  // Run a single match simulation
  const runSingleMatchSim = (matchId: string) => {
    const match = knockoutMatches[matchId];
    if (!match || !match.teamA || !match.teamB) return;

    const result = simulateMatch(match.teamA, match.teamB, weights, true, messiImpact);
    
    const updatedMatches = { ...knockoutMatches };
    updatedMatches[matchId] = {
      ...match,
      scoreA: result.homeGoals,
      scoreB: result.awayGoals,
      winnerId: result.winnerId,
      wasPenalties: result.wasPenaltyShootout
    };

    setKnockoutMatches(updatedMatches);
    propagateWinner(matchId, result.winnerId!, updatedMatches);
  };

  // Select match winner manually
  const selectManualWinner = (matchId: string, winnerId: string) => {
    const match = knockoutMatches[matchId];
    if (!match || !match.teamA || !match.teamB) return;

    const isTeamA = match.teamA.id === winnerId;
    const updatedMatches = { ...knockoutMatches };
    updatedMatches[matchId] = {
      ...match,
      scoreA: isTeamA ? 2 : 1,
      scoreB: isTeamA ? 1 : 2,
      winnerId: winnerId,
      wasPenalties: false
    };

    setKnockoutMatches(updatedMatches);
    propagateWinner(matchId, winnerId, updatedMatches);
  };

  // Propagate the winner to the next round match
  const propagateWinner = (matchId: string, winnerId: string, currentMatches: Record<string, KnockoutMatch>) => {
    const winner = teamsData.find(t => t.id === winnerId)!;
    
    // Parse stage and match number
    const parts = matchId.split('-');
    const stage = parts[0];
    const matchNum = parseInt(parts[1].substring(1));

    let nextMatchId = '';
    let isTeamA = false;

    if (stage === 'R32') {
      nextMatchId = `R16-M${Math.ceil(matchNum / 2)}`;
      isTeamA = matchNum % 2 !== 0;
    } else if (stage === 'R16') {
      nextMatchId = `QF-M${Math.ceil(matchNum / 2)}`;
      isTeamA = matchNum % 2 !== 0;
    } else if (stage === 'QF') {
      nextMatchId = `SF-M${Math.ceil(matchNum / 2)}`;
      isTeamA = matchNum % 2 !== 0;
    } else if (stage === 'SF') {
      nextMatchId = `F-M1`;
      isTeamA = matchNum % 2 !== 0;
    } else if (stage === 'F') {
      // Reached the end
      return;
    }

    const nextMatch = currentMatches[nextMatchId] || {
      id: nextMatchId,
      stage: nextMatchId.split('-')[0] as any
    };

    if (isTeamA) {
      nextMatch.teamA = winner;
      nextMatch.scoreA = undefined;
    } else {
      nextMatch.teamB = winner;
      nextMatch.scoreB = undefined;
    }

    // Reset winner of next match since teams changed
    nextMatch.winnerId = undefined;
    
    currentMatches[nextMatchId] = nextMatch;
    setKnockoutMatches({ ...currentMatches });
  };

  // Auto-simulate the entire bracket in sequence
  const handleAutoSimAllBracket = async () => {
    if (!isGroupStageSimulated) return;

    const currentMatches = { ...knockoutMatches };
    const stages: ('R32' | 'R16' | 'QF' | 'SF' | 'F')[] = ['R32', 'R16', 'QF', 'SF', 'F'];

    for (const stage of stages) {
      const stageMatches = Object.keys(currentMatches).filter(k => currentMatches[k].stage === stage);
      for (const mId of stageMatches) {
        const m = currentMatches[mId];
        if (m.teamA && m.teamB && !m.winnerId) {
          const res = simulateMatch(m.teamA, m.teamB, weights, true, messiImpact);
          currentMatches[mId] = {
            ...m,
            scoreA: res.homeGoals,
            scoreB: res.awayGoals,
            winnerId: res.winnerId,
            wasPenalties: res.wasPenaltyShootout
          };
          propagateWinner(mId, res.winnerId!, currentMatches);
        }
      }
    }
    setKnockoutMatches({ ...currentMatches });
  };

  // Get champion if exists
  const champion = knockoutMatches['F-M1']?.winnerId 
    ? teamsData.find(t => t.id === knockoutMatches['F-M1'].winnerId) 
    : undefined;

  // Render a match UI node
  const renderMatchCard = (matchId: string) => {
    const match = knockoutMatches[matchId];
    if (!match) return <div className="matchup-card" style={{ height: '70px', opacity: 0.2 }}></div>;

    const { teamA, teamB, scoreA, scoreB, winnerId, wasPenalties } = match;

    return (
      <div className={`matchup-card ${winnerId ? '' : 'active-match'}`} key={matchId}>
        <div style={{ fontSize: '0.65rem', background: '#0d1527', padding: '0.2rem 0.5rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Match {matchId.split('-')[1]}</span>
          {winnerId && (
            <button 
              onClick={() => runSingleMatchSim(matchId)}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.6rem', cursor: 'pointer' }}
            >
              Re-simular
            </button>
          )}
        </div>
        
        {/* Team A Row */}
        {teamA ? (
          <div 
            className={`matchup-team ${winnerId === teamA.id ? 'winner' : (winnerId ? 'loser' : '')}`}
            onClick={() => winnerId ? selectManualWinner(matchId, teamA.id) : runSingleMatchSim(matchId)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="team-flag">{teamA.flag}</span>
              <span style={{ fontSize: '0.8rem' }}>{teamA.name}</span>
            </div>
            {scoreA !== undefined && (
              <span className="matchup-score">
                {scoreA}
                {wasPenalties && winnerId === teamA.id && scoreA === scoreB && <span style={{ fontSize: '0.6rem', marginLeft: '0.2rem', color: 'var(--accent-gold)' }}>(P)</span>}
              </span>
            )}
          </div>
        ) : (
          <div className="matchup-team loser" style={{ cursor: 'default' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Por decidir</span>
          </div>
        )}

        {/* Team B Row */}
        {teamB ? (
          <div 
            className={`matchup-team ${winnerId === teamB.id ? 'winner' : (winnerId ? 'loser' : '')}`}
            onClick={() => winnerId ? selectManualWinner(matchId, teamB.id) : runSingleMatchSim(matchId)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="team-flag">{teamB.flag}</span>
              <span style={{ fontSize: '0.8rem' }}>{teamB.name}</span>
            </div>
            {scoreB !== undefined && (
              <span className="matchup-score">
                {scoreB}
                {wasPenalties && winnerId === teamB.id && scoreA === scoreB && <span style={{ fontSize: '0.6rem', marginLeft: '0.2rem', color: 'var(--accent-gold)' }}>(P)</span>}
              </span>
            )}
          </div>
        ) : (
          <div className="matchup-team loser" style={{ cursor: 'default' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Por decidir</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Intro Header */}
      <div className="glass-card flex-space" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitPullRequest size={22} className="text-cyan" />
            <span>Simulador de Llaves del Torneo</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Simula paso a paso la fase de grupos y todo el árbol de eliminatorias en tiempo real. 
            Haz clic en las selecciones para cambiar manualmente al ganador o pulsa los botones de simulación.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.7rem' }}>
          <button className="btn-secondary" onClick={initTournament}>
            Reiniciar
          </button>
          {!isGroupStageSimulated ? (
            <button className="btn-primary" onClick={handleSimulateGroups}>
              Simular Fase de Grupos
            </button>
          ) : (
            <button className="btn-primary" onClick={handleAutoSimAllBracket}>
              Auto-Simular Bracket
            </button>
          )}
        </div>
      </div>

      {/* Champion Overlay Card */}
      {champion && (
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(13, 21, 39, 0.95) 100%)',
          borderColor: 'var(--accent-gold)',
          textAlign: 'center',
          padding: '2.5rem',
          boxShadow: '0 0 30px var(--accent-gold-glow)',
          animation: 'pulse 2s infinite'
        }}>
          <Award size={48} className="text-gold" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
            ¡CAMPEÓN DEL MUNDO!
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>{champion.flag}</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{champion.name}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
            Ha superado todas las llaves de eliminación directa según el modelo simulado.
          </p>
        </div>
      )}

      {/* Bracket Tree View */}
      {isGroupStageSimulated ? (
        <div className="glass-card" style={{ overflowX: 'auto', padding: '1.5rem 1rem' }}>
          <div className="bracket-stages">
            
            {/* Round of 32 */}
            <div className="bracket-column">
              <div className="bracket-stage-header">Dieciseisavos (R32)</div>
              {Array.from({ length: 16 }).map((_, i) => renderMatchCard(`R32-M${i+1}`))}
            </div>

            {/* Round of 16 */}
            <div className="bracket-column">
              <div className="bracket-stage-header">Octavos de Final</div>
              {Array.from({ length: 8 }).map((_, i) => renderMatchCard(`R16-M${i+1}`))}
            </div>

            {/* Quarterfinals */}
            <div className="bracket-column">
              <div className="bracket-stage-header">Cuartos de Final</div>
              {Array.from({ length: 4 }).map((_, i) => renderMatchCard(`QF-M${i+1}`))}
            </div>

            {/* Semifinals */}
            <div className="bracket-column">
              <div className="bracket-stage-header">Semifinales</div>
              {Array.from({ length: 2 }).map((_, i) => renderMatchCard(`SF-M${i+1}`))}
            </div>

            {/* Final */}
            <div className="bracket-column" style={{ justifyContent: 'center' }}>
              <div className="bracket-stage-header">Gran Final</div>
              {renderMatchCard('F-M1')}
            </div>

          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <HelpCircle size={40} style={{ color: 'var(--text-muted)' }} />
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              Fase de grupos no simulada
            </h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '400px' }}>
              Pulsa el botón superior para simular la fase de grupos y rellenar automáticamente las plazas clasificatorias del cuadro de eliminación directa.
            </p>
          </div>
          <button className="btn-primary" onClick={handleSimulateGroups} style={{ maxWidth: '250px', marginTop: '0.5rem' }}>
            Simular Fase de Grupos
          </button>
        </div>
      )}

    </div>
  );
};
