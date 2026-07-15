"use client";

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Timer, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  FileSpreadsheet,
  Check,
  Award
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { examsData } from '@/data/exams';

export default function ExamLobby() {
  const { progress, isLoaded } = useProgress();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading exam lobby...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-emerald-450" />
          Mock Exams & Certifications
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Test your Excel mastery in timed, simulated exams. No hints or solutions are provided during these assessments. Get 80% score to unlock your certificate.
        </p>
      </div>

      {/* Available Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examsData.map((exam) => {
          // Find past results for this exam
          const results = progress.examResults.filter(r => r.examId === exam.id);
          const bestResult = results.length > 0 
            ? results.reduce((prev, current) => (prev.score > current.score) ? prev : current)
            : null;

          const isPass = bestResult ? bestResult.score >= 80 : false;

          return (
            <div 
              key={exam.id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-700 transition"
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                    exam.difficulty === 'Beginner' 
                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                      : exam.difficulty === 'Intermediate'
                      ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                      : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                  }`}>
                    {exam.difficulty}
                  </span>
                  
                  <div className="flex items-center gap-3 text-slate-500 text-xs font-mono font-medium">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      30m
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      30 Qs
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-450 shrink-0" />
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    This certification exam evaluates your core formula execution and referencing techniques in spreadsheet structures. Contains 30 random questions from the Excel bank.
                  </p>
                </div>
              </div>

              {/* Past Results / Start CTA */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div>
                  {bestResult ? (
                    <div className="space-y-0.5 select-none">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Best Score</span>
                      <span className={`text-xs font-bold font-mono flex items-center gap-1 ${isPass ? 'text-emerald-400' : 'text-rose-455'}`}>
                        {bestResult.score}% {isPass ? '(Passed ✓)' : '(Failed)'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 italic select-none">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-650" />
                      No attempts yet
                    </div>
                  )}
                </div>

                <Link
                  href={`/exam/${exam.id}`}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/5 shrink-0"
                >
                  Start Exam
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Attempts & Certificates History */}
      {progress.examResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-450" />
            Certificates & Exam History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Exam Name</th>
                  <th className="py-2.5">Attempt Date</th>
                  <th className="py-2.5 text-center">Score</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {progress.examResults.map((r, idx) => {
                  const examDetails = examsData.find(e => e.id === r.examId);
                  const isPass = r.score >= 80;
                  return (
                    <tr key={idx} className="hover:bg-slate-850/40 transition">
                      <td className="py-3 font-semibold text-slate-200">{examDetails?.title || r.examId}</td>
                      <td className="py-3 font-mono">{r.date || 'Today'}</td>
                      <td className="py-3 font-mono font-bold text-slate-200 text-center">{r.score}%</td>
                      <td className="py-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          isPass ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' : 'bg-rose-950/20 text-rose-400 border border-rose-900/40'
                        }`}>
                          {isPass ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isPass ? (
                          <span className="text-emerald-450 font-bold inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Certified
                          </span>
                        ) : (
                          <span className="text-slate-550 italic">Required 80%</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
