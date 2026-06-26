export interface ScheduledMatch {
  time: string;
  hId: string;
  hFlag: string;
  hName: string;
  aId: string;
  aFlag: string;
  aName: string;
  note: string;
  desc: string; // for compatibility with MatchPredictor
  pHome: number;
  pDraw: number;
  pAway: number;
}

export const tournamentSchedule: Record<string, ScheduledMatch[]> = {
  "2026-06-25": [
    { time: "Finalizado · 2-1", hId: "ECU", hFlag: "🇪🇨", hName: "Ecuador", aId: "GER", aFlag: "🇩🇪", aName: "Alemania", note: "Grupo E · Finalizado", desc: "Grupo E · Finalizado", pHome: 24, pDraw: 34, pAway: 42 },
    { time: "Finalizado · 0-1", hId: "SUI", hFlag: "🇨🇭", hName: "Suiza", aId: "CAN", aFlag: "🇨🇦", aName: "Canadá", note: "Grupo B · Finalizado", desc: "Grupo B · Finalizado", pHome: 42, pDraw: 29, pAway: 29 },
    { time: "Finalizado · 0-2", hId: "CUR", hFlag: "🇨🇼", hName: "Curazao", aId: "CIV", aFlag: "🇨🇮", aName: "Costa de Marfil", note: "Grupo E · Finalizado", desc: "Grupo E · Finalizado", pHome: 15, pDraw: 22, pAway: 63 },
    { time: "Finalizado · 3-0", hId: "BRA", hFlag: "🇧🇷", hName: "Brasil", aId: "SCO", aFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", aName: "Escocia", note: "Grupo C · Finalizado", desc: "Grupo C · Finalizado", pHome: 72, pDraw: 18, pAway: 10 }
  ],
  "2026-06-26": [
    { time: "Hoy · 21:00h", hId: "NOR", hFlag: "🇳🇴", hName: "Noruega", aId: "FRA", aFlag: "🇫🇷", aName: "Francia", note: "Partidazo Grupo I", desc: "Partidazo Grupo I", pHome: 18, pDraw: 22, pAway: 60 },
    { time: "Hoy · 21:00h", hId: "SEN", hFlag: "🇸🇳", hName: "Senegal", aId: "IRQ", aFlag: "🇮🇶", aName: "Irak", note: "Definición Grupo I", desc: "Definición Grupo I", pHome: 52, pDraw: 28, pAway: 20 },
    { time: "Hoy · Finalizado", hId: "TUR", hFlag: "🇹🇷", hName: "Turquía", aId: "USA", aFlag: "🇺🇸", aName: "EE.UU.", note: "Grupo D · Final 3-2", desc: "Grupo D · Final 3-2", pHome: 42, pDraw: 24, pAway: 34 },
    { time: "Hoy · Finalizado", hId: "PAR", hFlag: "🇵🇾", hName: "Paraguay", aId: "AUS", aFlag: "🇦🇺", aName: "Australia", note: "Grupo D · Final 0-0", desc: "Grupo D · Final 0-0", pHome: 28, pDraw: 44, pAway: 28 },
    { time: "Hoy · Finalizado", hId: "JPN", hFlag: "🇯🇵", hName: "Japón", aId: "SWE", aFlag: "🇸🇪", aName: "Suecia", note: "Grupo F · Final 1-1", desc: "Grupo F · Final 1-1", pHome: 32, pDraw: 36, pAway: 32 },
    { time: "Hoy · Finalizado", hId: "TUN", hFlag: "🇹🇳", hName: "Túnez", aId: "NED", aFlag: "🇳🇱", aName: "Países Bajos", note: "Grupo F · Final 1-3", desc: "Grupo F · Final 1-3", pHome: 15, pDraw: 25, pAway: 60 }
  ],
  "2026-06-27": [
    { time: "Mañana · 18:00h", hId: "MEX", hFlag: "🇲🇽", hName: "México", aId: "DEN", aFlag: "🇩🇰", aName: "Dinamarca", note: "Partidazo Grupo A", desc: "Partidazo Grupo A", pHome: 48, pDraw: 27, pAway: 25 },
    { time: "Mañana · 18:00h", hId: "RSA", hFlag: "🇿🇦", hName: "Sudáfrica", aId: "KOR", aFlag: "🇰🇷", aName: "Corea del Sur", note: "Grupo A · Clave", desc: "Grupo A · Clave", pHome: 22, pDraw: 35, pAway: 43 },
    { time: "Mañana · 21:00h", hId: "ESP", hFlag: "🇪🇸", hName: "España", aId: "CPV", aFlag: "🇨🇻", aName: "Cabo Verde", note: "Grupo H · Estreno", desc: "Grupo H · Estreno", pHome: 80, pDraw: 15, pAway: 5 },
    { time: "Mañana · 21:00h", hId: "KSA", hFlag: "🇸🇦", hName: "Arabia Saudita", aId: "URU", aFlag: "🇺🇾", aName: "Uruguay", note: "Grupo H · Choque", desc: "Grupo H · Choque", pHome: 20, pDraw: 28, pAway: 52 },
    { time: "Mañana · 23:30h", hId: "ARG", hFlag: "🇦🇷", hName: "Argentina", aId: "ALG", aFlag: "🇩🇿", aName: "Argelia", note: "Grupo J · Debut Messi", desc: "Grupo J · Debut Messi", pHome: 70, pDraw: 20, pAway: 10 },
    { time: "Mañana · 23:30h", hId: "AUT", hFlag: "🇦🇹", hName: "Austria", aId: "JOR", aFlag: "🇯🇴", aName: "Jordania", note: "Grupo J · Nivelado", desc: "Grupo J · Nivelado", pHome: 45, pDraw: 30, pAway: 25 }
  ],
  "2026-06-28": [
    { time: "Domingo · 18:00h", hId: "POR", hFlag: "🇵🇹", hName: "Portugal", aId: "JAM", aFlag: "🇯🇲", aName: "Jamaica", note: "Grupo K · Estreno", desc: "Grupo K · Estreno", pHome: 75, pDraw: 18, pAway: 7 },
    { time: "Domingo · 18:00h", hId: "UZB", hFlag: "🇺🇿", hName: "Uzbekistán", aId: "COL", aFlag: "🇨🇴", aName: "Colombia", note: "Grupo K · Clave", desc: "Grupo K · Clave", pHome: 20, pDraw: 28, pAway: 52 },
    { time: "Domingo · 21:00h", hId: "ENG", hFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hName: "Inglaterra", aId: "CRO", aFlag: "🇭🇷", aName: "Croacia", note: "Partidazo Grupo L", desc: "Partidazo Grupo L", pHome: 55, pDraw: 25, pAway: 20 },
    { time: "Domingo · 21:00h", hId: "PAN", hFlag: "🇵🇦", hName: "Panamá", aId: "GHA", aFlag: "🇬🇭", aName: "Ghana", note: "Grupo L · Choque", desc: "Grupo L · Choque", pHome: 25, pDraw: 30, pAway: 45 },
    { time: "Domingo · 23:30h", hId: "BEL", hFlag: "🇧🇪", hName: "Bélgica", aId: "EGY", aFlag: "🇪🇬", aName: "Egipto", note: "Grupo G · Dinámico", desc: "Grupo G · Dinámico", pHome: 65, pDraw: 22, pAway: 13 },
    { time: "Domingo · 23:30h", hId: "IRN", hFlag: "🇮🇷", hName: "Irán", aId: "NZL", aFlag: "🇳🇿", aName: "Nueva Zelanda", note: "Grupo G · Nivelado", desc: "Grupo G · Nivelado", pHome: 40, pDraw: 32, pAway: 28 }
  ]
};
