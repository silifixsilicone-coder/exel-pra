"use client";

import React, { useState, useEffect } from 'react';
import { useSpreadsheet } from '../context/SpreadsheetContext';

export default function FormulaBar() {
  const { 
    activeSheet, 
    selectCell, 
    updateCell, 
    editingCell,
    startEditing,
    stopEditing,
    editValue,
    setEditValue
  } = useSpreadsheet();

  const [nameInputValue, setNameInputValue] = useState(activeSheet.activeCell);

  // Keep Name Box input in sync with active cell
  useEffect(() => {
    setNameInputValue(activeSheet.activeCell);
  }, [activeSheet.activeCell]);

  // Jump to cell on Name Box enter
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = nameInputValue.toUpperCase().trim();
      if (/^[A-Z]+[0-9]+$/.test(target)) {
        selectCell(target);
      } else {
        setNameInputValue(activeSheet.activeCell);
      }
      e.currentTarget.blur();
    }
  };

  // Synchronize formula input edits
  const handleFormulaFocus = () => {
    startEditing(activeSheet.activeCell);
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
    // Live update cell values
    updateCell(activeSheet.activeCell, e.target.value);
  };

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      stopEditing(true);
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      stopEditing(false);
      e.currentTarget.blur();
    }
  };

  // Get current formula display string
  const activeCellValue = editingCell === activeSheet.activeCell
    ? editValue 
    : (activeSheet.cells[activeSheet.activeCell]?.value || '');

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-900 border-b border-slate-800 text-slate-200 select-none shrink-0 font-sans">
      {/* 1. Name Box */}
      <input
        type="text"
        value={nameInputValue}
        onChange={(e) => setNameInputValue(e.target.value)}
        onKeyDown={handleNameKeyDown}
        className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-semibold rounded text-center focus:outline-none focus:border-emerald-500 shadow-inner"
        title="Name Box (Go to cell)"
      />

      <div className="h-5 w-[1px] bg-slate-800 mx-1" />

      {/* 2. fx Symbol */}
      <span className="text-slate-500 font-serif italic text-base select-none px-1.5 cursor-default">
        fx
      </span>

      {/* 3. Formula Input */}
      <input
        type="text"
        value={activeCellValue}
        onFocus={handleFormulaFocus}
        onChange={handleFormulaChange}
        onKeyDown={handleFormulaKeyDown}
        onBlur={() => stopEditing(true)}
        placeholder="Enter formula or value"
        className="flex-1 px-3 py-1 bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs rounded focus:outline-none focus:border-emerald-500 shadow-inner"
      />
    </div>
  );
}
