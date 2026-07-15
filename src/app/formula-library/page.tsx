"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Star, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  HelpCircle, 
  Play, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { formulasData, FormulaData, placeholderFormulas } from '@/data/formulas';

export default function FormulaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('⭐ All Formulas');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(null);
  
  // Local storage state hooks
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [practiceCompleted, setPracticeCompleted] = useState<string[]>([]);
  const [learnedFormulas, setLearnedFormulas] = useState<string[]>([]);

  // Try it yourself state variables
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<{
    checked: boolean;
    isCorrect: boolean;
  } | null>(null);

  // Load local storage items
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavs = localStorage.getItem('formula_library_favs');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedRecent = localStorage.getItem('formula_library_recent');
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

      const storedPractice = localStorage.getItem('formula_library_practice');
      if (storedPractice) setPracticeCompleted(JSON.parse(storedPractice));

      const storedLearned = localStorage.getItem('formula_library_learned');
      if (storedLearned) setLearnedFormulas(JSON.parse(storedLearned));
    }
  }, []);

  // Save favorites helper
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let updated: string[] = [];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('formula_library_favs', JSON.stringify(updated));
  };

  // Open detail panel helper
  const handleOpenFormula = (id: string) => {
    setSelectedFormulaId(id);
    setUserAnswer('');
    setPracticeFeedback(null);

    // Track recently viewed
    const filteredRecent = recentlyViewed.filter(recentId => recentId !== id);
    const updatedRecent = [id, ...filteredRecent].slice(0, 10);
    setRecentlyViewed(updatedRecent);
    localStorage.setItem('formula_library_recent', JSON.stringify(updatedRecent));

    // Track as learned/viewed
    if (!learnedFormulas.includes(id)) {
      const updatedLearned = [...learnedFormulas, id];
      setLearnedFormulas(updatedLearned);
      localStorage.setItem('formula_library_learned', JSON.stringify(updatedLearned));
    }
  };

  // Evaluate "Try It Yourself" answer
  const handleCheckPractice = (formula: FormulaData) => {
    const normalizedUser = userAnswer.trim().replace(/\s+/g, '').toUpperCase();
    const isCorrect = formula.acceptedAnswers.some(ans => {
      const normalizedAns = ans.trim().replace(/\s+/g, '').toUpperCase();
      return normalizedUser === normalizedAns;
    });

    setPracticeFeedback({
      checked: true,
      isCorrect
    });

    if (isCorrect) {
      if (!practiceCompleted.includes(formula.id)) {
        const updatedPractice = [...practiceCompleted, formula.id];
        setPracticeCompleted(updatedPractice);
        localStorage.setItem('formula_library_practice', JSON.stringify(updatedPractice));
      }
    }
  };

  const handleResetPractice = () => {
    setUserAnswer('');
    setPracticeFeedback(null);
  };

  // Combine formulas database and placeholders to render a vast listing
  const allListing: Partial<FormulaData>[] = React.useMemo(() => {
    const list: Partial<FormulaData>[] = [...formulasData];
    
    // Add placeholders that don't already exist in database
    placeholderFormulas.forEach(placeholder => {
      if (!list.some(f => f.id === placeholder.id)) {
        list.push({
          ...placeholder,
          // Default fallbacks
          syntax: `=${placeholder.name?.toUpperCase()}(...)`,
          tips: ['Always check your ranges before hitting enter.'],
          mistakes: ['Make sure arguments are separated with commas.'],
          acceptedAnswers: [`=${placeholder.name?.toUpperCase()}(A2:B2)`],
          relatedFormulas: ['SUM', 'AVERAGE']
        });
      }
    });

    return list;
  }, []);

  // Filter functions by search and active category
  const filteredFormulas = React.useMemo(() => {
    return allListing.filter(formula => {
      const matchesSearch = 
        formula.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formula.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formula.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (formula.keywords && formula.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      if (activeCategory === '⭐ All Formulas') return true;
      if (activeCategory === 'Favorites') return favorites.includes(formula.id || '');
      if (activeCategory === 'Recently Viewed') return recentlyViewed.includes(formula.id || '');
      
      return formula.category?.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [allListing, searchQuery, activeCategory, favorites, recentlyViewed]);

  const selectedFormula = formulasData.find(f => f.id === selectedFormulaId) || allListing.find(f => f.id === selectedFormulaId);
  const practice = selectedFormula?.practiceQuestion;

  // Category items list
  const categories = [
    '⭐ All Formulas',
    'Basic',
    'Logical',
    'Lookup',
    'Text',
    'Date & Time',
    'Math',
    'Statistical',
    'Financial',
    'Database',
    'Dynamic Arrays',
    'Information',
    'Engineering',
    'Compatibility',
    'Web',
    'Recently Viewed',
    'Favorites'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
              Excel Formula Library
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Search, learn, practice and master every Excel formula.
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="relative w-full max-w-2xl mt-2">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas... (e.g. SUM, IF, XLOOKUP, TEXTJOIN, COUNTIFS)"
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 shadow-xl transition"
          />
        </div>

        {/* Top Search Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Top Searches:</span>
          {['SUM', 'IF', 'XLOOKUP', 'VLOOKUP', 'COUNTIF', 'TEXTJOIN', 'FILTER', 'UNIQUE'].map(chip => (
            <button
              key={chip}
              onClick={() => setSearchQuery(chip)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-400 rounded-lg transition"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main 3-Column Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0">
        
        {/* Sticky Left Sidebar Navigation (col-span-3) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg lg:sticky lg:top-6 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Categories
          </h3>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedFormulaId(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center justify-between ${
                  activeCategory === cat
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span>{cat}</span>
                {cat === 'Favorites' && (
                  <span className="bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area (col-span-9) */}
        <div className="lg:col-span-9 min-h-0">
          
          {/* A. Grid Card Listing (when no formula selected) */}
          {!selectedFormula ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  {activeCategory} ({filteredFormulas.length})
                </h3>
              </div>

              {filteredFormulas.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
                  <HelpCircle className="w-8 h-8 text-slate-600 animate-bounce" />
                  <p className="text-sm text-slate-400">No formulas found matching your filters.</p>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('⭐ All Formulas'); }} className="text-xs font-semibold text-emerald-400 hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFormulas.map(formula => {
                    const isFav = favorites.includes(formula.id || '');
                    return (
                      <div
                        key={formula.id}
                        onClick={() => handleOpenFormula(formula.id || '')}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:shadow-xl transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
                              {formula.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 text-slate-400 rounded">
                                {formula.category}
                              </span>
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                                formula.difficulty === 'Beginner' ? 'bg-emerald-950/20 text-emerald-400' :
                                formula.difficulty === 'Intermediate' ? 'bg-amber-950/20 text-amber-400' : 'bg-rose-950/20 text-rose-455'
                              }`}>
                                {formula.difficulty}
                              </span>
                              <button
                                onClick={(e) => toggleFavorite(formula.id || '', e)}
                                className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-400 transition"
                              >
                                <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                            {formula.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                          <code className="font-mono text-[10px] text-emerald-450 truncate max-w-[180px]">
                            {formula.syntax}
                          </code>
                          <button
                            onClick={() => handleOpenFormula(formula.id || '')}
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition"
                          >
                            Open Lesson
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            
            // B. Full Formula Detail Page
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Back to Library Header */}
              <button
                onClick={() => setSelectedFormulaId(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Library
              </button>

              {/* Title & Metadata Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                      Formula Reference
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-100 font-mono flex items-center gap-3">
                      {selectedFormula.name}
                      <button
                        onClick={(e) => toggleFavorite(selectedFormula.id || '', e)}
                        className="p-1.5 bg-slate-950 border border-slate-850 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-400 transition"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(selectedFormula.id || '') ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-950 border border-slate-850 text-slate-300 rounded-md">
                      {selectedFormula.category}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${
                      selectedFormula.difficulty === 'Beginner' 
                        ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                        : selectedFormula.difficulty === 'Intermediate'
                        ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                        : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                    }`}>
                      {selectedFormula.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-slate-350">
                  <p>{selectedFormula.description}</p>
                  
                  {/* Syntax Guide Box */}
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4">
                    <span className="text-[10px] text-emerald-450 font-bold uppercase tracking-wider block mb-1">
                      Syntax
                    </span>
                    <code className="block font-mono text-sm text-slate-100 font-bold">
                      {selectedFormula.syntax}
                    </code>
                  </div>
                </div>
              </div>

              {/* Arguments breakdown */}
              {selectedFormula.arguments && selectedFormula.arguments.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-450" />
                    Arguments
                  </h3>
                  <div className="divide-y divide-slate-800/80">
                    {selectedFormula.arguments.map((arg, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start gap-1 md:gap-4 text-xs">
                        <span className="font-mono font-bold text-emerald-400 min-w-[120px] shrink-0">
                          {arg.name} {arg.required ? '(required)' : '(optional)'}
                        </span>
                        <span className="text-slate-400 leading-relaxed">
                          {arg.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Return Value */}
              {selectedFormula.returnValue && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 text-xs">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider">Return Value</h3>
                  <p className="text-slate-350 leading-relaxed font-sans">{selectedFormula.returnValue}</p>
                </div>
              )}

              {/* Tips & Mistakes Grid split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Best Practice Tips */}
                {selectedFormula.tips && selectedFormula.tips.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
                    <h3 className="font-bold text-emerald-400 uppercase tracking-wider">Pro Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-350 leading-relaxed font-sans">
                      {selectedFormula.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Mistakes */}
                {selectedFormula.mistakes && selectedFormula.mistakes.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
                    <h3 className="font-bold text-rose-455 uppercase tracking-wider">Common Mistakes</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-350 leading-relaxed font-sans">
                      {selectedFormula.mistakes.map((mistake, idx) => (
                        <li key={idx}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Example Spreadsheet */}
              {selectedFormula.examples && selectedFormula.examples.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Example Spreadsheet
                  </h3>
                  {selectedFormula.examples.map((example, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="text-xs leading-normal">
                        <strong className="text-slate-200 block mb-0.5">{example.title}</strong>
                        <span className="text-slate-400">{example.description}</span>
                      </div>

                      {/* Spreadsheet Grid Mock */}
                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 font-mono text-xs">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-900/60 border-b border-slate-800">
                              <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none" />
                              {example.grid.headers.map((h, i) => (
                                <th key={i} className="p-2 border-r border-slate-800 text-slate-400 font-semibold text-center">
                                  {String.fromCharCode(65 + i)}
                                </th>
                              ))}
                            </tr>
                            <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-300 font-medium">
                              <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none">1</th>
                              {example.grid.headers.map((h, i) => (
                                <th key={i} className="p-2 border-r border-slate-800 text-center">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {example.grid.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-850 hover:bg-slate-900/30">
                                <td className="p-2 border-r border-slate-800 text-slate-500 text-center font-bold select-none">
                                  {rIdx + 2}
                                </td>
                                {row.map((cell, cIdx) => {
                                  const cellAddr = String.fromCharCode(65 + cIdx) + (rIdx + 2);
                                  const isResult = cellAddr === example.resultCell;
                                  return (
                                    <td
                                      key={cIdx}
                                      className={`p-2 border-r border-slate-850 text-center ${
                                        isResult ? 'bg-emerald-500/10 text-emerald-400 font-bold ring-2 ring-emerald-500/30 ring-inset' : 'text-slate-300'
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Formula & Steps */}
                      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Formula in {example.resultCell}:</span>
                          <code className="text-emerald-400 font-bold font-mono">{example.formula}</code>
                        </div>
                        <div className="border-t border-slate-850 pt-2.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Step-by-step explanation:</span>
                          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 font-sans leading-relaxed">
                            {example.steps.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Try It Yourself Sandbox (Interactive Playground) */}
              {practice && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3">
                    <Play className="w-4 h-4 fill-emerald-500" />
                    <h3>Try It Yourself</h3>
                  </div>

                  <div className="text-xs space-y-2 leading-relaxed">
                    <p className="text-slate-350"><strong className="text-slate-200">Objective:</strong> {practice.task}</p>
                    <p className="text-slate-500 font-medium italic"><strong className="text-slate-400 not-italic">Hint:</strong> {practice.hint}</p>
                  </div>

                  {/* Sandbox Grid mock */}
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 font-mono text-xs">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900/60 border-b border-slate-800">
                          <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none" />
                          {practice.initialGrid.headers.map((h, i) => (
                            <th key={i} className="p-2 border-r border-slate-800 text-slate-400 font-semibold text-center">
                              {String.fromCharCode(65 + i)}
                            </th>
                          ))}
                        </tr>
                        <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-300 font-medium">
                          <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none">1</th>
                          {practice.initialGrid.headers.map((h, i) => (
                            <th key={i} className="p-2 border-r border-slate-800 text-center">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {practice.initialGrid.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-850">
                            <td className="p-2 border-r border-slate-800 text-slate-500 text-center font-bold select-none">
                              {rIdx + 2}
                            </td>
                            {row.map((cell, cIdx) => {
                              const cellAddr = String.fromCharCode(65 + cIdx) + (rIdx + 2);
                              const isTarget = cellAddr === practice.targetCell;
                              
                              return (
                                <td
                                  key={cIdx}
                                  className={`p-2 border-r border-slate-850 text-center ${
                                    isTarget ? 'bg-slate-900 ring-2 ring-emerald-500 ring-inset' : 'text-slate-300'
                                  }`}
                                >
                                  {isTarget ? (
                                    <input
                                      type="text"
                                      value={userAnswer}
                                      onChange={(e) => setUserAnswer(e.target.value)}
                                      placeholder={`Enter formula`}
                                      className="w-full text-center bg-transparent text-emerald-400 font-bold focus:outline-none placeholder-slate-650"
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

                  {/* Formula bar + Action Panel */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <div className="flex-1 w-full relative flex items-center">
                      <span className="absolute left-3.5 text-slate-500 font-serif italic text-sm select-none">fx</span>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={`Enter answer (e.g. =SUM(B2:B4))`}
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                      <button
                        onClick={handleResetPractice}
                        className="flex items-center gap-1 px-4 py-2 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </button>
                      <button
                        onClick={() => handleCheckPractice(selectedFormula as FormulaData)}
                        className="flex items-center gap-1 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/10"
                      >
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        Check Answer
                      </button>
                    </div>
                  </div>

                  {/* Sandbox feedback notifications */}
                  {practiceFeedback && (
                    <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs animate-in slide-in-from-bottom-1 duration-150 ${
                      practiceFeedback.isCorrect 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-355' 
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
                    }`}>
                      {practiceFeedback.isCorrect ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-455 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <h4 className="font-bold">
                          {practiceFeedback.isCorrect ? '✅ Correct Answer!' : '❌ Incorrect Answer'}
                        </h4>
                        <p className="text-slate-400 leading-normal font-sans">
                          {practiceFeedback.isCorrect 
                            ? 'Excellent! The spreadsheet resolved your formula syntax correctly.'
                            : `Try again! Verify that your cell coordinates and brackets match the hint: "${practice.hint}"`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Related Formulas navigation list */}
              {selectedFormula.relatedFormulas && selectedFormula.relatedFormulas.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Related Formulas
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedFormula.relatedFormulas.map(relName => {
                      const relFormula = allListing.find(f => f.name?.toLowerCase() === relName.toLowerCase());
                      return (
                        <button
                          key={relName}
                          onClick={() => relFormula && handleOpenFormula(relFormula.id || '')}
                          disabled={!relFormula}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/30 hover:text-emerald-400 rounded-xl text-slate-350 transition font-mono disabled:opacity-50"
                        >
                          {relName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* 3. Bottom Progress Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shrink-0">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none mb-4">
          <Award className="w-4 h-4 text-emerald-450" />
          Formula Library Learning Progress
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Library Formulas</span>
            <span className="text-2xl font-extrabold text-slate-100 font-mono">{allListing.length}</span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Learned Formulas</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {learnedFormulas.length} <span className="text-xs text-slate-500 font-normal">({Math.round((learnedFormulas.length / allListing.length) * 100) || 0}%)</span>
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Practice Tasks Solved</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {practiceCompleted.length}
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Favorite Saved</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {favorites.length}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
