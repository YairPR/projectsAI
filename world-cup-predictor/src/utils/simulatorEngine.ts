import type { Team, GroupLetter } from '../data/teamsData';
import { teamsData } from '../data/teamsData';

export interface ModelWeights {
  fifaRank: number;
  gdp: number;
  population: number;
  climate: number;
  host: number;
  squadValue: number;
  luck: number;
}

export interface MatchResult {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  winnerId?: string; // Empty for draw
  wasPenaltyShootout?: boolean;
  penaltyWinnerId?: string;
}

export interface GroupStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface SimulationStats {
  teamId: string;
  name: string;
  flag: string;
  winProb: number;
  finalProb: number;
  semiProb: number;
  quarterProb: number;
  r16Prob: number;
  r32Prob: number;
  groupExitProb: number;
}

export interface MarketOption {
  n: string; // Name (e.g., "Argentina gana")
  p: number; // Probability percentage (e.g., 65)
  note?: string; // Additional details
  best?: boolean; // Highlight as best value
  odds: string; // Decimal odds (e.g., "1.54")
  marketType: string; // e.g. "1X2", "OVER_UNDER", "BTTS", "PLAYER_GOAL"
  selectionId: string; // Unique selection key
}

export interface MatchBettingMarkets {
  teamA: Team;
  teamB: Team;
  xgA: number;
  xgB: number;
  scoreA: number;
  scoreB: number;
  probA: number;
  probDraw: number;
  probB: number;
  confidence: number;
  markets: Record<string, MarketOption[]>;
  xgTotal: number;
  avgCornersA: number;
  avgCornersB: number;
  goalKicksA: number;
  goalKicksB: number;
  freeKicksA: number;
  freeKicksB: number;
  offsidesA: number;
  offsidesB: number;
}

// Calculate static rating components once to save performance

const maxGdp = Math.max(...teamsData.map(t => Math.log(t.gdpPerCapita)));
const minGdp = Math.min(...teamsData.map(t => Math.log(t.gdpPerCapita)));

const maxPop = Math.max(...teamsData.map(t => Math.log(t.population)));
const minPop = Math.min(...teamsData.map(t => Math.log(t.population)));

const maxSquadVal = Math.max(...teamsData.map(t => Math.log(t.squadValue)));
const minSquadVal = Math.min(...teamsData.map(t => Math.log(t.squadValue)));

/**
 * Calculates a rating between 0 and 1 for a team based on weights
 */
export function calculateTeamRating(team: Team, weights: ModelWeights, messiImpact: number = 0): number {
  // 1. FIFA points ELO-logistic win expectancy relative to average international opponent (baseline 1500 ELO)
  const eloScore = 1 / (1 + Math.pow(10, (1500 - team.fifaPoints) / 400));

  // 2. GDP normalization
  const gdpScore = (Math.log(team.gdpPerCapita) - minGdp) / (maxGdp - minGdp || 1);

  // 3. Population normalization
  const popScore = (Math.log(team.population) - minPop) / (maxPop - minPop || 1);

  // 4. Climate score: optimum temperature is 14°C. Farther from 14 reduces score.
  const tempDiff = Math.abs(team.meanTemp - 14.0);
  const climateScore = Math.max(0, 1 - tempDiff / 25.0);

  // 5. Host advantage: USA, CAN, MEX get 1.0. Continent neighbors get 0.3. Others 0.0.
  let hostScore = 0.0;
  if (team.isHost) {
    hostScore = 1.0;
  } else if (team.continent === 'CONCACAF') {
    hostScore = 0.35;
  }

  // 6. Squad value normalization
  const squadScore = (Math.log(team.squadValue) - minSquadVal) / (maxSquadVal - minSquadVal || 1);

  // Calculate sum of weights for normalization
  const weightsSum =
    weights.fifaRank +
    weights.gdp +
    weights.population +
    weights.climate +
    weights.host +
    weights.squadValue;

  if (weightsSum === 0) return 0.5;

  let baseRating = (
    weights.fifaRank * eloScore +
    weights.gdp * gdpScore +
    weights.population * popScore +
    weights.climate * climateScore +
    weights.host * hostScore +
    weights.squadValue * squadScore
  ) / weightsSum;

  // Apply Lionel Messi Impact Factor specifically to Argentina (ARG)
  if (team.id === 'ARG' && messiImpact > 0) {
    // Increase Argentina's rating proportionally (up to +15% boost)
    baseRating = Math.min(1.0, baseRating + (messiImpact * 0.15));
  }

  return baseRating;
}

