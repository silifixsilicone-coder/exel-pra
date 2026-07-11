"use client";

import React from 'react';
import { Save, Undo2, Redo2 } from 'lucide-react';
import { useSpreadsheet } from '../context/SpreadsheetContext';

export default function QuickToolbar() {
  const { undo, redo, canUndo, canRedo, saveWorkbook } = useSpreadsheet();

  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-slate-900 border-b border-slate-800 shrink-0 text-slate-400 select-none">
      {/* Save */}
      <button
        onClick={saveWorkbook}
        className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
        title="Save Workbook (Ctrl+S)"
      >
        <Save className="w-4 h-4 text-emerald-450" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      {/* Undo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-1 rounded transition ${
          canUndo ? 'hover:bg-slate-800 hover:text-white' : 'opacity-40 cursor-not-allowed'
        }`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>

      {/* Redo */}
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-1 rounded transition ${
          canRedo ? 'hover:bg-slate-800 hover:text-white' : 'opacity-40 cursor-not-allowed'
        }`}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>
      
      {/* Brand indicator */}
      <span className="text-[10px] font-mono text-slate-550 font-bold uppercase tracking-widest ml-auto">
        Path Excel Workbook Engine
      </span>
    </div>
  );
}
