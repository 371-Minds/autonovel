
export const PROTOTYPES = [
  {
    id: 'digital-conspiracy',
    title: 'The Digital Conspiracy',
    subtitle: 'Linear Branching Thriller',
    description: 'A high-stakes tech thriller with stark visuals and immediate consequences for every choice.',
    theme: 'dark' as const,
    style: 'linear' as const,
    imageUrl: 'https://cdn.abacus.ai/images/26ed5478-271b-482e-881a-668bb488a405.png',
    features: ['Choice-based branching', 'Tense atmosphere', 'Immediate consequences', 'Dark minimalist design'],
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'fragments-memory',
    title: 'Fragments of Memory',
    subtitle: 'Nonlinear Philosophical Explorer',
    description: 'Explore consciousness and reality through dreamlike navigation and fragmented storytelling.',
    theme: 'surreal' as const,
    style: 'nonlinear' as const,
    imageUrl: 'https://cdn.abacus.ai/images/3e072ddf-3bd5-493f-9b73-0056dce3a78d.png',
    features: ['Map-based navigation', 'Abstract visuals', 'Philosophical themes', 'Non-linear exploration'],
    estimatedTime: '20-30 minutes'
  },
  {
    id: 'neighborhood-voices',
    title: 'Voices of the Neighborhood',
    subtitle: 'Multi-POV Community Drama',
    description: 'Experience community stories through multiple character perspectives with emotional depth.',
    theme: 'warm' as const,
    style: 'multi-pov' as const,
    imageUrl: 'https://cdn.abacus.ai/images/cb658abf-f360-4a0f-977b-fd7db7a6f2a5.png',
    features: ['Multiple viewpoints', 'Character relationships', 'Dialogue-heavy', 'Community focus'],
    estimatedTime: '25-35 minutes'
  },
  {
    id: 'hidden-truth',
    title: 'The Hidden Truth',
    subtitle: 'AR-Enhanced Mystery',
    description: 'Solve mysteries with interactive elements and AR mockups for enhanced investigation.',
    theme: 'mystery' as const,
    style: 'ar-enhanced' as const,
    imageUrl: 'https://cdn.abacus.ai/images/81f0c3d4-7ad2-43c2-8802-cb11f3a327d3.png',
    features: ['AR mockup elements', 'Interactive clues', 'Mystery solving', 'Hidden content'],
    estimatedTime: '30-40 minutes'
  },
  {
    id: 'quest-unity',
    title: 'The Quest for Unity',
    subtitle: 'Gamified Adventure',
    description: 'Embark on a hopeful adventure with achievements, puzzles, and adaptive soundtrack.',
    theme: 'bright' as const,
    style: 'gamified' as const,
    imageUrl: 'https://cdn.abacus.ai/images/c25e04a4-c584-4b25-b17b-5f63e70fa529.png',
    features: ['Achievement system', 'Puzzle elements', 'Adaptive soundtrack', 'Progress tracking'],
    estimatedTime: '40-60 minutes'
  }
];

export const THEME_STYLES = {
  dark: {
    primary: 'from-gray-900 to-black',
    secondary: 'from-gray-800 to-gray-900',
    accent: 'text-red-400',
    text: 'text-gray-100',
    card: 'bg-gray-900/50 border-gray-700',
  },
  surreal: {
    primary: 'from-purple-900 via-blue-900 to-purple-800',
    secondary: 'from-purple-800 to-blue-800',
    accent: 'text-purple-300',
    text: 'text-purple-100',
    card: 'bg-purple-900/30 border-purple-600/30',
  },
  warm: {
    primary: 'from-orange-100 to-yellow-100',
    secondary: 'from-orange-200 to-yellow-200',
    accent: 'text-orange-600',
    text: 'text-gray-800',
    card: 'bg-white/80 border-orange-200',
  },
  mystery: {
    primary: 'from-gray-800 via-gray-900 to-black',
    secondary: 'from-yellow-900/20 to-orange-900/20',
    accent: 'text-yellow-400',
    text: 'text-gray-200',
    card: 'bg-gray-800/50 border-yellow-600/30',
  },
  bright: {
    primary: 'from-blue-400 via-purple-400 to-pink-400',
    secondary: 'from-green-400 to-blue-400',
    accent: 'text-pink-600',
    text: 'text-gray-800',
    card: 'bg-white/90 border-blue-300',
  }
};

export const ACCESSIBILITY_SETTINGS = {
  fontSize: {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  },
  transitions: {
    normal: 'transition-all duration-300 ease-in-out',
    reduced: ''
  }
};
