import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { mathEngine } from '@/lib/mathEngine';
import { rewardManager } from '@/lib/rewardManager';
import type { MathProblem, MathTopic, StylingItem } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RewardNotification from '@/components/RewardNotification';
import { toast } from 'sonner';
import { db } from '@/lib/db';
import { motion } from 'framer-motion';

// All possible concrete topics (excluding 'mixed')
export const ALL_TOPICS: Exclude<MathTopic, 'mixed'>[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'geometry',
  'sizes',
];

export function getRandomTopic(): Exclude<MathTopic, 'mixed'> {
  return ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];
}

export default function MathTask() {
  const [, setLocation] = useLocation();
  const { userProgress, getDifficultyForTopic, setDifficultyForTopic, updateUserProgress, refreshStylingItems, refreshUserProgress } = useApp();

  const [topic, setTopic] = useState<MathTopic>('addition');
  const [currentActualTopic, setCurrentActualTopic] = useState<Exclude<MathTopic, 'mixed'>>('addition'); // Tracks actual topic for mixed mode
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState<StylingItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayStats, setDisplayStats] = useState({ correct: 0, streak: 0 });

  // DISABLED: This useEffect was overwriting manual updates!
  // Update display stats whenever userProgress changes
  // useEffect(() => {
  //   if (userProgress) {
  //     console.log('[MathTask] userProgress changed, updating display:', userProgress);
  //     setDisplayStats({
  //       correct: userProgress.totalCorrectAnswers,
  //       streak: userProgress.correctAnswersStreak,
  //     });
  //   }
  // }, [userProgress]);

  // Initialize displayStats on mount from userProgress
  useEffect(() => {
    if (userProgress && displayStats.correct === 0 && displayStats.streak === 0) {
      console.log('[MathTask] INITIAL load - setting displayStats from userProgress:', userProgress);
      setDisplayStats({
        correct: userProgress.totalCorrectAnswers,
        streak: userProgress.correctAnswersStreak,
      });
    }
  }, [userProgress]); // Only runs once on initial load when both are 0

  useEffect(() => {
    // Get topic from URL
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get('topic') as MathTopic;
    if (topicParam) {
      setTopic(topicParam);
    }
  }, []);

  useEffect(() => {
    if (topic) {
      generateNewProblem();
    }
  }, [topic]);

  const generateNewProblem = () => {
    // For mixed mode, randomly select a topic
    const actualTopic = topic === 'mixed' ? getRandomTopic() : topic;
    setCurrentActualTopic(actualTopic);

    const difficulty = getDifficultyForTopic(actualTopic);
    const problem = mathEngine.generateProblem(actualTopic, difficulty);
    setCurrentProblem(problem);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent, submittedAnswer?: string) => {
    e.preventDefault();
    const answerToCheck = submittedAnswer ?? userAnswer;
    console.log('[MathTask] handleSubmit called', { currentProblem, isSubmitting, answerToCheck, userProgress });

    if (!currentProblem || isSubmitting) {
      console.log('[MathTask] Submit blocked:', { hasCurrentProblem: !!currentProblem, isSubmitting });
      return;
    }

    setIsSubmitting(true);

    const isCorrect = mathEngine.checkAnswer(currentProblem, answerToCheck);
    console.log('[MathTask] Answer checked:', { isCorrect, answerToCheck, correctAnswer: currentProblem.correctAnswer });
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      // Use displayStats as source of truth (it's always current)
      const currentStreak = displayStats.streak;
      const currentCorrect = displayStats.correct;
      const newStreak = currentStreak + 1;
      const newCorrect = currentCorrect + 1;
      // Use actual topic for difficulty adjustment (important for mixed mode)
      const newDifficulty = mathEngine.adjustDifficulty(getDifficultyForTopic(currentActualTopic), true);

      console.log('[MathTask] Updating from:', { currentStreak, currentCorrect }, 'to:', { newStreak, newCorrect });

      try {
        console.log('[MathTask] Updating progress...');
        await updateUserProgress({
          correctAnswersStreak: newStreak,
          totalCorrectAnswers: newCorrect,
        });

        // Update displayStats immediately for UI
        setDisplayStats({
          correct: newCorrect,
          streak: newStreak,
        });

        console.log('[MathTask] Progress updated:', { newCorrect, newStreak });
      } catch (error) {
        console.error('[MathTask] Error updating progress:', error);
      }

      // Update difficulty for the actual topic used (important for mixed mode)
      await setDifficultyForTopic(currentActualTopic, newDifficulty);

      // Check for reward
      const reward = await rewardManager.checkAndUnlockRewards(newStreak);
      if (reward) {
        setUnlockedItem(reward);
        setShowReward(true);
        await refreshStylingItems();
      }

      toast.success('Richtig! 🎉', {
        description: `Super gemacht! ${newStreak} richtige Antworten in Folge!`,
      });

      // Generate next problem after delay
      setTimeout(() => {
        generateNewProblem();
        setIsSubmitting(false);
      }, 1500);
    } else {
      // Read fresh values from DB for incorrect count only
      const freshProgress = await db.getUserProgress();
      // Use actual topic for difficulty adjustment (important for mixed mode)
      const newDifficulty = mathEngine.adjustDifficulty(getDifficultyForTopic(currentActualTopic), false);

      const currentIncorrect = freshProgress?.totalIncorrectAnswers ?? 0;
      await updateUserProgress({
        correctAnswersStreak: 0,
        totalIncorrectAnswers: currentIncorrect + 1,
      });

      // Reset streak, keep correct count
      setDisplayStats({
        correct: displayStats.correct,
        streak: 0,
      });

      // Update difficulty for the actual topic used (important for mixed mode)
      await setDifficultyForTopic(currentActualTopic, newDifficulty);

      toast.error('Nicht ganz richtig', {
        description: 'Versuch es nochmal! Du schaffst das! 💪',
      });

      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = (option: number | string) => {
    setUserAnswer(String(option));
  };

  // Use display stats from state
  const progressToNextUnlock = rewardManager.getProgressToNextUnlock(displayStats.streak);
  const unlockThreshold = rewardManager.getUnlockThreshold();
  const progressPercentage = (progressToNextUnlock / unlockThreshold) * 100;

  console.log('[MathTask] Render with stats:', {
    displayCorrect: displayStats.correct,
    displayStreak: displayStats.streak,
    userProgress,
  });

  if (!currentProblem) {
    return <div className="min-h-screen flex items-center justify-center">Lädt...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="container max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/topics')}
            className="mb-4"
          >
            ← Zurück zur Themenauswahl
          </Button>
          
          {/* Progress to next unlock */}
          <Card className="p-4 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Fortschritt zum nächsten Item:</span>
              <span className="text-sm font-bold text-primary">
                {progressToNextUnlock} / {unlockThreshold}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </Card>
        </div>

        {/* Problem Card with animations */}
        <motion.div
          animate={
            feedback === 'correct'
              ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
              : feedback === 'incorrect'
              ? { x: [0, -10, 10, -10, 10, 0] }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          <Card className={`p-8 mb-6 transition-all duration-300 border-4 ${
            feedback === 'correct'
              ? 'border-green-400 bg-green-50 shadow-xl shadow-green-200'
              : feedback === 'incorrect'
              ? 'border-red-400 bg-red-50 shadow-xl shadow-red-200'
              : 'border-white bg-white'
          }`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {currentProblem.question}
            </h2>
          </div>

          {/* Answer Input */}
          {currentProblem.type === 'calculation' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Deine Antwort..."
                className="text-3xl text-center h-20 border-4"
                autoFocus
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-xl h-16 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={!userAnswer || isSubmitting}
              >
                Antwort prüfen ✓
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              {currentProblem.options?.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    const optionStr = String(option);
                    handleOptionSelect(option);
                    // Pass the selected answer directly to avoid state race condition
                    setTimeout(() => {
                      handleSubmit({ preventDefault: () => {} } as React.FormEvent, optionStr);
                    }, 100);
                  }}
                  size="lg"
                  variant={userAnswer === String(option) ? 'default' : 'outline'}
                  className="w-full text-xl h-16"
                  disabled={isSubmitting}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
          </Card>
        </motion.div>


        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center bg-white/80 backdrop-blur">
            <div className="text-3xl font-bold text-green-600">
              {displayStats.correct}
            </div>
            <div className="text-sm text-muted-foreground">Richtig</div>
          </Card>
          <Card className="p-4 text-center bg-white/80 backdrop-blur">
            <div className="text-3xl font-bold text-primary">
              {displayStats.streak}
            </div>
            <div className="text-sm text-muted-foreground">Serie</div>
          </Card>
        </div>
      </div>

      {/* Reward Notification */}
      <RewardNotification
        isOpen={showReward}
        item={unlockedItem}
        onClose={() => {
          setShowReward(false);
          setLocation('/');
        }}
      />
    </div>
  );
}

