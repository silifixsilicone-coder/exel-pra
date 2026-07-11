"use client";

import React, { useState, useEffect } from 'react';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import FormulaAutocomplete, { getSearchWord } from './FormulaAutocomplete';
import ParameterAssistant from './ParameterAssistant';
import { validateFormula } from '../formula-engine/formula-validation';
import { AlertCircle } from 'lucide-react';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Keep Name Box input in sync with active cell
  useEffect(() => {
    setNameInputValue(activeSheet.activeCell);
  }, [activeSheet.activeCell]);

  // Handle active cell validation
  useEffect(() => {
    if (editingCell === activeSheet.activeCell) {
      const res = validateFormula(editValue);
      setValidationError(res.isValid ? null : res.errorMessage || null);
    } else {
      setValidationError(null);
    }
  }, [editValue, editingCell, activeSheet.activeCell]);

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
    updateCell(activeSheet.activeCell, e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      stopEditing(true);
      setShowSuggestions(false);
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      stopEditing(false);
      setShowSuggestions(false);
      e.currentTarget.blur();
    }
  };

  // Close editing on blur with a slight delay to allow clicking on autocomplete box
  const handleFormulaBlur = () => {
    setTimeout(() => {
      stopEditing(true);
      setShowSuggestions(false);
    }, 200);
  };

  const handleCursorTrack = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setCursorPosition(e.currentTarget.selectionStart || 0);
  };

  // Show suggestions only when typing a function keyword (e.g. "=SU")
  const activeCellValue = editingCell === activeSheet.activeCell
    ? editValue 
    : (activeSheet.cells[activeSheet.activeCell]?.value || '');

  const searchInfo = getSearchWord(activeCellValue);
  const shouldShowSuggestions = !!(
    editingCell === activeSheet.activeCell && 
    searchInfo && 
    searchInfo.word.length > 0
  );

  const hasParams = activeCellValue.startsWith('=') && activeCellValue.includes('(');
  const shouldShowParameterAssistant = editingCell === activeSheet.activeCell && hasParams && !shouldShowSuggestions;

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

      {/* 3. Formula Input Container */}
      <div className="flex-1 relative flex items-center">
        <input
          type="text"
          value={activeCellValue}
          onFocus={handleFormulaFocus}
          onChange={handleFormulaChange}
          onKeyDown={handleFormulaKeyDown}
          onBlur={handleFormulaBlur}
          onSelect={handleCursorTrack}
          onClick={handleCursorTrack}
          onKeyUp={handleCursorTrack}
          placeholder="Enter formula or value"
          className="w-full pl-3 pr-8 py-1 bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs rounded focus:outline-none focus:border-emerald-500 shadow-inner"
        />

        {/* Validation Error Alert Circle */}
        {validationError && (
          <div 
            className="absolute right-2.5 top-1.5 z-10 text-red-500 hover:text-red-400 cursor-help" 
            title={validationError}
          >
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Suggestion Dropdown Popover */}
        {shouldShowSuggestions && (
          <div className="absolute left-0 top-8 z-50">
            <FormulaAutocomplete
              val={activeCellValue}
              onSelect={(completed) => {
                setEditValue(completed);
                updateCell(activeSheet.activeCell, completed);
              }}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        )}

        {/* Parameter Assistant Overlay */}
        {shouldShowParameterAssistant && (
          <div className="absolute left-0 top-8 z-50">
            <ParameterAssistant val={activeCellValue} cursorIdx={cursorPosition} />
          </div>
        )}
      </div>
    </div>
  );
}
