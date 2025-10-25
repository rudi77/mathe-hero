// Data models for Mathe-Stylistin

export interface StylingItem {
  id: string;
  type: 'color' | 'accessory' | 'effect';
  name: string;
  assetReference: string;
  isUnlocked: boolean;
  category?: string;
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
  | 'sizes';

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

