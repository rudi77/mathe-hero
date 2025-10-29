import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSubtopicById } from '@/types/dojoSubtopics';
import { MathEngine } from '@/lib/mathEngine';
import type { MathProblem } from '@/types/models';
import { motion } from 'framer-motion';

// Dojo Mode: No DB writes or rewards
// This component is intentionally isolated from the app context
// and does not persist any progress to the database.

export default function DojoPractice() {
  console.log('[DojoPractice] Component mounted');
  const [location, setLocation] = useLocation();
  console.log('[DojoPractice] Location:', location);

  // Problem state
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);

  // In-memory stats (not persisted)
  const [streak, setStreak] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract subtopic from query params - use window.location for query params
  const params = new URLSearchParams(window.location.search);
  const subtopicId = params.get('subtopic');
  console.log('[DojoPractice] Parsed subtopicId:', subtopicId);

  // Look up subtopic definition
  const subtopic = subtopicId ? getSubtopicById(subtopicId) : undefined;
  console.log('[DojoPractice] Found subtopic:', subtopic);

  // MathEngine instance
  const mathEngine = new MathEngine();

  // Generate new problem when component mounts or subtopic changes
  useEffect(() => {
    console.log('[DojoPractice] useEffect triggered', { subtopic, subtopicId });
    if (subtopic) {
      generateNewProblem();
    }
  }, [subtopic]);

  const generateNewProblem = () => {
    console.log('[DojoPractice] generateNewProblem called', { subtopic });
    if (!subtopic) {
      console.log('[DojoPractice] No subtopic, returning');
      return;
    }

    const { difficultyMin = 1, difficultyMax = 10, constraints } = subtopic.mathEngineParams;
    const difficulty = Math.random() * (difficultyMax - difficultyMin) + difficultyMin;

    let problem: MathProblem;

    // For addition/subtraction with maxNumber constraint, generate directly
    if (constraints?.maxNumber && (subtopic.topicId === 'addition' || subtopic.topicId === 'subtraction')) {
      const maxNumber = constraints.maxNumber;

      if (subtopic.topicId === 'addition') {
        // Generate addition within limits
        const a = Math.floor(Math.random() * maxNumber) + 1;
        const b = Math.floor(Math.random() * (maxNumber - a)) + 1; // Ensure sum <= maxNumber
        problem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          topic: 'addition',
          question: `${a} + ${b} = ?`,
          correctAnswer: a + b,
          difficulty,
          type: 'calculation',
        };
      } else {
        // Generate subtraction within limits
        const a = Math.floor(Math.random() * maxNumber) + 1;
        const b = Math.floor(Math.random() * a) + 1; // Ensure positive result
        problem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          topic: 'subtraction',
          question: `${a} - ${b} = ?`,
          correctAnswer: a - b,
          difficulty,
          type: 'calculation',
        };
      }
    } else {
      // Use MathEngine for other topics
      problem = mathEngine.generateProblem(subtopic.topicId, difficulty);
    }

    console.log('[DojoPractice] Problem generated', { problem });

    setCurrentProblem(problem);
    setUserAnswer('');
    setFeedback(null);
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentProblem || isProcessing || !userAnswer) return;

    setIsProcessing(true);

    // Check answer using MathEngine
    const isCorrect = mathEngine.checkAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: 'Richtig! 🎉',
      });
      setStreak(prev => prev + 1);
      setTotalSolved(prev => prev + 1);

      // Auto-generate next problem after correct answer
      setTimeout(() => {
        generateNewProblem();
      }, 2000);
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Nicht ganz. Die richtige Antwort ist ${currentProblem.correctAnswer}`,
      });
      setStreak(0); // Reset streak on incorrect answer
      setIsProcessing(false);
    }
  };

  const handleOptionSelect = (option: number | string) => {
    if (!currentProblem || isProcessing) return;

    setIsProcessing(true);
    const optionStr = String(option);

    // Check answer immediately for multiple choice
    const isCorrect = mathEngine.checkAnswer(currentProblem, optionStr);

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: 'Richtig! 🎉',
      });
      setStreak(prev => prev + 1);
      setTotalSolved(prev => prev + 1);

      // Auto-generate next problem after correct answer
      setTimeout(() => {
        generateNewProblem();
      }, 2000);
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Nicht ganz. Die richtige Antwort ist ${currentProblem.correctAnswer}`,
      });
      setStreak(0); // Reset streak on incorrect answer
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    setStreak(0); // Reset streak when skipping
    generateNewProblem();
  };

  const handleExit = () => {
    setLocation('/dojo');
  };

  // Handle Enter key for submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  // Show loading state if no subtopic or problem
  if (!subtopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg text-muted-foreground">Lädt Subtopic...</p>
          <p className="text-sm mt-4">SubtopicId: {subtopicId || 'none'}</p>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg text-muted-foreground">Generiere Aufgabe...</p>
          <p className="text-sm mt-4">Subtopic: {subtopic.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleExit}
            className="mb-4"
          >
            ← Zurück zum Dojo
          </Button>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                🥋 {subtopic.name}
              </h1>
              {subtopic.description && (
                <p className="text-lg text-muted-foreground">{subtopic.description}</p>
              )}
            </div>

            {/* In-memory stats */}
            <div className="flex gap-4">
              <Card className="p-3 bg-white/80 backdrop-blur">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{streak}</div>
                  <div className="text-xs text-muted-foreground">Serie</div>
                </div>
              </Card>
              <Card className="p-3 bg-white/80 backdrop-blur">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalSolved}</div>
                  <div className="text-xs text-muted-foreground">Gelöst</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Problem Card with animations */}
        <motion.div
          animate={
            feedback?.type === 'correct'
              ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
              : feedback?.type === 'incorrect'
              ? { x: [0, -10, 10, -10, 10, 0] }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          <Card className={`p-8 mb-6 transition-all duration-300 border-4 ${
            feedback?.type === 'correct'
              ? 'border-green-400 bg-green-50 shadow-xl shadow-green-200'
              : feedback?.type === 'incorrect'
              ? 'border-red-400 bg-red-50 shadow-xl shadow-red-200'
              : 'border-white bg-white/90 backdrop-blur'
          }`}>
            {/* Problem Question */}
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
                  onKeyDown={handleKeyDown}
                  placeholder="Deine Antwort..."
                  className="text-3xl text-center h-20 border-4"
                  autoFocus
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-xl h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                  disabled={!userAnswer || isProcessing}
                >
                  Antwort prüfen ✓
                </Button>
              </form>
            ) : (
              <div className="space-y-3">
                {currentProblem.options?.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    size="lg"
                    variant="outline"
                    className="w-full text-xl h-16 hover:bg-orange-100 hover:border-orange-400"
                    disabled={isProcessing}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Feedback Message */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg text-center font-semibold text-lg ${
                  feedback.type === 'correct'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {feedback.message}
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSkip}
            size="lg"
            variant="outline"
            className="flex-1 text-lg h-14"
            disabled={isProcessing}
          >
            Nächste Aufgabe →
          </Button>
          <Button
            onClick={handleExit}
            size="lg"
            variant="secondary"
            className="text-lg h-14 px-8"
          >
            Beenden
          </Button>
        </div>

        {/* Info Note */}
        <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800 text-center">
            ℹ️ Dojo-Modus: Dein Fortschritt wird nicht gespeichert. Übe in Ruhe ohne Belohnungen.
          </p>
        </Card>
      </div>
    </div>
  );
}
