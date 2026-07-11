"use client";

import React, { useState, useEffect, useRef } from 'react';
import { searchFormulas } from '../formula-engine/formula-search';
import { FormulaHistoryRegistry } from '../formula-engine/formula-library/registry';
import { FunctionMetadata } from '../formula-engine/formula-library/metadata';
import { Pin, Star, Info, AlertTriangle } from 'lucide-react';

interface FormulaAutocompleteProps {
  val: string;
  onSelect: (completedText: string) => void;
  onClose: () => void;
}

// Extracts the last typed function search word (e.g. "=SU" -> "SU", or "=" -> "")
export function getSearchWord(inputVal: string): { word: string; startIdx: number } | null {
  if (!inputVal.startsWith('=')) return null;
  if (inputVal === '=') {
    return { word: '', startIdx: 1 };
  }
  // Match letters and underscores at the end of the string
  const match = inputVal.match(/([A-Z_0-9]+)$/i);
  if (!match) return { word: '', startIdx: inputVal.length };
  return {
    word: match[1].toUpperCase(),
    startIdx: inputVal.length - match[1].length
  };
}

export default function FormulaAutocomplete({ val, onSelect, onClose }: FormulaAutocompleteProps) {
  const searchInfo = getSearchWord(val);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // States to force list refresh when favorites/pins are toggled
  const [favs, setFavs] = useState<string[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFavs(FormulaHistoryRegistry.getFavorites());
    setPins(FormulaHistoryRegistry.getPins());
  }, []);

  if (!searchInfo) return null;

  const { word, startIdx } = searchInfo;

  // 1. Get search and ranked results
  let filtered = searchFormulas(word);

  // 2. Filter by category
  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter(fn => fn.category.toUpperCase() === selectedCategory.toUpperCase());
  }

  // If no matches, close suggestions
  if (filtered.length === 0) return null;

  const activeIndex = Math.min(selectedIndex, filtered.length - 1);
  const selectedFunction = filtered[activeIndex];

  // Capture keyboard navigation
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex(prev => (prev + 1) % filtered.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          e.stopPropagation();
          if (selectedFunction) {
            handleComplete(selectedFunction.name);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeys, true);
    return () => window.removeEventListener('keydown', handleGlobalKeys, true);
  }, [filtered, activeIndex, val, startIdx, selectedFunction]);

  const handleComplete = (name: string) => {
    FormulaHistoryRegistry.addHistory(name);
    const completed = val.substring(0, startIdx) + name + '(';
    onSelect(completed);
  };

  const togglePin = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    FormulaHistoryRegistry.togglePin(name);
    setPins(FormulaHistoryRegistry.getPins());
  };

  const toggleFavorite = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    FormulaHistoryRegistry.toggleFavorite(name);
    setFavs(FormulaHistoryRegistry.getFavorites());
  };

  // Categories list
  const categories = ['ALL', 'MATH', 'STATISTICAL', 'LOGICAL', 'TEXT', 'DATE & TIME', 'LOOKUP', 'CUSTOM'];

  return (
    <div
      ref={containerRef}
      className="absolute z-55 flex flex-col bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans text-xs w-[480px] h-[260px] animate-in fade-in zoom-in-95 duration-100"
    >
      {/* 1. Category Filter Header */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border-b border-slate-800 overflow-x-auto shrink-0 custom-scrollbar select-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedIndex(0);
            }}
            className={`px-2 py-1 rounded-md text-[9px] font-bold tracking-wider transition ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Ranked suggestion items list */}
        <div className="w-[180px] border-r border-slate-800/80 overflow-y-auto p-1 flex flex-col gap-0.5 custom-scrollbar bg-slate-950">
          {filtered.map((item, idx) => {
            const isPinned = pins.includes(item.name.toUpperCase());
            const isFav = favs.includes(item.name.toUpperCase());
            return (
              <div
                key={item.name}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => handleComplete(item.name)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition ${
                  idx === activeIndex
                    ? 'bg-emerald-500/10 text-emerald-450 border-l-2 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-bold font-mono text-[10.5px]">{item.name}</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wide">{item.category}</span>
                </div>

                {/* Pin / Fav Icons */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={(e) => togglePin(e, item.name)} 
                    className={`hover:text-emerald-400 transition ${isPinned ? 'text-emerald-500' : 'text-slate-600'}`}
                    title="Pin Formula"
                  >
                    <Pin className="w-2.5 h-2.5" />
                  </button>
                  <button 
                    onClick={(e) => toggleFavorite(e, item.name)} 
                    className={`hover:text-amber-400 transition ${isFav ? 'text-amber-400' : 'text-slate-600'}`}
                    title="Favorite Formula"
                  >
                    <Star className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Rich documentation side panel */}
        {selectedFunction && (
          <div className="flex-1 p-3 bg-slate-900/40 overflow-y-auto flex flex-col gap-2.5 text-slate-300 custom-scrollbar select-text">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-450 tracking-wider font-mono">
                  {selectedFunction.name}
                </span>
                <span className="text-[8px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  {selectedFunction.category}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">
                {selectedFunction.description}
              </p>
            </div>

            {/* Syntax block */}
            <div className="border-t border-slate-800/60 pt-2 flex flex-col gap-1 text-[9.5px]">
              <div>
                <strong className="text-slate-500 font-bold uppercase tracking-wider text-[7.5px] block">Syntax</strong>
                <code className="text-emerald-400/90 font-mono font-bold mt-0.5 block">{selectedFunction.syntax}</code>
              </div>
              
              {/* Parameters List */}
              {selectedFunction.parameters && selectedFunction.parameters.length > 0 && (
                <div className="mt-1">
                  <strong className="text-slate-500 font-bold uppercase tracking-wider text-[7.5px] block">Parameters</strong>
                  <div className="flex flex-col gap-1 mt-0.5">
                    {selectedFunction.parameters.map(p => (
                      <div key={p.name} className="text-[9px] text-slate-400 leading-relaxed font-mono">
                        <strong className="text-slate-200 font-semibold">{p.name}</strong> ({p.type}): {p.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example block */}
              <div className="mt-1">
                <strong className="text-slate-500 font-bold uppercase tracking-wider text-[7.5px] block">Example</strong>
                <code className="text-slate-400 font-mono block mt-0.5">{selectedFunction.examples[0]}</code>
              </div>

              {/* Common mistakes */}
              {selectedFunction.commonMistakes && selectedFunction.commonMistakes.length > 0 && (
                <div className="mt-1 flex items-start gap-1 text-amber-500/80">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-500 font-bold uppercase tracking-wider text-[7.5px] block">Common Mistake</strong>
                    <span className="text-[9px] leading-relaxed mt-0.5 block">{selectedFunction.commonMistakes[0]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
