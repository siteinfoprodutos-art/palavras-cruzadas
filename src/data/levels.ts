import { LevelConfig, PremiumPackInfo, ThemeId, ThemeInfo } from '../types/game';

export const THEMES: Record<ThemeId, ThemeInfo> = {
  animais: {
    id: 'animais',
    name: 'Animais',
    icon: '🐶',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-700',
  },
  frutas: {
    id: 'frutas',
    name: 'Frutas',
    icon: '🍎',
    color: 'rose',
    gradient: 'from-rose-500 to-red-700',
  },
  paises: {
    id: 'paises',
    name: 'Países',
    icon: '🇧🇷',
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-700',
  },
  profissoes: {
    id: 'profissoes',
    name: 'Profissões',
    icon: '💼',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-700',
  },
  futebol: {
    id: 'futebol',
    name: 'Futebol',
    icon: '⚽',
    color: 'green',
    gradient: 'from-green-500 to-emerald-800',
  },
  comida: {
    id: 'comida',
    name: 'Comida',
    icon: '🍔',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-700',
  },
  astronomia: {
    id: 'astronomia',
    name: 'Astronomia',
    icon: '🌌',
    color: 'purple',
    gradient: 'from-purple-600 to-indigo-900',
  },
  musica: {
    id: 'musica',
    name: 'Música',
    icon: '🎸',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-700',
  },
  natureza: {
    id: 'natureza',
    name: 'Natureza',
    icon: '🌲',
    color: 'lime',
    gradient: 'from-lime-600 to-green-800',
  },
  tecnologia: {
    id: 'tecnologia',
    name: 'Tecnologia',
    icon: '🎮',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-700',
  },
  // Premium Themes:
  biblia: {
    id: 'biblia',
    name: 'Bíblia Sagrada',
    icon: '📖',
    color: 'amber',
    gradient: 'from-amber-600 to-yellow-800',
    isPremium: true,
  },
  cidades: {
    id: 'cidades',
    name: 'Cidades do Brasil',
    icon: '🏙️',
    color: 'sky',
    gradient: 'from-sky-500 to-blue-700',
    isPremium: true,
  },
  novelas: {
    id: 'novelas',
    name: 'Novelas Famosas',
    icon: '📺',
    color: 'fuchsia',
    gradient: 'from-fuchsia-600 to-pink-800',
    isPremium: true,
  },
  marcas: {
    id: 'marcas',
    name: 'Marcas Famosas',
    icon: '🏷️',
    color: 'violet',
    gradient: 'from-violet-600 to-purple-800',
    isPremium: true,
  },
};

export const WORD_SEARCH_COLORS = [
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#d97706', // Yellow-Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#e11d48', // Red
];

