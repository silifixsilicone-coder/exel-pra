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
  Keyboard,
  Clock,
  Shuffle,
  HelpCircle,
  FileText,
  BookOpen
} from 'lucide-react';
import { shortcutsData, ShortcutData } from '@/data/shortcuts';

// On-screen keyboard layout rows
const keyboardRows = [
  ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
  ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift-r'],
  ['control', 'alt', 'command', 'space', 'command-r', 'alt-r', 'control-r', 'arrowleft', 'arrowup', 'arrowdown', 'arrowright']
];

// Helper to map keys to pretty labels
const keyLabels: Record<string, string> = {
  esc: 'Esc', f1: 'F1', f2: 'F2', f3: 'F3', f4: 'F4', f5: 'F5', f6: 'F6', f7: 'F7', f8: 'F8', f9: 'F9', f10: 'F10', f11: 'F11', f12: 'F12',
  backspace: 'Backspace', tab: 'Tab', caps: 'Caps Lock', enter: 'Enter', shift: 'Shift', 'shift-r': 'Shift',
  control: 'Ctrl', alt: 'Alt', command: 'Win/Cmd', space: 'Spacebar', 'control-r': 'Ctrl', 'alt-r': 'Alt',
  arrowleft: '←', arrowup: '↑', arrowdown: '↓', arrowright: '→'
};