/**
 * Poisson distribution probability calculation
 */
export function poissonProbability(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Formats probability to decimal odds (e.g. 50% -> 2.00x)
 */
export function probToOdds(prob: number): string {
  if (prob <= 0) return '100.00';
  const val = 100 / prob;
  return Math.min(100.0, Math.max(1.01, val)).toFixed(2);
}

/**
 * Simulates a single match between two teams (for tournament simulations)
 */
export function simulateMatch(
  homeTeam: Team,
  awayTeam: Team,
  weights: ModelWeights,
  isKnockout: boolean,
  messiImpact: number = 0
): MatchResult {
  const ratingHome = calculateTeamRating(homeTeam, weights, messiImpact);
  const ratingAway = calculateTeamRating(awayTeam, weights, messiImpact);

  // Rating difference (range: -1 to 1)
  const ratingDiff = ratingHome - ratingAway;

  // Apply physical form and average age modifiers
  const formHome = (homeTeam.physicalForm - 80) * 0.01;
  const formAway = (awayTeam.physicalForm - 80) * 0.01;
  const agePenaltyHome = homeTeam.averageAge > 28.5 ? (homeTeam.averageAge - 28.5) * 0.04 : 0;
  const agePenaltyAway = awayTeam.averageAge > 28.5 ? (awayTeam.averageAge - 28.5) * 0.04 : 0;

  // Apply luck/randomness factor as a random walk offset
  const luckMultiplier = weights.luck * 0.6;
  const homeRandom = (Math.random() - 0.5) * luckMultiplier;
  const awayRandom = (Math.random() - 0.5) * luckMultiplier;

  // Base goals expected is around 1.3 goals per team, modified by differences, physical form, age
  const homeExpectedGoals = Math.max(0.1, 1.25 + ratingDiff * 1.8 + formHome - agePenaltyHome + homeRandom * 1.5);
  const awayExpectedGoals = Math.max(0.1, 1.25 - ratingDiff * 1.8 + formAway - agePenaltyAway + awayRandom * 1.5);

  const homeGoals = drawPoissonGoals(homeExpectedGoals);
  const awayGoals = drawPoissonGoals(awayExpectedGoals);

  let result: MatchResult = {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
  };

  if (homeGoals > awayGoals) {
    result.winnerId = homeTeam.id;
  } else if (awayGoals > homeGoals) {
    result.winnerId = awayTeam.id;
  }

  // Handle knockout rules (must have a winner)
  if (isKnockout && homeGoals === awayGoals) {
    // Simulate extra time
    const homeExtra = Math.random() < (ratingHome / (ratingHome + ratingAway)) ? drawPoissonGoals(0.4) : drawPoissonGoals(0.3);
    const awayExtra = Math.random() < (ratingAway / (ratingHome + ratingAway)) ? drawPoissonGoals(0.4) : drawPoissonGoals(0.3);

    result.homeGoals += homeExtra;
    result.awayGoals += awayExtra;

    if (result.homeGoals > result.awayGoals) {
      result.winnerId = homeTeam.id;
    } else if (result.awayGoals > result.homeGoals) {
      result.winnerId = awayTeam.id;
    } else {
      // Simulate penalty shootout
      result.wasPenaltyShootout = true;
      const penaltySkillHome = 0.5 + ratingHome * 0.3 + (Math.random() - 0.5) * 0.4;
      const penaltySkillAway = 0.5 + ratingAway * 0.3 + (Math.random() - 0.5) * 0.4;

      result.penaltyWinnerId = penaltySkillHome >= penaltySkillAway ? homeTeam.id : awayTeam.id;
      result.winnerId = result.penaltyWinnerId;
    }
  }

  return result;
}

// Simple approximation of Poisson distribution goals
function drawPoissonGoals(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > L && k < 10);
  return k - 1;
}

