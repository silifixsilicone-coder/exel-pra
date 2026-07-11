"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, Lock, Play } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { lessonsData } from '@/data/lessons';
import { curriculumCategories } from '@/data/curriculum';

export default function LearnIndex() {
  const { progress, isLoaded } = useProgress();

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

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Excel Curriculum
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Master formulas and formatting concepts step-by-step. Each lesson includes a live interactive mini-practice.
        </p>
      </div>

      {/* Curriculum Grid */}
      <div className="space-y-8">
        {curriculumCategories.map((category) => {
          // Find lessons belonging to this category
          const categoryLessons = lessonsData.filter(
            (lesson) => lesson.category.toLowerCase() === category.name.toLowerCase()
          );

          return (
            <div key={category.id} className="space-y-3.5">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-slate-200">{category.name}</h2>
                  <p className="text-xs text-slate-450">{category.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
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
              {categoryLessons.length > 0 ? (
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
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
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
                            <span className="text-[10px] text-slate-500 font-medium font-mono uppercase block">
                              Difficulty: {lesson.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-200 transition">
                          {isCompleted ? (
                            <span className="text-emerald-450 font-semibold text-[11px]">Completed</span>
                          ) : isCurrent ? (
                            <span className="text-emerald-450 font-semibold text-[11px]">In Progress</span>
                          ) : null}
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-4 bg-slate-950 border border-slate-900/60 rounded-xl text-xs text-slate-500 italic select-none">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  Lessons for this module are currently locked. Check back after finishing Excel Basics.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