// Banco de 40 palavras sem acento (4 a 10 letras) para cada tema
export const THEME_WORD_BANKS: Record<ThemeId, string[]> = {
  animais: [
    'GATO', 'LEAO', 'URSO', 'LOBO', 'PUMA', 'ZEBRA', 'TIGRE', 'PEIXE', 'COBRA', 'POLVO',
    'BALEIA', 'MACACO', 'GIRAFA', 'COELHO', 'CORUJA', 'CAVALO', 'JACARE', 'AGUIA', 'GAVIAO', 'CASTOR',
    'RAPOSA', 'FALCAO', 'PANTERA', 'TUBARAO', 'CANGURU', 'ESQUILO', 'GOLFINHO', 'ELEFANTE', 'LEOPARDO', 'CAMALEAO',
    'FLAMINGO', 'CAPIVARA', 'CACHORRO', 'PAPAGAIO', 'ANACONDA', 'MARIPOSA', 'TARTARUGA', 'HIPOPOTAMO', 'SURICATO', 'PREGUICA'
  ],
  frutas: [
    'MACA', 'PERA', 'CAJU', 'FIGO', 'LIMA', 'KIWI', 'JACA', 'ROMA', 'AMORA', 'MANGA',
    'MELAO', 'CACAU', 'MAMAO', 'CAQUI', 'AMEIXA', 'GOIABA', 'BANANA', 'PITAYA', 'CEREJA', 'MARMELO',
    'NESPERA', 'DAMASCO', 'GUARANA', 'FISALIS', 'ABACATE', 'ABACAXI', 'ACEROLA', 'LARANJA', 'MORANGO', 'PITANGA',
    'GRAVIOLA', 'MELANCIA', 'MARACUJA', 'CARAMBOLA', 'FRAMBOESA', 'TANGERINA', 'SERIGUELA', 'NECTARINA', 'TUPINAMBA', 'JABUTICABA'
  ],
  paises: [
    'PERU', 'CUBA', 'CHAD', 'MALI', 'CHILE', 'JAPAO', 'EGITO', 'CHINA', 'INDIA', 'SUICA',
    'BRASIL', 'MEXICO', 'CANADA', 'PANAMA', 'ANGOLA', 'GRECIA', 'RUSSIA', 'ITALIA', 'FRANCA', 'VIETNA',
    'SUECIA', 'ESPANHA', 'URUGUAI', 'EQUADOR', 'BOLIVIA', 'NORUEGA', 'CROACIA', 'POLONIA', 'BELGICA', 'HUNGRIA',
    'ALEMANHA', 'PORTUGAL', 'COLOMBIA', 'MARROCOS', 'ISLANDIA', 'ARGENTINA', 'AUSTRALIA', 'TAILANDIA', 'FINLANDIA', 'DINAMARCA'
  ],
  profissoes: [
    'ATOR', 'JUIZ', 'CHEFE', 'POETA', 'PADRE', 'PILOTO', 'MEDICO', 'PINTOR', 'ATLETA', 'FISCAL',
    'CANTOR', 'MUSICO', 'PADEIRO', 'QUIMICO', 'BIOLOGO', 'GEOLOGO', 'REPORTE', 'DENTISTA', 'BOMBEIRO', 'POLICIAL',
    'ADVOGADO', 'CARTEIRO', 'BARBEIRO', 'MECANICO', 'ESCRITOR', 'BANCARIO', 'ESCULTOR', 'DETETIVE', 'DESIGNER', 'CIRURGIAO',
    'PROFESSOR', 'ARQUITETO', 'CIENTISTA', 'DIPLOMATA', 'PSICOLOGO', 'MOTORISTA', 'ASTRONOMO', 'FOTOGRAFO', 'ENGENHEIRO', 'JORNALISTA'
  ],
  futebol: [
    'BOLA', 'TIME', 'JOGO', 'REDE', 'TIRO', 'COPA', 'APITO', 'CHUTE', 'PASSE', 'TRAVA',
    'DRIBLE', 'CAMISA', 'GOLACO', 'CARTAO', 'CANETA', 'CHAPEU', 'PLACAR', 'TECNICO', 'ARBITRO', 'PENALTI',
    'ESTADIO', 'TORCIDA', 'CAPITAO', 'SELECAO', 'VOLANTE', 'CAMPEAO', 'GANDULA', 'TITULAR', 'RESERVA', 'GOLEIRO',
    'VITORIA', 'ZAGUEIRO', 'ATACANTE', 'CARRINHO', 'BANDEIRA', 'CABECADA', 'CHUTEIRA', 'MARACANA', 'ESCANTEIO', 'DELEGACAO'
  ],
  comida: [
    'SOPA', 'BOLO', 'SUCO', 'TACO', 'ARROZ', 'PIZZA', 'PUDIM', 'SUSHI', 'LEITE', 'QUEIJO',
    'FAROFA', 'PASTEL', 'RISOTO', 'PAELLA', 'FONDUE', 'BATATA', 'SALADA', 'ESFIHA', 'PIPOCA', 'EMPADA',
    'TAPIOCA', 'MOQUECA', 'COXINHA', 'LASANHA', 'CHURROS', 'SORVETE', 'CEVICHE', 'OMELETE', 'BEIJINHO', 'FEIJOADA',
    'MACARRAO', 'EMPANADA', 'PANQUECA', 'BISCOITO', 'CHURRASCO', 'GUACAMOLE', 'CROISSANT', 'BRIGADEIRO', 'HAMBURGUER', 'STROGANOFF'
  ],
  astronomia: [
    'SOL', 'LUA', 'TERRA', 'MARTE', 'ORBITA', 'COMETA', 'ESTRELA', 'GALAXIA', 'METEORITO', 'ASTEROIDE',
    'SATELITE', 'NEBULOSA', 'BURACO', 'QUASAR', 'SUPERNOVA', 'VACTO', 'ATMOSFERA', 'PLANETA', 'TELESCOPIO', 'UNIVERSO',
    'GRAVIDADE', 'ECLIPSE', 'COSMOS', 'CONSTELACAO', 'ASTRONOMIA', 'EXPANSAO', 'SUPERGRAVIDADE', 'PLANETOIDE', 'MAGNETAR', 'EXOPLANETA',
    'POERIRA', 'AURORA', 'PHOTON', 'RADICACAO', 'SOLAR', 'LUNAR', 'VENUS', 'JUPITER', 'SATURNO', 'URANO'
  ],
  musica: [
    'ROCK', 'PIANO', 'RITMO', 'SAMBA', 'VIOLAO', 'FLAUTA', 'CANCAO', 'BATERIA', 'VIOLINO', 'GUITARRA',
    'ACORDE', 'MAESTRO', 'MELODIA', 'PARTITURA', 'MICROFONE', 'ACORDEAO', 'ORQUESTRA', 'SINFONIA', 'PALCO', 'CORAL',
    'TENOR', 'BAIXO', 'SOLO', 'TURNÊ', 'ACUSTICO', 'BANDA', 'POP', 'JAZZ', 'REPOSTA', 'BATIDA',
    'HARMONIA', 'DISCO', 'ALBUM', 'MUSICA', 'TECLADO', 'SAXOFONE', 'ROMA', 'OPERA', 'COMPOSITOR', 'REFRÃO'
  ],
  natureza: [
    'PRAIA', 'ARVORE', 'OCEANO', 'DESERTO', 'FLORESTA', 'MONTANHA', 'CACHOEIRA', 'VULCAO', 'TROVAO', 'PRIMAVERA',
    'FURACAO', 'NEBLINA', 'GEADA', 'TERREMOTO', 'AURORA', 'LAGO', 'RIO', 'VALE', 'ROCHAS', 'NUVEM',
    'VENTO', 'CHUVA', 'MAR', 'ILHA', 'CAMPO', 'SELVA', 'FLORA', 'FAUNA', 'SOL', 'FOLHAS',
    'NEVE', 'GRUTA', 'COLINA', 'ECOSSISTEMA', 'BIOMA', 'MINERAL', 'PANTANAL', 'SAVANA', 'CANYON', 'NASCENTE'
  ],
  tecnologia: [
    'DADOS', 'REDES', 'NUVEM', 'PIXEL', 'CODIGO', 'CELULAR', 'CONSOLE', 'AVATAR', 'MEMORIA', 'SERVIDOR',
    'INTERNET', 'HARDWARE', 'SOFTWARE', 'ROBOTICA', 'CONEXAO', 'ALGORITMO', 'PROCESSADOR', 'SEGURANCA', 'COMPUTADOR', 'CHIP',
    'TELA', 'TECLADO', 'MOUSE', 'MONITOR', 'WIFI', 'BYTE', 'CABO', 'ROUTER', 'BIT', 'DISCO',
    'PAINEL', 'CAMERA', 'AUDIO', 'SISTEMA', 'PROGRAMA', 'APLICATIVO', 'SITE', 'MODEM', 'SENHA', 'REDE'
  ],
  // Premium Word Banks
  biblia: [
    'MOISES', 'DAVID', 'GENESIS', 'SALMOS', 'JESUS', 'BIBLIA', 'SALOMAO', 'PROFETA', 'ARCA', 'MILAGRE',
    'ANJO', 'FE', 'PARABOLA', 'EDEN', 'EVANGELHO', 'APOSTOLO', 'CRISTO', 'ALIANCA', 'TEMPLO', 'PASTOR',
    'MATEUS', 'ISAIAS', 'ABRAHAO', 'DANIEL', 'JOSE', 'MARIA', 'PEDRO', 'PAULO', 'REINO', 'GRACA',
    'LUZ', 'ORACAO', 'LOUVOR', 'BATISMO', 'COMUNHAO', 'ESPIRITO', 'SACRIFICIO', 'JERUSALEM', 'AMEM', 'CANTA'
  ],
  cidades: [
    'SAO PAULO', 'RIO', 'BRASILIA', 'SALVADOR', 'FORTALEZA', 'RECIFE', 'CURITIBA', 'MANAUS', 'BELEM', 'GOIANIA',
    'CAMPINAS', 'MACEIO', 'NATAL', 'TERESINA', 'ARACAJU', 'CUIABA', 'PALMAS', 'MACAPA', 'SOBRAL', 'SANTOS',
    'NITEROI', 'OLINDA', 'GRAMADO', 'HORIZONTE', 'PETROPOLIS', 'UBERLANDIA', 'LONDRINA', 'MARINGA', 'JOINVILLE', 'BLUMENAU',
    'VITORIA', 'CASCAVEL', 'CANELA', 'ANAPOLIS', 'CARUARU', 'CAMPINA', 'FRANCA', 'SOROCABA', 'OSASCO', 'BETIM'
  ],
  novelas: [
    'ROQUE', 'PANTANAL', 'MALHACAO', 'TIETA', 'GABRIELA', 'VALE TUDO', 'CLONE', 'CELEBRIDADE', 'SENHORA', 'IMPERIO',
    'REVOLUCAO', 'CORACAO', 'RENASCER', 'ANJO MAU', 'SUAVE', 'TORRE', 'VAMP', 'TOP MODEL', 'PAIXAO', 'AMOR',
    'PASSIONE', 'CAMINHO', 'FINO', 'SANGUE', 'CARAS', 'ESPELHO', 'CHOCOLATE', 'CRAVO', 'SELVA', 'TITITI',
    'BANG', 'MANIA', 'AMERICA', 'FEITICO', 'REINO', 'VEREDA', 'SARAMANDA', 'POR AMOR', 'BAILA', 'AGUA VIVA'
  ],
  marcas: [
    'NATURA', 'HAVAIANAS', 'PETROBRAS', 'AMBEV', 'NUBANK', 'ITAU', 'BRADESCO', 'MAGALU', 'EMBRAER', 'TRAMONTINA',
    'KIBON', 'SADIA', 'PERDIGAO', 'BOTICARIO', 'PILAO', 'YPE', 'BOMBRIL', 'TOYOTA', 'COCA', 'NIKE',
    'ADIDAS', 'NESTLE', 'SAMSUNG', 'APPLE', 'FIAT', 'CHEVROLET', 'PEPSI', 'HONDA', 'SONY', 'LG',
    'HYUNDAI', 'RENAULT', 'MOTOROLA', 'NETFLIX', 'GOOGLE', 'SPOTIFY', 'DISNEY', 'PUMA', 'CORONA', 'STELLA'
  ],
};

