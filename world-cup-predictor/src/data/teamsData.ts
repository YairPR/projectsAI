export interface Player {
  name: string;
  position: 'DEL' | 'MED' | 'DEF';
  age: number;
  goals: number;
  assists: number;
  physicalForm: number; // 0 to 100
  scoringProb: number;  // Base goalscorer probability factor (0 to 1)
  assistProb: number;   // Base assist probability factor
  cardsProb: number;    // Base cards probability factor
}

export interface Team {
  id: string;
  name: string;
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
  fifaRank: number;
  fifaPoints: number;
  gdpPerCapita: number; // USD
  population: number; // Millions
  meanTemp: number; // °C
  squadValue: number; // Million EUR
  isHost: boolean;
  continent: 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
  flag: string;
  averageAge: number;
  physicalForm: number; // 0 to 100
  aggressiveness: number; // 0 to 100
  players: Player[];
}

export const teamsData: Team[] = [
  // GROUP A
  {
    id: 'MEX',
    name: 'México',
    group: 'A',
    fifaRank: 15,
    fifaPoints: 1650,
    gdpPerCapita: 13800,
    population: 128.5,
    meanTemp: 21.0,
    squadValue: 220,
    isHost: true,
    continent: 'CONCACAF',
    flag: '🇲🇽',
    averageAge: 27.2,
    physicalForm: 82,
    aggressiveness: 65,
    players: [
      { name: 'S. Giménez', position: 'DEL', age: 25, goals: 2, assists: 0, physicalForm: 85, scoringProb: 0.62, assistProb: 0.22, cardsProb: 0.25 },
      { name: 'H. Lozano', position: 'DEL', age: 30, goals: 1, assists: 0, physicalForm: 80, scoringProb: 0.45, assistProb: 0.35, cardsProb: 0.42 },
      { name: 'Edson Álvarez', position: 'MED', age: 28, goals: 0, assists: 1, physicalForm: 84, scoringProb: 0.22, assistProb: 0.38, cardsProb: 0.55 }
    ]
  },
  {
    id: 'RSA',
    name: 'Sudáfrica',
    group: 'A',
    fifaRank: 59,
    fifaPoints: 1410,
    gdpPerCapita: 6200,
    population: 60.6,
    meanTemp: 17.5,
    squadValue: 50,
    isHost: false,
    continent: 'CAF',
    flag: '🇿🇦',
    averageAge: 28.1,
    physicalForm: 79,
    aggressiveness: 72,
    players: [
      { name: 'P. Tau', position: 'DEL', age: 32, goals: 1, assists: 0, physicalForm: 81, scoringProb: 0.48, assistProb: 0.28, cardsProb: 0.30 },
      { name: 'T. Zwane', position: 'MED', age: 36, goals: 0, assists: 1, physicalForm: 74, scoringProb: 0.32, assistProb: 0.42, cardsProb: 0.25 },
      { name: 'A. Modiba', position: 'DEF', age: 30, goals: 0, assists: 0, physicalForm: 80, scoringProb: 0.12, assistProb: 0.20, cardsProb: 0.48 }
    ]
  },
  {
    id: 'KOR',
    name: 'Corea del Sur',
    group: 'A',
    fifaRank: 22,
    fifaPoints: 1564,
    gdpPerCapita: 33000,
    population: 51.7,
    meanTemp: 12.5,
    squadValue: 180,
    isHost: false,
    continent: 'AFC',
    flag: '🇰🇷',
    averageAge: 27.6,
    physicalForm: 85,
    aggressiveness: 55,
    players: [
      { name: 'Son Heung-min', position: 'DEL', age: 33, goals: 3, assists: 1, physicalForm: 88, scoringProb: 0.72, assistProb: 0.45, cardsProb: 0.20 },
      { name: 'Hwang Hee-chan', position: 'DEL', age: 30, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.52, assistProb: 0.28, cardsProb: 0.35 },
      { name: 'Lee Kang-in', position: 'MED', age: 25, goals: 0, assists: 2, physicalForm: 87, scoringProb: 0.35, assistProb: 0.55, cardsProb: 0.28 }
    ]
  },
  {
    id: 'DEN',
    name: 'Dinamarca',
    group: 'A',
    fifaRank: 16,
    fifaPoints: 1630,
    gdpPerCapita: 68000,
    population: 5.9,
    meanTemp: 8.5,
    squadValue: 350,
    isHost: false,
    continent: 'UEFA',
    flag: '🇩🇰',
    averageAge: 26.9,
    physicalForm: 83,
    aggressiveness: 60,
    players: [
      { name: 'R. Højlund', position: 'DEL', age: 23, goals: 2, assists: 0, physicalForm: 86, scoringProb: 0.65, assistProb: 0.20, cardsProb: 0.22 },
      { name: 'C. Eriksen', position: 'MED', age: 34, goals: 0, assists: 2, physicalForm: 78, scoringProb: 0.38, assistProb: 0.60, cardsProb: 0.15 },
      { name: 'P. Højbjerg', position: 'MED', age: 30, goals: 1, assists: 0, physicalForm: 84, scoringProb: 0.28, assistProb: 0.35, cardsProb: 0.50 }
    ]
  },

  // GROUP B
  {
    id: 'CAN',
    name: 'Canadá',
    group: 'B',
    fifaRank: 49, // Corrected ranking based on mock
    fifaPoints: 1495,
    gdpPerCapita: 53000,
    population: 38.9,
    meanTemp: -5.3,
    squadValue: 200,
    isHost: true,
    continent: 'CONCACAF',
    flag: '🇨🇦',
    averageAge: 25.8,
    physicalForm: 87,
    aggressiveness: 68,
    players: [
      { name: 'Jonathan David', position: 'DEL', age: 26, goals: 3, assists: 0, physicalForm: 90, scoringProb: 0.68, assistProb: 0.28, cardsProb: 0.25 },
      { name: 'Alphonso Davies', position: 'DEL', age: 25, goals: 2, assists: 2, physicalForm: 92, scoringProb: 0.55, assistProb: 0.50, cardsProb: 0.38 },
      { name: 'Cyle Larin', position: 'DEL', age: 31, goals: 2, assists: 0, physicalForm: 80, scoringProb: 0.50, assistProb: 0.20, cardsProb: 0.32 }
    ]
  },
  {
    id: 'ITA',
    name: 'Italia',
    group: 'B',
    fifaRank: 10,
    fifaPoints: 1725,
    gdpPerCapita: 37000,
    population: 58.9,
    meanTemp: 13.0,
    squadValue: 750,
    isHost: false,
    continent: 'UEFA',
    flag: '🇮🇹',
    averageAge: 26.4,
    physicalForm: 84,
    aggressiveness: 62,
    players: [
      { name: 'G. Scamacca', position: 'DEL', age: 27, goals: 1, assists: 1, physicalForm: 82, scoringProb: 0.60, assistProb: 0.25, cardsProb: 0.35 },
      { name: 'F. Chiesa', position: 'DEL', age: 28, goals: 1, assists: 0, physicalForm: 85, scoringProb: 0.58, assistProb: 0.38, cardsProb: 0.30 },
      { name: 'N. Barella', position: 'MED', age: 29, goals: 0, assists: 2, physicalForm: 88, scoringProb: 0.35, assistProb: 0.58, cardsProb: 0.45 }
    ]
  },
  {
    id: 'QAT',
    name: 'Catar',
    group: 'B',
    fifaRank: 34,
    fifaPoints: 1508,
    gdpPerCapita: 82000,
    population: 2.7,
    meanTemp: 27.0,
    squadValue: 20,
    isHost: false,
    continent: 'AFC',
    flag: '🇶🇦',
    averageAge: 28.5,
    physicalForm: 78,
    aggressiveness: 58,
    players: [
      { name: 'Almoez Ali', position: 'DEL', age: 29, goals: 1, assists: 0, physicalForm: 80, scoringProb: 0.52, assistProb: 0.22, cardsProb: 0.28 },
      { name: 'Akram Afif', position: 'DEL', age: 29, goals: 1, assists: 1, physicalForm: 82, scoringProb: 0.48, assistProb: 0.45, cardsProb: 0.32 },
      { name: 'H. Al-Haydos', position: 'MED', age: 35, goals: 0, assists: 0, physicalForm: 72, scoringProb: 0.28, assistProb: 0.35, cardsProb: 0.20 }
    ]
  },
  {
    id: 'SUI',
    name: 'Suiza',
    group: 'B',
    fifaRank: 20, // Corrected ranking based on mock
    fifaPoints: 1618,
    gdpPerCapita: 93000,
    population: 8.8,
    meanTemp: 5.5,
    squadValue: 280,
    isHost: false,
    continent: 'UEFA',
    flag: '🇨🇭',
    averageAge: 27.8,
    physicalForm: 83,
    aggressiveness: 66,
    players: [
      { name: 'B. Embolo', position: 'DEL', age: 29, goals: 2, assists: 0, physicalForm: 85, scoringProb: 0.58, assistProb: 0.20, cardsProb: 0.38 },
      { name: 'G. Xhaka', position: 'MED', age: 33, goals: 1, assists: 1, physicalForm: 84, scoringProb: 0.35, assistProb: 0.50, cardsProb: 0.62 },
      { name: 'X. Shaqiri', position: 'MED', age: 34, goals: 1, assists: 1, physicalForm: 76, scoringProb: 0.42, assistProb: 0.48, cardsProb: 0.25 }
    ]
  },

  // GROUP C
  {
    id: 'BRA',
    name: 'Brasil',
    group: 'C',
    fifaRank: 5,
    fifaPoints: 1785,
    gdpPerCapita: 10400,
    population: 215.3,
    meanTemp: 25.0,
    squadValue: 1050,
    isHost: false,
    continent: 'CONMEBOL',
    flag: '🇧🇷',
    averageAge: 26.2,
    physicalForm: 86,
    aggressiveness: 64,
    players: [
      { name: 'Vinicius Jr.', position: 'DEL', age: 25, goals: 2, assists: 1, physicalForm: 92, scoringProb: 0.75, assistProb: 0.48, cardsProb: 0.40 },
      { name: 'Rodrygo', position: 'DEL', age: 25, goals: 1, assists: 0, physicalForm: 88, scoringProb: 0.60, assistProb: 0.35, cardsProb: 0.28 },
      { name: 'Bruno Guimarães', position: 'MED', age: 28, goals: 0, assists: 1, physicalForm: 85, scoringProb: 0.28, assistProb: 0.45, cardsProb: 0.50 }
    ]
  },
  {
    id: 'MAR',
    name: 'Marruecos',
    group: 'C',
    fifaRank: 13, // Corrected ranking based on mock
    fifaPoints: 1675,
    gdpPerCapita: 3900,
    population: 37.8,
    meanTemp: 17.0,
    squadValue: 380,
    isHost: false,
    continent: 'CAF',
    flag: '🇲🇦',
    averageAge: 26.8,
    physicalForm: 84,
    aggressiveness: 68,
    players: [
      { name: 'Y. En-Nesyri', position: 'DEL', age: 29, goals: 1, assists: 0, physicalForm: 83, scoringProb: 0.58, assistProb: 0.18, cardsProb: 0.32 },
      { name: 'H. Ziyech', position: 'DEL', age: 33, goals: 1, assists: 1, physicalForm: 79, scoringProb: 0.50, assistProb: 0.52, cardsProb: 0.40 },
      { name: 'Achraf Hakimi', position: 'DEF', age: 27, goals: 0, assists: 1, physicalForm: 89, scoringProb: 0.25, assistProb: 0.42, cardsProb: 0.35 }
    ]
  },
  {
    id: 'HAI',
    name: 'Haití',
    group: 'C',
    fifaRank: 86,
    fifaPoints: 1260,
    gdpPerCapita: 1700,
    population: 11.7,
    meanTemp: 26.5,
    squadValue: 15,
    isHost: false,
    continent: 'CONCACAF',
    flag: '🇭🇹',
    averageAge: 28.0,
    physicalForm: 75,
    aggressiveness: 70,
    players: [
      { name: 'F. Pierrot', position: 'DEL', age: 31, goals: 0, assists: 0, physicalForm: 78, scoringProb: 0.40, assistProb: 0.15, cardsProb: 0.28 },
      { name: 'D. Nazon', position: 'DEL', age: 32, goals: 0, assists: 0, physicalForm: 74, scoringProb: 0.38, assistProb: 0.18, cardsProb: 0.30 },
      { name: 'C. Arcens', position: 'MED', age: 25, goals: 0, assists: 0, physicalForm: 76, scoringProb: 0.20, assistProb: 0.25, cardsProb: 0.42 }
    ]
  },
  {
    id: 'SCO',
    name: 'Escocia',
    group: 'C',
    fifaRank: 39,
    fifaPoints: 1497,
    gdpPerCapita: 48000,
    population: 5.4,
    meanTemp: 8.0,
    squadValue: 240,
    isHost: false,
    continent: 'UEFA',
    flag: '🏴\u200d☠️', // Flag fallback or simple representation
    averageAge: 27.5,
    physicalForm: 80,
    aggressiveness: 74,
    players: [
      { name: 'Che Adams', position: 'DEL', age: 29, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.50, assistProb: 0.20, cardsProb: 0.30 },
      { name: 'S. McTominay', position: 'MED', age: 29, goals: 1, assists: 0, physicalForm: 83, scoringProb: 0.42, assistProb: 0.28, cardsProb: 0.58 },
      { name: 'J. McGinn', position: 'MED', age: 31, goals: 0, assists: 1, physicalForm: 81, scoringProb: 0.32, assistProb: 0.40, cardsProb: 0.45 }
    ]
  },

  // GROUP D
  {
    id: 'USA',
    name: 'Estados Unidos',
    group: 'D',
    fifaRank: 11,
    fifaPoints: 1680,
    gdpPerCapita: 80000,
    population: 333.2,
    meanTemp: 11.5,
    squadValue: 350,
    isHost: true,
    continent: 'CONCACAF',
    flag: '🇺🇸',
    averageAge: 25.1,
    physicalForm: 86,
    aggressiveness: 63,
    players: [
      { name: 'C. Pulisic', position: 'DEL', age: 27, goals: 2, assists: 2, physicalForm: 88, scoringProb: 0.65, assistProb: 0.48, cardsProb: 0.25 },
      { name: 'F. Balogun', position: 'DEL', age: 24, goals: 2, assists: 0, physicalForm: 85, scoringProb: 0.60, assistProb: 0.22, cardsProb: 0.30 },
      { name: 'Weston McKennie', position: 'MED', age: 27, goals: 1, assists: 1, physicalForm: 86, scoringProb: 0.32, assistProb: 0.38, cardsProb: 0.52 }
    ]
  },
  {
    id: 'PAR',
    name: 'Paraguay',
    group: 'D',
    fifaRank: 56,
    fifaPoints: 1420,
    gdpPerCapita: 5800,
    population: 6.8,
    meanTemp: 23.5,
    squadValue: 110,
    isHost: false,
    continent: 'CONMEBOL',
    flag: '🇵🇾',
    averageAge: 26.9,
    physicalForm: 80,
    aggressiveness: 75,
    players: [
      { name: 'A. Sanabria', position: 'DEL', age: 30, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.50, assistProb: 0.18, cardsProb: 0.30 },
      { name: 'Miguel Almirón', position: 'DEL', age: 32, goals: 1, assists: 1, physicalForm: 81, scoringProb: 0.48, assistProb: 0.40, cardsProb: 0.35 },
      { name: 'J. Enciso', position: 'DEL', age: 22, goals: 0, assists: 0, physicalForm: 84, scoringProb: 0.42, assistProb: 0.32, cardsProb: 0.25 }
    ]
  },
  {
    id: 'AUS',
    name: 'Australia',
    group: 'D',
    fifaRank: 23,
    fifaPoints: 1560,
    gdpPerCapita: 65000,
    population: 26.0,
    meanTemp: 21.5,
    squadValue: 55,
    isHost: false,
    continent: 'AFC',
    flag: '🇦🇺',
    averageAge: 27.9,
    physicalForm: 82,
    aggressiveness: 70,
    players: [
      { name: 'Mitchell Duke', position: 'DEL', age: 35, goals: 1, assists: 0, physicalForm: 78, scoringProb: 0.45, assistProb: 0.15, cardsProb: 0.42 },
      { name: 'Mathew Leckie', position: 'DEL', age: 35, goals: 0, assists: 1, physicalForm: 76, scoringProb: 0.38, assistProb: 0.30, cardsProb: 0.38 },
      { name: 'Jackson Irvine', position: 'MED', age: 33, goals: 1, assists: 0, physicalForm: 83, scoringProb: 0.30, assistProb: 0.28, cardsProb: 0.55 }
    ]
  },
  {
    id: 'TUR',
    name: 'Turquía',
    group: 'D',
    fifaRank: 26,
    fifaPoints: 1530,
    gdpPerCapita: 10600,
    population: 85.3,
    meanTemp: 11.5,
    squadValue: 320,
    isHost: false,
    continent: 'UEFA',
    flag: '🇹🇷',
    averageAge: 25.8,
    physicalForm: 83,
    aggressiveness: 72,
    players: [
      { name: 'K. Yildiz', position: 'DEL', age: 21, goals: 1, assists: 0, physicalForm: 85, scoringProb: 0.50, assistProb: 0.30, cardsProb: 0.28 },
      { name: 'H. Calhanoglu', position: 'MED', age: 32, goals: 1, assists: 1, physicalForm: 81, scoringProb: 0.45, assistProb: 0.55, cardsProb: 0.35 },
      { name: 'Arda Güler', position: 'MED', age: 21, goals: 0, assists: 1, physicalForm: 84, scoringProb: 0.42, assistProb: 0.48, cardsProb: 0.25 }
    ]
  },

  // GROUP E
  {
    id: 'GER',
    name: 'Alemania',
    group: 'E',
    fifaRank: 12, // Corrected ranking based on mock
    fifaPoints: 1665,
    gdpPerCapita: 52000,
    population: 83.2,
    meanTemp: 8.5,
    squadValue: 850,
    isHost: false,
    continent: 'UEFA',
    flag: '🇩🇪',
    averageAge: 26.8,
    physicalForm: 86,
    aggressiveness: 60,
    players: [
      { name: 'D. Undav', position: 'DEL', age: 29, goals: 3, assists: 2, physicalForm: 86, scoringProb: 0.65, assistProb: 0.45, cardsProb: 0.28 },
      { name: 'F. Wirtz', position: 'MED', age: 23, goals: 2, assists: 1, physicalForm: 92, scoringProb: 0.58, assistProb: 0.60, cardsProb: 0.22 },
      { name: 'Jamal Musiala', position: 'MED', age: 23, goals: 1, assists: 2, physicalForm: 90, scoringProb: 0.55, assistProb: 0.58, cardsProb: 0.20 }
    ]
  },
  {
    id: 'CUR',
    name: 'Curazao',
    group: 'E',
    fifaRank: 90,
    fifaPoints: 1235,
    gdpPerCapita: 21000,
    population: 0.15,
    meanTemp: 27.5,
    squadValue: 12,
    isHost: false,
    continent: 'CONCACAF',
    flag: '🇨🇼',
    averageAge: 28.6,
    physicalForm: 76,
    aggressiveness: 66,
    players: [
      { name: 'J. Bacuna', position: 'DEL', age: 28, goals: 1, assists: 0, physicalForm: 80, scoringProb: 0.48, assistProb: 0.25, cardsProb: 0.35 },
      { name: 'Kenji Gorré', position: 'DEL', age: 31, goals: 0, assists: 1, physicalForm: 74, scoringProb: 0.38, assistProb: 0.30, cardsProb: 0.28 },
      { name: 'V. Anita', position: 'MED', age: 37, goals: 0, assists: 0, physicalForm: 68, scoringProb: 0.15, assistProb: 0.22, cardsProb: 0.50 }
    ]
  },
  {
    id: 'CIV',
    name: 'Costa de Marfil',
    group: 'E',
    fifaRank: 38,
    fifaPoints: 1500,
    gdpPerCapita: 2500,
    population: 28.1,
    meanTemp: 26.0,
    squadValue: 320,
    isHost: false,
    continent: 'CAF',
    flag: '🇨🇮',
    averageAge: 26.5,
    physicalForm: 83,
    aggressiveness: 70,
    players: [
      { name: 'S. Haller', position: 'DEL', age: 31, goals: 2, assists: 0, physicalForm: 82, scoringProb: 0.62, assistProb: 0.18, cardsProb: 0.25 },
      { name: 'Simon Adingra', position: 'DEL', age: 24, goals: 1, assists: 1, physicalForm: 88, scoringProb: 0.50, assistProb: 0.38, cardsProb: 0.30 },
      { name: 'Franck Kessié', position: 'MED', age: 29, goals: 1, assists: 0, physicalForm: 85, scoringProb: 0.32, assistProb: 0.32, cardsProb: 0.52 }
    ]
  },
  {
    id: 'ECU',
    name: 'Ecuador',
    group: 'E',
    fifaRank: 30,
    fifaPoints: 1520,
    gdpPerCapita: 6300,
    population: 18.0,
    meanTemp: 21.0,
    squadValue: 280,
    isHost: false,
    continent: 'CONMEBOL',
    flag: '🇪🇨',
    averageAge: 25.2,
    physicalForm: 85,
    aggressiveness: 72,
    players: [
      { name: 'Enner Valencia', position: 'DEL', age: 36, goals: 2, assists: 0, physicalForm: 80, scoringProb: 0.58, assistProb: 0.15, cardsProb: 0.40 },
      { name: 'Kendry Páez', position: 'MED', age: 19, goals: 1, assists: 2, physicalForm: 90, scoringProb: 0.48, assistProb: 0.50, cardsProb: 0.28 },
      { name: 'Moisés Caicedo', position: 'MED', age: 24, goals: 0, assists: 1, physicalForm: 88, scoringProb: 0.25, assistProb: 0.42, cardsProb: 0.60 }
    ]
  },

  // GROUP F
  {
    id: 'NED',
    name: 'Países Bajos',
    group: 'F',
    fifaRank: 7,
    fifaPoints: 1745,
    gdpPerCapita: 62000,
    population: 17.8,
    meanTemp: 9.5,
    squadValue: 680,
    isHost: false,
    continent: 'UEFA',
    flag: '🇳🇱',
    averageAge: 26.5,
    physicalForm: 85,
    aggressiveness: 61,
    players: [
      { name: 'C. Gakpo', position: 'DEL', age: 27, goals: 3, assists: 1, physicalForm: 86, scoringProb: 0.65, assistProb: 0.35, cardsProb: 0.20 },
      { name: 'B. Brobbey', position: 'DEL', age: 24, goals: 2, assists: 0, physicalForm: 88, scoringProb: 0.58, assistProb: 0.20, cardsProb: 0.32 },
      { name: 'V. van Dijk', position: 'DEF', age: 34, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.28, assistProb: 0.15, cardsProb: 0.38 }
    ]
  },
  {
    id: 'JPN',
    name: 'Japón',
    group: 'F',
    fifaRank: 15, // Corrected ranking based on mock
    fifaPoints: 1622,
    gdpPerCapita: 34000,
    population: 125.1,
    meanTemp: 11.5,
    squadValue: 290,
    isHost: false,
    continent: 'AFC',
    flag: '🇯🇵',
    averageAge: 26.1,
    physicalForm: 87,
    aggressiveness: 54,
    players: [
      { name: 'K. Nakamura', position: 'DEL', age: 25, goals: 2, assists: 1, physicalForm: 86, scoringProb: 0.55, assistProb: 0.32, cardsProb: 0.22 },
      { name: 'T. Kubo', position: 'DEL', age: 25, goals: 1, assists: 1, physicalForm: 88, scoringProb: 0.50, assistProb: 0.45, cardsProb: 0.25 },
      { name: 'Kaoru Mitoma', position: 'DEL', age: 29, goals: 1, assists: 1, physicalForm: 84, scoringProb: 0.52, assistProb: 0.42, cardsProb: 0.20 }
    ]
  },
  {
    id: 'SWE',
    name: 'Suecia',
    group: 'F',
    fifaRank: 25, // Corrected ranking based on mock
    fifaPoints: 1530,
    gdpPerCapita: 56000,
    population: 10.5,
    meanTemp: 2.0,
    squadValue: 340,
    isHost: false,
    continent: 'UEFA',
    flag: '🇸🇪',
    averageAge: 25.9,
    physicalForm: 84,
    aggressiveness: 63,
    players: [
      { name: 'Alexander Isak', position: 'DEL', age: 26, goals: 3, assists: 0, physicalForm: 88, scoringProb: 0.68, assistProb: 0.25, cardsProb: 0.28 },
      { name: 'Viktor Gyökeres', position: 'DEL', age: 28, goals: 2, assists: 1, physicalForm: 90, scoringProb: 0.65, assistProb: 0.30, cardsProb: 0.35 },
      { name: 'D. Kulusevski', position: 'DEL', age: 26, goals: 1, assists: 2, physicalForm: 86, scoringProb: 0.45, assistProb: 0.50, cardsProb: 0.40 }
    ]
  },
  {
    id: 'TUN',
    name: 'Túnez',
    group: 'F',
    fifaRank: 41,
    fifaPoints: 1490,
    gdpPerCapita: 3800,
    population: 12.3,
    meanTemp: 19.5,
    squadValue: 45,
    isHost: false,
    continent: 'CAF',
    flag: '🇹🇳',
    averageAge: 28.2,
    physicalForm: 78,
    aggressiveness: 71,
    players: [
      { name: 'Y. Msakni', position: 'DEL', age: 35, goals: 1, assists: 0, physicalForm: 72, scoringProb: 0.45, assistProb: 0.20, cardsProb: 0.30 },
      { name: 'Elias Achouri', position: 'DEL', age: 27, goals: 0, assists: 1, physicalForm: 80, scoringProb: 0.38, assistProb: 0.35, cardsProb: 0.25 },
      { name: 'Ellyes Skhiri', position: 'MED', age: 31, goals: 0, assists: 0, physicalForm: 82, scoringProb: 0.20, assistProb: 0.30, cardsProb: 0.48 }
    ]
  },

  // GROUP G
  {
    id: 'BEL',
    name: 'Bélgica',
    group: 'G',
    fifaRank: 8, // Corrected ranking based on mock
    fifaPoints: 1790,
    gdpPerCapita: 54000,
    population: 11.7,
    meanTemp: 9.5,
    squadValue: 580,
    isHost: false,
    continent: 'UEFA',
    flag: '🇧🇪',
    averageAge: 27.1,
    physicalForm: 83,
    aggressiveness: 59,
    players: [
      { name: 'Romelu Lukaku', position: 'DEL', age: 33, goals: 3, assists: 0, physicalForm: 84, scoringProb: 0.70, assistProb: 0.20, cardsProb: 0.35 },
      { name: 'Kevin De Bruyne', position: 'MED', age: 34, goals: 1, assists: 3, physicalForm: 82, scoringProb: 0.45, assistProb: 0.72, cardsProb: 0.28 },
      { name: 'Jeremy Doku', position: 'DEL', age: 24, goals: 1, assists: 1, physicalForm: 89, scoringProb: 0.50, assistProb: 0.42, cardsProb: 0.30 }
    ]
  },
  {
    id: 'EGY',
    name: 'Egipto',
    group: 'G',
    fifaRank: 36,
    fifaPoints: 1502,
    gdpPerCapita: 3700,
    population: 110.9,
    meanTemp: 22.0,
    squadValue: 120,
    isHost: false,
    continent: 'CAF',
    flag: '🇪🇬',
    averageAge: 28.4,
    physicalForm: 82,
    aggressiveness: 64,
    players: [
      { name: 'Mohamed Salah', position: 'DEL', age: 34, goals: 3, assists: 1, physicalForm: 86, scoringProb: 0.75, assistProb: 0.45, cardsProb: 0.15 },
      { name: 'Mostafa Mohamed', position: 'DEL', age: 28, goals: 1, assists: 0, physicalForm: 83, scoringProb: 0.52, assistProb: 0.18, cardsProb: 0.38 },
      { name: 'Trézéguet', position: 'DEL', age: 31, goals: 1, assists: 1, physicalForm: 80, scoringProb: 0.45, assistProb: 0.30, cardsProb: 0.32 }
    ]
  },
  {
    id: 'IRN',
    name: 'Irán',
    group: 'G',
    fifaRank: 20,
    fifaPoints: 1610,
    gdpPerCapita: 4700,
    population: 88.5,
    meanTemp: 17.0,
    squadValue: 50,
    isHost: false,
    continent: 'AFC',
    flag: '🇮🇷',
    averageAge: 28.9,
    physicalForm: 80,
    aggressiveness: 72,
    players: [
      { name: 'Mehdi Taremi', position: 'DEL', age: 33, goals: 2, assists: 1, physicalForm: 82, scoringProb: 0.62, assistProb: 0.30, cardsProb: 0.40 },
      { name: 'Sardar Azmoun', position: 'DEL', age: 31, goals: 1, assists: 0, physicalForm: 80, scoringProb: 0.55, assistProb: 0.22, cardsProb: 0.35 },
      { name: 'A. Jahanbakhsh', position: 'DEL', age: 32, goals: 0, assists: 1, physicalForm: 78, scoringProb: 0.38, assistProb: 0.35, cardsProb: 0.42 }
    ]
  },
  {
    id: 'NZL',
    name: 'Nueva Zelanda',
    group: 'G',
    fifaRank: 104,
    fifaPoints: 1195,
    gdpPerCapita: 48000,
    population: 5.1,
    meanTemp: 10.5,
    squadValue: 25,
    isHost: false,
    continent: 'OFC',
    flag: '🇳🇿',
    averageAge: 27.0,
    physicalForm: 78,
    aggressiveness: 62,
    players: [
      { name: 'Chris Wood', position: 'DEL', age: 34, goals: 2, assists: 0, physicalForm: 82, scoringProb: 0.58, assistProb: 0.12, cardsProb: 0.25 },
      { name: 'K. Barbarouses', position: 'DEL', age: 36, goals: 0, assists: 1, physicalForm: 72, scoringProb: 0.32, assistProb: 0.25, cardsProb: 0.28 },
      { name: 'Marko Stamenic', position: 'MED', age: 24, goals: 0, assists: 0, physicalForm: 80, scoringProb: 0.18, assistProb: 0.28, cardsProb: 0.48 }
    ]
  },

  // GROUP H
  {
    id: 'ESP',
    name: 'España',
    group: 'H',
    fifaRank: 1, // Corrected ranking based on mock
    fifaPoints: 1820,
    gdpPerCapita: 33000,
    population: 47.6,
    meanTemp: 13.5,
    squadValue: 980,
    isHost: false,
    continent: 'UEFA',
    flag: '🇪🇸',
    averageAge: 24.9,
    physicalForm: 88,
    aggressiveness: 58,
    players: [
      { name: 'L. Yamal', position: 'DEL', age: 18, goals: 2, assists: 2, physicalForm: 92, scoringProb: 0.62, assistProb: 0.60, cardsProb: 0.22 },
      { name: 'Á. Morata', position: 'DEL', age: 33, goals: 1, assists: 0, physicalForm: 80, scoringProb: 0.58, assistProb: 0.20, cardsProb: 0.35 },
      { name: 'Pedri', position: 'MED', age: 23, goals: 0, assists: 2, physicalForm: 86, scoringProb: 0.32, assistProb: 0.58, cardsProb: 0.25 }
    ]
  },
  {
    id: 'CPV',
    name: 'Cabo Verde',
    group: 'H',
    fifaRank: 65,
    fifaPoints: 1380,
    gdpPerCapita: 3900,
    population: 0.6,
    meanTemp: 24.0,
    squadValue: 20,
    isHost: false,
    continent: 'CAF',
    flag: '🇨🇻',
    averageAge: 28.5,
    physicalForm: 77,
    aggressiveness: 68,
    players: [
      { name: 'Ryan Mendes', position: 'DEL', age: 36, goals: 1, assists: 0, physicalForm: 75, scoringProb: 0.45, assistProb: 0.22, cardsProb: 0.28 },
      { name: 'Garry Rodrigues', position: 'DEL', age: 35, goals: 0, assists: 1, physicalForm: 74, scoringProb: 0.38, assistProb: 0.30, cardsProb: 0.32 },
      { name: 'Bebé', position: 'DEL', age: 35, goals: 1, assists: 0, physicalForm: 70, scoringProb: 0.40, assistProb: 0.15, cardsProb: 0.35 }
    ]
  },
  {
    id: 'KSA',
    name: 'Arabia Saudita',
    group: 'H',
    fifaRank: 53,
    fifaPoints: 1435,
    gdpPerCapita: 30000,
    population: 36.4,
    meanTemp: 25.5,
    squadValue: 30,
    isHost: false,
    continent: 'AFC',
    flag: '🇸🇦',
    averageAge: 28.1,
    physicalForm: 79,
    aggressiveness: 65,
    players: [
      { name: 'Salem Al-Dawsari', position: 'DEL', age: 34, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.55, assistProb: 0.32, cardsProb: 0.30 },
      { name: 'Firas Al-Buraikan', position: 'DEL', age: 26, goals: 1, assists: 0, physicalForm: 81, scoringProb: 0.48, assistProb: 0.18, cardsProb: 0.22 },
      { name: 'Mohamed Kanno', position: 'MED', age: 31, goals: 0, assists: 1, physicalForm: 78, scoringProb: 0.25, assistProb: 0.30, cardsProb: 0.55 }
    ]
  },
  {
    id: 'URU',
    name: 'Uruguay',
    group: 'H',
    fifaRank: 17,
    fifaPoints: 1660,
    gdpPerCapita: 21000,
    population: 3.4,
    meanTemp: 17.5,
    squadValue: 480,
    isHost: false,
    continent: 'CONMEBOL',
    flag: '🇺🇾',
    averageAge: 26.2,
    physicalForm: 86,
    aggressiveness: 78,
    players: [
      { name: 'Darwin Núñez', position: 'DEL', age: 26, goals: 2, assists: 0, physicalForm: 88, scoringProb: 0.65, assistProb: 0.22, cardsProb: 0.45 },
      { name: 'F. Valverde', position: 'MED', age: 27, goals: 1, assists: 1, physicalForm: 92, scoringProb: 0.45, assistProb: 0.48, cardsProb: 0.38 },
      { name: 'R. Bentancur', position: 'MED', age: 28, goals: 0, assists: 1, physicalForm: 85, scoringProb: 0.28, assistProb: 0.38, cardsProb: 0.50 }
    ]
  },

  // GROUP I
  {
    id: 'FRA',
    name: 'Francia',
    group: 'I',
    fifaRank: 2,
    fifaPoints: 1845,
    gdpPerCapita: 45000,
    population: 68.0,
    meanTemp: 10.5,
    squadValue: 1040,
    isHost: false,
    continent: 'UEFA',
    flag: '🇫🇷',
    averageAge: 26.5,
    physicalForm: 87,
    aggressiveness: 61,
    players: [
      { name: 'K. Mbappé', position: 'DEL', age: 27, goals: 3, assists: 1, physicalForm: 92, scoringProb: 0.78, assistProb: 0.50, cardsProb: 0.25 },
      { name: 'O. Dembélé', position: 'DEL', age: 29, goals: 1, assists: 1, physicalForm: 85, scoringProb: 0.52, assistProb: 0.48, cardsProb: 0.32 },
      { name: 'M. Olise', position: 'DEL', age: 24, goals: 1, assists: 1, physicalForm: 86, scoringProb: 0.48, assistProb: 0.42, cardsProb: 0.20 }
    ]
  },
  {
    id: 'SEN',
    name: 'Senegal',
    group: 'I',
    fifaRank: 18,
    fifaPoints: 1625,
    gdpPerCapita: 1600,
    population: 17.3,
    meanTemp: 28.0,
    squadValue: 280,
    isHost: false,
    continent: 'CAF',
    flag: '🇸🇳',
    averageAge: 27.8,
    physicalForm: 82,
    aggressiveness: 70,
    players: [
      { name: 'Sadio Mané', position: 'DEL', age: 34, goals: 1, assists: 1, physicalForm: 80, scoringProb: 0.58, assistProb: 0.38, cardsProb: 0.30 },
      { name: 'Nicolas Jackson', position: 'DEL', age: 24, goals: 1, assists: 0, physicalForm: 85, scoringProb: 0.52, assistProb: 0.22, cardsProb: 0.38 },
      { name: 'I. Sarr', position: 'DEL', age: 28, goals: 1, assists: 1, physicalForm: 82, scoringProb: 0.45, assistProb: 0.35, cardsProb: 0.28 }
    ]
  },
  {
    id: 'IRQ',
    name: 'Irak',
    group: 'I',
    fifaRank: 55,
    fifaPoints: 1420,
    gdpPerCapita: 5900,
    population: 43.5,
    meanTemp: 22.0,
    squadValue: 15,
    isHost: false,
    continent: 'AFC',
    flag: '🇮🇶',
    averageAge: 25.5,
    physicalForm: 80,
    aggressiveness: 70,
    players: [
      { name: 'Ayman Hussein', position: 'DEL', age: 30, goals: 2, assists: 0, physicalForm: 82, scoringProb: 0.55, assistProb: 0.15, cardsProb: 0.35 },
      { name: 'Ali Jasim', position: 'MED', age: 22, goals: 0, assists: 1, physicalForm: 83, scoringProb: 0.38, assistProb: 0.45, cardsProb: 0.28 },
      { name: 'Z. Iqbal', position: 'MED', age: 23, goals: 0, assists: 0, physicalForm: 80, scoringProb: 0.30, assistProb: 0.38, cardsProb: 0.30 }
    ]
  },
  {
    id: 'NOR',
    name: 'Noruega',
    group: 'I',
    fifaRank: 22, // Corrected ranking based on mock
    fifaPoints: 1460,
    gdpPerCapita: 104000,
    population: 5.4,
    meanTemp: 1.5,
    squadValue: 450,
    isHost: false,
    continent: 'UEFA',
    flag: '🇳🇴',
    averageAge: 25.6,
    physicalForm: 84,
    aggressiveness: 62,
    players: [
      { name: 'E. Haaland', position: 'DEL', age: 25, goals: 4, assists: 0, physicalForm: 92, scoringProb: 0.82, assistProb: 0.18, cardsProb: 0.25 },
      { name: 'M. Ødegaard', position: 'MED', age: 27, goals: 0, assists: 2, physicalForm: 88, scoringProb: 0.35, assistProb: 0.65, cardsProb: 0.20 },
      { name: 'A. Sørloth', position: 'DEL', age: 30, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.50, assistProb: 0.22, cardsProb: 0.30 }
    ]
  },

  // GROUP J
  {
    id: 'ARG',
    name: 'Argentina',
    group: 'J',
    fifaRank: 3, // Corrected ranking based on mock
    fifaPoints: 1860,
    gdpPerCapita: 13700,
    population: 46.2,
    meanTemp: 14.5,
    squadValue: 800,
    isHost: false,
    continent: 'CONMEBOL',
    flag: '🇦🇷',
    averageAge: 27.5,
    physicalForm: 86,
    aggressiveness: 66,
    players: [
      { name: 'L. Messi', position: 'DEL', age: 39, goals: 4, assists: 1, physicalForm: 85, scoringProb: 0.78, assistProb: 0.55, cardsProb: 0.15 },
      { name: 'J. Álvarez', position: 'DEL', age: 26, goals: 1, assists: 0, physicalForm: 89, scoringProb: 0.58, assistProb: 0.30, cardsProb: 0.25 },
      { name: 'Lautaro Martínez', position: 'DEL', age: 28, goals: 2, assists: 0, physicalForm: 87, scoringProb: 0.62, assistProb: 0.25, cardsProb: 0.32 }
    ]
  },
  {
    id: 'ALG',
    name: 'Argelia',
    group: 'J',
    fifaRank: 32,
    fifaPoints: 1515,
    gdpPerCapita: 4300,
    population: 44.9,
    meanTemp: 22.5,
    squadValue: 190,
    isHost: false,
    continent: 'CAF',
    flag: '🇩🇿',
    averageAge: 27.9,
    physicalForm: 81,
    aggressiveness: 69,
    players: [
      { name: 'Baghdad Bounedjah', position: 'DEL', age: 34, goals: 1, assists: 0, physicalForm: 78, scoringProb: 0.55, assistProb: 0.15, cardsProb: 0.38 },
      { name: 'Riyad Mahrez', position: 'DEL', age: 35, goals: 0, assists: 1, physicalForm: 75, scoringProb: 0.48, assistProb: 0.45, cardsProb: 0.20 },
      { name: 'Houssem Aouar', position: 'MED', age: 27, goals: 1, assists: 1, physicalForm: 82, scoringProb: 0.35, assistProb: 0.38, cardsProb: 0.28 }
    ]
  },
  {
    id: 'AUT',
    name: 'Austria',
    group: 'J',
    fifaRank: 24, // Corrected ranking based on mock
    fifaPoints: 1550,
    gdpPerCapita: 57000,
    population: 9.1,
    meanTemp: 7.5,
    squadValue: 270,
    isHost: false,
    continent: 'UEFA',
    flag: '🇦🇹',
    averageAge: 26.6,
    physicalForm: 84,
    aggressiveness: 63,
    players: [
      { name: 'M. Sabitzer', position: 'MED', age: 32, goals: 1, assists: 0, physicalForm: 83, scoringProb: 0.45, assistProb: 0.38, cardsProb: 0.42 },
      { name: 'Konrad Laimer', position: 'MED', age: 29, goals: 0, assists: 1, physicalForm: 86, scoringProb: 0.28, assistProb: 0.35, cardsProb: 0.50 },
      { name: 'M. Arnautović', position: 'DEL', age: 37, goals: 0, assists: 0, physicalForm: 70, scoringProb: 0.42, assistProb: 0.22, cardsProb: 0.48 }
    ]
  },
  {
    id: 'JOR',
    name: 'Jordania',
    group: 'J',
    fifaRank: 71,
    fifaPoints: 1350,
    gdpPerCapita: 4300,
    population: 11.3,
    meanTemp: 18.0,
    squadValue: 15,
    isHost: false,
    continent: 'AFC',
    flag: '🇯🇴',
    averageAge: 27.2,
    physicalForm: 81,
    aggressiveness: 64,
    players: [
      { name: 'Mousa Al-Tamari', position: 'DEL', age: 28, goals: 1, assists: 0, physicalForm: 84, scoringProb: 0.50, assistProb: 0.28, cardsProb: 0.30 },
      { name: 'Yazan Al-Naimat', position: 'DEL', age: 26, goals: 0, assists: 1, physicalForm: 82, scoringProb: 0.45, assistProb: 0.20, cardsProb: 0.25 },
      { name: 'Ali Olwan', position: 'DEL', age: 26, goals: 0, assists: 0, physicalForm: 80, scoringProb: 0.38, assistProb: 0.18, cardsProb: 0.35 }
    ]
  },

  // GROUP K
  {
    id: 'POR',
    name: 'Portugal',
    group: 'K',
    fifaRank: 6,
    fifaPoints: 1755,
    gdpPerCapita: 26000,
    population: 10.3,
    meanTemp: 15.0,
    squadValue: 920,
    isHost: false,
    continent: 'UEFA',
    flag: '🇵🇹',
    averageAge: 26.8,
    physicalForm: 85,
    aggressiveness: 61,
    players: [
      { name: 'C. Ronaldo', position: 'DEL', age: 41, goals: 2, assists: 0, physicalForm: 82, scoringProb: 0.68, assistProb: 0.20, cardsProb: 0.30 },
      { name: 'B. Fernandes', position: 'MED', age: 31, goals: 1, assists: 2, physicalForm: 86, scoringProb: 0.45, assistProb: 0.65, cardsProb: 0.40 },
      { name: 'Rafael Leão', position: 'DEL', age: 26, goals: 1, assists: 0, physicalForm: 88, scoringProb: 0.52, assistProb: 0.38, cardsProb: 0.28 }
    ]
  },
  {
    id: 'JAM',
    name: 'Jamaica',
    group: 'K',
    fifaRank: 55,
    fifaPoints: 1422,
    gdpPerCapita: 5500,
    population: 2.8,
    meanTemp: 25.0,
    squadValue: 80,
    isHost: false,
    continent: 'CONCACAF',
    flag: '🇯🇲',
    averageAge: 27.4,
    physicalForm: 81,
    aggressiveness: 67,
    players: [
      { name: 'Michail Antonio', position: 'DEL', age: 36, goals: 1, assists: 0, physicalForm: 80, scoringProb: 0.48, assistProb: 0.15, cardsProb: 0.38 },
      { name: 'Leon Bailey', position: 'DEL', age: 28, goals: 0, assists: 1, physicalForm: 84, scoringProb: 0.45, assistProb: 0.35, cardsProb: 0.25 },
      { name: 'Bobby Decordova-Reid', position: 'MED', age: 33, goals: 0, assists: 0, physicalForm: 80, scoringProb: 0.28, assistProb: 0.28, cardsProb: 0.45 }
    ]
  },
  {
    id: 'UZB',
    name: 'Uzbekistán',
    group: 'K',
    fifaRank: 74, // Corrected ranking based on mock
    fifaPoints: 1386,
    gdpPerCapita: 2300,
    population: 36.0,
    meanTemp: 12.0,
    squadValue: 35,
    isHost: false,
    continent: 'AFC',
    flag: '🇺🇿',
    averageAge: 26.0,
    physicalForm: 82,
    aggressiveness: 63,
    players: [
      { name: 'E. Shomurodov', position: 'DEL', age: 30, goals: 1, assists: 0, physicalForm: 83, scoringProb: 0.50, assistProb: 0.18, cardsProb: 0.28 },
      { name: 'Abbosbek Fayzullaev', position: 'MED', age: 22, goals: 0, assists: 1, physicalForm: 85, scoringProb: 0.35, assistProb: 0.40, cardsProb: 0.22 },
      { name: 'Oston Urunov', position: 'MED', age: 25, goals: 0, assists: 0, physicalForm: 80, scoringProb: 0.30, assistProb: 0.25, cardsProb: 0.30 }
    ]
  },
  {
    id: 'COL',
    name: 'Colombia',
    group: 'K',
    fifaRank: 19, // Corrected ranking based on mock
    fifaPoints: 1670,
    gdpPerCapita: 6700,
    population: 51.5,
    meanTemp: 24.0,
    squadValue: 280,
    isHost: false,
    continent: 'CONMEBOL',
    flag: '🇨🇴',
    averageAge: 27.1,
    physicalForm: 84,
    aggressiveness: 74,
    players: [
      { name: 'Luis Díaz', position: 'DEL', age: 29, goals: 2, assists: 0, physicalForm: 88, scoringProb: 0.62, assistProb: 0.30, cardsProb: 0.35 },
      { name: 'James Rodríguez', position: 'MED', age: 34, goals: 1, assists: 3, physicalForm: 79, scoringProb: 0.40, assistProb: 0.65, cardsProb: 0.30 },
      { name: 'Jhon Durán', position: 'DEL', age: 22, goals: 1, assists: 0, physicalForm: 85, scoringProb: 0.50, assistProb: 0.18, cardsProb: 0.48 }
    ]
  },

  // GROUP L
  {
    id: 'ENG',
    name: 'Inglaterra',
    group: 'L',
    fifaRank: 4, // Corrected ranking based on mock
    fifaPoints: 1740,
    gdpPerCapita: 46000,
    population: 56.5,
    meanTemp: 8.5,
    squadValue: 1200,
    isHost: false,
    continent: 'UEFA',
    flag: '🏴\u200d󠁥󠁮󠁧󠁿',
    averageAge: 25.9,
    physicalForm: 85,
    aggressiveness: 59,
    players: [
      { name: 'Harry Kane', position: 'DEL', age: 32, goals: 3, assists: 0, physicalForm: 84, scoringProb: 0.76, assistProb: 0.30, cardsProb: 0.20 },
      { name: 'Bukayo Saka', position: 'DEL', age: 24, goals: 1, assists: 2, physicalForm: 88, scoringProb: 0.58, assistProb: 0.48, cardsProb: 0.22 },
      { name: 'Jude Bellingham', position: 'MED', age: 22, goals: 1, assists: 1, physicalForm: 90, scoringProb: 0.52, assistProb: 0.45, cardsProb: 0.42 }
    ]
  },
  {
    id: 'CRO',
    name: 'Croacia',
    group: 'L',
    fifaRank: 10, // Corrected ranking based on mock
    fifaPoints: 1730,
    gdpPerCapita: 20000,
    population: 3.9,
    meanTemp: 11.5,
    squadValue: 320,
    isHost: false,
    continent: 'UEFA',
    flag: '🇭🇷',
    averageAge: 28.5,
    physicalForm: 81,
    aggressiveness: 63,
    players: [
      { name: 'Andrej Kramarić', position: 'DEL', age: 34, goals: 2, assists: 0, physicalForm: 80, scoringProb: 0.55, assistProb: 0.22, cardsProb: 0.25 },
      { name: 'Luka Modrić', position: 'MED', age: 40, goals: 0, assists: 1, physicalForm: 74, scoringProb: 0.32, assistProb: 0.52, cardsProb: 0.30 },
      { name: 'Mateo Kovačić', position: 'MED', age: 32, goals: 0, assists: 1, physicalForm: 82, scoringProb: 0.25, assistProb: 0.38, cardsProb: 0.48 }
    ]
  },
  {
    id: 'GHA',
    name: 'Ghana',
    group: 'L',
    fifaRank: 60,
    fifaPoints: 1400,
    gdpPerCapita: 2200,
    population: 33.5,
    meanTemp: 27.0,
    squadValue: 250,
    isHost: false,
    continent: 'CAF',
    flag: '🇬🇭',
    averageAge: 25.4,
    physicalForm: 80,
    aggressiveness: 71,
    players: [
      { name: 'Inaki Williams', position: 'DEL', age: 31, goals: 1, assists: 0, physicalForm: 84, scoringProb: 0.52, assistProb: 0.20, cardsProb: 0.28 },
      { name: 'Mohammed Kudus', position: 'MED', age: 25, goals: 1, assists: 1, physicalForm: 86, scoringProb: 0.48, assistProb: 0.35, cardsProb: 0.32 },
      { name: 'Jordan Ayew', position: 'DEL', age: 34, goals: 0, assists: 0, physicalForm: 78, scoringProb: 0.38, assistProb: 0.28, cardsProb: 0.45 }
    ]
  },
  {
    id: 'PAN',
    name: 'Panamá',
    group: 'L',
    fifaRank: 43,
    fifaPoints: 1475,
    gdpPerCapita: 17000,
    population: 4.4,
    meanTemp: 27.0,
    squadValue: 22,
    isHost: false,
    continent: 'CONCACAF',
    flag: '🇵🇦',
    averageAge: 27.2,
    physicalForm: 81,
    aggressiveness: 69,
    players: [
      { name: 'José Fajardo', position: 'DEL', age: 32, goals: 1, assists: 0, physicalForm: 82, scoringProb: 0.48, assistProb: 0.15, cardsProb: 0.30 },
      { name: 'Adalberto Carrasquilla', position: 'MED', age: 27, goals: 0, assists: 1, physicalForm: 84, scoringProb: 0.32, assistProb: 0.42, cardsProb: 0.50 },
      { name: 'Yoel Bárcenas', position: 'DEL', age: 32, goals: 0, assists: 1, physicalForm: 80, scoringProb: 0.35, assistProb: 0.30, cardsProb: 0.25 }
    ]
  }
];

export const groupsList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;
export type GroupLetter = typeof groupsList[number];
