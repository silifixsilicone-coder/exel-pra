"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Grid, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Search,
  Filter,
  Shuffle,
  Sparkles
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { practiceQuestionsData, getQuestionById, totalQuestionsCount, practiceCategories } from '@/data/practiceQuestions';

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export default function PracticeIndex() {
  const router = useRouter();
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

  // Categories list
  const categories = ['All', ...practiceCategories];

  // Try parsing search query as integer ID to dynamically find from the 10,000+ dataset
  const parsedId = searchQuery.trim().replace(/^#/, '');
  const searchIdNum = parseInt(parsedId, 10);
  const searchedGenQuestion = (!isNaN(searchIdNum) && searchIdNum >= 1 && searchIdNum <= totalQuestionsCount)
    ? getQuestionById(`q-gen-${searchIdNum}`)
    : undefined;

  // Filter practice questions from catalog
  const filteredQuestions = practiceQuestionsData.filter(q => {
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    
    const matchesSearch = searchQuery.trim() === '' || 
                          q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  // If we found a direct ID match from the 10,000+ pool, display it at the top of results
  if (searchedGenQuestion) {
    if (!filteredQuestions.some(q => q.id === searchedGenQuestion.id)) {
      filteredQuestions.unshift(searchedGenQuestion);
    }
  }

  const completedQuestions = progress.completedQuestionIds || [];

  // Pick random question helper
  const handleRandomChallenge = () => {
    const randomId = Math.floor(Math.random() * totalQuestionsCount) + 1;
    router.push(`/practice/q-gen-${randomId}`);
  };

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-6 max-w-5xl mx-auto selection:bg-emerald-500 selection:text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
            Practice Challenges
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-slate-450 text-xs md:text-sm leading-relaxed max-w-lg font-sans">
            "LeetCode for Excel." Learn by writing formulas directly inside real spreadsheet scenarios. Access a pool of {totalQuestionsCount.toLocaleString()}+ dynamic challenges.
          </p>
        </div>

        {/* Aggregate Mini-card */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 shrink-0 select-none">
          <div className="text-xs">
            <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wider">Solved</span>
            <span className="font-mono font-bold text-slate-100">{completedQuestions.length} Challenges</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-800" />
          <div className="text-xs">
            <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wider">Accuracy</span>
            <span className="font-mono font-bold text-emerald-450">{metrics.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search & Random Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, category or ID (e.g. #4500)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-emerald-500/50 transition font-sans placeholder-slate-500"
            />
          </div>

          {/* Random Challenge button */}
          <button
            onClick={handleRandomChallenge}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold active:scale-95 transition"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            Random Challenge
          </button>
        </div>

        {/* Selection filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5" />
            <span>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyFilter)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-300 w-full sm:w-auto font-sans"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 w-full sm:w-auto">
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-300 w-full sm:w-auto font-sans"
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
                        <CheckCircle2 className="w-5 h-5 text-emerald-450" />
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
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-[10px] text-slate-450 font-medium font-sans">
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