/**
 * Simulates a single Group's matches and returns standings
 */
export function simulateGroup(groupTeams: Team[], weights: ModelWeights, messiImpact: number = 0): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};
  groupTeams.forEach(t => {
    standings[t.id] = {
      team: t,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  for (let i = 0; i < groupTeams.length; i++) {
    for (let j = i + 1; j < groupTeams.length; j++) {
      const match = simulateMatch(groupTeams[i], groupTeams[j], weights, false, messiImpact);

      const home = standings[groupTeams[i].id];
      const away = standings[groupTeams[j].id];

      home.played++;
      away.played++;

      home.goalsFor += match.homeGoals;
      home.goalsAgainst += match.awayGoals;
      away.goalsFor += match.awayGoals;
      away.goalsAgainst += match.homeGoals;

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;

      if (!match.winnerId) {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      } else if (match.winnerId === groupTeams[i].id) {
        home.won++;
        away.lost++;
        home.points += 3;
      } else {
        away.won++;
        home.lost++;
        away.points += 3;
      }
    }
  }

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return calculateTeamRating(b.team, weights, messiImpact) - calculateTeamRating(a.team, weights, messiImpact);
  });
}

/**
 * Calculates complete match-specific betting markets dynamically
 */
export interface LineupData {
  formation: string;
  startingXI: string[];
  substitutes: string[];
}

/**
 * Calculates complete match-specific betting markets dynamically
 */
