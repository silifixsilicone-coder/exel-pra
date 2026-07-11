"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  PaintBucket 
} from 'lucide-react';
import { CellData, GridState, SpreadsheetState } from '../../types';
import { evaluateGrid, colNumberToLetter, colLetterToNumber } from '../../utils/formulaEvaluator';

interface SpreadsheetProps {
  initialState: SpreadsheetState;
  onChange?: (state: SpreadsheetState) => void;
  readOnly?: boolean;
}

export default function Spreadsheet({ initialState, onChange, readOnly = false }: SpreadsheetProps) {
  const [grid, setGrid] = useState<GridState>(initialState.cells);
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  const cellInputRef = useRef<HTMLInputElement>(null);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialState changes
  useEffect(() => {
    setGrid(initialState.cells);
  }, [initialState]);

  // Evaluate the entire grid to compute values
  const computedGrid = evaluateGrid(grid);

  // Trigger parent change callback
  const triggerChange = (newGrid: GridState) => {
    setGrid(newGrid);
    if (onChange) {
      onChange({
        cells: newGrid,
        rowCount: initialState.rowCount,
        colCount: initialState.colCount
      });
    }
  };

  // Select a cell
  const handleSelectCell = (key: string) => {
    if (editingCell && editingCell !== key) {
      saveCellEdit();
    }
    setSelectedCell(key);
    const cell = grid[key];
    setEditValue(cell ? cell.value : '');
    setEditingCell(null);
  };

  // Double click to edit cell inline
  const handleDoubleClickCell = (key: string) => {
    if (readOnly) return;
    setSelectedCell(key);
    const cell = grid[key];
    setEditValue(cell ? cell.value : '');
    setEditingCell(key);
  };

  // Save the edit value back to the cell
  const saveCellEdit = () => {
    if (!editingCell) return;
    const currentVal = editValue;
    const updatedGrid = { ...grid };
    
    if (currentVal === '') {
      delete updatedGrid[editingCell];
    } else {
      updatedGrid[editingCell] = {
        ...(updatedGrid[editingCell] || {}),
        value: currentVal
      };
    }
    
    setEditingCell(null);
    triggerChange(updatedGrid);
  };

  // Focus inline input on edit mode trigger
  useEffect(() => {
    if (editingCell && cellInputRef.current) {
      cellInputRef.current.focus();
      cellInputRef.current.select();
    }
  }, [editingCell]);

  // Key navigation and entry
  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, key: string) => {
    if (readOnly) return;
    
    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveCellEdit();
        // Move selection down
        moveSelection(0, 1);
      } else if (e.key === 'Escape') {
        setEditingCell(null);
        const cell = grid[key];
        setEditValue(cell ? cell.value : '');
      }
      return;
    }

    // Navigation mode
    let colMatch = key.match(/^[A-Z]+/);
    let rowMatch = key.match(/[0-9]+$/);
    if (!colMatch || !rowMatch) return;
    
    const col = colMatch[0];
    const row = parseInt(rowMatch[0], 10);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveSelection(0, -1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveSelection(0, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveSelection(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveSelection(1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        setEditingCell(key);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        const updatedGrid = { ...grid };
        delete updatedGrid[key];
        setEditValue('');
        triggerChange(updatedGrid);
        break;
      default:
        // Direct character typing triggers edit mode
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setSelectedCell(key);
          setEditValue(e.key);
          setEditingCell(key);
        }
        break;
    }
  };

  const moveSelection = (colDelta: number, rowDelta: number) => {
    let colMatch = selectedCell.match(/^[A-Z]+/);
    let rowMatch = selectedCell.match(/[0-9]+$/);
    if (!colMatch || !rowMatch) return;
    
    const colNum = colLetterToNumber(colMatch[0]);
    const row = parseInt(rowMatch[0], 10);

    const targetColNum = Math.max(1, Math.min(initialState.colCount, colNum + colDelta));
    const targetRow = Math.max(1, Math.min(initialState.rowCount, row + rowDelta));
    
    const targetKey = colNumberToLetter(targetColNum) + targetRow;
    setSelectedCell(targetKey);
    const cell = grid[targetKey];
    setEditValue(cell ? cell.value : '');
  };

  // Synchronize formula bar edits
  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    setEditValue(e.target.value);
    
    const updatedGrid = { ...grid };
    if (e.target.value === '') {
      delete updatedGrid[selectedCell];
    } else {
      updatedGrid[selectedCell] = {
        ...(updatedGrid[selectedCell] || {}),
        value: e.target.value
      };
    }
    setGrid(updatedGrid);
  };

  const handleFormulaBlur = () => {
    triggerChange(grid);
  };

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerChange(grid);
      if (formulaInputRef.current) {
        formulaInputRef.current.blur();
      }
    }
  };

  // Toolbar actions
  const applyCellStyle = (styleKey: 'bold' | 'italic' | 'align' | 'bgColor', value?: any) => {
    if (readOnly) return;
    const updatedGrid = { ...grid };
    const cell = updatedGrid[selectedCell] || { value: '' };
    
    if (styleKey === 'bold') {
      cell.bold = !cell.bold;
    } else if (styleKey === 'italic') {
      cell.italic = !cell.italic;
    } else if (styleKey === 'align') {
      cell.align = value;
    } else if (styleKey === 'bgColor') {
      cell.bgColor = value;
    }
    
    updatedGrid[selectedCell] = cell;
    triggerChange(updatedGrid);
  };

  const clearActiveCell = () => {
    if (readOnly) return;
    const updatedGrid = { ...grid };
    delete updatedGrid[selectedCell];
    setEditValue('');
    triggerChange(updatedGrid);
  };

  // Generate row and column elements
  const cols = Array.from({ length: initialState.colCount }, (_, i) => colNumberToLetter(i + 1));
  const rows = Array.from({ length: initialState.rowCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col w-full h-full bg-card-bg border border-border-custom rounded-xl overflow-hidden shadow-2xl">
      {/* 1. Toolbar Section */}
      <div className="flex items-center gap-1.5 p-2 bg-card-bg/50 border-b border-border-custom backdrop-blur-sm">
        <button
          onClick={() => applyCellStyle('bold')}
          disabled={readOnly}
          className={`p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-hover-bg transition ${
            grid[selectedCell]?.bold ? 'bg-hover-bg text-emerald-500 font-bold' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => applyCellStyle('italic')}
          disabled={readOnly}
          className={`p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-hover-bg transition ${
            grid[selectedCell]?.italic ? 'bg-hover-bg text-emerald-500' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4.5 h-4.5" />
        </button>
        
        <div className="h-5 w-[1px] bg-border-custom mx-1" />

        <button
          onClick={() => applyCellStyle('align', 'left')}
          disabled={readOnly}
          className={`p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-hover-bg transition ${
            grid[selectedCell]?.align === 'left' ? 'bg-hover-bg text-emerald-500' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => applyCellStyle('align', 'center')}
          disabled={readOnly}
          className={`p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-hover-bg transition ${
            grid[selectedCell]?.align === 'center' ? 'bg-hover-bg text-emerald-500' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => applyCellStyle('align', 'right')}
          disabled={readOnly}
          className={`p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-hover-bg transition ${
            grid[selectedCell]?.align === 'right' ? 'bg-hover-bg text-emerald-500' : ''
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4.5 h-4.5" />
        </button>

        <div className="h-5 w-[1px] bg-border-custom mx-1" />

        {/* Colors */}
        <div className="flex items-center gap-1 group relative">
          <button 
            disabled={readOnly}
            className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-hover-bg transition"
            title="Cell Color"
          >
            <PaintBucket className="w-4.5 h-4.5" />
          </button>
          <div className="flex items-center gap-1">
            <button 
              disabled={readOnly}
              onClick={() => applyCellStyle('bgColor', 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-350 dark:bg-emerald-950/40')}
              className="w-4.5 h-4.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 hover:scale-110 transition"
            />
            <button 
              disabled={readOnly}
              onClick={() => applyCellStyle('bgColor', 'bg-blue-500/10 text-blue-600 dark:text-blue-350 dark:bg-blue-950/40')}
              className="w-4.5 h-4.5 rounded-md bg-blue-500/15 border border-blue-500/30 hover:scale-110 transition"
            />
            <button 
              disabled={readOnly}
              onClick={() => applyCellStyle('bgColor', 'bg-amber-500/10 text-amber-600 dark:text-amber-350 dark:bg-amber-950/40')}
              className="w-4.5 h-4.5 rounded-md bg-amber-500/15 border border-amber-500/30 hover:scale-110 transition"
            />
            <button 
              disabled={readOnly}
              onClick={() => applyCellStyle('bgColor', undefined)}
              className="w-4.5 h-4.5 rounded-md bg-hover-bg border border-border-custom hover:scale-110 transition"
            />
          </div>
        </div>

        <div className="ml-auto">
          <button
            onClick={clearActiveCell}
            disabled={readOnly}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background hover:bg-red-500/10 hover:text-red-500 border border-border-custom hover:border-red-550/20 text-xs font-medium transition"
            title="Clear Cell"
          >
            <Trash2 className="w-3.5 h-3.5 text-text-muted group-hover:text-red-500" />
            Clear
          </button>
        </div>
      </div>

      {/* 2. Formula Bar Section */}
      <div className="flex items-center gap-2 p-2 bg-card-bg/35 border-b border-border-custom">
        {/* Active Cell Address Indicator */}
        <div className="flex items-center justify-center min-w-[50px] px-2 py-1 bg-grid-bg text-emerald-500 border border-border-custom rounded font-mono text-sm font-semibold select-none shadow-inner">
          {selectedCell}
        </div>
        {/* fx symbol */}
        <span className="text-text-muted font-serif italic text-base select-none pl-1">
          fx
        </span>
        {/* Formula Input */}
        <input
          ref={formulaInputRef}
          type="text"
          value={editValue}
          onChange={handleFormulaChange}
          onBlur={handleFormulaBlur}
          onKeyDown={handleFormulaKeyDown}
          disabled={readOnly}
          placeholder="Enter formula (e.g. =SUM(A1:B2)) or value"
          className="flex-1 px-3 py-1 bg-grid-bg text-foreground border border-border-custom rounded font-mono text-sm focus:outline-none focus:border-emerald-500/50 shadow-inner"
        />
      </div>

      {/* 3. Grid Canvas Container */}
      <div className="flex-1 overflow-auto bg-grid-bg custom-scrollbar">
        <table className="w-max min-w-full border-collapse select-none">
          <colgroup>
            <col style={{ width: '48px' }} />
            {cols.map((col) => (
              <col key={col} style={{ width: '110px' }} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-card-bg/60 sticky top-0 z-10">
              {/* Top-Left Empty Column Row Selector */}
              <th className="w-12 h-7 border-r border-b border-border-custom text-center text-xs font-semibold text-text-muted select-none bg-card-bg" />
              {/* Column Letter Headers */}
              {cols.map((col) => (
                <th
                  key={col}
                  className="min-w-[110px] h-7 border-r border-b border-border-custom text-center text-xs font-semibold text-text-muted select-none bg-card-bg/60"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="h-8 border-b border-grid-border hover:bg-hover-bg/15">
                {/* Row Number Header */}
                <td className="w-12 border-r border-border-custom text-center text-xs font-mono font-medium text-text-muted select-none bg-card-bg/40 sticky left-0 z-5">
                  {row}
                </td>
                {/* Editable Data Cells */}
                {cols.map((col) => {
                  const cellKey = col + row;
                  const isSelected = selectedCell === cellKey;
                  const isEditing = editingCell === cellKey;
                  const cell = computedGrid[cellKey];
                  const rawCell = grid[cellKey];

                  // Resolve final display value
                  let displayVal = '';
                  if (cell !== undefined && cell.computed !== undefined) {
                    displayVal = String(cell.computed);
                  } else if (rawCell !== undefined) {
                    displayVal = String(rawCell.value);
                  }

                  // Build cell style classes
                  let styleClasses = '';
                  if (rawCell) {
                    if (rawCell.bold) styleClasses += ' font-bold';
                    if (rawCell.italic) styleClasses += ' italic';
                    if (rawCell.align === 'center') styleClasses += ' text-center';
                    else if (rawCell.align === 'right') styleClasses += ' text-right';
                    else styleClasses += ' text-left';

                    if (rawCell.bgColor) {
                      styleClasses += ` ${rawCell.bgColor}`;
                    } else {
                      styleClasses += ' text-foreground';
                    }
                  } else {
                    styleClasses += ' text-foreground text-left';
                  }

                  return (
                    <td
                      key={cellKey}
                      onClick={() => handleSelectCell(cellKey)}
                      onDoubleClick={() => handleDoubleClickCell(cellKey)}
                      onKeyDown={(e) => handleCellKeyDown(e, cellKey)}
                      tabIndex={0}
                      className={`h-8 border-r border-grid-border px-2 font-mono text-sm relative transition-all duration-100 ease-out focus:outline-none ${styleClasses} ${
                        isSelected ? 'ring-2 ring-emerald-500 ring-inset bg-hover-bg/25 z-1' : ''
                      }`}
                    >
                      {isEditing ? (
                        <input
                          ref={cellInputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveCellEdit}
                          className="absolute inset-0 w-full h-full px-2 bg-grid-bg text-foreground border border-emerald-500 font-mono text-sm focus:outline-none z-10"
                        />
                      ) : (
                        <span className="block truncate pointer-events-none select-none">
                          {displayVal}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 4. Bottom Grid Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-card-bg border-t border-border-custom text-[11px] font-medium text-text-muted font-mono">
        <div>Sheet1</div>
        <div className="flex items-center gap-3">
          <span>Formula Check Enabled</span>
          <span>Caps Lock Alert: OK</span>
        </div>
      </div>
    </div>
  );
}
