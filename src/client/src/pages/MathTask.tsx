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

export default function MathTask() {
  const [, setLocation] = useLocation();
  const { userProgress, getDifficultyForTopic, setDifficultyForTopic, updateUserProgress, refreshStylingItems, refreshUserProgress } = useApp();
  
  const [topic, setTopic] = useState<MathTopic>('addition');
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState<StylingItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

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
    const difficulty = getDifficultyForTopic(topic);
    const problem = mathEngine.generateProblem(topic, difficulty);
    setCurrentProblem(problem);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[MathTask] handleSubmit called', { currentProblem, isSubmitting, userAnswer, userProgress });
    
    if (!currentProblem || isSubmitting) {
      console.log('[MathTask] Submit blocked:', { hasCurrentProblem: !!currentProblem, isSubmitting });
      return;
    }

    setIsSubmitting(true);

    const isCorrect = mathEngine.checkAnswer(currentProblem, userAnswer);
    console.log('[MathTask] Answer checked:', { isCorrect, userAnswer, correctAnswer: currentProblem.correctAnswer });
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      // Update progress
      const currentStreak = userProgress?.correctAnswersStreak || 0;
      const currentCorrect = userProgress?.totalCorrectAnswers || 0;
      const newStreak = currentStreak + 1;
      const newCorrect = currentCorrect + 1;
      const newDifficulty = mathEngine.adjustDifficulty(getDifficultyForTopic(topic), true);
      
      setDebugInfo(`BEFORE update: correct=${currentCorrect}, streak=${currentStreak}`);
      
      try {
        await updateUserProgress({
          correctAnswersStreak: newStreak,
          totalCorrectAnswers: newCorrect,
        });
        setDebugInfo(`AFTER update: newCorrect=${newCorrect}, newStreak=${newStreak}`);
      } catch (error) {
        setDebugInfo(`ERROR: ${error}`);
      }
      
      await setDifficultyForTopic(topic, newDifficulty);
      
      // Force refresh to ensure UI updates
      await refreshUserProgress();

      // Check for reward
      const reward = await rewardManager.checkAndUnlockRewards(newStreak);
      if (reward) {
        setUnlockedItem(reward);
        setShowReward(true);
        await refreshStylingItems();
      }

      toast.success('Richtig! 🎉', {
        description: `Super gemacht! ${newStreak} richtige Antworten in Folge. DEBUG: currentCorrect=${currentCorrect}, newCorrect=${newCorrect}, userProgress.totalCorrectAnswers=${userProgress?.totalCorrectAnswers}`,
      });

      // Generate next problem after delay
      setTimeout(() => {
        generateNewProblem();
        setIsSubmitting(false);
      }, 1500);
    } else {
      // Update progress
      const newDifficulty = mathEngine.adjustDifficulty(getDifficultyForTopic(topic), false);
      
      const currentIncorrect = userProgress?.totalIncorrectAnswers || 0;
      await updateUserProgress({
        correctAnswersStreak: 0,
        totalIncorrectAnswers: currentIncorrect + 1,
      });
      
      await setDifficultyForTopic(topic, newDifficulty);
      
      // Force refresh to ensure UI updates
      await refreshUserProgress();

      toast.error('Nicht ganz richtig', {
        description: 'Versuch es nochmal! Du schaffst das! 💪',
      });

      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = (option: number | string) => {
    setUserAnswer(String(option));
  };

  // Force component to use latest userProgress values
  const currentStreak = userProgress?.correctAnswersStreak || 0;
  const currentCorrect = userProgress?.totalCorrectAnswers || 0;
  const progressToNextUnlock = rewardManager.getProgressToNextUnlock(currentStreak);
  const unlockThreshold = rewardManager.getUnlockThreshold();
  const progressPercentage = (progressToNextUnlock / unlockThreshold) * 100;
  
  console.log('[MathTask] Render with stats:', { currentCorrect, currentStreak, userProgress });

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

        {/* Problem Card */}
        <Card className={`p-8 mb-6 transition-all duration-300 border-4 ${
          feedback === 'correct' 
            ? 'border-green-400 bg-green-50' 
            : feedback === 'incorrect' 
            ? 'border-red-400 bg-red-50' 
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
                    handleOptionSelect(option);
                    setTimeout(() => {
                      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
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

        {/* Debug Info */}
        <Card className="p-4 mb-4 bg-yellow-100">
          <div className="text-xs font-mono">
            <div>userProgress: {JSON.stringify(userProgress)}</div>
            <div>currentCorrect: {currentCorrect}</div>
            <div>currentStreak: {currentStreak}</div>
            <div className="mt-2 font-bold text-red-600">{debugInfo}</div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center bg-white/80 backdrop-blur">
            <div className="text-3xl font-bold text-green-600">
              {currentCorrect}
            </div>
            <div className="text-sm text-muted-foreground">Richtig</div>
          </Card>
          <Card className="p-4 text-center bg-white/80 backdrop-blur">
            <div className="text-3xl font-bold text-primary">
              {currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">Serie</div>
          </Card>
        </div>
      </div>

      {/* Reward Notification */}
      <RewardNotification
        isOpen={showReward}
        item={unlockedItem}
        onClose={() => setShowReward(false)}
      />
    </div>
  );
}

