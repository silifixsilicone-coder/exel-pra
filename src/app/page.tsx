"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight, 
  Lightbulb, 
  BookOpen, 
  AlertTriangle,
  Award,
  BookMarked
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import Spreadsheet from '@/components/shared/Spreadsheet';
import { practiceQuestionsData } from '@/data/practiceQuestions';
import { lessonsData } from '@/data/lessons';
import { SpreadsheetState, Question } from '@/types';
import { evaluateFormula } from '@/utils/formulaEvaluator';

export default function Dashboard() {
  const { progress, isLoaded, updateQuestionProgress, metrics } = useProgress();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  // Spreadsheet state for the active question
  const [sheetState, setSheetState] = useState<SpreadsheetState | null>(null);
  
  // Feedback overlay states
  const [evaluationResult, setEvaluationResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    userFormula: string;
    expectedFormula: string;
    reason?: string;
  } | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // 1. Find the first unsolved practice question or default to Q1
  useEffect(() => {
    if (!isLoaded) return;

    let targetQ = practiceQuestionsData[0];
    const completedIds = progress.completedQuestionIds || [];
    
    // Find first question in the data that is not completed
    const unsolved = practiceQuestionsData.find(q => !completedIds.includes(q.id));
    if (unsolved) {
      targetQ = unsolved;
    }

    setCurrentQuestion(targetQ);
    // Deep copy initial grid so we don't mutate static data
    setSheetState(JSON.parse(JSON.stringify(targetQ.initialGrid)));
    
    // Reset feedback states
    setEvaluationResult(null);
    setShowHint(false);
    setShowSolution(false);
  }, [isLoaded, progress.completedQuestionIds]);

  if (!isLoaded || !currentQuestion || !sheetState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading practice environment...</span>
        </div>
      </div>
    );
  }

  // Handle cell grid changes
  const handleGridChange = (newState: SpreadsheetState) => {
    setSheetState(newState);
  };

  // Find next lesson to study based on progress
  const nextLessonId = progress.currentLessonId || 'excel-basics-1';
  const currentLesson = lessonsData.find(l => l.id === nextLessonId) || lessonsData[0];

  // Calculate lesson progress percentage
  const totalLessonsCount = lessonsData.length;
  const completedLessonsCount = progress.completedLessonIds.length;
  const lessonProgressPercent = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  // Grade user's answer
  const handleCheckAnswer = () => {
    if (!sheetState || !currentQuestion) return;

    const targetCellKey = currentQuestion.targetCell.toUpperCase();
    const cell = sheetState.cells[targetCellKey];
    
    const userValue = cell ? cell.value.trim() : '';
    const userComputed = cell ? evaluateFormula(cell.value, sheetState.cells) : '';

    // Must start with = and match the formulas pattern or match expected values
    const isFormula = userValue.startsWith('=');
    const normalizedFormula = userValue.replace(/\s+/g, '').toUpperCase();
    
    // Check if entered formula matches any of the accepted formulas
    const isFormulaMatch = currentQuestion.expectedFormulas.some(f => {
      const normalizedExpected = f.replace(/\s+/g, '').toUpperCase();
      return normalizedFormula === normalizedExpected;
    });

    // Check if the computed value is equal to expected value
    const isValueMatch = String(userComputed).toLowerCase() === String(currentQuestion.expectedValue).toLowerCase();

    // Overall correctness condition
    const isCorrect = isFormula && (isFormulaMatch || isValueMatch);

    let reason = '';
    if (!isFormula) {
      reason = 'Your input does not start with an "=" sign. Excel formulas must always begin with an equals sign.';
    } else if (!isFormulaMatch && !isValueMatch) {
      reason = `We evaluated your formula to "${userComputed}", but the expected output is "${currentQuestion.expectedValue}". Double-check your formula arguments and cells.`;
    }

    setEvaluationResult({
      checked: true,
      isCorrect,
      userFormula: userValue,
      expectedFormula: currentQuestion.solutionFormula,
      reason
    });

    // Save attempts and progress in hooks / localstorage
    updateQuestionProgress(currentQuestion.id, isCorrect, userValue);
  };

  const handleResetQuestion = () => {
    setSheetState(JSON.parse(JSON.stringify(currentQuestion.initialGrid)));
    setEvaluationResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleNextQuestion = () => {
    // Locate index of current question and move to next
    const currentIndex = practiceQuestionsData.findIndex(q => q.id === currentQuestion.id);
    const nextIndex = (currentIndex + 1) % practiceQuestionsData.length;
    const nextQ = practiceQuestionsData[nextIndex];
    
    setCurrentQuestion(nextQ);
    setSheetState(JSON.parse(JSON.stringify(nextQ.initialGrid)));
    setEvaluationResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  return (
    <div className="flex flex-col min-h-full p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Workspace Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Solve daily tasks, learn core operations, and view real-time accuracy sheets.
          </p>
        </div>
      </div>

      {/* 2. Top Section: Continue Learning Card */}
      <div className="hidden md:flex bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Resume Curriculum
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {currentLesson.title}
            </h3>
            <p className="text-slate-400 text-xs max-w-xl">
              Category: <span className="text-slate-300 font-medium">{currentLesson.category}</span> • 
              Difficulty: <span className={`font-semibold ${
                currentLesson.difficulty === 'Beginner' ? 'text-emerald-400' : 
                currentLesson.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'
              }`}>{currentLesson.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar & CTA */}
        <div className="flex flex-col md:items-end w-full md:w-auto gap-3.5 shrink-0">
          <div className="w-full md:w-48 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>Course Progress</span>
              <span>{completedLessonsCount}/{totalLessonsCount} Lessons</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-750">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500" 
                style={{ width: `${lessonProgressPercent}%` }}
              />
            </div>
          </div>
          <Link 
            href={`/learn/${currentLesson.id}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-semibold rounded-xl text-xs transition"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            Resume Learning
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Main Practice Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Live Practice Area (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* Today's Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Daily Challenge
                </span>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">Q{currentQuestion.questionNum}.</span>
                  {currentQuestion.title}
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                  {currentQuestion.category}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${
                  currentQuestion.difficulty === 'Beginner' 
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' 
                    : currentQuestion.difficulty === 'Intermediate'
                    ? 'bg-amber-950/30 text-amber-400 border-amber-900/50'
                    : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 text-slate-400 rounded-md border border-slate-700 font-mono">
                  {currentQuestion.estimatedTime}
                </span>
              </div>
            </div>

            {/* Task prompt */}
            <div className="space-y-2 text-sm leading-relaxed text-slate-350">
              <p><strong className="text-slate-200">Scenario:</strong> {currentQuestion.scenario}</p>
              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 mt-2">
                <strong className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block mb-1">Your Objective:</strong>
                <p className="text-slate-100 font-semibold">{currentQuestion.task}</p>
              </div>
            </div>

            {/* Simulated Live Grid Sheet */}
            <div className="w-full h-[280px] sm:h-[360px] pt-2">
              <Spreadsheet 
                initialState={sheetState} 
                onChange={handleGridChange}
              />
            </div>

            {/* Bottom check bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex gap-2">
                <button
                  onClick={handleResetQuestion}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sheet
                </button>
                <button
                  onClick={() => setShowHint(prev => !prev)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    showHint 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              </div>

              <div className="flex gap-2">
                {evaluationResult?.isCorrect && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Next Challenge
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleCheckAnswer}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/10"
                >
                  <Check className="w-4 h-4" />
                  Check Answer
                </button>
              </div>
            </div>

            {/* Answer Feedbacks */}
            {evaluationResult && (
              <div className={`border rounded-xl p-4 mt-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                evaluationResult.isCorrect 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
              }`}>
                {evaluationResult.isCorrect ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 w-full">
                  <h4 className="font-bold text-sm">
                    {evaluationResult.isCorrect ? 'Correct Formula!' : 'Incorrect Formula'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1.5">
                    <div>
                      <div className="text-slate-400 font-medium">Your Formula:</div>
                      <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-emerald-300">
                        {evaluationResult.userFormula || '(None)'}
                      </code>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Expected Formula Syntax:</div>
                      <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-slate-300">
                        {evaluationResult.expectedFormula}
                      </code>
                    </div>
                  </div>
                  {!evaluationResult.isCorrect && evaluationResult.reason && (
                    <p className="text-xs text-rose-400 mt-2 font-medium">
                      Reason: {evaluationResult.reason}
                    </p>
                  )}
                  {evaluationResult.isCorrect && (
                    <p className="text-xs text-slate-300 mt-2">
                      Excellent job! The spreadsheet evaluated your formula correctly and returned the target value of <strong className="text-emerald-400 font-mono font-bold">{currentQuestion.expectedValue}</strong>.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info & Controls (1 Col) */}
        <div className="space-y-6">
          
          {/* Progress Summary Card */}
          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Practice Progress
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Solved Questions</span>
                <span className="font-mono font-bold text-slate-200">{metrics.questionsSolved}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Attempts</span>
                <span className="font-mono font-bold text-slate-200">{metrics.totalAttempts}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Wrong Submissions</span>
                <span className="font-mono font-bold text-rose-400">{metrics.wrongAttempts}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Accuracy</span>
                <span className="font-mono font-extrabold text-emerald-400">{metrics.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Overall Score</span>
                <span className="font-mono font-extrabold text-emerald-400">{metrics.overallScore} / 100</span>
              </div>
            </div>
          </div>

          {/* Hint / Helper Widget */}
          {showHint && (
            <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-5 shadow-lg space-y-3 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Formula Hint
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.hint}
              </p>
              
              <div className="border-t border-slate-800/80 pt-3 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Syntax Guide</span>
                  <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-slate-300 text-[11px] break-all">
                    {currentQuestion.formulaSyntax}
                  </code>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Syntax Example</span>
                  <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-emerald-400 text-[11px]">
                    {currentQuestion.formulaExample}
                  </code>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center">
                <span className="text-xs text-slate-500">Stuck?</span>
                <button
                  onClick={() => setShowSolution(prev => !prev)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                </button>
              </div>

              {showSolution && (
                <div className="mt-3 p-3 bg-slate-950 border border-slate-850 rounded-lg animate-in slide-in-from-top-1 duration-150">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Correct Answer Formula</span>
                  <code className="font-mono text-xs text-emerald-400 font-bold break-all">
                    {currentQuestion.solutionFormula}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Related Formula Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Key Function Guide
            </h3>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                Category: <span className="text-emerald-400 font-bold">{currentQuestion.category}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Make sure you start with an equals sign <code className="text-emerald-400">=</code>. Cell references must match column letters and row coordinates (e.g. <code className="text-slate-300">A2</code>, <code className="text-slate-300">B2</code>).
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
