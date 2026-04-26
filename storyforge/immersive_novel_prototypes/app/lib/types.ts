
export interface Prototype {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  theme: 'dark' | 'surreal' | 'warm' | 'mystery' | 'bright';
  style: 'linear' | 'nonlinear' | 'multi-pov' | 'ar-enhanced' | 'gamified';
  imageUrl: string;
  features: string[];
  estimatedTime: string;
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  choices?: Choice[];
  metadata?: {
    character?: string;
    location?: string;
    mood?: string;
    backgroundImage?: string;
    unlocked?: boolean;
    connections?: string[];
  };
}

export interface Choice {
  id: string;
  text: string;
  consequence?: string;
  nextSceneId?: string;
  metadata?: {
    impact?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    points?: number;
  };
}

export interface UserState {
  currentSceneId: string;
  choices: Record<string, string>;
  achievements: string[];
  progress: number;
  metadata: Record<string, any>;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  colorBlindMode: boolean;
  textToSpeech: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface FeedbackData {
  prototypeId: string;
  rating: number;
  categories: {
    engagement: number;
    usability: number;
    innovation: number;
    accessibility: number;
  };
  comment?: string;
  feedbackType: 'PROTOTYPE_SPECIFIC' | 'OVERALL_EXPERIENCE' | 'ACCESSIBILITY' | 'TECHNICAL_ISSUE';
}
