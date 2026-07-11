"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Grid, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Search,
  Filter
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { practiceQuestionsData } from '@/data/practiceQuestions';

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export default function PracticeIndex() {
  const { progress, isLoaded, metrics } = useProgress();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading practice catalog...</span>
        </div>
      </div>
    );
  }

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(practiceQuestionsData.map(q => q.category)))];

  // Filter practice questions
  const filteredQuestions = practiceQuestionsData.filter(q => {
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  const completedQuestions = progress.completedQuestionIds || [];

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Practice Challenges
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            "LeetCode for Excel." Learn by writing formulas directly inside real spreadsheet scenarios.
          </p>
        </div>

        {/* Aggregate Mini-card */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 shrink-0 select-none">
          <div className="text-xs">
            <span className="text-slate-500 block uppercase font-semibold">Solved</span>
            <span className="font-mono font-bold text-slate-100">{metrics.questionsSolved} / {practiceQuestionsData.length}</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-850" />
          <div className="text-xs">
            <span className="text-slate-500 block uppercase font-semibold">Accuracy</span>
            <span className="font-mono font-bold text-emerald-450">{metrics.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Selection filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyFilter)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-300"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-300"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {filteredQuestions.length > 0 ? (
          <div className="divide-y divide-slate-850">
            {filteredQuestions.map((q) => {
              const isCompleted = completedQuestions.includes(q.id);
              const stats = progress.questionStats[q.id];
              const isAttempted = stats && stats.attempts > 0;

              return (
                <Link
                  key={q.id}
                  href={`/practice/${q.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-900/60 transition active:scale-[0.995]"
                >
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className="mt-1 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isAttempted ? (
                        <div className="w-5 h-5 rounded-full border border-rose-500/50 bg-rose-500/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-455" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center">
                          <HelpCircle className="w-3 h-3 text-slate-650" />
                        </div>
                      )}
                    </div>

                    {/* Meta & Info */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-emerald-450 font-mono font-semibold text-sm">
                          Q{q.questionNum}.
                        </span>
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition">
                          {q.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-[10px] text-slate-450 font-medium">
                          {q.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-450 max-w-xl line-clamp-1 font-sans">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-9 sm:ml-0">
                    {/* Difficulty Badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                      q.difficulty === 'Beginner' 
                        ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                        : q.difficulty === 'Intermediate'
                        ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                        : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                    }`}>
                      {q.difficulty}
                    </span>
                    {/* Time limit */}
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {q.estimatedTime}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-650 group-hover:translate-x-0.5 group-hover:text-slate-400 transition shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 italic font-mono select-none">
            No questions match your filters. Try search or adjusting filters.
          </div>
        )}
      </div>

    </div>
  );
}
