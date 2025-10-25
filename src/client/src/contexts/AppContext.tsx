import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const refreshStylingItems = async () => {
    const items = await db.getAllStylingItems();
    setStylingItems(items);
  };

  const refreshUserProgress = async () => {
    const progress = await db.getUserProgress();
    if (progress) {
      setUserProgress(progress);
    }
  };

  const updateUserProgress = async (updates: Partial<UserProgress>) => {
    console.log('[AppContext] updateUserProgress called with:', updates);

    // If userProgress is null, load it first or use initial values
    const currentProgress = userProgress || initialUserProgress;
    console.log('[AppContext] currentProgress:', currentProgress);

    const updatedProgress = { ...currentProgress, ...updates, id: 1 };
    console.log('[AppContext] updatedProgress BEFORE save:', updatedProgress);

    await db.saveUserProgress(updatedProgress);
    console.log('[AppContext] DB save completed');

    // Read back from DB to ensure consistency
    const savedProgress = await db.getUserProgress();
    console.log('[AppContext] Progress read back from DB:', savedProgress);

    if (savedProgress) {
      // Create completely new object reference to ensure React detects change
      const newProgressRef = JSON.parse(JSON.stringify(savedProgress));
      setUserProgress(newProgressRef);
      console.log('[AppContext] setUserProgress called with NEW reference:', newProgressRef);
    }

    console.log('[AppContext] User progress updated successfully');
  };

  const updateCharacterState = async (state: CharacterState) => {
    await db.saveCharacterState(state);
    setCharacterState(state);
  };

  const getDifficultyForTopic = (topic: MathTopic): number => {
    if (!userProgress) return 1;
    
    const topicMap: Record<MathTopic, keyof UserProgress> = {
      addition: 'difficultyLevelAddition',
      subtraction: 'difficultyLevelSubtraction',
      multiplication: 'difficultyLevelMultiplication',
      division: 'difficultyLevelDivision',
      geometry: 'difficultyLevelGeometry',
      sizes: 'difficultyLevelSizes',
    };
    
    return userProgress[topicMap[topic]] as number;
  };

  const setDifficultyForTopic = async (topic: MathTopic, difficulty: number) => {
    if (!userProgress) return;
    
    const topicMap: Record<MathTopic, keyof UserProgress> = {
      addition: 'difficultyLevelAddition',
      subtraction: 'difficultyLevelSubtraction',
      multiplication: 'difficultyLevelMultiplication',
      division: 'difficultyLevelDivision',
      geometry: 'difficultyLevelGeometry',
      sizes: 'difficultyLevelSizes',
    };
    
    await updateUserProgress({ [topicMap[topic]]: difficulty });
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

