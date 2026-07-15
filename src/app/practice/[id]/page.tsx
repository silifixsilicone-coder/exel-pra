"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Lightbulb, 
  ChevronRight, 
  AlertTriangle,
  BookOpen,
  Award,
  Lock,
  Eye
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import Spreadsheet from '@/components/shared/Spreadsheet';
import { practiceQuestionsData, getQuestionById } from '@/data/practiceQuestions';
import { SpreadsheetState, Question } from '@/types';
import { evaluateFormula } from '@/utils/formulaEvaluator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PracticeDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { progress, isLoaded, updateQuestionProgress, metrics } = useProgress();
  const [question, setQuestion] = useState<Question | null>(null);
  
  // Spreadsheet state
  const [sheetState, setSheetState] = useState<SpreadsheetState | null>(null);
  
  // Evaluation feedbacks
  const [evaluationResult, setEvaluationResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    userFormula: string;
    expectedFormula: string;
    reason?: string;
  } | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Load question details
  useEffect(() => {
    const foundQ = getQuestionById(id);
    if (foundQ) {
      setQuestion(foundQ);
      setSheetState(JSON.parse(JSON.stringify(foundQ.initialGrid)));
      
      // Reset feedback states
      setEvaluationResult(null);
      setShowHint(false);
      setShowSolution(false);
    }
  }, [id]);

  if (!isLoaded || !question || !sheetState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading challenge environment...</span>
        </div>
      </div>
    );
  }

  const handleGridChange = (newState: SpreadsheetState) => {
    setSheetState(newState);
  };

  const handleCheckAnswer = () => {
    if (!sheetState || !question) return;

    const targetKey = question.targetCell.toUpperCase();
    const cell = sheetState.cells[targetKey];
    
    const userValue = cell ? cell.value.trim() : '';
    const userComputed = cell ? evaluateFormula(cell.value, sheetState.cells) : '';

    const isFormula = userValue.startsWith('=');
    const normalizedFormula = userValue.replace(/\s+/g, '').toUpperCase();
    
    const isFormulaMatch = question.expectedFormulas.some(f => {
      const normalizedExpected = f.replace(/\s+/g, '').toUpperCase();
      return normalizedFormula === normalizedExpected;
    });

    const isValueMatch = String(userComputed).toLowerCase() === String(question.expectedValue).toLowerCase();
    
    const isCorrect = isFormula && (isFormulaMatch || isValueMatch);

    let reason = '';
    if (!isFormula) {
      reason = 'Your formula must start with an equals sign ("=").';
    } else if (!isFormulaMatch && !isValueMatch) {
      reason = `Evaluated value is "${userComputed}", but expected "${question.expectedValue}". Check cell references.`;
    }

    setEvaluationResult({
      checked: true,
      isCorrect,
      userFormula: userValue,
      expectedFormula: question.solutionFormula,
      reason
    });

    // Update progress in local storage
    updateQuestionProgress(question.id, isCorrect, userValue);
  };

  const handleResetQuestion = () => {
    setSheetState(JSON.parse(JSON.stringify(question.initialGrid)));
    setEvaluationResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleNextQuestion = () => {
    const currentIndex = practiceQuestionsData.findIndex(q => q.id === question.id);
    const nextIndex = (currentIndex + 1) % practiceQuestionsData.length;
    const nextQ = practiceQuestionsData[nextIndex];
    router.push(`/practice/${nextQ.id}`);
  };

  const isCompleted = progress.completedQuestionIds.includes(question.id);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-7xl mx-auto space-y-6 pb-24 relative">
      
      {/* Back and Status Header */}
      <div className="flex items-center justify-between shrink-0">
        <Link 
          href="/practice"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Challenges
        </Link>
        {isCompleted && (
          <span className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-emerald-950/20 text-emerald-455 border border-emerald-900/40 rounded-full select-none">
            <Check className="w-3.5 h-3.5" />
            Solved Successfully
          </span>
        )}
      </div>

      {/* Main Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* Left Sidebar (25% = lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Challenge details
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-850 text-slate-400 rounded-md font-mono">
                {question.estimatedTime}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-850 text-slate-300 rounded">
                  {question.category}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                  question.difficulty === 'Beginner' 
                    ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                    : question.difficulty === 'Intermediate'
                    ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                    : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                }`}>
                  {question.difficulty}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 leading-tight">
                <span className="text-emerald-450 font-mono">Q{question.questionNum}.</span>
                {question.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-350 block mb-0.5 font-sans">Scenario:</strong> 
                {question.scenario}
              </p>
              
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 mt-2">
                <strong className="text-emerald-450 text-[10px] font-semibold uppercase tracking-wider block mb-1">Your Objective</strong>
                <p className="text-slate-100 font-semibold text-xs leading-normal">{question.task}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Area (58% = lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col h-[520px] min-h-0 relative">
            <div className="flex-1 min-h-0 relative">
              <Spreadsheet 
                initialState={sheetState} 
                onChange={handleGridChange}
              />
            </div>
          </div>

          {/* Answer Feedbacks */}
          {evaluationResult && (
            <div className={`border rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              evaluationResult.isCorrect 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-355' 
                : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
            }`}>
              {evaluationResult.isCorrect ? (
                <Check className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-455 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 w-full text-xs">
                <h4 className="font-bold text-sm">
                  {evaluationResult.isCorrect ? '✅ Correct Answer' : '❌ Incorrect Answer'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1.5">
                  <div>
                    <div className="text-slate-450 font-medium">Your Formula:</div>
                    <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-emerald-350">
                      {evaluationResult.userFormula || '(None)'}
                    </code>
                  </div>
                  <div>
                    <div className="text-slate-450 font-medium">Expected Formula:</div>
                    <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-slate-300 font-bold">
                      {evaluationResult.expectedFormula}
                    </code>
                  </div>
                </div>
                {!evaluationResult.isCorrect && evaluationResult.reason && (
                  <p className="text-rose-400 mt-2 font-medium font-sans">
                    Reason: {evaluationResult.reason}
                  </p>
                )}
                {evaluationResult.isCorrect && (
                  <p className="text-slate-355 mt-2 font-sans">
                    Fantastic! The spreadsheet resolved your formula correctly. You have completed this question.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (17% = lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
              <Award className="w-4 h-4 text-emerald-400" />
              Practice Progress
            </h3>
            
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Solved</span>
                <span className="font-bold text-slate-200">{metrics.questionsSolved} / {practiceQuestionsData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Accuracy</span>
                <span className="font-bold text-emerald-400">{metrics.accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Hint Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3.5">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Challenge Helper
            </h3>
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Hint</span>
                <p className="text-[11px] text-slate-300 leading-normal mt-0.5">{question.hint}</p>
              </div>
              
              <div className="border-t border-slate-800/80 pt-2 space-y-2">
                <div>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase">Syntax Guide</span>
                  <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-slate-350 text-[10px] break-all">
                    {question.formulaSyntax}
                  </code>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase">Syntax Example</span>
                  <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-emerald-455 text-[10px] break-all">
                    {question.formulaExample}
                  </code>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-2 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Stuck?</span>
                  <button
                    onClick={() => setShowSolution(prev => !prev)}
                    className="flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300 text-[11px] font-bold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showSolution ? 'Hide Ans' : 'Show Ans'}
                  </button>
                </div>
                {showSolution && (
                  <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg animate-in slide-in-from-top-1 duration-150">
                    <code className="font-mono text-[10px] text-emerald-455 font-bold break-all">
                      {question.solutionFormula}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
          <div className="flex gap-2">
            <button
              onClick={handleResetQuestion}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Sheet
            </button>
          </div>

          <div className="flex gap-2">
            {evaluationResult?.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold transition"
              >
                Next Challenge
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleCheckAnswer}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/10"
            >
              <Check className="w-4 h-4" />
              Check Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
