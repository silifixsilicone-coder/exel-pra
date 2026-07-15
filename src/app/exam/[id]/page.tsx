"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Timer, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  Home,
  Check,
  Award,
  BookOpen,
  Eye,
  Percent,
  XCircle,
  Activity,
  GraduationCap
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import Spreadsheet from '@/components/shared/Spreadsheet';
import { examsData, getQuestionsForExam } from '@/data/exams';
import { SpreadsheetState, Exam, Question, ExamResult } from '@/types';
import { evaluateFormula } from '@/utils/formulaEvaluator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ExamSessionPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { progress, isLoaded, addExamResult } = useProgress();
  const [exam, setExam] = useState<Exam | null>(null);
  
  // Active states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examFinished, setExamFinished] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  // Track user sheets and formulas for each question index
  const [userGrids, setUserGrids] = useState<SpreadsheetState[]>([]);
  const [resultsData, setResultsData] = useState<ExamResult | null>(null);

  // Review states
  const [reviewReport, setReviewReport] = useState<{ question: Question; userValue: string; isCorrect: boolean }[]>([]);
  const [showReview, setShowReview] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load exam details
  useEffect(() => {
    const foundExam = examsData.find(e => e.id === id);
    if (foundExam) {
      // Fetch 30 random questions from unified question bank
      const examQuestions = getQuestionsForExam(foundExam.id);
      const examWithQuestions: Exam = {
        ...foundExam,
        questions: examQuestions
      };

      setExam(examWithQuestions);
      setTimeLeft(foundExam.timeLimitSeconds);
      
      // Deep copy all initial grids to save user edits dynamically
      const initialGrids = examQuestions.map(q => 
        JSON.parse(JSON.stringify(q.initialGrid))
      );
      setUserGrids(initialGrids);
    }
  }, [id]);

  // Handle timer countdown
  useEffect(() => {
    if (examStarted && !examFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishExam(true); // Force finish on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, examFinished, timeLeft]);

  if (!isLoaded || !exam || userGrids.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Setting up certification environment...</span>
        </div>
      </div>
    );
  }

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleGridChange = (newState: SpreadsheetState) => {
    const updatedGrids = [...userGrids];
    updatedGrids[currentQuestionIndex] = newState;
    setUserGrids(updatedGrids);
  };

  const handleFinishExam = (forceTimeout = false) => {
    if (examFinished) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Evaluate answers
    let correctCount = 0;
    let wrongCount = 0;
    const report: typeof reviewReport = [];

    exam.questions.forEach((question, idx) => {
      const state = userGrids[idx];
      const targetCellKey = question.targetCell.toUpperCase();
      const cell = state.cells[targetCellKey];
      
      const userValue = cell ? cell.value.trim() : '';
      const userComputed = cell ? evaluateFormula(cell.value, state.cells) : '';

      const isFormula = userValue.startsWith('=');
      const normalizedFormula = userValue.replace(/\s+/g, '').toUpperCase();
      
      const isFormulaMatch = question.expectedFormulas.some(f => {
        const normalizedExpected = f.replace(/\s+/g, '').toUpperCase();
        return normalizedFormula === normalizedExpected;
      });

      const isValueMatch = String(userComputed).toLowerCase() === String(question.expectedValue).toLowerCase();
      
      const isCorrect = isFormula && (isFormulaMatch || isValueMatch);

      if (isCorrect) correctCount++;
      else wrongCount++;

      report.push({
        question,
        userValue,
        isCorrect
      });
    });

    const totalQuestions = exam.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const accuracy = score; // Out of 100

    const newResult: ExamResult = {
      examId: exam.id,
      score,
      accuracy,
      correctCount,
      wrongCount,
      date: new Date().toLocaleDateString(),
      completed: true
    };

    // Save exam result to local storage
    addExamResult(newResult);

    setReviewReport(report);
    setResultsData(newResult);
    setExamFinished(true);
  };

  const activeQuestion = exam.questions[currentQuestionIndex];
  const activeSheetState = userGrids[currentQuestionIndex];

  // Exam lobby view before starting
  if (!examStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5 animate-pulse">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
              Exam Instructions
            </span>
            <h2 className="text-xl font-bold text-slate-100">{exam.title}</h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              You are about to start a certification assessment containing **30 randomized questions** from the Excel bank. Hints and inline validations are strictly locked. Achieve **80% or higher** to pass and earn your certificate!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-semibold">Time Limit</span>
              <span className="font-mono text-sm font-bold text-slate-200 mt-1 block">
                30 Minutes
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-semibold">Passing Score</span>
              <span className="font-mono text-sm font-bold text-emerald-450 mt-1 block">
                80% Score
              </span>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/10"
          >
            Start Certification Exam
          </button>
        </div>
      </div>
    );
  }

  // Exam result sheet view
  if (examFinished && resultsData) {
    const hasPassed = resultsData.score >= 80;

    // Calculate dynamic performance breakdown by question category
    const categoryAnalysis: Record<string, { correct: number; total: number }> = {};
    reviewReport.forEach(item => {
      const category = item.question.category || 'General';
      if (!categoryAnalysis[category]) {
        categoryAnalysis[category] = { correct: 0, total: 0 };
      }
      categoryAnalysis[category].total++;
      if (item.isCorrect) {
        categoryAnalysis[category].correct++;
      }
    });

    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 pb-24">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Assessment Result</span>
            <h2 className="text-2xl font-black text-slate-100">{exam.title}</h2>
          </div>

          {/* Pass/Fail banner */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 select-none ${
            hasPassed 
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-450' 
              : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
          }`}>
            {hasPassed ? (
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-rose-400" />
            )}
            <div>
              <div className="font-bold text-lg">{hasPassed ? 'Status: PASSED' : 'Status: FAILED'}</div>
              <p className="text-slate-450 text-xs mt-1 max-w-md font-sans leading-relaxed">
                {hasPassed 
                  ? 'Excellent! You have successfully passed the certification check and unlocked your certificate badge.' 
                  : 'You did not reach the 80% passing threshold. Practice more challenges in the lab and retry.'}
              </p>
            </div>
          </div>

          {/* Dynamic Certificate Unlock Frame */}
          {hasPassed && (
            <div className="p-6 bg-slate-950 border border-amber-500/30 rounded-2xl relative overflow-hidden select-none shadow-xl border-dashed">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
              <div className="text-center space-y-4">
                <Award className="w-12 h-12 text-amber-450 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-amber-450">Excel Expert Certificate</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Awarded to the Candidate on {resultsData.date}</p>
                </div>
                <div className="border-t border-slate-850 pt-3 max-w-sm mx-auto">
                  <p className="text-xs text-slate-350 leading-relaxed font-serif italic">
                    "This document certifies that the candidate has successfully cleared the 30-question dynamic certification exam with a score of {resultsData.score}%."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results specs */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-500 block font-sans font-semibold">Your Score</span>
              <span className="text-lg font-black text-slate-100 mt-1 block">{resultsData.score}%</span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-sans font-semibold">Correct Tasks</span>
              <span className="text-lg font-black text-emerald-450 mt-1 block">{resultsData.correctCount}</span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-sans font-semibold">Incorrect Tasks</span>
              <span className="text-lg font-black text-rose-455 mt-1 block">{resultsData.wrongCount}</span>
            </div>
          </div>

          {/* Category-wise Performance Analysis */}
          <div className="space-y-3.5 bg-slate-950 border border-slate-850 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 flex items-center gap-1.5 font-sans">
              <Activity className="w-4 h-4 text-emerald-450" />
              Category Performance Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryAnalysis).map(([cat, val]) => {
                const percent = Math.round((val.correct / val.total) * 100);
                return (
                  <div key={cat} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-350 font-bold">{cat}</span>
                      <span className="text-slate-455">{val.correct}/{val.total} correct ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 80 ? 'bg-emerald-450' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Answers Toggle Button */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowReview(prev => !prev)}
              className="w-full py-3 bg-slate-950 border border-slate-805 hover:bg-slate-900 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Eye className="w-4 h-4 text-emerald-450" />
              {showReview ? 'Hide Exam Answers Review' : 'Review Exam Answers'}
            </button>

            <Link
              href="/exam"
              className="py-3 bg-slate-950 border border-slate-805 hover:bg-slate-900 text-slate-300 font-semibold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition"
            >
              <Home className="w-4 h-4" />
              Exit to Lobby
            </Link>
          </div>

        </div>

        {/* Detailed Answers Review section */}
        {showReview && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-455 font-mono">
              Exam Answers Sheet Review
            </h3>
            
            <div className="space-y-4">
              {reviewReport.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-2">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-emerald-450 font-mono">Q{idx + 1}.</span>
                      {item.question.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      item.isCorrect ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' : 'bg-rose-950/20 text-rose-455 border border-rose-900/40'
                    }`}>
                      {item.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-450 leading-relaxed font-sans">
                    <strong className="text-slate-300 block mb-0.5">Scenario:</strong>
                    {item.question.scenario}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-[11px]">
                    <div>
                      <div className="text-slate-500 font-sans font-medium">Your Input:</div>
                      <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 text-slate-300 truncate">
                        {item.userValue || '(Empty)'}
                      </code>
                    </div>
                    <div>
                      <div className="text-slate-500 font-sans font-medium">Correct Formula:</div>
                      <code className="block mt-1 p-2 bg-slate-950 rounded border border-slate-850 text-emerald-450 truncate">
                        {item.question.solutionFormula}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Session Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
            Exam In Progress
          </span>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {exam.title}
          </h2>
        </div>

        {/* Timer countdown and progress count */}
        <div className="flex items-center gap-4 select-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-xl">
            <span className="text-[10px] text-slate-550 font-semibold uppercase">Question</span>
            <span className="font-mono font-bold text-slate-200 text-xs">
              {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-3.5 py-1.5 border rounded-xl font-mono text-xs font-bold ${
            timeLeft < 120 
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse' 
              : 'bg-slate-900 border-slate-850 text-slate-200'
          }`}>
            <Timer className="w-4 h-4 text-slate-450" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* 2. Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Spreadsheet Area (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4 min-h-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg space-y-4">
            
            {/* Task Description */}
            <div className="space-y-2.5 text-sm leading-relaxed text-slate-350 font-sans">
              <p><strong className="text-slate-250">Scenario:</strong> {activeQuestion.scenario}</p>
              
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 mt-2 font-sans">
                <strong className="text-emerald-450 text-xs font-semibold uppercase tracking-wider block mb-1">
                  Active Instruction:
                </strong>
                <p className="text-slate-100 font-semibold">{activeQuestion.task}</p>
              </div>
            </div>

            {/* Live spreadsheet practice canvas */}
            <div className="w-full h-[300px] sm:h-[420px] pt-2">
              <Spreadsheet 
                key={activeQuestion.id} // Forces remounting when moving questions to load correct grid
                initialState={activeSheetState} 
                onChange={handleGridChange}
              />
            </div>

            {/* Bottom session navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-850 font-sans">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-850 hover:bg-slate-800 disabled:opacity-50 text-slate-350 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Task
              </button>

              {currentQuestionIndex === exam.questions.length - 1 ? (
                <button
                  onClick={() => handleFinishExam(false)}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Submit Examination
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-250 rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  Save & Next Task
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar Guidelines (1 Col) */}
        <div className="space-y-6 select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Exam Constraints
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Hints, formula verification checkmarks, and solutions are locked in exam mode.
            </p>
            <p className="text-xs text-slate-450 leading-relaxed font-sans">
              Your edits are saved automatically as you navigate between questions. Double-check your formula arguments before clicking <strong>Submit Examination</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
