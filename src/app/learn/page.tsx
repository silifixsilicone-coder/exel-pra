"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, Lock, Play, Search, XCircle, Award } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { lessonsData } from '@/data/lessons';
import { curriculumCategories } from '@/data/curriculum';

export default function LearnIndex() {
  const { progress, isLoaded } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading curriculum...</span>
        </div>
      </div>
    );
  }

  const completedLessons = progress.completedLessonIds || [];

  // Filter lessons based on query
  const matchingLessons = lessonsData.filter((lesson) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lesson.title.toLowerCase().includes(q) ||
      lesson.category.toLowerCase().includes(q) ||
      lesson.explanation.toLowerCase().includes(q) ||
      lesson.difficulty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-8 max-w-5xl mx-auto selection:bg-emerald-500 selection:text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Excel Learning Curriculum
          </h1>
          <p className="text-slate-450 text-xs md:text-sm leading-relaxed max-w-xl font-sans">
            Master Microsoft Excel concepts step-by-step. Access {lessonsData.length} lessons divided into 20 modular categories, each featuring interactive tasks and quizzes.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl min-w-[240px] space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <span>Overall Completion</span>
            <span className="font-mono text-emerald-450">{completedLessons.length} / {lessonsData.length} Lessons</span>
          </div>
          <div className="w-full bg-slate-950 border border-slate-850 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${(completedLessons.length / lessonsData.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="relative group max-w-lg">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition" />
        <input
          type="text"
          placeholder="Search curriculum topic, formula, difficulty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-10 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition font-sans shadow-inner placeholder-slate-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
          >
            <XCircle className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Search results view vs. default modules view */}
      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Search Matches ({matchingLessons.length} lessons found)
          </h2>
          {matchingLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingLessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = progress.currentLessonId === lesson.id;

                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${lesson.id}`}
                    className={`group flex items-center justify-between p-4 bg-slate-900 border rounded-xl hover:border-slate-700/60 hover:bg-slate-900/80 active:scale-[0.99] transition ${
                      isCompleted 
                        ? 'border-emerald-950/40 bg-emerald-950/5' 
                        : isCurrent
                        ? 'border-emerald-500/30'
                        : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-450 shrink-0" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                          isCurrent ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700'
                        }`}>
                          {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-450" />}
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                          {lesson.title}
                        </h3>
                        <div className="flex gap-2 text-[10px] text-slate-500 font-medium font-mono uppercase">
                          <span>{lesson.category}</span>
                          <span>•</span>
                          <span>{lesson.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-slate-900 border border-slate-850 rounded-2xl text-center text-xs text-slate-550 font-sans leading-normal">
              No matching curriculum lessons found. Try searching for "SUM", "VLOOKUP", or "Basics".
            </div>
          )}
        </div>
      ) : (
        /* Default 20 Modules View */
        <div className="space-y-8">
          {curriculumCategories.map((category, catIdx) => {
            const categoryLessons = lessonsData.filter(
              (lesson) => lesson.category.toLowerCase() === category.name.toLowerCase()
            );

            // Unlock next module only if previous one has completed lessons, or if it is the first module (Excel Basics)
            const isUnlocked = catIdx === 0 || completedLessons.length > 0;

            return (
              <div key={category.id} className="space-y-3.5">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <div className="space-y-0.5">
                    <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md font-mono">
                        {String(catIdx + 1).padStart(2, '0')}
                      </span>
                      {category.name}
                    </h2>
                    <p className="text-xs text-slate-450 leading-relaxed font-sans">{category.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    category.difficulty === 'Beginner' 
                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                      : category.difficulty === 'Intermediate'
                      ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                      : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                  }`}>
                    {category.difficulty}
                  </span>
                </div>

                {/* Lessons List in Category */}
                {isUnlocked ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryLessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = progress.currentLessonId === lesson.id;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${lesson.id}`}
                          className={`group flex items-center justify-between p-4 bg-slate-900 border rounded-xl hover:border-slate-700/60 hover:bg-slate-900/80 active:scale-[0.99] transition ${
                            isCompleted 
                              ? 'border-emerald-950/40 bg-emerald-950/5' 
                              : isCurrent
                              ? 'border-emerald-500/30'
                              : 'border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-450 shrink-0" />
                            ) : (
                              <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                                isCurrent ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700'
                              }`}>
                                {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-450" />}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                                {lesson.title}
                              </h3>
                              <div className="flex gap-2 text-[10px] text-slate-500 font-medium font-mono uppercase">
                                <span>{lesson.difficulty}</span>
                                <span>•</span>
                                <span>{lesson.estimatedTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-405 group-hover:text-slate-200 transition">
                            {isCompleted ? (
                              <span className="text-emerald-450 font-bold text-[10px]">Completed</span>
                            ) : isCurrent ? (
                              <span className="text-emerald-450 font-bold text-[10px]">In Progress</span>
                            ) : null}
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 p-4 bg-slate-950 border border-slate-900/60 rounded-xl text-xs text-slate-500 italic select-none font-sans">
                    <Lock className="w-3.5 h-3.5 text-slate-650" />
                    Lessons for this module are currently locked. Finish previous sections to unlock.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
