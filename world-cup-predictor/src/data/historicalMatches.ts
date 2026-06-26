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
    homeGoals: 1,
    awayGoals: 0,
    winnerName: 'Sudáfrica',
    optaAnalysis: 'El modelo analítico proyectaba la victoria de Corea del Sur (43% de probabilidad y marcador sugerido de 0-1) debido a la jerarquía de Son Heung-min y su mayor ranking FIFA. Sin embargo, Sudáfrica dio la sorpresa ganando 1-0. De acuerdo con los datos de Opta, Corea dominó la posesión (58%) y generó un xG de 1.45 frente a un escaso 0.55 de Sudáfrica, pero la falta de contundencia de sus atacantes, sumada a un planteamiento ultra-defensivo de Sudáfrica en el segundo tiempo que bloqueó 5 remates clave en el área, inclinaron la balanza a favor del equipo africano.'
  },
  {
    homeTeamId: 'ECU',
    awayTeamId: 'GER',
    homeGoals: 2,
    awayGoals: 1,
    winnerName: 'Ecuador',
    optaAnalysis: 'El modelo analítico estimaba una victoria alemana (42% de probabilidad, marcador esperado 0-1) debido a la gran ventaja en ELO y valor de plantilla de Alemania. Sin embargo, Ecuador se impuso 2-1 en un partidazo histórico. Opta reportó que Ecuador anuló el mediocampo alemán con una presión asfixiante liderada por Moisés Caicedo, bloqueando las líneas de pase hacia Musiala. Ecuador anotó mediante transiciones verticales rápidas y capitalizó un tiro libre de Enner Valencia, mientras que Alemania, a pesar de tener un 62% de posesión, se mostró lenta en repliegues defensivos y sufrió dos desatenciones graves.'
  },
  {
    homeTeamId: 'GER',
    awayTeamId: 'ECU',
    homeGoals: 1,
    awayGoals: 2,
    winnerName: 'Ecuador',
    optaAnalysis: 'El modelo analítico estimaba una victoria alemana (42% de probabilidad, marcador esperado 0-1) debido a la gran ventaja en ELO y valor de plantilla de Alemania. Sin embargo, Ecuador se impuso 2-1 en un partidazo histórico. Opta reportó que Ecuador anuló el mediocampo alemán con una presión asfixiante liderada por Moisés Caicedo, bloqueando las líneas de pase hacia Musiala. Ecuador anotó mediante transiciones verticales rápidas y capitalizó un tiro libre de Enner Valencia, mientras que Alemania, a pesar de tener un 62% de posesión, se mostró lenta en repliegues defensivos y sufrió dos desatenciones graves.'
  },
  {
    homeTeamId: 'KOR',
    awayTeamId: 'RSA',
    homeGoals: 0,
    awayGoals: 1,
    winnerName: 'Sudáfrica',
    optaAnalysis: 'El modelo analítico proyectaba la victoria de Corea del Sur (43% de probabilidad y marcador sugerido de 0-1) debido a la jerarquía de Son Heung-min y su mayor ranking FIFA. Sin embargo, Sudáfrica dio la sorpresa ganando 1-0. De acuerdo con los datos de Opta, Corea dominó la posesión (58%) y generó un xG de 1.45 frente a un escaso 0.55 de Sudáfrica, pero la falta de contundencia de sus atacantes, sumada a un planteamiento ultra-defensivo de Sudáfrica en el segundo tiempo que bloqueó 5 remates clave en el área, inclinaron la balanza a favor del equipo africano.'
  },
  {
    homeTeamId: 'MEX',
    awayTeamId: 'DEN',
    homeGoals: 3,
    awayGoals: 0,
    winnerName: 'México',
    optaAnalysis: 'El modelo estimaba un partido cerrado con 48% a favor de México. El resultado real fue un contundente 3-0 para la selección mexicana. Santiago Giménez mostró una efectividad letal (anotando un doblete con solo 3 tiros directos), capitalizando un xG de balón parado de 1.25. Dinamarca sufrió notablemente por la altitud y la presión alta liderada por Edson Álvarez, lo que desmanteló su estructura defensiva clásica analizada en el ELO puro.'
  },
  {
    homeTeamId: 'DEN',
    awayTeamId: 'MEX',
    homeGoals: 0,
    awayGoals: 3,
    winnerName: 'México',
    optaAnalysis: 'El modelo estimaba un partido cerrado con 48% a favor de México. El resultado real fue un contundente 3-0 para la selección mexicana. Santiago Giménez mostró una efectividad letal (anotando un doblete con solo 3 tiros directos), capitalizando un xG de balón parado de 1.25. Dinamarca sufrió notablemente por la altitud y la presión alta liderada por Edson Álvarez, lo que desmanteló su estructura defensiva clásica analizada en el ELO puro.'
  },
  {
    homeTeamId: 'BRA',
    awayTeamId: 'SCO',
    homeGoals: 3,
    awayGoals: 0,
    winnerName: 'Brasil',
    optaAnalysis: 'El modelo proyectaba una cómoda victoria de Brasil (64% de probabilidad y marcador de 2-0). En la realidad se consolidó un 3-0 para la canarinha. Vinicius Jr. fue el jugador del partido con 6 regates completados y un gol en transición rápida. Escocia fue incapaz de generar peligro real debido al pressing brasileño, registrando un xG acumulado de apenas 0.18 frente al 2.34 generado por el ataque de Brasil.'
  },
  {
    homeTeamId: 'SCO',
    awayTeamId: 'BRA',
    homeGoals: 0,
    awayGoals: 3,
    winnerName: 'Brasil',
    optaAnalysis: 'El modelo proyectaba una cómoda victoria de Brasil (64% de probabilidad y marcador de 2-0). En la realidad se consolidó un 3-0 para la canarinha. Vinicius Jr. fue el jugador del partido con 6 regates completados y un gol en transición rápida. Escocia fue incapaz de generar peligro real debido al pressing brasileño, registrando un xG acumulado de apenas 0.18 frente al 2.34 generado por el ataque de Brasil.'
  },
  {
    homeTeamId: 'MAR',
    awayTeamId: 'HAI',
    homeGoals: 4,
    awayGoals: 2,
    winnerName: 'Marruecos',
    optaAnalysis: 'El modelo proyectaba una victoria controlada de Marruecos (70% de probabilidad y marcador de 2-0). Sin embargo, el partido terminó 4-2. Aunque la ofensiva marroquí liderada por En-Nesyri (2 goles) cumplió con las expectativas, la defensa sufrió en las transiciones rápidas creadas por Haití, encajando dos goles de contraataque directo que revelaron una desatención en la cobertura lateral.'
  },
  {
    homeTeamId: 'HAI',
    awayTeamId: 'MAR',
    homeGoals: 2,
    awayGoals: 4,
    winnerName: 'Marruecos',
    optaAnalysis: 'El modelo proyectaba una victoria controlada de Marruecos (70% de probabilidad y marcador de 2-0). Sin embargo, el partido terminó 4-2. Aunque la ofensiva marroquí liderada por En-Nesyri (2 goles) cumplió con las expectativas, la defensa sufrió en las transiciones rápidas creadas por Haití, encajando dos goles de contraataque directo que revelaron una desatención en la cobertura lateral.'
  }
];
