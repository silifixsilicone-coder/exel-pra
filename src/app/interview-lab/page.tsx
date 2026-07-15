"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Star, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Award, 
  Play, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  HelpCircle,
  FileText,
  Clock,
  Briefcase,
  TrendingUp,
  X,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { interviewsData, InterviewQuestionType } from '@/data/interviews';

interface AssessmentState {
  id: string;
  title: string;
  categoryFilter: string;
  questions: InterviewQuestionType[];
  currentIndex: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  startTime: number;
  timeSpent: number; // in seconds
  isActive: boolean;
  isFinished: boolean;
}

export default function InterviewLabPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Selected single question mode (optional practice)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  
  // Assessment mode states
  const [assessment, setAssessment] = useState<AssessmentState | null>(null);

  // Local storage state trackers
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, score: 0 });

  // Sandbox inputs
  const [userTextAnswer, setUserTextAnswer] = useState('');
  const [userOptionAnswer, setUserOptionAnswer] = useState('');
  const [pressedShortcutKeys, setPressedShortcutKeys] = useState<string[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState<{ checked: boolean; isCorrect: boolean } | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Load persistent stats
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCompleted = localStorage.getItem('interview_lab_completed');
      if (storedCompleted) setCompletedQuestions(JSON.parse(storedCompleted));

      const storedAttempts = localStorage.getItem('interview_lab_attempts');
      if (storedAttempts) setAttemptsCount(Number(storedAttempts));

      const storedStats = localStorage.getItem('interview_lab_stats');
      if (storedStats) setStats(JSON.parse(storedStats));
    }
  }, []);

  const selectedQuestion = interviewsData.find(q => q.id === selectedQuestionId);

  // Mock assessments configurations
  const mockPacks = [
    { id: 'mnc-excel', title: 'MNC Excel Assessment', role: 'Excel Analyst' as const, difficulty: 'Medium' as const, count: 8, time: '15 min', categoryFilter: 'Excel Analyst' as const },
    { id: 'finance-excel', title: 'Finance Excel Assessment', role: 'Accountant' as const, difficulty: 'Hard' as const, count: 6, time: '12 min', categoryFilter: 'Accountant' as const },
    { id: 'mis-executive', title: 'MIS Executive Assessment', role: 'MIS Executive' as const, difficulty: 'Medium' as const, count: 8, time: '15 min', categoryFilter: 'MIS Executive' as const },
    { id: 'data-entry', title: 'Data Entry Assessment', role: 'Data Entry' as const, difficulty: 'Easy' as const, count: 10, time: '10 min', categoryFilter: 'Data Entry' as const },
    { id: 'office-admin', title: 'Office Admin Assessment', role: 'Office Admin' as const, difficulty: 'Easy' as const, count: 8, time: '10 min', categoryFilter: 'Office Admin' as const }
  ];

  // Starts an assessment pack
  const handleStartAssessment = (packId: string) => {
    const pack = mockPacks.find(p => p.id === packId);
    if (!pack) return;

    // Filter relevant questions for this assessment
    const questions = interviewsData.filter(q => q.category === pack.categoryFilter).slice(0, pack.count);
    
    setAssessment({
      id: packId,
      title: pack.title,
      categoryFilter: pack.categoryFilter,
      questions,
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      startTime: Date.now(),
      timeSpent: 0,
      isActive: true,
      isFinished: false
    });

    // Reset simulator inputs
    setUserTextAnswer('');
    setUserOptionAnswer('');
    setPressedShortcutKeys([]);
    setPracticeFeedback(null);
    setShowSolution(false);
    setSelectedQuestionId(null);
  };

  // Shortcut keypress interceptor inside details panel
  useEffect(() => {
    const activeQ = selectedQuestion || (assessment?.isActive ? assessment.questions[assessment.currentIndex] : null);
    if (!activeQ || activeQ.questionType !== 'Shortcut') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyName = e.key.toLowerCase();
      // Block default browser shortcut triggers
      const isInterception = ['c', 'x', 'v', 'b', 'i', 'u', 'z', 'y', 's', 'p', 'f', 'h', 't', 'l', '1', '=', '4', '5'].includes(keyName) ||
                            keyName === 'f2' || keyName === 'f4' || keyName === 'f7' || keyName === 'f11' ||
                            ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(keyName);

      if ((e.ctrlKey || e.altKey || e.metaKey) && isInterception) {
        e.preventDefault();
      }

      const keys: string[] = [];
      if (e.ctrlKey || e.metaKey) keys.push('control');
      if (e.shiftKey) keys.push('shift');
      if (e.altKey) keys.push('alt');

      if (!['control', 'shift', 'alt', 'meta'].includes(keyName)) {
        if (keyName === '$' || keyName === '4') keys.push('$');
        else if (keyName === '%' || keyName === '5') keys.push('%');
        else keys.push(keyName);
      }

      const uniqueKeys = Array.from(new Set(keys));
      setPressedShortcutKeys(uniqueKeys);

      const sortedAccepted = [...activeQ.acceptedAnswer].sort();
      const sortedPressed = [...uniqueKeys].sort();

      const isMatch = sortedAccepted.length === sortedPressed.length &&
                      sortedAccepted.every((val, index) => val === sortedPressed[index]);

      if (isMatch) {
        setPracticeFeedback({ checked: true, isCorrect: true });
        handleSaveSuccess(activeQ.id);
      } else if (uniqueKeys.length >= sortedAccepted.length) {
        setPracticeFeedback({ checked: true, isCorrect: false });
        handleSaveFailure();
      }
    };

    const handleKeyUp = () => {
      setPressedShortcutKeys([]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedQuestionId, assessment?.isActive, assessment?.currentIndex]);

  // Evaluates answer submissions
  const handleCheckAnswer = () => {
    const activeQ = selectedQuestion || (assessment?.isActive ? assessment.questions[assessment.currentIndex] : null);
    if (!activeQ) return;

    let isCorrect = false;

    if (activeQ.questionType === 'Theory') {
      const selectedLetter = userOptionAnswer.trim().charAt(0).toUpperCase();
      const expectedLetter = activeQ.acceptedAnswer[0].trim().toUpperCase();
      isCorrect = selectedLetter === expectedLetter;
    } else {
      const normalizedUser = userTextAnswer.trim().replace(/\s+/g, '').toUpperCase();
      isCorrect = activeQ.acceptedAnswer.some(ans => {
        const normalizedAns = ans.trim().replace(/\s+/g, '').toUpperCase();
        return normalizedUser === normalizedAns;
      });
    }

    setPracticeFeedback({
      checked: true,
      isCorrect
    });

    if (isCorrect) {
      handleSaveSuccess(activeQ.id);
    } else {
      handleSaveFailure();
    }
  };

  const handleSaveSuccess = (qId: string) => {
    if (assessment?.isActive) {
      setAssessment(prev => {
        if (!prev) return null;
        return {
          ...prev,
          score: prev.score + 100 / prev.questions.length,
          correctCount: prev.correctCount + 1
        };
      });
    } else {
      // Practice question success
      const updatedStats = {
        ...stats,
        correct: stats.correct + 1,
        score: stats.score + 10
      };
      setStats(updatedStats);
      localStorage.setItem('interview_lab_stats', JSON.stringify(updatedStats));

      if (!completedQuestions.includes(qId)) {
        const updatedCompleted = [...completedQuestions, qId];
        setCompletedQuestions(updatedCompleted);
        localStorage.setItem('interview_lab_completed', JSON.stringify(updatedCompleted));
      }
    }
  };

  const handleSaveFailure = () => {
    if (assessment?.isActive) {
      setAssessment(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wrongCount: prev.wrongCount + 1
        };
      });
    } else {
      const updatedStats = {
        ...stats,
        wrong: stats.wrong + 1
      };
      setStats(updatedStats);
      localStorage.setItem('interview_lab_stats', JSON.stringify(updatedStats));
    }
  };

  const handleNextQuestion = () => {
    if (assessment?.isActive) {
      const nextIndex = assessment.currentIndex + 1;
      if (nextIndex < assessment.questions.length) {
        setAssessment(prev => {
          if (!prev) return null;
          return { ...prev, currentIndex: nextIndex };
        });
        // Reset sandbox
        setUserTextAnswer('');
        setUserOptionAnswer('');
        setPressedShortcutKeys([]);
        setPracticeFeedback(null);
        setShowSolution(false);
      } else {
        // Finish assessment
        setAssessment(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isActive: false,
            isFinished: true,
            timeSpent: Math.round((Date.now() - prev.startTime) / 1000)
          };
        });

        const nextAttempts = attemptsCount + 1;
        setAttemptsCount(nextAttempts);
        localStorage.setItem('interview_lab_attempts', String(nextAttempts));
      }
    } else {
      // Individual practice next
      const currentIdx = interviewsData.findIndex(q => q.id === selectedQuestionId);
      const nextQ = interviewsData[(currentIdx + 1) % interviewsData.length];
      handleOpenShortcut(nextQ.id);
    }
  };

  const handleOpenShortcut = (id: string) => {
    setSelectedQuestionId(id);
    setAssessment(null);
    setUserTextAnswer('');
    setUserOptionAnswer('');
    setPressedShortcutKeys([]);
    setPracticeFeedback(null);
    setShowSolution(false);
  };

  const handleResetSimulator = () => {
    setUserTextAnswer('');
    setUserOptionAnswer('');
    setPressedShortcutKeys([]);
    setPracticeFeedback(null);
    setShowSolution(false);
  };

  // Filter individual practice challenges
  const filteredQuestions = React.useMemo(() => {
    return interviewsData.filter(q => {
      const matchesSearch = 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
      const matchesRole = filterRole === 'All' || q.role === filterRole;
      const matchesType = filterType === 'All' || q.questionType === filterType;

      return matchesSearch && matchesDifficulty && matchesRole && matchesType;
    });
  }, [searchQuery, filterDifficulty, filterRole, filterType]);

  const activeQuestion = selectedQuestion || (assessment?.isActive ? assessment.questions[assessment.currentIndex] : null);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. Assessment Finished Result Page */}
      {assessment?.isFinished && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-4 animate-bounce">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">
              Assessment Completed!
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {assessment.title}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Final Score</span>
              <span className="text-xl font-extrabold text-slate-100 font-mono">
                {Math.round(assessment.score)} <span className="text-xs text-slate-500 font-normal">/100</span>
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Accuracy</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {Math.round((assessment.correctCount / assessment.questions.length) * 100)}%
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Correct</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{assessment.correctCount}</span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Time Taken</span>
              <span className="text-xl font-extrabold text-slate-100 font-mono">{Math.round(assessment.timeSpent / 60)}m {assessment.timeSpent % 60}s</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-left space-y-2.5 text-xs">
            <div>
              <strong className="text-slate-350">Strong Topics:</strong>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">{assessment.categoryFilter}</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">Data Sorting</span>
              </div>
            </div>
            <div className="border-t border-slate-850 pt-2.5">
              <strong className="text-slate-350">Recommended Practice:</strong>
              <p className="text-slate-400 mt-1">Practice formula range bindings to improve speed and layout accuracy.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleStartAssessment(assessment.id)}
              className="flex-1 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Retry Assessment
            </button>
            <Link
              href="/practice"
              className="flex-1 px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center transition"
            >
              Go to Practice
            </Link>
          </div>
        </div>
      )}

      {/* 2. Assessment Mode / Practice Workspace Mode */}
      {!assessment?.isFinished && activeQuestion ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Action Back link */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <button
              onClick={() => { setSelectedQuestionId(null); setAssessment(null); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit Assessment
            </button>

            {assessment?.isActive && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-500">Assessment:</span>
                <span className="text-slate-200 font-semibold">{assessment.title}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-450 font-bold">
                  Q{assessment.currentIndex + 1} of {assessment.questions.length}
                </span>
              </div>
            )}
          </div>

          {/* Main 3-Column Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Sidebar (25% = lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    Question
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-850 text-slate-400 rounded-md font-mono">
                    {activeQuestion.estimatedTime}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-850 text-slate-300 rounded">
                      {activeQuestion.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                      activeQuestion.difficulty === 'Beginner' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' :
                      activeQuestion.difficulty === 'Intermediate' ? 'bg-amber-950/20 text-amber-400 border-amber-900/50' : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                    }`}>
                      {activeQuestion.difficulty}
                    </span>
                  </div>
                  
                  <h2 className="text-sm font-bold text-slate-100 leading-snug">
                    {activeQuestion.title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed font-sans mt-2">
                    <strong className="text-slate-200 block mb-0.5">Scenario:</strong>
                    {activeQuestion.scenario}
                  </p>
                  
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 mt-2">
                    <strong className="text-emerald-450 text-[10px] font-semibold uppercase tracking-wider block mb-1">Instructions</strong>
                    <p className="text-slate-100 font-semibold leading-normal">{activeQuestion.instructions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Area: Question Interactive Panel (58% = lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Question Task Prompt Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-xs leading-relaxed">
                <strong className="text-emerald-450 block uppercase text-[10px] tracking-wider mb-1">Question</strong>
                <p className="text-slate-100 font-medium text-sm leading-normal">{activeQuestion.question}</p>
              </div>

              {/* Renders Workspace content dynamically based on QuestionType */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col space-y-4 min-h-[300px]">
                
                {/* 1. Theory MCQ choice selection */}
                {activeQuestion.questionType === 'Theory' && activeQuestion.options && (
                  <div className="flex-1 flex flex-col justify-center space-y-3 py-4">
                    {activeQuestion.options.map(option => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer text-xs font-semibold transition ${
                          userOptionAnswer === option
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="theory-options"
                          value={option}
                          checked={userOptionAnswer === option}
                          onChange={() => setUserOptionAnswer(option)}
                          className="accent-emerald-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {/* 2. Shortcut capturing panel */}
                {activeQuestion.questionType === 'Shortcut' && (
                  <div className="flex-1 flex flex-col justify-center items-center py-6 text-center space-y-3 font-mono">
                    <p className="text-xs text-slate-400 font-sans">Press the keyboard shortcut to answer.</p>
                    <div className="px-6 py-4 bg-slate-950 border border-slate-850 rounded-xl flex gap-2 justify-center min-w-[200px]">
                      {pressedShortcutKeys.length === 0 ? (
                        <span className="text-slate-600 italic text-xs font-sans">(Waiting for shortcut...)</span>
                      ) : (
                        pressedShortcutKeys.map((k, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-emerald-400">
                            {k.toUpperCase()}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Formulas & Spreadsheet Grid Simulator */}
                {activeQuestion.spreadsheetData && (
                  <div className="flex-1 space-y-3 min-h-0">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono shadow-inner">
                      <div className="w-10 text-center font-bold text-emerald-500 bg-slate-900 py-1 rounded">
                        {activeQuestion.targetCell || 'A1'}
                      </div>
                      <span className="text-slate-500 font-serif italic pl-1 select-none">fx</span>
                      <input
                        type="text"
                        value={userTextAnswer}
                        onChange={(e) => setUserTextAnswer(e.target.value)}
                        placeholder="Enter cell formula (e.g. =B2-C2)"
                        className="flex-1 bg-transparent border-none text-emerald-450 focus:outline-none placeholder-slate-700"
                      />
                    </div>

                    {/* Interactive table */}
                    <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950 font-mono text-xs">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-900/60 border-b border-slate-800">
                            <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none" />
                            {activeQuestion.spreadsheetData.headers.map((h, idx) => (
                              <th key={idx} className="p-2 border-r border-slate-850 text-slate-400 font-semibold text-center">
                                {String.fromCharCode(65 + idx)}
                              </th>
                            ))}
                          </tr>
                          <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-300 font-medium">
                            <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none">1</th>
                            {activeQuestion.spreadsheetData.headers.map((h, idx) => (
                              <th key={idx} className="p-2 border-r border-slate-850 text-center">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeQuestion.spreadsheetData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-850">
                              <td className="p-2 border-r border-slate-800 text-slate-500 text-center font-bold select-none">
                                {rIdx + 2}
                              </td>
                              {row.map((cell, cIdx) => {
                                const cellAddr = String.fromCharCode(65 + cIdx) + (rIdx + 2);
                                const isTarget = cellAddr === activeQuestion.targetCell;
                                return (
                                  <td
                                    key={cIdx}
                                    className={`p-2 border-r border-slate-850 text-center text-slate-300 ${
                                      isTarget ? 'bg-slate-900/80 ring-2 ring-emerald-500 ring-inset font-bold' : ''
                                    }`}
                                  >
                                    {isTarget ? (
                                      <input
                                        type="text"
                                        value={userTextAnswer}
                                        onChange={(e) => setUserTextAnswer(e.target.value)}
                                        placeholder="Enter formula"
                                        className="w-full text-center bg-transparent text-emerald-400 font-bold focus:outline-none placeholder-slate-700"
                                      />
                                    ) : (
                                      cell
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Practice Feedback notifications */}
              {practiceFeedback && (
                <div className={`p-4 border rounded-2xl flex items-start gap-3 text-xs animate-in slide-in-from-bottom-2 duration-200 ${
                  practiceFeedback.isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-355' 
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
                }`}>
                  {practiceFeedback.isCorrect ? (
                    <Check className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-455 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 w-full">
                    <h4 className="font-bold text-sm">
                      {practiceFeedback.isCorrect ? '✅ Evaluation Success!' : '❌ Incorrect Assessment'}
                    </h4>
                    <p className="text-slate-400 font-sans leading-normal mt-0.5">
                      {practiceFeedback.isCorrect 
                        ? 'Great job! Your response matches the correct assessment validation answer.'
                        : `Oops! The answers don't match. Check details or review target values.`
                      }
                    </p>
                    {practiceFeedback.isCorrect ? (
                      <div className="mt-3 p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Explanation:</span>
                          <p className="text-slate-350 font-sans leading-relaxed">{activeQuestion.explanation}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-rose-400 mt-2 font-medium font-sans">
                        Reason: Check syntax constraints, quotes, range addresses, or try again.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel (20% = lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3.5">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 select-none">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  Assessment Helper
                </h3>
                
                <div className="space-y-3 text-xs leading-normal">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Hint</span>
                    <p className="text-slate-300 mt-0.5 font-sans leading-normal">{activeQuestion.hint}</p>
                  </div>
                  
                  {activeQuestion.solution && (
                    <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">Need Solution?</span>
                        <button
                          onClick={() => setShowSolution(prev => !prev)}
                          className="text-emerald-450 hover:text-emerald-350 text-[10px] font-bold transition flex items-center gap-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          {showSolution ? 'Hide Ans' : 'Show Ans'}
                        </button>
                      </div>
                      {showSolution && (
                        <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg animate-in slide-in-from-top-1 duration-150">
                          <code className="font-mono text-[10px] text-emerald-455 font-bold break-all">
                            {activeQuestion.solution}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-40 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
              <div className="flex gap-2">
                <button
                  onClick={handleResetSimulator}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              <div className="flex gap-2">
                {practiceFeedback?.isCorrect && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold transition animate-pulse"
                  >
                    Next Question
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {!practiceFeedback?.isCorrect && (
                  <button
                    onClick={handleCheckAnswer}
                    className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/10"
                  >
                    <Check className="w-4 h-4" />
                    Submit Answer
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : null}

      {/* 3. Landing Page Landing Grid Dashboard */}
      {!assessment?.isActive && !assessment?.isFinished && !selectedQuestionId && (
        <>
          {/* Landing Title Header */}
          <div className="flex flex-col space-y-4 shrink-0">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
                Excel Interview Lab
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Practice Excel assessments, mock hiring tests, and formula questions curated for real jobs.
              </p>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>

              {/* Difficulty filter select */}
              <div>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-slate-350 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Role filter select */}
              <div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-slate-350 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Roles</option>
                  <option value="Accountant">Accountant</option>
                  <option value="MIS Executive">MIS Executive</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Office Admin">Office Admin</option>
                  <option value="HR">HR</option>
                  <option value="Business Analyst">Business Analyst</option>
                </select>
              </div>

              {/* QuestionType filter select */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-slate-350 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Types</option>
                  <option value="Theory">Theory MCQ</option>
                  <option value="Formula">Formula Input</option>
                  <option value="Spreadsheet">Spreadsheet Practical</option>
                  <option value="Shortcut">Shortcut</option>
                  <option value="Pivot Table">Pivot Table</option>
                  <option value="Charts">Charts</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3.1 Mock Assessments Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Mock Company assessments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPacks.map(pack => (
                <div
                  key={pack.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between gap-5 shadow-lg transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-850 text-emerald-450 rounded">
                        {pack.role}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pack.time}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-100">
                      {pack.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      Assessment covering essential hiring criteria: {pack.categoryFilter} operations, lookup matches, and report validations.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {pack.count} Challenges • {pack.difficulty}
                    </span>
                    
                    <button
                      onClick={() => handleStartAssessment(pack.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Start Test
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3.2 Individual Practice List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Individual Practice Challenges ({filteredQuestions.length})
            </h3>

            {filteredQuestions.length === 0 ? (
              <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                No individual questions match selected filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.slice(0, 16).map(q => (
                  <div
                    key={q.id}
                    onClick={() => handleOpenShortcut(q.id)}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:shadow-xl transition"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[8px] font-bold bg-slate-950 border border-slate-850 text-slate-450 rounded">
                          {q.role}
                        </span>
                        <span className={`px-2 py-0.5 text-[8px] font-bold rounded border ${
                          q.difficulty === 'Beginner' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' :
                          q.difficulty === 'Intermediate' ? 'bg-amber-950/20 text-amber-400 border-amber-900/50' : 'bg-rose-950/20 text-rose-455'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 truncate">{q.title}</h4>
                      <p className="text-[10px] text-slate-450 truncate">{q.question}</p>
                    </div>

                    <button className="p-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-emerald-450 transition shrink-0">
                      <Play className="w-3.5 h-3.5 fill-emerald-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3.3 Learning Progress Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-450" />
              Interview Lab Learning Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Assessments Finished</span>
                <span className="text-2xl font-extrabold text-slate-100 font-mono">{attemptsCount}</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Questions Solved</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {completedQuestions.length}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Correct Answers</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {stats.correct}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Overall Score</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">
                  {stats.score}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
