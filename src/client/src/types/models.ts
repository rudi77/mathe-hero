// Data models for Mathe-Stylistin

export interface StylingItem {
  id: string;
  type: 'color' | 'accessory' | 'effect';
  name: string;
  assetReference: string;
  isUnlocked: boolean;
  category?: string;
  // Default placement relative to character head in percent (0-100)
  defaultPosition?: { x: number; y: number };
  // Rendering size hint used by display component
  size?: 'small' | 'medium' | 'large';
}

export interface UserProgress {
  id: number;
  difficultyLevelAddition: number;
  difficultyLevelSubtraction: number;
  difficultyLevelMultiplication: number;
  difficultyLevelDivision: number;
  difficultyLevelGeometry: number;
  difficultyLevelSizes: number;
  correctAnswersStreak: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  lastSessionDate: string;
}

export type MathTopic =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'geometry'
  | 'sizes'
  | 'mixed';

export interface MathProblem {
  id: string;
  topic: MathTopic;
  question: string;
  correctAnswer: number | string;
  options?: (number | string)[];
  difficulty: number;
  type: 'calculation' | 'multipleChoice' | 'textProblem';
}

export interface AppliedStyling {
  itemId: string;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

export interface CharacterState {
  appliedItems: AppliedStyling[];
}

