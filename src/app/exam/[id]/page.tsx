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
  FolderSync,
  GraduationCap
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import Spreadsheet from '@/components/shared/Spreadsheet';
import { examsData } from '@/data/exams';
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load exam details
  useEffect(() => {
    const foundExam = examsData.find(e => e.id === id);
    if (foundExam) {
      setExam(foundExam);
      setTimeLeft(foundExam.timeLimitSeconds);
      
      // Deep copy all initial grids to save user edits dynamically
      const initialGrids = foundExam.questions.map(q => 
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

  if (!isLoaded || !exam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading exam environment...</span>
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
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Instructions
            </span>
            <h2 className="text-xl font-bold text-slate-100">{exam.title}</h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Once you start, a countdown timer will begin. Hints, solutions, and inline verification checks are strictly disabled. Submit your final spreadsheet answers before time runs out.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-semibold">Time Limit</span>
              <span className="font-mono text-sm font-bold text-slate-200 mt-1 block">
                {exam.timeLimitSeconds / 60} Minutes
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-semibold">Questions</span>
              <span className="font-mono text-sm font-bold text-slate-200 mt-1 block">
                {exam.questions.length} Challenges
              </span>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/10"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // Exam result sheet view
  if (examFinished && resultsData) {
    const hasPassed = resultsData.score >= 70;

    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Assessment Result</span>
            <h2 className="text-2xl font-black text-slate-100">{exam.title}</h2>
          </div>

          {/* Pass/Fail banner */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 select-none ${
            hasPassed 
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-450' 
              : 'bg-rose-950/20 border-rose-500/30 text-rose-455'
          }`}>
            {hasPassed ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <AlertTriangle className="w-10 h-10" />
            )}
            <div>
              <div className="font-bold text-lg">{hasPassed ? 'Status: PASSED' : 'Status: NOT COMPLETED'}</div>
              <p className="text-slate-400 text-xs mt-1 max-w-sm font-sans leading-relaxed">
                {hasPassed 
                  ? 'Congratulations! You have demonstrated core competency in this category.' 
                  : 'You did not reach the 70% passing threshold. Review the questions and try again.'}
              </p>
            </div>
          </div>

          {/* Results specs */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-sans font-semibold">Score</span>
              <span className="text-lg font-black text-slate-100 mt-1 block">{resultsData.score}%</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-sans font-semibold">Correct</span>
              <span className="text-lg font-black text-emerald-455 mt-1 block">{resultsData.correctCount}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-550 block font-sans font-semibold">Wrong</span>
              <span className="text-lg font-black text-rose-455 mt-1 block">{resultsData.wrongCount}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/exam"
              className="flex-1 py-3 border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 font-semibold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition active:scale-98"
            >
              <Home className="w-4 h-4" />
              Exit to Lobby
            </Link>
          </div>
        </div>
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Question</span>
            <span className="font-mono font-bold text-slate-200 text-xs">
              {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-3.5 py-1.5 border rounded-xl font-mono text-xs font-bold ${
            timeLeft < 120 
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse' 
              : 'bg-slate-900 border-slate-850 text-slate-200'
          }`}>
            <Timer className="w-4 h-4 text-slate-400" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* 2. Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Spreadsheet Area (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            
            {/* Task Description */}
            <div className="space-y-2.5 text-sm leading-relaxed text-slate-350">
              <p><strong className="text-slate-250">Scenario:</strong> {activeQuestion.scenario}</p>
              
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 mt-2">
                <strong className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                  Active Instruction:
                </strong>
                <p className="text-slate-100 font-semibold">{activeQuestion.task}</p>
              </div>
            </div>

            {/* Live spreadsheet practice canvas */}
            <div className="w-full min-h-[380px] h-[420px] pt-2">
              <Spreadsheet 
                key={activeQuestion.id} // Forces remounting when moving questions to load correct grid
                initialState={activeSheetState} 
                onChange={handleGridChange}
              />
            </div>

            {/* Bottom session navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-850">
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
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg"
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
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
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
