// Test data factories for creating test objects
import type { StylingItem, UserProgress, MathProblem, CharacterState, AppliedStyling } from '@/types/models';

/**
 * Factory function to create a StylingItem with default or custom values
 */
export function createStylingItem(overrides?: Partial<StylingItem>): StylingItem {
  return {
    id: 'test-item-1',
    type: 'color',
    name: 'Test Color',
    assetReference: '#FF0000',
    isUnlocked: false,
    category: 'colors',
    ...overrides,
  };
}

/**
 * Factory function to create multiple StylingItems
 */
export function createStylingItems(count: number, overrides?: Partial<StylingItem>): StylingItem[] {
  return Array.from({ length: count }, (_, index) =>
    createStylingItem({
      id: `test-item-${index + 1}`,
      name: `Test Item ${index + 1}`,
      ...overrides,
    })
  );
}

/**
 * Factory function to create a UserProgress with default or custom values
 */
export function createUserProgress(overrides?: Partial<UserProgress>): UserProgress {
  return {
    id: 1,
    difficultyLevelAddition: 1,
    difficultyLevelSubtraction: 1,
    difficultyLevelMultiplication: 1,
    difficultyLevelDivision: 1,
    difficultyLevelGeometry: 1,
    difficultyLevelSizes: 1,
    correctAnswersStreak: 0,
    totalCorrectAnswers: 0,
    totalIncorrectAnswers: 0,
    lastSessionDate: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Factory function to create a MathProblem with default or custom values
 */
export function createMathProblem(overrides?: Partial<MathProblem>): MathProblem {
  return {
    id: 'test-problem-1',
    topic: 'addition',
    question: '5 + 3 = ?',
    correctAnswer: 8,
    difficulty: 1,
    type: 'calculation',
    ...overrides,
  };
}

/**
 * Factory function to create a CharacterState with default or custom values
 */
export function createCharacterState(overrides?: Partial<CharacterState>): CharacterState {
  return {
    appliedItems: [],
    ...overrides,
  };
}

/**
 * Factory function to create an AppliedStyling with default or custom values
 */
export function createAppliedStyling(overrides?: Partial<AppliedStyling>): AppliedStyling {
  return {
    itemId: 'test-item-1',
    position: { x: 50, y: 50 },
    scale: 1,
    rotation: 0,
    ...overrides,
  };
}

/**
 * Create a complete set of test items matching initial data structure
 */
export function createInitialTestItems(): StylingItem[] {
  return [
    // Unlocked colors
    createStylingItem({
      id: 'color-pink',
      type: 'color',
      name: 'Rosa',
      assetReference: '#FFB6C1',
      isUnlocked: true,
      category: 'colors',
    }),
    createStylingItem({
      id: 'color-blue',
      type: 'color',
      name: 'Blau',
      assetReference: '#87CEEB',
      isUnlocked: true,
      category: 'colors',
    }),
    // Locked color
    createStylingItem({
      id: 'color-purple',
      type: 'color',
      name: 'Lila',
      assetReference: '#DDA0DD',
      isUnlocked: false,
      category: 'colors',
    }),
    // Unlocked accessory
    createStylingItem({
      id: 'accessory-glasses-1',
      type: 'accessory',
      name: 'Coole Brille',
      assetReference: '🕶️',
      isUnlocked: true,
      category: 'accessories',
    }),
    // Locked accessories
    createStylingItem({
      id: 'accessory-hat-1',
      type: 'accessory',
      name: 'Partyhut',
      assetReference: '🎉',
      isUnlocked: false,
      category: 'accessories',
    }),
    createStylingItem({
      id: 'accessory-crown',
      type: 'accessory',
      name: 'Krone',
      assetReference: '👑',
      isUnlocked: false,
      category: 'accessories',
    }),
  ];
}
