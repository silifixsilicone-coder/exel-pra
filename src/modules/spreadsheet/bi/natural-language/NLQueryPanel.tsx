"use client";

import React, { useState } from 'react';
import { useBI } from '../context/BIContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { parseNaturalLanguageQuery, QueryResult } from './NLQueryEngine';
import { Sparkles, Play, Check } from 'lucide-react';

export default function NLQueryPanel() {
  const { collapsiblePanel, setCollapsiblePanel } = useBI();
  const { updateCell, activeSheet } = useSpreadsheet();

  const [queryText, setQueryText] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);

  if (collapsiblePanel !== 'natural-language') return null;

  const handleRunQuery = () => {
    if (!queryText.trim()) return;
    const res = parseNaturalLanguageQuery(queryText);
    setResult(res);
  };

  const handleApplyFormula = () => {
    if (!result?.formulaSuggestion) return;
    updateCell(activeSheet.activeCell, result.formulaSuggestion);
    alert(`Applied formula "${result.formulaSuggestion}" to active cell ${activeSheet.activeCell}!`);
    setResult(null);
    setQueryText('');
  };


  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 shrink-0 flex flex-col justify-between shadow-2xl z-40 select-none animate-in slide-in-from-right duration-250">
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
          <h3 className="text-xs font-bold text-emerald-450 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Natural Language Query
          </h3>
          <button
            onClick={() => setCollapsiblePanel('none')}
            className="text-slate-500 hover:text-slate-350 text-[10px] font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Ask about your data</label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder='e.g. "What are total sales?" or "average cost"'
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans resize-none h-20 shadow-inner"
          />

          <button
            onClick={handleRunQuery}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-lg transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            Query AI Agent
          </button>
        </div>

        {result && (
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 text-xs animate-in slide-in-from-bottom-2 duration-150">
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase block">AI Explanation:</span>
              <p className="text-slate-350 font-sans leading-relaxed mt-0.5">{result.text}</p>
            </div>

            {result.formulaSuggestion && (
              <div className="space-y-2 pt-1 border-t border-slate-900">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Suggested Formula:</span>
                  <code className="block mt-1 p-2 bg-slate-900 border border-slate-850 rounded font-mono text-emerald-455 text-[10px] break-all">
                    {result.formulaSuggestion}
                  </code>
                </div>

                <button
                  onClick={handleApplyFormula}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-450 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Insert in Cell {activeSheet.activeCell}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-850 pt-4 text-[9px] text-slate-500 font-mono">
        Models: GPT-4 NLP parser • Caching enabled
      </div>
    </div>
  );
}