export function calculateMatchBettingMarkets(
  teamA: Team,
  teamB: Team,
  weights: ModelWeights,
  messiImpact: number = 0,
  lineupA?: LineupData,
  lineupB?: LineupData,
  applyGameTheory: boolean = false
): MatchBettingMarkets {
  let ratingA = calculateTeamRating(teamA, weights, teamA.id === 'ARG' ? messiImpact : 0);
  let ratingB = calculateTeamRating(teamB, weights, teamB.id === 'ARG' ? messiImpact : 0);

  if (applyGameTheory) {
    // Teoría de Juegos y Supervivencia Táctica:
    // El equipo menos favorecido en calidad teórica pura recibe un ajuste de intensidad y utilidad
    // porque juega por su supervivencia. El favorito juega con un enfoque más conservador o táctico.
    const ratingDiff = ratingA - ratingB;
    if (ratingDiff < 0) {
      // B es favorito. A (Ecuador) recibe el valor del incentivo.
      ratingA = Math.min(1.0, ratingA + Math.abs(ratingDiff) * 0.45);
      ratingB = Math.max(0.1, ratingB - Math.abs(ratingDiff) * 0.25);
    } else if (ratingDiff > 0) {
      // A es favorito. B recibe el valor del incentivo.
      ratingB = Math.min(1.0, ratingB + Math.abs(ratingDiff) * 0.45);
      ratingA = Math.max(0.1, ratingA - Math.abs(ratingDiff) * 0.25);
    }
  }

  // Lineup impact: check if star players (those in team.players) are missing from the startingXI
  let ratingReductionA = 0;
  if (lineupA && lineupA.startingXI.length > 0) {
    teamA.players.forEach(p => {
      const isStarting = lineupA.startingXI.some(name => name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(name.toLowerCase()));
      if (!isStarting) {
        if (p.position === 'DEL') {
          ratingReductionA += 0.08;
        } else if (p.position === 'MED') {
          ratingReductionA += 0.05;
        } else {
          ratingReductionA += 0.03;
        }
      }
    });
  }
  ratingA = Math.max(0.1, ratingA - ratingReductionA);

  let ratingReductionB = 0;
  if (lineupB && lineupB.startingXI.length > 0) {
    teamB.players.forEach(p => {
      const isStarting = lineupB.startingXI.some(name => name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(name.toLowerCase()));
      if (!isStarting) {
        if (p.position === 'DEL') {
          ratingReductionB += 0.08;
        } else if (p.position === 'MED') {
          ratingReductionB += 0.05;
        } else {
          ratingReductionB += 0.03;
        }
      }
    });
  }
  ratingB = Math.max(0.1, ratingB - ratingReductionB);

  // Formation modifiers
  let formationMultGoalsA = 1.0;
  let formationMultGoalsOppA = 1.0;
  let formationMultCornersA = 1.0;
  let formationMultCardsA = 1.0;

  if (lineupA && lineupA.formation) {
    const f = lineupA.formation;
    if (f.startsWith('5') || f === '4-5-1') {
      formationMultGoalsA *= 0.80;
      formationMultGoalsOppA *= 0.80;
      formationMultCornersA *= 0.85;
      formationMultCardsA *= 1.20;
    } else if (f.startsWith('3') || f === '4-3-3') {
      formationMultGoalsA *= 1.15;
      formationMultGoalsOppA *= 1.12;
      formationMultCornersA *= 1.15;
      formationMultCardsA *= 0.90;
    }
  }

  let formationMultGoalsB = 1.0;
  let formationMultGoalsOppB = 1.0;
  let formationMultCornersB = 1.0;
  let formationMultCardsB = 1.0;

  if (lineupB && lineupB.formation) {
    const f = lineupB.formation;
    if (f.startsWith('5') || f === '4-5-1') {
      formationMultGoalsB *= 0.80;
      formationMultGoalsOppB *= 0.80;
      formationMultCornersB *= 0.85;
      formationMultCardsB *= 1.20;
    } else if (f.startsWith('3') || f === '4-3-3') {
      formationMultGoalsB *= 1.15;
      formationMultGoalsOppB *= 1.12;
      formationMultCornersB *= 1.15;
      formationMultCardsB *= 0.90;
    }
  }

  // 1. Calculate realistic xG (incorporating physicalForm and averageAge)
  const formModifierA = (teamA.physicalForm - 80) * 0.015;
  const formModifierB = (teamB.physicalForm - 80) * 0.015;
  
  const agePenaltyA = teamA.averageAge > 28 ? (teamA.averageAge - 28) * 0.05 : 0;
  const agePenaltyB = teamB.averageAge > 28 ? (teamB.averageAge - 28) * 0.05 : 0;

  const attackPowerA = Math.max(0.3, ratingA * 1.8 + formModifierA);
  const defensePowerB = Math.max(0.3, (1.0 - ratingB) * 1.6 + agePenaltyB);
  
  const attackPowerB = Math.max(0.3, ratingB * 1.8 + formModifierB);
  const defensePowerA = Math.max(0.3, (1.0 - ratingA) * 1.6 + agePenaltyA);

  let xgA = Math.max(0.2, +(attackPowerA * defensePowerB * 1.35 * formationMultGoalsA * formationMultGoalsOppB).toFixed(2));
  let xgB = Math.max(0.2, +(attackPowerB * defensePowerA * 1.35 * formationMultGoalsB * formationMultGoalsOppA).toFixed(2));

  if (applyGameTheory) {
    // Proyectar un partido trabado y de pocos goles (reducción general del 30% en xG)
    xgA = Math.max(0.1, +(xgA * 0.70).toFixed(2));
    xgB = Math.max(0.1, +(xgB * 0.70).toFixed(2));
  }

  const xgTotal = +(xgA + xgB).toFixed(2);

  // 2. Exact score distribution using Poisson (0 to 5 goals)
  let probA = 0;
  let probB = 0;
  let probDraw = 0;
  let bestScore = { g1: 0, g2: 0, p: 0 };
  const exactScores: { g1: number; g2: number; p: number }[] = [];

  for (let a = 0; a <= 5; a++) {
    for (let b = 0; b <= 5; b++) {
      const p = poissonProbability(xgA, a) * poissonProbability(xgB, b);
      if (a > b) probA += p;
      else if (b > a) probB += p;
      else probDraw += p;

      exactScores.push({ g1: a, g2: b, p });
      if (p > bestScore.p) {
        bestScore = { g1: a, g2: b, p };
      }
    }
  }

  // Normalize win/draw probabilities
  const sumProbs = probA + probB + probDraw;
  const wA = Math.round((probA / sumProbs) * 100);
  const wB = Math.round((probB / sumProbs) * 100);
  const wD = 100 - wA - wB;

  // Sort exact scores to get top 3
  const topScores = exactScores
    .sort((x, y) => y.p - x.p)
    .slice(0, 3)
    .map(s => {
      const p = Math.round((s.p / sumProbs) * 100);
      return {
        n: `${s.g1} – ${s.g2}`,
        p: Math.max(1, p),
        odds: probToOdds(p),
        marketType: 'EXACT_SCORE',
        selectionId: `${teamA.id}_${teamB.id}_CS_${s.g1}-${s.g2}`
      };
    });

  // 3. Over/Under probabilities
  const pOver = (threshold: number): number => {
    let underProb = 0;
    for (let k = 0; k <= Math.floor(threshold); k++) {
      underProb += poissonProbability(xgTotal, k);
    }
    return Math.max(2, Math.round((1 - underProb) * 100));
  };

  const pBtts = Math.max(5, Math.round((1 - Math.exp(-xgA)) * (1 - Math.exp(-xgB)) * 100));

  // 4. Corners Calculation
  const avgCornersA = Math.max(2.5, +( (3.5 + ratingA * 4.5 + formModifierA * 2) * formationMultCornersA ).toFixed(1));
  const avgCornersB = Math.max(2.5, +( (3.5 + ratingB * 4.5 + formModifierB * 2) * formationMultCornersB ).toFixed(1));
  const totalCorners = avgCornersA + avgCornersB;

  // 5. Cards Calculation (aggressiveness)
  const avgCardsA = Math.max(0.5, +( (1.2 + (1.0 - ratingA) * 1.5 + (teamA.aggressiveness / 100) * 1.8) * formationMultCardsA ).toFixed(1));
  const avgCardsB = Math.max(0.5, +( (1.2 + (1.0 - ratingB) * 1.5 + (teamB.aggressiveness / 100) * 1.8) * formationMultCardsB ).toFixed(1));
  const totalCards = avgCardsA + avgCardsB;

  // 6. Specials (Goal kicks, free kicks, offsides)
  const goalKicksA = Math.round(5 + xgB * 2.8 + (1.0 - ratingA) * 4);
  const goalKicksB = Math.round(5 + xgA * 2.8 + (1.0 - ratingB) * 4);

  const freeKicksA = Math.round(10 + avgCardsB * 3.5 + (teamA.physicalForm / 100) * 3);
  const freeKicksB = Math.round(10 + avgCardsA * 3.5 + (teamB.physicalForm / 100) * 3);

  const offsidesA = Math.max(0, Math.round(1.2 + xgA * 0.9 + (30 - teamA.averageAge) * 0.08));
  const offsidesB = Math.max(0, Math.round(1.2 + xgB * 0.9 + (30 - teamB.averageAge) * 0.08));

  // 7. Player scoring/assisting/cards probabilities
  const processPlayers = (team: Team, ownXG: number, lineup?: LineupData) => {
    return team.players.map(p => {
      let statusFactor = 1.0;
      if (lineup && lineup.startingXI.length > 0) {
        const isStarting = lineup.startingXI.some(name => name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(name.toLowerCase()));
        if (!isStarting) {
          const isSub = lineup.substitutes.some(name => name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(name.toLowerCase()));
          statusFactor = isSub ? 0.25 : 0.0;
        }
      }

      const pScore = Math.max(1, Math.round(p.scoringProb * (1 - Math.exp(-ownXG)) * 1.15 * 100 * statusFactor));
      const pAssist = Math.max(1, Math.round(p.assistProb * (1 - Math.exp(-ownXG)) * 0.95 * 100 * statusFactor));
      const pCard = Math.max(1, Math.round(p.cardsProb * (1 + (team.aggressiveness / 100) * 0.3) * 100 * (statusFactor > 0 ? 1.0 : 0.0)));

      return {
        player: p,
        teamName: team.name,
        flag: team.flag,
        scoringProb: pScore,
        assistProb: pAssist,
        cardsProb: pCard
      };
    });
  };

  const playersA = processPlayers(teamA, xgA, lineupA);
  const playersB = processPlayers(teamB, xgB, lineupB);
  const allPlayers = [...playersA, ...playersB];

  // 8. Assemble markets object
  const markets: Record<string, MarketOption[]> = {
    '1X2': [
      { n: `${teamA.flag} ${teamA.name}`, p: wA, note: 'Victoria local', best: wA > wB && wA > wD, odds: probToOdds(wA), marketType: '1X2', selectionId: `${teamA.id}_WIN` },
      { n: 'Empate', p: wD, note: 'Tablas', best: wD > wA && wD > wB, odds: probToOdds(wD), marketType: '1X2', selectionId: 'DRAW' },
      { n: `${teamB.flag} ${teamB.name}`, p: wB, note: 'Victoria visitante', best: wB > wA && wB > wD, odds: probToOdds(wB), marketType: '1X2', selectionId: `${teamB.id}_WIN` }
    ],
    'doubleChance': [
      { n: `${teamA.name} o Empate`, p: Math.min(98, wA + wD), note: '1X', odds: probToOdds(Math.min(98, wA + wD)), marketType: 'DOUBLE_CHANCE', selectionId: `${teamA.id}_X` },
      { n: `${teamB.name} o Empate`, p: Math.min(98, wB + wD), note: 'X2', odds: probToOdds(Math.min(98, wB + wD)), marketType: 'DOUBLE_CHANCE', selectionId: `${teamB.id}_X` },
      { n: 'Sin Empate', p: Math.min(95, wA + wB), note: '12', odds: probToOdds(Math.min(95, wA + wB)), marketType: 'DOUBLE_CHANCE', selectionId: 'NO_DRAW' }
    ],
    'btts': [
      { n: 'Ambos Marcan (Sí)', p: pBtts, note: 'Goles en ambos arcos', best: pBtts > 50, odds: probToOdds(pBtts), marketType: 'BTTS', selectionId: 'BTTS_YES' },
      { n: 'Ambos Marcan (No)', p: 100 - pBtts, note: 'Valla invicta o seco', best: pBtts <= 50, odds: probToOdds(100 - pBtts), marketType: 'BTTS', selectionId: 'BTTS_NO' }
    ],
    'exactScore': topScores,
    'totalGoals': [0.5, 1.5, 2.5, 3.5, 4.5].map(th => {
      const p = pOver(th);
      return {
        n: `Más de ${th}`,
        p,
        note: `Over ${th} goles`,
        best: th === 2.5 && p > 55,
        odds: probToOdds(p),
        marketType: 'TOTAL_GOALS',
        selectionId: `OVER_${th}`
      };
    }),
    'corners': [
      { n: `Más de ${Math.round(totalCorners - 1.5)}.5 Córners`, p: 68, note: `Media total ~${Math.round(totalCorners)}`, odds: probToOdds(68), marketType: 'CORNERS', selectionId: 'CORNERS_OVER_LOW' },
      { n: `Más de ${Math.round(totalCorners - 0.5)}.5 Córners`, p: 48, note: 'Línea de valor', odds: probToOdds(48), marketType: 'CORNERS', selectionId: 'CORNERS_OVER_MID' },
      { n: `Más de ${Math.round(totalCorners + 0.5)}.5 Córners`, p: 28, odds: probToOdds(28), marketType: 'CORNERS', selectionId: 'CORNERS_OVER_HIGH' }
    ],
    'bookings': [
      { n: `Más de 2.5 Tarjetas Amarillas`, p: 72, note: `Media total ~${Math.round(totalCards)}`, odds: probToOdds(72), marketType: 'BOOKINGS', selectionId: 'CARDS_OVER_2' },
      { n: 'Más de 3.5 Tarjetas', p: 45, note: 'Línea disciplinaria', odds: probToOdds(45), marketType: 'BOOKINGS', selectionId: 'CARDS_OVER_3' },
      { n: 'Tarjeta Roja en el partido', p: 15, note: 'Expulsión', odds: probToOdds(15), marketType: 'BOOKINGS', selectionId: 'RED_CARD' }
    ],
    'anytimeGoal': allPlayers.filter(pa => pa.scoringProb > 0).sort((x, y) => y.scoringProb - x.scoringProb).slice(0, 5).map(pa => {
      return {
        n: `${pa.flag} ${pa.player.name} (${pa.teamName})`,
        p: pa.scoringProb,
        note: `${pa.player.position} · ${pa.player.age} años`,
        odds: probToOdds(pa.scoringProb),
        marketType: 'ANYTIME_SCORER',
        selectionId: `ANYTIME_${pa.player.name.replace(/\s+/g, '')}`
      };
    }),
    'firstGoal': allPlayers.filter(pa => pa.scoringProb > 0).sort((x, y) => y.scoringProb - x.scoringProb).slice(0, 5).map((pa, idx) => {
      const pFirst = Math.round(pa.scoringProb * 0.35);
      return {
        n: `${pa.flag} ${pa.player.name} (${pa.teamName})`,
        p: pFirst,
        note: 'Primer goleador',
        best: idx === 0,
        odds: probToOdds(pFirst),
        marketType: 'FIRST_SCORER',
        selectionId: `FIRST_GOAL_${pa.player.name.replace(/\s+/g, '')}`
      };
    }),
    'anytimeAssist': allPlayers.filter(pa => pa.assistProb > 0).sort((x, y) => y.assistProb - x.assistProb).slice(0, 4).map(pa => {
      return {
        n: `${pa.flag} ${pa.player.name} (${pa.teamName})`,
        p: pa.assistProb,
        note: `Asistente`,
        odds: probToOdds(pa.assistProb),
        marketType: 'ANYTIME_ASSIST',
        selectionId: `ASSIST_${pa.player.name.replace(/\s+/g, '')}`
      };
    })
  };

  const confidence = Math.min(85, Math.round(Math.max(wA, wB) * 0.65 + Math.abs(teamA.fifaRank - teamB.fifaRank) * 0.45 + 15));

  return {
    teamA,
    teamB,
    xgA,
    xgB,
    scoreA: bestScore.g1,
    scoreB: bestScore.g2,
    probA: wA,
    probDraw: wD,
    probB: wB,
    confidence,
    markets,
    xgTotal,
    avgCornersA,
    avgCornersB,
    goalKicksA,
    goalKicksB,
    freeKicksA,
    freeKicksB,
    offsidesA,
    offsidesB
  };
}

