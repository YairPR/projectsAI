export interface HistoricalMatch {
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  winnerName: string;
  optaAnalysis: string;
}

export const historicalMatches: HistoricalMatch[] = [
  {
    homeTeamId: 'RSA',
    awayTeamId: 'KOR',
    homeGoals: 2,
    awayGoals: 1,
    winnerName: 'Sudáfrica',
    optaAnalysis: 'El modelo estadístico puro otorgaba a Corea del Sur un 43% de probabilidad de victoria debido a su mayor cotización en Transfermarkt (180M vs 50M) y ranking FIFA superior (22 vs 59). Sin embargo, Sudáfrica se impuso 2-1 gracias a una efectividad defensiva extrema. Según Opta, Corea del Sur generó un xG de 1.68 frente a 0.72 de Sudáfrica, pero la falta de contundencia de Son Heung-min y dos contraataques perfectos liderados por P. Tau cambiaron el destino del encuentro, superando la expectativa teórica.'
  },
  {
    homeTeamId: 'KOR',
    awayTeamId: 'RSA',
    homeGoals: 1,
    awayGoals: 2,
    winnerName: 'Sudáfrica',
    optaAnalysis: 'El modelo estadístico puro otorgaba a Corea del Sur un 43% de probabilidad de victoria debido a su mayor cotización en Transfermarkt (180M vs 50M) y ranking FIFA superior (22 vs 59). Sin embargo, Sudáfrica se impuso 2-1 gracias a una efectividad defensiva extrema. Según Opta, Corea del Sur generó un xG de 1.68 frente a 0.72 de Sudáfrica, pero la falta de contundencia de Son Heung-min y dos contraataques perfectos liderados por P. Tau cambiaron el destino del encuentro, superando la expectativa teórica.'
  },
  {
    homeTeamId: 'MEX',
    awayTeamId: 'DEN',
    homeGoals: 0,
    awayGoals: 2,
    winnerName: 'Dinamarca',
    optaAnalysis: 'Aunque México contaba con la ventaja de localía en el Estadio Azteca y el apoyo del público, Dinamarca impuso su disciplina defensiva y juego aéreo. El modelo estimaba un 48% a favor de México. Opta reportó que Dinamarca neutralizó por completo a Santiago Giménez y anotó dos goles a balón parado (xG de balón parado: 1.15), explotando las debilidades defensivas aéreas del equipo mexicano.'
  },
  {
    homeTeamId: 'DEN',
    awayTeamId: 'MEX',
    homeGoals: 2,
    awayGoals: 0,
    winnerName: 'Dinamarca',
    optaAnalysis: 'Aunque México contaba con la ventaja de localía en el Estadio Azteca y el apoyo del público, Dinamarca impuso su disciplina defensiva y juego aéreo. El modelo estimaba un 48% a favor de México. Opta reportó que Dinamarca neutralizó por completo a Santiago Giménez y anotó dos goles a balón parado (xG de balón parado: 1.15), explotando las debilidades defensivas aéreas del equipo mexicano.'
  },
  {
    homeTeamId: 'ITA',
    awayTeamId: 'SUI',
    homeGoals: 1,
    awayGoals: 1,
    winnerName: 'Empate',
    optaAnalysis: 'El modelo asignaba a Italia una probabilidad de victoria del 52% basada en el valor de su plantel (750M). El partido finalizó 1-1. Suiza limitó las transiciones italianas mediante una formación cerrada 5-4-1 que redujo el xG de Italia de un promedio habitual de 1.85 a tan solo 1.05. Además, la falla de un penal por parte de Scamacca en el minuto 84 frustró la victoria esperada por el modelo.'
  },
  {
    homeTeamId: 'SUI',
    awayTeamId: 'ITA',
    homeGoals: 1,
    awayGoals: 1,
    winnerName: 'Empate',
    optaAnalysis: 'El modelo asignaba a Italia una probabilidad de victoria del 52% basada en el valor de su plantel (750M). El partido finalizó 1-1. Suiza limitó las transiciones italianas mediante una formación cerrada 5-4-1 que redujo el xG de Italia de un promedio habitual de 1.85 a tan solo 1.05. Además, la falla de un penal por parte de Scamacca en el minuto 84 frustró la victoria esperada por el modelo.'
  }
];
