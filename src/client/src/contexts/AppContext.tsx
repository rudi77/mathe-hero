import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { StylingItem, UserProgress, CharacterState, MathTopic } from '@/types/models';
import { db } from '@/lib/db';
import { initialStylingItems, initialUserProgress } from '@/lib/initialData';

interface AppContextType {
  stylingItems: StylingItem[];
  userProgress: UserProgress | null;
  characterState: CharacterState;
  isLoading: boolean;
  refreshStylingItems: () => Promise<void>;
  refreshUserProgress: () => Promise<void>;
  updateUserProgress: (updates: Partial<UserProgress>) => Promise<void>;
  updateCharacterState: (state: CharacterState) => Promise<void>;
  getDifficultyForTopic: (topic: MathTopic) => number;
  setDifficultyForTopic: (topic: MathTopic, difficulty: number) => Promise<void>;
  resetGame: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [stylingItems, setStylingItems] = useState<StylingItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [characterState, setCharacterState] = useState<CharacterState>({ appliedItems: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await db.init();
      
      // Check if data exists
      let items = await db.getAllStylingItems();
      let progress = await db.getUserProgress();
      let charState = await db.getCharacterState();

      // Initialize with default data if empty
      if (items.length === 0) {
        await db.saveStylingItems(initialStylingItems);
        items = initialStylingItems;
      }

      if (!progress) {
        await db.saveUserProgress(initialUserProgress);
        progress = initialUserProgress;
      }

      if (!charState) {
        charState = { appliedItems: [] };
        await db.saveCharacterState(charState);
      }

      setStylingItems(items);
      setUserProgress(progress);
      setCharacterState(charState);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStylingItems = useCallback(async () => {
    const items = await db.getAllStylingItems();
    setStylingItems(items);
  }, []);

  const refreshUserProgress = useCallback(async () => {
    const progress = await db.getUserProgress();
    if (progress) {
      // Create new object reference to ensure React detects change
      const newProgressRef = JSON.parse(JSON.stringify(progress));
      setUserProgress(newProgressRef);
    }
  }, []);

  const updateUserProgress = async (updates: Partial<UserProgress>) => {
    // Always merge against the LATEST persisted progress to avoid overwriting
    // fields with stale values when multiple updates happen back-to-back
    // (e.g., counters update followed by difficulty update).
    const persisted = await db.getUserProgress();
    const base = persisted ?? userProgress ?? initialUserProgress;

    // Ensure all fields always exist by layering initial defaults first
    const currentProgress: UserProgress = { ...initialUserProgress, ...base } as UserProgress;

    const updatedProgress: UserProgress = { ...currentProgress, ...updates, id: 1 } as UserProgress;

    await db.saveUserProgress(updatedProgress);

    // Read back from DB to ensure consistency and to get the transaction's final state
    const savedProgress = await db.getUserProgress();

    if (savedProgress) {
      // Create completely new object reference to ensure React detects change
      const newProgressRef = JSON.parse(JSON.stringify(savedProgress));
      setUserProgress(newProgressRef);
    }
  };

  const updateCharacterState = async (state: CharacterState) => {
    await db.saveCharacterState(state);
    setCharacterState(state);
  };

  const getDifficultyForTopic = (topic: MathTopic): number => {
    if (!userProgress) return 1;

    // 'mixed' is handled in MathTask by selecting a random concrete topic
    // This function should never receive 'mixed' as input
    const topicMap: Record<Exclude<MathTopic, 'mixed'>, keyof UserProgress> = {
      addition: 'difficultyLevelAddition',
      subtraction: 'difficultyLevelSubtraction',
      multiplication: 'difficultyLevelMultiplication',
      division: 'difficultyLevelDivision',
      geometry: 'difficultyLevelGeometry',
      sizes: 'difficultyLevelSizes',
    };

    return userProgress[topicMap[topic as Exclude<MathTopic, 'mixed'>]] as number;
  };

  const setDifficultyForTopic = async (topic: MathTopic, difficulty: number) => {
    if (!userProgress) return;

    // 'mixed' is handled in MathTask by selecting a random concrete topic
    // This function should never receive 'mixed' as input
    const topicMap: Record<Exclude<MathTopic, 'mixed'>, keyof UserProgress> = {
      addition: 'difficultyLevelAddition',
      subtraction: 'difficultyLevelSubtraction',
      multiplication: 'difficultyLevelMultiplication',
      division: 'difficultyLevelDivision',
      geometry: 'difficultyLevelGeometry',
      sizes: 'difficultyLevelSizes',
    };

    await updateUserProgress({ [topicMap[topic as Exclude<MathTopic, 'mixed'>]]: difficulty });
  };

  const resetGame = async () => {
    try {
      // Clear all IndexedDB stores
      await db.clearAllData();
      
      // Restore initial styling items
      await db.saveStylingItems(initialStylingItems);
      
      // Restore initial user progress
      await db.saveUserProgress(initialUserProgress);
      
      // Clear character state
      const emptyCharacterState: CharacterState = { appliedItems: [] };
      await db.saveCharacterState(emptyCharacterState);
      
      // Refresh state to reflect reset
      await refreshStylingItems();
      await refreshUserProgress();
      setCharacterState(emptyCharacterState);
    } catch (error) {
      console.error('Failed to reset game:', error);
      throw new Error('Fehler beim Zurücksetzen des Spiels. Bitte versuche es erneut.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        stylingItems,
        userProgress,
        characterState,
        isLoading,
        refreshStylingItems,
        refreshUserProgress,
        updateUserProgress,
        updateCharacterState,
        getDifficultyForTopic,
        setDifficultyForTopic,
        resetGame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

