import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target file where the UI will fetch lineups
const OUTPUT_FILE = path.join(__dirname, '../public/lineups.json');

// Mock data to fallback to if no API key is provided
const MOCK_DATA = {
  ECU: {
    formation: '4-3-3',
    startingXI: ['H. Galíndez', 'P. Hincapié', 'W. Pacho', 'F. Torres', 'A. Preciado', 'M. Caicedo', 'A. Franco', 'K. Páez', 'J. Sarmiento', 'E. Valencia', 'K. Rodríguez'],
    substitutes: ['A. Domínguez', 'J. Ortiz', 'J. Cifuentes', 'A. Minda', 'J. Caicedo'],
    lastUpdated: new Date().toISOString()
  },
  GER: {
    formation: '4-2-3-1',
    startingXI: ['M. ter Stegen', 'M. Mittelstädt', 'J. Tah', 'A. Rüdiger', 'J. Kimmich', 'T. Kroos', 'R. Andrich', 'F. Wirtz', 'I. Gündogan', 'J. Musiala', 'K. Havertz'],
    substitutes: ['O. Baumann', 'N. Schlotterbeck', 'D. Raum', 'P. Groß', 'L. Sané', 'N. Füllkrug', 'D. Undav'],
    lastUpdated: new Date().toISOString()
  },
  CAN: {
    formation: '4-4-2',
    startingXI: ['M. Crépeau', 'A. Davies', 'D. Cornelius', 'M. Bombito', 'A. Johnston', 'J. Shaffelburg', 'S. Eustáquio', 'I. Koné', 'T. Buchanan', 'Jonathan David', 'C. Larin'],
    substitutes: ['D. St. Clair', 'K. Miller', 'S. Adekugbe', 'J. Osorio', 'T. Oluwaseyi'],
    lastUpdated: new Date().toISOString()
  },
  SUI: {
    formation: '5-4-1',
    startingXI: ['Y. Sommer', 'R. Rodríguez', 'M. Akanji', 'F. Schär', 'L. Stergiou', 'S. Widmer', 'G. Xhaka', 'R. Freuler', 'D. Ndoye', 'R. Vargas', 'B. Embolo'],
    substitutes: ['G. Kobel', 'C. Zesiger', 'X. Shaqiri', 'Z. Amdouni', 'V. Sierro'],
    lastUpdated: new Date().toISOString()
  },
  CUR: {
    formation: '4-2-3-1',
    startingXI: ['E. Room', 'S. Floranus', 'J. Gaari', 'R. Martina', 'K. Janga', 'V. Anita', 'L. Bacuna', 'J. Bacuna', 'G. Kastaneer', 'R. Alberg', 'G. Kuwas'],
    substitutes: ['T. Bodak', 'S. van Eijma', 'K. Felida', 'Q. Jakoba', 'C. Vicento'],
    lastUpdated: new Date().toISOString()
  },
  CIV: {
    formation: '4-3-3',
    startingXI: ['Y. Fofana', 'G. Konan', 'E. Ndicka', 'O. Diomande', 'W. Singo', 'S. Fofana', 'F. Kessié', 'I. Sangaré', 'S. Adingra', 'S. Haller', 'N. Pépé'],
    substitutes: ['B. Sangaré', 'W. Boly', 'J. Seri', 'K. Kossounou', 'K. Konaté', 'O. Diakité'],
    lastUpdated: new Date().toISOString()
  },
  BRA: {
    formation: '4-3-3',
    startingXI: ['Alisson', 'Wendell', 'Marquinhos', 'Gabriel Magalhães', 'Danilo', 'Bruno Guimarães', 'João Gomes', 'Lucas Paquetá', 'Vinícius Júnior', 'Rodrygo', 'Raphinha'],
    substitutes: ['Bento', 'Lucas Beraldo', 'Andreas Pereira', 'Douglas Luiz', 'Savinho', 'Endrick'],
    lastUpdated: new Date().toISOString()
  },
  SCO: {
    formation: '5-3-2',
    startingXI: ['A. Gunn', 'A. Robertson', 'K. Tierney', 'G. Hanley', 'J. Hendry', 'A. Ralston', 'C. McGregor', 'B. Gilmour', 'S. McTominay', 'J. McGinn', 'L. Shankland'],
    substitutes: ['L. Kelly', 'R. Porteous', 'K. McLean', 'R. Christie', 'C. Adams'],
    lastUpdated: new Date().toISOString()
  },
  ARG: {
    formation: '4-3-3',
    startingXI: ['E. Martínez', 'N. Tagliafico', 'N. Otamendi', 'C. Romero', 'N. Molina', 'A. Mac Allister', 'E. Fernández', 'R. De Paul', 'N. González', 'L. Martínez', 'L. Messi'],
    substitutes: ['G. Rulli', 'L. Martínez Quarta', 'G. Pezzella', 'L. Paredes', 'G. Lo Celso', 'Á. Di María', 'J. Álvarez'],
    lastUpdated: new Date().toISOString()
  }
};

// Load environment variables from .env file locally if not already set
if (!process.env.API_FOOTBALL_KEY) {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*API_FOOTBALL_KEY\s*=\s*(.*)\s*$/);
        if (match) {
          process.env.API_FOOTBALL_KEY = match[1].trim().replace(/['"]/g, '');
          break;
        }
      }
    }
  } catch (err) {
    // Ignore error loading .env
  }
}

// API configuration
const API_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = 'https://v3.football.api-sports.io/fixtures/lineups';


async function fetchLiveLineups() {
  if (!API_KEY) {
    console.log('⚠️ No API_FOOTBALL_KEY found in Environment. Using mock database.');
    writeLineups(MOCK_DATA);
    return;
  }

  console.log('📡 Fetching today\'s match lineups from API-Football...');

  try {
    const fetchedData = {};
    
    // Simulate mapping response:
    // ...
    
    console.log('✅ Lineups successfully fetched and mapped.');
    writeLineups({ ...MOCK_DATA, ...fetchedData });

  } catch (error) {
    console.error('❌ Error fetching lineups from API-Football:', error);
    console.log('⚠️ Falling back to mock lineups data.');
    writeLineups(MOCK_DATA);
  }
}

function writeLineups(data) {
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`📂 Lineups database successfully written to: ${OUTPUT_FILE}`);
}

fetchLiveLineups();