/**
 * Calculates combined odds applying a correlation discount for selections in the same match
 */
export function calculateCombinedOdds(selections: { odds: string; marketType: string; selectionId: string }[]): string {
  if (selections.length === 0) return '1.00';
  
  let rawMultiplier = 1.0;
  selections.forEach(sel => {
    rawMultiplier *= parseFloat(sel.odds);
  });

  // Apply a correlation discount if there are multiple bets
  // For example, if betting win A + Over 1.5, they are highly correlated.
  if (selections.length > 1) {
    const discount = Math.pow(0.88, selections.length - 1);
    rawMultiplier *= discount;
  }

  return Math.max(1.05, rawMultiplier).toFixed(2);
}

/**
 * Monte Carlo simulator that runs N iterations and calculates probabilities
 */
export function runMonteCarloSimulation(
  weights: ModelWeights,
  iterations: number = 1000,
  messiImpact: number = 0,
  onProgress?: (progress: number) => void
): Record<string, SimulationStats> {
  const stats: Record<string, {
    winCount: number;
    finalCount: number;
    semiCount: number;
    quarterCount: number;
    r16Count: number;
    r32Count: number;
    groupExitCount: number;
  }> = {};

  teamsData.forEach(t => {
    stats[t.id] = {
      winCount: 0,
      finalCount: 0,
      semiCount: 0,
      quarterCount: 0,
      r16Count: 0,
      r32Count: 0,
      groupExitCount: 0,
    };
  });

  const groups: Record<GroupLetter, Team[]> = {} as any;
  teamsData.forEach(team => {
    if (!groups[team.group]) {
      groups[team.group] = [];
    }
    groups[team.group].push(team);
  });

  for (let iter = 0; iter < iterations; iter++) {
    if (onProgress && iter % Math.max(1, Math.floor(iterations / 10)) === 0) {
      onProgress(Math.round((iter / iterations) * 100));
    }

    const groupWinners: Team[] = [];
    const groupRunnersUp: Team[] = [];
    const groupThirds: GroupStanding[] = [];

    for (const groupLetter of Object.keys(groups) as GroupLetter[]) {
      const standings = simulateGroup(groups[groupLetter], weights, messiImpact);
      groupWinners.push(standings[0].team);
      groupRunnersUp.push(standings[1].team);
      groupThirds.push(standings[2]);
      stats[standings[3].team.id].groupExitCount++;
    }

    const sortedThirds = groupThirds.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return calculateTeamRating(b.team, weights, messiImpact) - calculateTeamRating(a.team, weights, messiImpact);
    });

    const advancingThirds = sortedThirds.slice(0, 8).map(g => g.team);
    const exitingThirds = sortedThirds.slice(8).map(g => g.team);

    exitingThirds.forEach(t => {
      stats[t.id].groupExitCount++;
    });

    const r32Teams = [...groupWinners, ...groupRunnersUp, ...advancingThirds];
    r32Teams.forEach(t => {
      stats[t.id].r32Count++;
    });

    const r32Matches: [Team, Team][] = [];
    for (let i = 0; i < 8; i++) {
      r32Matches.push([groupWinners[i], advancingThirds[i]]);
    }
    r32Matches.push([groupWinners[8], groupRunnersUp[0]]);
    r32Matches.push([groupWinners[9], groupRunnersUp[1]]);
    r32Matches.push([groupWinners[10], groupRunnersUp[2]]);
    r32Matches.push([groupWinners[11], groupRunnersUp[3]]);
    
    r32Matches.push([groupRunnersUp[4], groupRunnersUp[5]]);
    r32Matches.push([groupRunnersUp[6], groupRunnersUp[7]]);
    r32Matches.push([groupRunnersUp[8], groupRunnersUp[9]]);
    r32Matches.push([groupRunnersUp[10], groupRunnersUp[11]]);

    const r16Teams: Team[] = [];
    r32Matches.forEach(([teamA, teamB]) => {
      const match = simulateMatch(teamA, teamB, weights, true, messiImpact);
      const winner = teamsData.find(t => t.id === match.winnerId)!;
      r16Teams.push(winner);
      stats[winner.id].r16Count++;
    });

    const quarterTeams: Team[] = [];
    for (let i = 0; i < 16; i += 2) {
      const match = simulateMatch(r16Teams[i], r16Teams[i+1], weights, true, messiImpact);
      const winner = teamsData.find(t => t.id === match.winnerId)!;
      quarterTeams.push(winner);
      stats[winner.id].quarterCount++;
    }

    const semiTeams: Team[] = [];
    for (let i = 0; i < 8; i += 2) {
      const match = simulateMatch(quarterTeams[i], quarterTeams[i+1], weights, true, messiImpact);
      const winner = teamsData.find(t => t.id === match.winnerId)!;
      semiTeams.push(winner);
      stats[winner.id].semiCount++;
    }

    const finalTeams: Team[] = [];
    for (let i = 0; i < 4; i += 2) {
      const match = simulateMatch(semiTeams[i], semiTeams[i+1], weights, true, messiImpact);
      const winner = teamsData.find(t => t.id === match.winnerId)!;
      finalTeams.push(winner);
      stats[winner.id].finalCount++;
    }

    const matchFinal = simulateMatch(finalTeams[0], finalTeams[1], weights, true, messiImpact);
    const champion = teamsData.find(t => t.id === matchFinal.winnerId)!;
    stats[champion.id].winCount++;
  }

  if (onProgress) {
    onProgress(100);
  }

  const results: Record<string, SimulationStats> = {};
  teamsData.forEach(t => {
    const s = stats[t.id];
    results[t.id] = {
      teamId: t.id,
      name: t.name,
      flag: t.flag,
      winProb: Math.round((s.winCount / iterations) * 1000) / 10,
      finalProb: Math.round((s.finalCount / iterations) * 1000) / 10,
      semiProb: Math.round((s.semiCount / iterations) * 1000) / 10,
      quarterProb: Math.round((s.quarterCount / iterations) * 1000) / 10,
      r16Prob: Math.round((s.r16Count / iterations) * 1000) / 10,
      r32Prob: Math.round((s.r32Count / iterations) * 1000) / 10,
      groupExitProb: Math.round((s.groupExitCount / iterations) * 1000) / 10,
    };
  });

  return results;
}
