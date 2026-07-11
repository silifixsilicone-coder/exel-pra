"use client";

import React, { useState, useEffect, useRef } from 'react';
import { functionSuggestions, FunctionMetadata } from '../formula-engine/autocomplete';

interface FormulaAutocompleteProps {
  val: string;
  onSelect: (completedText: string) => void;
  onClose: () => void;
}

// Extracts the last typed function search word (e.g. "=SU" -> "SU")
export function getSearchWord(inputVal: string): { word: string; startIdx: number } | null {
  if (!inputVal.startsWith('=')) return null;
  // Match letters and underscores at the end of the string
  const match = inputVal.match(/([A-Z_]+)$/i);
  if (!match) return null;
  return {
    word: match[1].toUpperCase(),
    startIdx: inputVal.length - match[1].length
  };
}

export default function FormulaAutocomplete({ val, onSelect, onClose }: FormulaAutocompleteProps) {
  const searchInfo = getSearchWord(val);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!searchInfo) return null;

  const { word, startIdx } = searchInfo;

  // Filter suggestions matching search prefix
  const filtered = functionSuggestions.filter(fn => 
    fn.name.startsWith(word)
  );

  // If no matches, close suggestions
  if (filtered.length === 0) return null;

  // Clamp selection index within bounds of filtered items
  const activeIndex = Math.min(selectedIndex, filtered.length - 1);
  const selectedFunction = filtered[activeIndex];

  // Capture keyboard navigation globally when mounted
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
          // Autocomplete to "=FUNCTION("
          const completed = val.substring(0, startIdx) + filtered[activeIndex].name + '(';
          onSelect(completed);
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
  }, [filtered, activeIndex, val, startIdx, onSelect, onClose]);

  // Handle clicking on a suggestion item
  const handleItemClick = (fnName: string) => {
    const completed = val.substring(0, startIdx) + fnName + '(';
    onSelect(completed);
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-55 flex bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans text-xs w-[380px] h-[160px] animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Left List of functions matching */}
      <div className="w-[150px] border-r border-slate-800/80 overflow-y-auto p-1.5 flex flex-col gap-0.5 custom-scrollbar bg-slate-950">
        {filtered.map((item, idx) => (
          <button
            key={item.name}
            onClick={() => handleItemClick(item.name)}
            onMouseEnter={() => setSelectedIndex(idx)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all font-bold ${
              idx === activeIndex 
                ? 'bg-emerald-500/10 text-emerald-450 border-l-2 border-emerald-500' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Right Details Panel for current selected suggestion */}
      {selectedFunction && (
        <div className="flex-1 p-3.5 bg-slate-900/60 overflow-y-auto flex flex-col justify-between text-slate-300">
          <div>
            <div className="text-xs font-extrabold text-emerald-450 tracking-wide uppercase">
              {selectedFunction.name}
            </div>
            <div className="text-[10px] text-slate-450 leading-relaxed mt-1 font-medium">
              {selectedFunction.description}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex flex-col gap-1 text-[9.5px]">
            <div>
              <strong className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">Syntax</strong>
              <code className="text-emerald-400/90 font-mono font-bold mt-0.5 block">{selectedFunction.syntax}</code>
            </div>
            <div className="mt-1">
              <strong className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">Example</strong>
              <code className="text-slate-400 font-mono block mt-0.5">{selectedFunction.example}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
