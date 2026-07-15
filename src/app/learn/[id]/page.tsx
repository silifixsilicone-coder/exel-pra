"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  Lightbulb, 
  RotateCcw, 
  AlertTriangle, 
  BookOpen, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import Spreadsheet from '@/components/shared/Spreadsheet';
import { lessonsData } from '@/data/lessons';
import { SpreadsheetState, Lesson } from '@/types';
import { evaluateFormula } from '@/utils/formulaEvaluator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LessonDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { progress, isLoaded, updateLessonProgress } = useProgress();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  
  // Spreadsheet state for the mini practice
  const [sheetState, setSheetState] = useState<SpreadsheetState | null>(null);
  
  // Feedback states for spreadsheet
  const [evaluationResult, setEvaluationResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    userFormula: string;
    expectedFormula: string;
    reason?: string;
  } | null>(null);

  const [showHint, setShowHint] = useState(false);

  // Mini Quiz States
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ checked: boolean; isCorrect: boolean } | null>(null);

  // Load lesson details
  useEffect(() => {
    const foundLesson = lessonsData.find(l => l.id === id);
    if (foundLesson) {
      setLesson(foundLesson);
      setSheetState(JSON.parse(JSON.stringify(foundLesson.miniPractice.initialGrid)));
      
      // Reset feedback states
      setEvaluationResult(null);
      setShowHint(false);
      setSelectedOption(null);
      setQuizFeedback(null);
    }
  }, [id]);

  if (!isLoaded || !lesson || !sheetState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading lesson...</span>
        </div>
      </div>
    );
  }

  const handleGridChange = (newState: SpreadsheetState) => {
    setSheetState(newState);
  };

  const handleCheckAnswer = () => {
    if (!sheetState || !lesson) return;

    const targetKey = lesson.miniPractice.targetCell.toUpperCase();
    const cell = sheetState.cells[targetKey];
    
    const userValue = cell ? cell.value.trim() : '';
    const userComputed = cell ? evaluateFormula(cell.value, sheetState.cells) : '';

    const isFormula = userValue.startsWith('=');
    const normalizedFormula = userValue.replace(/\s+/g, '').toUpperCase();
    
    const isFormulaMatch = lesson.miniPractice.expectedFormulas.some(f => {
      const normalizedExpected = f.replace(/\s+/g, '').toUpperCase();
      return normalizedFormula === normalizedExpected;
    });

    const isValueMatch = String(userComputed).toLowerCase() === String(lesson.miniPractice.expectedValue).toLowerCase();
    
    const isCorrect = isFormula && (isFormulaMatch || isValueMatch);

    let reason = '';
    if (!isFormula) {
      reason = 'Your formula must start with an equals sign ("=").';
    } else if (!isFormulaMatch && !isValueMatch) {
      reason = `Evaluated value is "${userComputed}", but we expected "${lesson.miniPractice.expectedValue}". Check your variables.`;
    }

    setEvaluationResult({
      checked: true,
      isCorrect,
      userFormula: userValue,
      expectedFormula: lesson.miniPractice.expectedFormulas[0],
      reason
    });

    if (isCorrect) {
      updateLessonProgress(lesson.id, true, lesson.nextLessonId);
    }
  };

  const handleCheckQuiz = () => {
    if (!lesson || !lesson.miniQuiz || selectedOption === null) return;
    const isCorrect = selectedOption === lesson.miniQuiz.answerIndex;
    setQuizFeedback({ checked: true, isCorrect });
  };

  const handleResetPractice = () => {
    setSheetState(JSON.parse(JSON.stringify(lesson.miniPractice.initialGrid)));
    setEvaluationResult(null);
    setShowHint(false);
  };

  const handleNextLesson = () => {
    if (lesson.nextLessonId) {
      router.push(`/learn/${lesson.nextLessonId}`);
    } else {
      router.push('/learn');
    }
  };

  const isCompleted = progress.completedLessonIds.includes(lesson.id);

  return (
    <div className="flex flex-col min-h-full p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-w-6xl mx-auto selection:bg-emerald-500 selection:text-white">
      
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/learn"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Curriculum
        </Link>
        {isCompleted && (
          <span className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-emerald-950/20 text-emerald-450 border border-emerald-900/40 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Lesson Completed
          </span>
        )}
      </div>

      {/* Grid Layout: Explanation vs. Mini Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Lesson Explanations */}
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                {lesson.category}
              </span>
              <span className="text-slate-650 font-mono text-[9px]">•</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <Clock className="w-3 h-3 text-slate-500" />
                {lesson.estimatedTime}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              {lesson.title}
            </h1>
          </div>

          {/* SaaS Concept Image Vector Mockup Placeholder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full" />
            <div className="w-full max-w-sm bg-slate-950 border border-slate-850 rounded-xl p-3 shadow-inner space-y-2 text-center relative z-10">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Visual Representation Vector</span>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-emerald-450 font-mono text-xs font-bold inline-block">
                {lesson.syntax}
              </div>
              <p className="text-[10px] text-slate-400 font-sans italic">{lesson.example}</p>
            </div>
          </div>

          {/* Explanation text */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Concept Explanation</h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {lesson.explanation}
            </p>
            
            {/* Syntax block */}
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block">Formula Syntax</span>
              <code className="font-mono text-emerald-400 text-sm font-bold block">
                {lesson.syntax}
              </code>
            </div>
          </div>

          {/* Example Data Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Visual Table Example</h2>
            
            {/* Table representation */}
            <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-850">
                    {lesson.exampleTableHeaders.map((h, i) => (
                      <th key={i} className="px-4 py-3 font-semibold text-slate-450 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lesson.exampleTableRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-900/50 hover:bg-slate-900/10">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2.5 font-mono text-slate-300 font-medium">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step-by-Step Instructions & Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">How to implement</h3>
              <ol className="list-decimal pl-4 text-xs text-slate-405 space-y-2 font-sans leading-relaxed">
                {lesson.stepByStep.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-rose-455 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Common Mistakes
              </h3>
              <ul className="list-disc pl-4 text-xs text-slate-405 space-y-2 font-sans leading-relaxed">
                {lesson.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Concept Summary Block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-sans">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-450" />
              Concept Summary
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {lesson.summary}
            </p>
          </div>

          {/* Mini Quiz Section */}
          {lesson.miniQuiz && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <HelpCircle className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">Mini Concept Quiz</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-semibold font-sans">{lesson.miniQuiz.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {lesson.miniQuiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(idx);
                        setQuizFeedback(null);
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                        selectedOption === idx
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-900'
                      }`}
                    >
                      <span className="inline-flex w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold items-center justify-center mr-2 uppercase">
                        {String.fromCharCode(97 + idx)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleCheckQuiz}
                    disabled={selectedOption === null}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs transition"
                  >
                    Submit Quiz
                  </button>
                </div>

                {quizFeedback && (
                  <div className={`p-4 border rounded-xl flex items-start gap-2.5 text-xs ${
                    quizFeedback.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                  }`}>
                    {quizFeedback.isCorrect ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <p className="font-sans leading-relaxed">
                      {quizFeedback.isCorrect
                        ? 'Correct! You matched the concept answer successfully.'
                        : 'Incorrect answer. Read the concept explanation above and try again!'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Mini Spreadsheet Practice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-5 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Interactive Task</span>
              <h2 className="text-lg font-bold text-slate-100">Mini Practice Grid</h2>
            </div>
          </div>

          {/* Prompt info */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4">
            <span className="text-[10px] text-emerald-450 font-bold uppercase tracking-wider block mb-1">Task Target</span>
            <p className="text-sm font-semibold text-slate-200 leading-relaxed">
              {lesson.miniPractice.taskDescription}
            </p>
          </div>

          {/* Live spreadsheet simulation */}
          <div className="w-full h-[280px] sm:h-[320px]">
            <Spreadsheet 
              initialState={sheetState}
              onChange={handleGridChange}
            />
          </div>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex gap-2">
              <button
                onClick={handleResetPractice}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
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
                Hint
              </button>
            </div>

            <div className="flex gap-2">
              {evaluationResult?.isCorrect && (
                <button
                  onClick={handleNextLesson}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold transition"
                >
                  {lesson.nextLessonId ? 'Next Lesson' : 'Curriculum Index'}
                  <ChevronRight className="w-3.5 h-3.5" />
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

          {/* Hint view */}
          {showHint && (
            <div className="p-4 bg-slate-950 border border-amber-900/30 rounded-xl text-xs text-slate-300 leading-relaxed animate-in fade-in duration-150">
              <span className="font-bold text-amber-400 uppercase tracking-wide block mb-1">Helpful Tip</span>
              {lesson.miniPractice.hint}
            </div>
          )}

          {/* Checking feedback */}
          {evaluationResult && (
            <div className={`border rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
              evaluationResult.isCorrect 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
            }`}>
              {evaluationResult.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 w-full text-xs">
                <h4 className="font-bold text-sm">
                  {evaluationResult.isCorrect ? 'Correct! Lesson Completed' : 'Incorrect Attempt'}
                </h4>
                <div className="pt-2">
                  <div className="text-slate-400">Your formula:</div>
                  <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-emerald-300 break-all">
                    {evaluationResult.userFormula || '(None)'}
                  </code>
                </div>
                {!evaluationResult.isCorrect && evaluationResult.reason && (
                  <p className="text-rose-455 font-semibold mt-2">
                    Reason: {evaluationResult.reason}
                  </p>
                )}
                {evaluationResult.isCorrect && (
                  <p className="text-slate-300 mt-2">
                    You have successfully mastered the concept! Progress saved. Click Next Lesson to proceed.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
