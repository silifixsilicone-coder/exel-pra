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
  Eye,
  PanelLeft,
  ChevronLeft,
  Compass,
  CheckCircle2,
  HelpCircle,
  Play
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
  
  // Active Question and Spreadsheet State managed locally to prevent page reload
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [sheetState, setSheetState] = useState<SpreadsheetState | null>(null);
  
  // UI Panels State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Evaluation feedbacks
  const [evaluationResult, setEvaluationResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    userFormula: string;
    expectedFormula: string;
    reason?: string;
  } | null>(null);

  // Load question details from URL parameter on initial mount or back/forward actions
  useEffect(() => {
    const foundQ = getQuestionById(id);
    if (foundQ) {
      setActiveQuestion(foundQ);
      setSheetState(JSON.parse(JSON.stringify(foundQ.initialGrid)));
      setEvaluationResult(null);
      setShowHint(false);
      setShowSolution(false);
      localStorage.setItem('practice_last_viewed', foundQ.id);
    }
  }, [id]);

  // Handle local transitions without triggering a full page reload
  const handleLoadQuestion = (q: Question) => {
    setActiveQuestion(q);
    setSheetState(JSON.parse(JSON.stringify(q.initialGrid)));
    setEvaluationResult(null);
    setShowHint(false);
    setShowSolution(false);
    localStorage.setItem('practice_last_viewed', q.id);
    
    // Update the browser URL address bar dynamically without reloading the bundle
    window.history.replaceState(null, '', `/practice/${q.id}`);
  };

  // Keyboard Event Binders
  useEffect(() => {
    if (!activeQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing transition shortcuts if user is typing inside textboxes or editable cells
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.hasAttribute('contenteditable') ||
        target.closest('.excel-editor-input') ||
        target.closest('[contenteditable="true"]')
      ) {
        return;
      }

      const currentIndex = practiceQuestionsData.findIndex(q => q.id === activeQuestion.id);
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          handleLoadQuestion(practiceQuestionsData[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < practiceQuestionsData.length - 1) {
          handleLoadQuestion(practiceQuestionsData[currentIndex + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestion]);

  if (!isLoaded || !activeQuestion || !sheetState) {
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
    if (!sheetState || !activeQuestion) return;

    const targetKey = activeQuestion.targetCell.toUpperCase();
    const cell = sheetState.cells[targetKey];
    
    const userValue = cell ? cell.value.trim() : '';
    const userComputed = cell ? evaluateFormula(cell.value, sheetState.cells) : '';

    const isFormula = userValue.startsWith('=');
    const normalizedFormula = userValue.replace(/\s+/g, '').toUpperCase();
    
    const isFormulaMatch = activeQuestion.expectedFormulas.some(f => {
      const normalizedExpected = f.replace(/\s+/g, '').toUpperCase();
      return normalizedFormula === normalizedExpected;
    });

    const isValueMatch = String(userComputed).toLowerCase() === String(activeQuestion.expectedValue).toLowerCase();
    
    const isCorrect = isFormula && (isFormulaMatch || isValueMatch);

    let reason = '';
    if (!isFormula) {
      reason = 'Your formula must start with an equals sign ("=").';
    } else if (!isFormulaMatch && !isValueMatch) {
      reason = `Evaluated value is "${userComputed}", but expected "${activeQuestion.expectedValue}". Check cell references.`;
    }

    setEvaluationResult({
      checked: true,
      isCorrect,
      userFormula: userValue,
      expectedFormula: activeQuestion.solutionFormula,
      reason
    });

    // Update progress in local storage
    updateQuestionProgress(activeQuestion.id, isCorrect, userValue);
  };

  const handleResetQuestion = () => {
    setSheetState(JSON.parse(JSON.stringify(activeQuestion.initialGrid)));
    setEvaluationResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const currentIndex = practiceQuestionsData.findIndex(q => q.id === activeQuestion.id);
  const totalCount = practiceQuestionsData.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCount - 1;

  const handleNextQuestion = () => {
    if (!isLast) {
      handleLoadQuestion(practiceQuestionsData[currentIndex + 1]);
    } else {
      router.push('/practice');
    }
  };

  const handlePrevQuestion = () => {
    if (!isFirst) {
      handleLoadQuestion(practiceQuestionsData[currentIndex - 1]);
    }
  };

  const completedQuestions = progress.completedQuestionIds || [];
  const isCompleted = completedQuestions.includes(activeQuestion.id);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* 1. Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-850 px-4 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        {/* Left segment */}
        <div className="flex items-center gap-3">
          <Link 
            href="/practice"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Challenges List
          </Link>
          <div className="w-[1px] h-4 bg-slate-800 hidden md:block" />
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className={`p-1.5 rounded-lg border transition ${
              sidebarOpen ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/30' : 'bg-slate-900 text-slate-405 border-slate-800 hover:text-white'
            }`}
            title="Toggle sidebar catalogue"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Middle segment: problem transitions & jump dropdown */}
        <div className="flex items-center gap-3 select-none">
          <button
            onClick={handlePrevQuestion}
            disabled={isFirst}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono font-bold text-slate-300">
            Challenge {currentIndex + 1} of {totalCount}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={isLast && isCompleted}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <select
            value={activeQuestion.id}
            onChange={(e) => {
              const q = getQuestionById(e.target.value);
              if (q) handleLoadQuestion(q);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-300 font-sans cursor-pointer max-w-[160px]"
          >
            {practiceQuestionsData.map((q, idx) => (
              <option key={q.id} value={q.id}>
                Q{idx + 1}. {q.title}
              </option>
            ))}
          </select>
        </div>

        {/* Right segment: progress metrics */}
        <div className="flex items-center gap-4 text-xs font-mono select-none">
          <div className="hidden lg:flex items-center gap-2 text-slate-450">
            <span>Completed: <strong className="text-emerald-450">{completedQuestions.length}</strong></span>
            <span>•</span>
            <span>Remaining: <strong className="text-slate-300">{totalCount - completedQuestions.length}</strong></span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800 hidden lg:block" />
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-450" />
            <span className="font-bold text-emerald-450">{metrics.accuracy}% accuracy</span>
          </div>
        </div>
      </header>

      {/* 2. Workspace Viewport layout */}
      <div className="flex-1 flex flex-row min-h-0 relative">
        
        {/* Left Side: Collapsible Sidebar catalog drawer */}
        {sidebarOpen && (
          <aside className="w-64 bg-slate-950 border-r border-slate-850 shrink-0 flex flex-col min-h-0 z-40 animate-in slide-in-from-left duration-200 select-none">
            <div className="p-4 border-b border-slate-850 shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                Challenges List
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {practiceQuestionsData.map((q, idx) => {
                const isQCompleted = completedQuestions.includes(q.id);
                const isQCurrent = q.id === activeQuestion.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleLoadQuestion(q)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition text-left ${
                      isQCurrent
                        ? 'bg-slate-900 text-white font-bold border border-slate-800'
                        : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{q.title}</span>
                    </div>
                    {isQCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-450 shrink-0 ml-1.5" />
                    ) : isQCurrent ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-450 shrink-0 ml-1.5 animate-pulse" />
                    ) : (
                      <HelpCircle className="w-3.5 h-3.5 text-slate-650 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Right Side: Split grid contents */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto p-4 md:p-6 gap-6 relative">
          
          {/* Challenge Description panel */}
          <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-full pr-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  {activeQuestion.category}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                  activeQuestion.difficulty === 'Beginner' 
                    ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                    : activeQuestion.difficulty === 'Intermediate'
                    ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                    : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                }`}>
                  {activeQuestion.difficulty}
                </span>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 leading-tight">
                  <span className="text-emerald-450 font-mono">Q{currentIndex + 1}.</span>
                  {activeQuestion.title}
                </h2>
                
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {activeQuestion.description}
                </p>

                <p className="text-xs text-slate-405 leading-relaxed font-sans">
                  <strong className="text-slate-350 block mb-0.5">Business Context:</strong> 
                  {activeQuestion.scenario}
                </p>
                
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 mt-2">
                  <strong className="text-emerald-450 text-[10px] font-bold uppercase tracking-wider block mb-1">Your Objective</strong>
                  <p className="text-slate-100 font-semibold text-xs leading-normal font-sans">{activeQuestion.task}</p>
                </div>
              </div>
            </div>

            {/* Explanation & Solution block (Only rendered once solved) */}
            {isCompleted && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5 animate-in fade-in duration-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-450 flex items-center gap-1 font-sans">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Conceptual Explanation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {activeQuestion.explanation || 'Perfect! Using correct references aligns this calculation dynamically inside Microsoft Excel.'}
                </p>
                <div className="border-t border-slate-850 pt-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Solution Formula</span>
                  <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 font-mono text-emerald-450 text-xs">
                    {activeQuestion.solutionFormula}
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Spreadsheet sandbox editor panel */}
          <div className="lg:col-span-8 flex flex-col space-y-4 min-h-0">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col h-[520px] min-h-0 relative">
              <div className="flex-1 min-h-0 relative">
                <Spreadsheet 
                  initialState={sheetState} 
                  onChange={handleGridChange}
                />
              </div>
            </div>

            {/* Answer check controller toolbar */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={handleResetQuestion}
                  className="flex items-center gap-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-805 rounded-xl text-xs font-semibold transition active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={() => setShowHint(prev => !prev)}
                  className={`flex items-center gap-1 px-4 py-2.5 border rounded-xl text-xs font-semibold transition active:scale-95 ${
                    showHint ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-900 hover:bg-slate-850 text-slate-350 border-slate-805'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Hint
                </button>
              </div>

              <div className="flex gap-2">
                {evaluationResult?.isCorrect && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/10 active:scale-95 font-sans"
                  >
                    {isLast ? 'Finish Practice Set' : 'Next Question'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleCheckAnswer}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl border border-slate-805 text-xs font-semibold transition active:scale-95 font-sans"
                >
                  Check Answer
                </button>
              </div>
            </div>

            {/* Helper tips view */}
            {showHint && (
              <div className="p-4 bg-slate-950 border border-amber-900/30 rounded-xl text-xs text-slate-300 leading-relaxed font-sans animate-in fade-in duration-150">
                <span className="font-bold text-amber-400 uppercase tracking-wide block mb-1">Helpful Tip</span>
                {activeQuestion.hint}
              </div>
            )}

            {/* Result status alerts */}
            {evaluationResult && (
              <div className={`border rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                evaluationResult.isCorrect 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
              }`}>
                {evaluationResult.isCorrect ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 w-full text-xs">
                  <h4 className="font-bold text-sm">
                    {evaluationResult.isCorrect ? 'Correct Answer! Challenge Cleared' : 'Incorrect Attempt'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono">
                    <div>
                      <div className="text-slate-450 font-sans font-medium">Your Formula:</div>
                      <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 text-emerald-300 break-all">
                        {evaluationResult.userFormula || '(None)'}
                      </code>
                    </div>
                    <div>
                      <div className="text-slate-450 font-sans font-medium">Expected Solution:</div>
                      <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 text-slate-300 font-bold break-all">
                        {evaluationResult.expectedFormula}
                      </code>
                    </div>
                  </div>
                  {!evaluationResult.isCorrect && evaluationResult.reason && (
                    <p className="text-rose-455 font-semibold mt-2 font-sans">
                      Reason: {evaluationResult.reason}
                    </p>
                  )}
                  {evaluationResult.isCorrect && (
                    <p className="text-slate-300 mt-2 font-sans">
                      Excellent! The formula evaluates to the target value successfully. Click Next Question to continue.
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}