export const PREMIUM_PACKS: PremiumPackInfo[] = [
  {
    id: 'biblia',
    name: 'Bíblia Sagrada',
    icon: '📖',
    description: 'Palavras marcantes do Antigo e Novo Testamento, profetas, parábolas e versículos.',
    coinPrice: 200,
    realPriceText: 'R$ 4,90',
    sampleWords: ['MOISES', 'DAVID', 'JESUS', 'MILAGRE', 'PARABOLA', 'EVANGELHO', 'APOSTOLO', 'JERUSALEM'],
  },
  {
    id: 'cidades',
    name: 'Cidades do Brasil',
    icon: '🏙️',
    description: 'Capitais e grandes municípios turísticos e históricos de todo o Brasil.',
    coinPrice: 200,
    realPriceText: 'R$ 4,90',
    sampleWords: ['SAO PAULO', 'BRASILIA', 'SALVADOR', 'CURITIBA', 'MANAUS', 'RECIFE', 'GRAMADO', 'PETROPOLIS'],
  },
  {
    id: 'novelas',
    name: 'Novelas Famosas',
    icon: '📺',
    description: 'Sucessos Inesquecíveis da TV brasileira, clássicos e grandes produções.',
    coinPrice: 200,
    realPriceText: 'R$ 4,90',
    sampleWords: ['PANTANAL', 'ROQUE', 'TIETA', 'VALE TUDO', 'CLONE', 'CELEBRIDADE', 'RENASCER', 'CHOCOLATE'],
  },
  {
    id: 'marcas',
    name: 'Marcas Famosas',
    icon: '🏷️',
    description: 'Marcas brasileiras e globais consagradas que fazem parte do nosso dia a dia.',
    coinPrice: 200,
    realPriceText: 'R$ 4,90',
    sampleWords: ['HAVAIANAS', 'PETROBRAS', 'NUBANK', 'TRAMONTINA', 'SAMSUNG', 'APPLE', 'NATURA', 'SPOTIFY'],
  },
];