export default function ShortcutLabPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('⭐ All');
  const [selectedShortcutId, setSelectedShortcutId] = useState<string | null>(null);
  
  // Local storage state hooks
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedShortcuts, setCompletedShortcuts] = useState<string[]>([]);
  const [recentlyPracticed, setRecentlyPracticed] = useState<string[]>([]);
  const [accuracyStats, setAccuracyStats] = useState({ correct: 0, wrong: 0 });

  // Simulator / Practice state hooks
  const [practiceMode, setPracticeMode] = useState<'learn' | 'keyboard' | 'spreadsheet' | 'speed' | 'random'>('learn');
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState<{ checked: boolean; isCorrect: boolean } | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Speed Mode Timer states
  const [timerCount, setTimerCount] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Practice Spreadsheet grid mock state
  const [sheetGrid, setSheetGrid] = useState<{
    headers: string[];
    rows: string[][];
    bold: boolean;
    italic: boolean;
    underline: boolean;
    formattedType: 'normal' | 'currency' | 'percent';
    autosumApplied: boolean;
    filterApplied: boolean;
    tableApplied: boolean;
  }>({
    headers: ['Product', 'Price', 'Qty', 'Total'],
    rows: [
      ['Laptop', '1200', '2', '2400'],
      ['Mouse', '25', '10', '250'],
      ['Keyboard', '75', '4', '300'],
      ['Total', '', '', '']
    ],
    bold: false,
    italic: false,
    underline: false,
    formattedType: 'normal',
    autosumApplied: false,
    filterApplied: false,
    tableApplied: false
  });

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavs = localStorage.getItem('shortcut_lab_favs');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedCompleted = localStorage.getItem('shortcut_lab_completed');
      if (storedCompleted) setCompletedShortcuts(JSON.parse(storedCompleted));

      const storedRecent = localStorage.getItem('shortcut_lab_recent');
      if (storedRecent) setRecentlyPracticed(JSON.parse(storedRecent));

      const storedStats = localStorage.getItem('shortcut_lab_stats');
      if (storedStats) setAccuracyStats(JSON.parse(storedStats));
    }
  }, []);

  const selectedShortcut = shortcutsData.find(s => s.id === selectedShortcutId);

  // Timer runner for Speed Mode
  useEffect(() => {
    if (timerActive && timerCount > 0) {
      timerRef.current = setTimeout(() => {
        setTimerCount(prev => prev - 1);
      }, 1000);
    } else if (timerCount === 0 && timerActive) {
      setTimerActive(false);
      setPracticeFeedback({ checked: true, isCorrect: false });
      updateStats(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerCount, timerActive]);

  // Update statistics
  const updateStats = (isCorrect: boolean) => {
    const updated = {
      correct: accuracyStats.correct + (isCorrect ? 1 : 0),
      wrong: accuracyStats.wrong + (isCorrect ? 0 : 1)
    };
    setAccuracyStats(updated);
    localStorage.setItem('shortcut_lab_stats', JSON.stringify(updated));

    if (isCorrect && selectedShortcutId) {
      if (!completedShortcuts.includes(selectedShortcutId)) {
        const updatedCompleted = [...completedShortcuts, selectedShortcutId];
        setCompletedShortcuts(updatedCompleted);
        localStorage.setItem('shortcut_lab_completed', JSON.stringify(updatedCompleted));
      }
    }
  };

  // Keyboard events listener for physical shortcuts
  useEffect(() => {
    if (!selectedShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default shortcuts like Ctrl+B, Ctrl+I, Ctrl+P, Ctrl+S, Alt+=, etc.
      const keyName = e.key.toLowerCase();
      const isExcelInterception = 
        ['b', 'i', 'u', 'c', 'x', 'v', 'z', 'y', 's', 'p', 'f', 'h', 't', 'l', '1', '=', '4', '5'].includes(keyName) ||
        keyName === 'f2' || keyName === 'f4' || keyName === 'f7' || keyName === 'f11' ||
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(keyName);

      if ((e.ctrlKey || e.altKey || e.metaKey) && isExcelInterception) {
        e.preventDefault();
      }

      // Record currently pressed keys
      const keys: string[] = [];
      if (e.ctrlKey || e.metaKey) keys.push('control');
      if (e.shiftKey) keys.push('shift');
      if (e.altKey) keys.push('alt');

      if (!['control', 'shift', 'alt', 'meta'].includes(keyName)) {
        if (keyName === '$' || keyName === '4') keys.push('$');
        else if (keyName === '%' || keyName === '5') keys.push('%');
        else keys.push(keyName);
      }

      // Avoid duplication
      const uniqueKeys = Array.from(new Set(keys));
      setPressedKeys(uniqueKeys);

      // Check combination matching
      if (practiceMode !== 'learn') {
        const sortedAccepted = [...selectedShortcut.acceptedKeys].sort();
        const sortedPressed = [...uniqueKeys].sort();

        const isMatch = sortedAccepted.length === sortedPressed.length &&
                        sortedAccepted.every((val, index) => val === sortedPressed[index]);

        if (isMatch) {
          setPracticeFeedback({ checked: true, isCorrect: true });
          updateStats(true);
          setTimerActive(false);

          // Apply spreadsheet format changes based on action
          if (practiceMode === 'spreadsheet' && selectedShortcut.expectedSpreadsheetChange) {
            applySpreadsheetFormat(selectedShortcut.expectedSpreadsheetChange);
          }
        } else if (uniqueKeys.length >= sortedAccepted.length) {
          // If they pressed enough keys but they didn't match
          setPracticeFeedback({ checked: true, isCorrect: false });
          updateStats(false);
        }
      }
    };

    const handleKeyUp = () => {
      setPressedKeys([]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedShortcutId, practiceMode, timerActive]);

  // Apply spreadsheet format updates
  const applySpreadsheetFormat = (action: string) => {
    setSheetGrid(prev => {
      const next = { ...prev };
      if (action === 'bold') next.bold = true;
      if (action === 'italic') next.italic = true;
      if (action === 'underline') next.underline = true;
      if (action === 'currency') next.formattedType = 'currency';
      if (action === 'percent') next.formattedType = 'percent';
      if (action === 'autosum') {
        next.autosumApplied = true;
        // Inject sum calculation in rows[3][3] = total
        next.rows[3][3] = '2950';
      }
      if (action === 'filter') next.filterApplied = true;
      if (action === 'table') next.tableApplied = true;
      return next;
    });
  };

  const handleResetPracticeGrid = () => {
    setSheetGrid({
      headers: ['Product', 'Price', 'Qty', 'Total'],
      rows: [
        ['Laptop', '1200', '2', '2400'],
        ['Mouse', '25', '10', '250'],
        ['Keyboard', '75', '4', '300'],
        ['Total', '', '', '']
      ],
      bold: false,
      italic: false,
      underline: false,
      formattedType: 'normal',
      autosumApplied: false,
      filterApplied: false,
      tableApplied: false
    });
    setPracticeFeedback(null);
  };

  // Toggle favorite helper
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
    localStorage.setItem('shortcut_lab_favs', JSON.stringify(updated));
  };

  // Open shortcut helper
  const handleOpenShortcut = (id: string) => {
    setSelectedShortcutId(id);
    setPressedKeys([]);
    setPracticeFeedback(null);
    setShowSolution(false);
    setTimerActive(false);

    // Track recently practiced
    const filteredRecent = recentlyPracticed.filter(rId => rId !== id);
    const updatedRecent = [id, ...filteredRecent].slice(0, 10);
    setRecentlyPracticed(updatedRecent);
    localStorage.setItem('shortcut_lab_recent', JSON.stringify(updatedRecent));
    
    // Set practice mode default
    setPracticeMode('learn');
    handleResetPracticeGrid();
  };

  const handleStartSpeedMode = () => {
    setTimerCount(10);
    setTimerActive(true);
    setPracticeFeedback(null);
    setPressedKeys([]);
  };

  const handleNextRandomShortcut = () => {
    const randomIndex = Math.floor(Math.random() * shortcutsData.length);
    handleOpenShortcut(shortcutsData[randomIndex].id);
  };

  // Filter shortcuts lists
  const filteredShortcuts = React.useMemo(() => {
    return shortcutsData.filter(s => {
      const matchesSearch = 
        s.shortcut.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filters
      if (activeCategory === '⭐ All') return true;
      if (activeCategory === 'Favorites') return favorites.includes(s.id);
      if (activeCategory === 'Recently Practiced') return recentlyPracticed.includes(s.id);

      return s.category.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [searchQuery, activeCategory, favorites, recentlyPracticed]);

  // Sidebar category values
  const categories = [
    '⭐ All',
    'Clipboard',
    'Basic Editing',
    'Formatting',
    'Numbers',
    'Functions',
    'Filtering',
    'Tables',
    'Navigation',
    'Formula Editing',
    'Favorites',
    'Recently Practiced'
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
              Excel Shortcut Lab
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Master Excel keyboard shortcuts through interactive lessons and live practice.
            </p>
          </div>
        </div>

        {/* Sticky Search Bar */}
        <div className="relative w-full max-w-2xl mt-2">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shortcut... (e.g. Ctrl+C, Alt, F2, Format, Filter)"
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 shadow-xl transition"
          />
        </div>
      </div>

      {/* 2. Main 3-Column Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0">
        
        {/* Left Category Sidebar Navigation (col-span-3) */}
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
                  setSelectedShortcutId(null);
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

        {/* Main Content Pane (col-span-9) */}
        <div className="lg:col-span-9 min-h-0">
          
          {/* A. Shortcut List Grid (when no shortcut is opened) */}
          {!selectedShortcut ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {activeCategory} ({filteredShortcuts.length})
              </h3>

              {filteredShortcuts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
                  <Keyboard className="w-8 h-8 text-slate-600 animate-bounce" />
                  <p className="text-sm text-slate-400">No shortcuts found matching your filters.</p>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('⭐ All'); }} className="text-xs font-semibold text-emerald-400 hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredShortcuts.map(s => {
                    const isFav = favorites.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleOpenShortcut(s.id)}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:shadow-xl transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <code className="text-sm font-bold text-emerald-400 font-mono bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">
                              {s.shortcut}
                            </code>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 text-slate-400 rounded">
                                {s.category}
                              </span>
                              <button
                                onClick={(e) => toggleFavorite(s.id, e)}
                                className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-400 transition"
                              >
                                <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-sm font-bold text-slate-100">{s.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                            {s.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono text-[10px]">
                            {s.windows} / {s.mac}
                          </span>
                          <button
                            onClick={() => handleOpenShortcut(s.id)}
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition"
                          >
                            Open Lab
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
            
            // B. Interactive Shortcut detail panel
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Back Link */}
              <button
                onClick={() => { setSelectedShortcutId(null); setTimerActive(false); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Lab
              </button>

              {/* Title Header Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                      Active Simulator
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-100 font-mono flex items-center gap-3">
                      {selectedShortcut.title}
                      <button
                        onClick={(e) => toggleFavorite(selectedShortcut.id, e)}
                        className="p-1.5 bg-slate-950 border border-slate-850 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-400 transition"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(selectedShortcut.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-950 border border-slate-850 text-slate-300 rounded-md">
                      {selectedShortcut.category}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${
                      selectedShortcut.difficulty === 'Beginner' 
                        ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' 
                        : selectedShortcut.difficulty === 'Intermediate'
                        ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                        : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                    }`}>
                      {selectedShortcut.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-slate-350">
                  <p>{selectedShortcut.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Windows</span>
                      <code className="text-emerald-400 font-bold font-mono">{selectedShortcut.windows}</code>
                    </div>
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Mac OS</span>
                      <code className="text-emerald-400 font-bold font-mono">{selectedShortcut.mac}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode Selectors */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg flex flex-wrap gap-1">
                {(['learn', 'keyboard', 'spreadsheet', 'speed', 'random'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setPracticeMode(mode);
                      setPracticeFeedback(null);
                      setPressedKeys([]);
                      setTimerActive(false);
                      if (mode === 'random') {
                        handleNextRandomShortcut();
                      }
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
                      practiceMode === mode
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'learn' && <BookOpen className="w-3.5 h-3.5" />}
                    {mode === 'keyboard' && <Keyboard className="w-3.5 h-3.5" />}
                    {mode === 'spreadsheet' && <FileText className="w-3.5 h-3.5" />}
                    {mode === 'speed' && <Clock className="w-3.5 h-3.5" />}
                    {mode === 'random' && <Shuffle className="w-3.5 h-3.5" />}
                    <span className="capitalize">{mode} Mode</span>
                  </button>
                ))}
              </div>

              {/* Mode 1: Learn Mode Visuals */}
              {practiceMode === 'learn' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Learn & Guide
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-450">
                    <div className="space-y-3">
                      <div>
                        <strong className="text-slate-200 block mb-0.5">When to use:</strong>
                        <p>{selectedShortcut.whenToUse}</p>
                      </div>
                      <div>
                        <strong className="text-slate-200 block mb-0.5">Step-by-step:</strong>
                        <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-350">
                          {selectedShortcut.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <strong className="text-slate-200 block mb-0.5">Real Office Examples:</strong>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-slate-350">
                          {selectedShortcut.officeExamples.map((ex, idx) => (
                            <li key={idx}><strong>{ex.title}:</strong> {ex.description}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Keyboard Practice */}
              {practiceMode === 'keyboard' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-center">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-left">
                    Keyboard Practice
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hold down the keys on your physical keyboard to execute: <strong className="text-emerald-400 font-mono">{selectedShortcut.shortcut}</strong>.
                  </p>

                  <div className="py-4 bg-slate-950 border border-slate-850 rounded-xl max-w-xl mx-auto text-center font-mono">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Keys Captured:</div>
                    <div className="text-lg font-bold text-emerald-400 mt-2 flex items-center justify-center gap-2">
                      {pressedKeys.length === 0 ? (
                        <span className="text-slate-650 italic text-sm">(Waiting for input...)</span>
                      ) : (
                        pressedKeys.map((k, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg shadow-md text-xs font-semibold">
                            {keyLabels[k] || k.toUpperCase()}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Spreadsheet Practice */}
              {practiceMode === 'spreadsheet' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Spreadsheet Practice
                    </h3>
                    <button
                      onClick={handleResetPracticeGrid}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-350 border border-slate-700 rounded-lg text-[10px] font-semibold transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Grid
                    </button>
                  </div>

                  <div className="text-xs bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl leading-relaxed">
                    <strong className="text-emerald-450 block uppercase text-[10px] tracking-wider mb-0.5">Task Description:</strong>
                    <p className="text-slate-100 font-medium">{selectedShortcut.taskDescription || 'Perform the shortcut on the active sheet cells.'}</p>
                  </div>

                  {/* Sandbox Grid mock */}
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 font-mono text-xs select-none">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="p-2 border-r border-slate-800 text-slate-500 w-10 text-center select-none" />
                          {sheetGrid.headers.map((h, idx) => (
                            <th key={idx} className="p-2 border-r border-slate-800 text-center">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheetGrid.rows.map((row, rIdx) => {
                          const isHeader = rIdx === -1;
                          const isTableStyle = sheetGrid.tableApplied && rIdx < 3;
                          const isSumRow = rIdx === 3;
                          
                          return (
                            <tr
                              key={rIdx}
                              className={`border-b border-slate-850 ${
                                isTableStyle ? (rIdx % 2 === 0 ? 'bg-emerald-500/5' : 'bg-slate-900/40') : ''
                              }`}
                            >
                              <td className="p-2 border-r border-slate-800 text-slate-500 text-center font-bold select-none">
                                {rIdx + 1}
                              </td>
                              {row.map((cell, cIdx) => {
                                // Formatting evaluation
                                let styleClass = '';
                                if (sheetGrid.bold) styleClass += ' font-bold';
                                if (sheetGrid.italic) styleClass += ' italic';
                                if (sheetGrid.underline) styleClass += ' underline';
                                
                                let displayVal = cell;
                                if (sheetGrid.formattedType === 'currency' && cIdx === 1 && rIdx < 3) {
                                  displayVal = `$${cell}.00`;
                                } else if (sheetGrid.formattedType === 'currency' && cIdx === 3 && rIdx < 3) {
                                  displayVal = `$${cell}.00`;
                                }
                                
                                if (sheetGrid.formattedType === 'percent' && cIdx === 2 && rIdx < 3) {
                                  displayVal = `${Number(cell) * 10}%`;
                                }

                                if (sheetGrid.autosumApplied && isSumRow && cIdx === 3) {
                                  displayVal = '=SUM(D1:D3)';
                                }

                                return (
                                  <td
                                    key={cIdx}
                                    className={`p-2 border-r border-slate-850 text-center text-slate-300 font-mono ${styleClass}`}
                                  >
                                    {displayVal}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Mode 4: Speed Mode Practice */}
              {practiceMode === 'speed' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-center">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-left">
                    Speed Mode Practice
                  </h3>

                  <div className="max-w-md mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-6 py-6 bg-slate-950 border border-slate-850 rounded-xl">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Timer</span>
                        <span className={`text-3xl font-extrabold font-mono ${timerCount <= 3 ? 'text-red-500 animate-ping' : 'text-emerald-400'}`}>
                          {timerCount}s
                        </span>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-850" />
                      <button
                        onClick={handleStartSpeedMode}
                        disabled={timerActive}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition"
                      >
                        Start Timer
                      </button>
                    </div>

                    {timerActive && (
                      <p className="text-xs text-slate-400">
                        Quickly press the keyboard shortcut for: <strong className="text-emerald-400 font-mono">{selectedShortcut.title}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Practice Feedback notifications */}
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
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold">
                      {practiceFeedback.isCorrect ? '✅ Success!' : '❌ Incorrect Keys Pressed'}
                    </h4>
                    <p className="text-slate-400 leading-normal font-sans">
                      {practiceFeedback.isCorrect 
                        ? 'Excellent job! You executed the shortcut key combination successfully.'
                        : `Oops! Keep your fingers on Ctrl/Shift/Alt and press: "${selectedShortcut.shortcut}".`
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* On-screen Visual Keyboard Simulator */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Visual Keyboard Simulator
                </h3>

                <div className="flex flex-col gap-1.5 p-3 bg-slate-950 border border-slate-850 rounded-xl overflow-x-auto max-w-full">
                  {keyboardRows.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-1 justify-center min-w-[700px]">
                      {row.map(key => {
                        const cleanKey = key.replace('-r', '').replace('-l', '');
                        
                        // Check if key is highlighted in the active shortcut definition
                        const isShortcutKey = selectedShortcut.acceptedKeys.includes(cleanKey);
                        
                        // Check if user is physically pressing it
                        const isPressed = pressedKeys.includes(cleanKey);

                        // Layout widths for modifier keys
                        let widthClass = 'w-10';
                        if (key === 'backspace') widthClass = 'w-20';
                        if (key === 'tab') widthClass = 'w-16';
                        if (key === 'caps') widthClass = 'w-20';
                        if (key === 'enter') widthClass = 'w-20';
                        if (key.startsWith('shift')) widthClass = 'w-24';
                        if (key.startsWith('control') || key.startsWith('alt') || key.startsWith('command')) widthClass = 'w-16';
                        if (key === 'space') widthClass = 'w-52';

                        return (
                          <div
                            key={key}
                            className={`h-9 ${widthClass} rounded-lg flex items-center justify-center font-semibold text-[10px] uppercase font-mono shadow border transition ${
                              isPressed
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-95 shadow-inner'
                                : isShortcutKey
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 animate-pulse'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            {keyLabels[key] || key.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes & Related Shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                
                {/* Common Mistakes */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h3 className="font-bold text-rose-455 uppercase tracking-wider">Common Mistakes</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-350 font-sans">
                    {selectedShortcut.mistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                {/* Related Shortcuts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider">Related Shortcuts</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedShortcut.related.map(relId => {
                      const relShortcut = shortcutsData.find(s => s.id === relId);
                      return (
                        <button
                          key={relId}
                          onClick={() => relShortcut && handleOpenShortcut(relShortcut.id)}
                          disabled={!relShortcut}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/30 hover:text-emerald-400 rounded-xl text-slate-350 transition font-mono disabled:opacity-50"
                        >
                          {relShortcut ? relShortcut.shortcut : relId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3. Bottom Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shrink-0">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none mb-4">
          <Award className="w-4 h-4 text-emerald-450" />
          Shortcut Lab Practice Progress
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Shortcuts</span>
            <span className="text-2xl font-extrabold text-slate-100 font-mono">{shortcutsData.length}</span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Mastered / Solved</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {completedShortcuts.length} <span className="text-xs text-slate-500 font-normal">({Math.round((completedShortcuts.length / shortcutsData.length) * 100) || 0}%)</span>
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Correct Inputs</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {accuracyStats.correct}
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Accuracy Rate</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {Math.round((accuracyStats.correct / (accuracyStats.correct + accuracyStats.wrong)) * 100) || 0}%
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
