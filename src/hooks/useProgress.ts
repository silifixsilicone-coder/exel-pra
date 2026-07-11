"use client";

import { useState, useEffect } from 'react';
import { UserProgress, ExamResult } from '../types';

const STORAGE_KEY = 'path_excel_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  currentLessonId: 'excel-basics-1',
  completedLessonIds: [],
  completedQuestionIds: [],
  correctCount: 0,
  wrongCount: 0,
  questionStats: {},
  jobProjectStats: {},
  examResults: []
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading progress from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.error('Error saving progress to localStorage:', e);
    }
  };

  const updateLessonProgress = (lessonId: string, completed: boolean, nextLessonId?: string) => {
    const completedLessonIds = [...progress.completedLessonIds];
    if (completed && !completedLessonIds.includes(lessonId)) {
      completedLessonIds.push(lessonId);
    }
    
    saveProgress({
      ...progress,
      completedLessonIds,
      currentLessonId: nextLessonId || progress.currentLessonId
    });
  };

  const updateQuestionProgress = (questionId: string, isCorrect: boolean, lastFormula: string) => {
    const questionStats = { ...progress.questionStats };
    const completedQuestionIds = [...progress.completedQuestionIds];
    
    const existing = questionStats[questionId] || { attempts: 0, solved: false, lastFormula: '', isCorrect: false };
    
    const wasSolved = existing.solved;
    const isNowSolved = wasSolved || isCorrect;
    
    questionStats[questionId] = {
      attempts: existing.attempts + 1,
      solved: isNowSolved,
      lastFormula,
      isCorrect
    };

    if (isCorrect && !completedQuestionIds.includes(questionId)) {
      completedQuestionIds.push(questionId);
    }

    // Compute aggregate counts
    let correctCount = progress.correctCount;
    let wrongCount = progress.wrongCount;

    if (isCorrect) {
      // If they solved it now, increment correct count
      correctCount += 1;
    } else {
      // Increment wrong count
      wrongCount += 1;
    }

    saveProgress({
      ...progress,
      completedQuestionIds,
      questionStats,
      correctCount,
      wrongCount
    });
  };

  const updateJobProjectProgress = (projectId: string, completed: boolean) => {
    const jobProjectStats = { ...progress.jobProjectStats };
    const jobProjectsCompleted = progress.completedQuestionIds; // Just reuse arrays or keep simple metadata
    
    jobProjectStats[projectId] = {
      completed,
      lastUpdated: new Date().toISOString()
    };

    saveProgress({
      ...progress,
      jobProjectStats
    });
  };

  const addExamResult = (result: ExamResult) => {
    const examResults = [...progress.examResults];
    // Keep history of exams
    examResults.push(result);

    saveProgress({
      ...progress,
      examResults
    });
  };

  const resetProgress = () => {
    saveProgress(DEFAULT_PROGRESS);
  };

  // Helper computed properties
  const questionsSolved = progress.completedQuestionIds.length;
  const totalAttempts = progress.correctCount + progress.wrongCount;
  
  // Scoring formula: Overall Score = Correct Answers ÷ Questions Solved * 100
  // Wait! The user says:
  // "Overall Score = Correct Answers ÷ Questions Solved × 100"
  // E.g. solved = 20, correct = 17, wrong = 3, accuracy = 85%, Overall Score = 85 / 100
  // If no questions are solved, it defaults to 100 or 0.
  const correctAttempts = progress.correctCount; // total correct clicks
  const wrongAttempts = progress.wrongCount;
  
  // Calculate accuracy: Correct Clicks / Total Clicks
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
  const overallScore = accuracy; // out of 100

  return {
    progress,
    isLoaded,
    updateLessonProgress,
    updateQuestionProgress,
    updateJobProjectProgress,
    addExamResult,
    resetProgress,
    metrics: {
      questionsSolved,
      correctAttempts,
      wrongAttempts,
      totalAttempts,
      accuracy,
      overallScore
    }
  };
}