/**
 * Sorteia 10 palavras do tema sem repetir as palavras usadas na fase anterior
 */
export function getRandomWordsForTheme(themeId: ThemeId, previousWords: string[] = []): string[] {
  const bank = THEME_WORD_BANKS[themeId] || THEME_WORD_BANKS.animais;
  
  const normPrevious = previousWords.map((w) =>
    w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
  );

  let available = bank.filter((w) => {
    const norm = w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    return !normPrevious.includes(norm);
  });

  if (available.length < 10) {
    available = [...bank];
  }

  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 10);
}

export const LEVELS: LevelConfig[] = Array.from({ length: 30 }, (_, index) => {
  const levelId = index + 1;
  const themeIds: ThemeId[] = ['animais', 'frutas', 'paises', 'profissoes', 'futebol', 'comida'];
  const themeId = themeIds[index % themeIds.length];
  const theme = THEMES[themeId];

  let gridSize = 9;
  let allowDiagonal = false;
  let allowBackward = false;

  if (levelId <= 5) {
    gridSize = 9;
    allowDiagonal = true;
    allowBackward = false;
  } else if (levelId <= 15) {
    gridSize = 10;
    allowDiagonal = true;
    allowBackward = false;
  } else if (levelId <= 25) {
    gridSize = 11;
    allowDiagonal = true;
    allowBackward = true;
  } else {
    gridSize = 12;
    allowDiagonal = true;
    allowBackward = true;
  }

  return {
    id: levelId,
    themeId,
    themeName: `${theme.name} - Nível ${Math.floor(index / 6) + 1}`,
    gridSize,
    words: THEME_WORD_BANKS[themeId].slice(0, 10),
    allowDiagonal,
    allowBackward,
    timeLimitSeconds: 120 + Math.floor(levelId / 5) * 15,
  };
});
