"use client";

import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  BookMarked,
  Briefcase,
  GraduationCap,
  Calendar,
  Percent
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { practiceQuestionsData } from '@/data/practiceQuestions';
import { lessonsData } from '@/data/lessons';
import { jobProjectsData } from '@/data/jobProjects';

export default function ProgressPage() {
  const { progress, isLoaded, metrics } = useProgress();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading progress statistics...</span>
        </div>
      </div>
    );
  }

  // Calculate some numbers
  const completedLessonsCount = progress.completedLessonIds.length;
  const completedProjectsCount = Object.values(progress.jobProjectStats).filter(p => p.completed).length;
  const completedExamsCount = progress.examResults.length;

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Progress & Performance
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Detailed metrics showing your Excel formula execution and task completion rates.
        </p>
      </div>

      {/* Aggregate metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 select-none shadow-md">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Questions Solved</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {metrics.questionsSolved}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {practiceQuestionsData.length}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 select-none shadow-md">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Accuracy Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-450 font-mono">
              {metrics.accuracy}%
            </span>
            <span className="text-xs text-emerald-600 font-mono">
              target: 80%+
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 select-none shadow-md">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Overall Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-450 font-mono">
              {metrics.overallScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / 100
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 select-none shadow-md">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Submissions Log</span>
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {metrics.correctAttempts} OK
            </span>
            <span className="text-sm font-bold text-rose-455 font-mono">
              {metrics.wrongAttempts} ERR
            </span>
          </div>
        </div>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 sections) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Completed Job Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Briefcase className="w-4.5 h-4.5 text-emerald-450" />
              Completed Corporate Projects
            </h2>

            {completedProjectsCount > 0 ? (
              <div className="divide-y divide-slate-850">
                {Object.entries(progress.jobProjectStats)
                  .filter(([_, stat]) => stat.completed)
                  .map(([projId, stat]) => {
                    const project = jobProjectsData.find(p => p.id === projId);
                    if (!project) return null;
                    return (
                      <div key={projId} className="flex items-center justify-between py-3">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-semibold text-slate-200">{project.title}</h4>
                          <span className="text-[10px] text-slate-500 font-mono uppercase">Role: {project.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(stat.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic select-none py-2 leading-relaxed">
                No corporate projects completed yet. Head over to <strong>Job Mode</strong> to work on real corporate spreadsheets.
              </div>
            )}
          </div>

          {/* Past Exam Certificates */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <GraduationCap className="w-4.5 h-4.5 text-emerald-450" />
              Certification Exam Results
            </h2>

            {completedExamsCount > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-850">
                      <th className="px-4 py-3 font-semibold text-slate-400">Exam Details</th>
                      <th className="px-4 py-3 font-semibold text-slate-400">Result</th>
                      <th className="px-4 py-3 font-semibold text-slate-400">Date Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress.examResults.map((result, i) => (
                      <tr key={i} className="border-b border-slate-900/50 hover:bg-slate-900/10">
                        <td className="px-4 py-3 font-semibold text-slate-350">
                          {result.examId === 'beginner-exam' ? 'Beginner Certification' : 
                           result.examId === 'intermediate-exam' ? 'Intermediate Certification' : 
                           result.examId === 'advanced-exam' ? 'Advanced Certification' : 'Job Ready Certification'}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold">
                          <span className={result.score >= 70 ? 'text-emerald-450' : 'text-rose-455'}>
                            {result.score}% {result.score >= 70 ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">{result.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic select-none py-2 leading-relaxed">
                No mock assessments taken yet. Open the <strong>Exams</strong> panel to verify your skills.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Aggregate Overview) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-3 select-none">
              <Award className="w-4 h-4 text-emerald-400" />
              Curriculum Overview
            </h3>

            <div className="space-y-4">
              {/* Stat 1 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-slate-450" />
                    Lessons Completed
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {completedLessonsCount} / {lessonsData.length}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${(completedLessonsCount / lessonsData.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-455" />
                    Questions Mastered
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {metrics.questionsSolved} / {practiceQuestionsData.length}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${(metrics.questionsSolved / practiceQuestionsData.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-455" />
                    Job Projects Complete
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {completedProjectsCount} / {jobProjectsData.length}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${(completedProjectsCount / jobProjectsData.length) * 100}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
