"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CellData, CellRange, SheetData, ClipboardData, WorkbookState } from '../types';
import { colNumberToLetter, colLetterToNumber, evaluateFormula } from '../utils/gridUtils';

interface SpreadsheetContextType {
  workbook: WorkbookState;
  activeSheet: SheetData;
  editingCell: string | null;
  editValue: string;
  activeTab: string;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  
  // Undo / Redo
  undo: () => void;
  redo: () => void;
  
  // Sheet Management
  setActiveSheet: (id: string) => void;
  addSheet: () => void;
  deleteSheet: (id: string) => void;
  renameSheet: (id: string, name: string) => void;
  duplicateSheet: (id: string) => void;
  reorderSheets: (startIndex: number, endIndex: number) => void;

  // Selection
  selectCell: (cellKey: string, extendRange?: boolean) => void;
  selectRange: (range: CellRange | null) => void;
  selectRow: (rowNum: number, extendRange?: boolean) => void;
  selectCol: (colNum: number, extendRange?: boolean) => void;

  // Grid Operations
  updateCell: (cellKey: string, value: string) => void;
  startEditing: (cellKey: string, initialVal?: string) => void;
  stopEditing: (commit?: boolean) => void;
  setEditValue: (val: string) => void;
  clearContents: () => void;

  // Context Menu operations
  insertRow: () => void;
  deleteRow: () => void;
  insertColumn: () => void;
  deleteColumn: () => void;

  // Formatting & Styles
  applyFormatting: (styleKey: keyof CellData, value: any) => void;
  mergeCells: () => void;

  // Clipboard
  copy: () => void;
  cut: () => void;
  paste: () => void;

  // Ribbon & UI
  setActiveTab: (tab: string) => void;
  setZoom: (zoom: number) => void;
  saveWorkbook: () => void;
}

const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

// Initial workbook mock data
const createInitialSheet = (id: string, name: string): SheetData => {
  const cells: Record<string, CellData> = {};
  
  // Seed initial demo data for Sheet1
  if (id === 'sheet-1') {
    cells['A1'] = { value: 'Product Sales Dashboard', bold: true, fontSize: 16, color: '#10b981' };
    cells['A3'] = { value: 'Product Name', bold: true, bgColor: '#1e293b', color: '#f8fafc' };
    cells['B3'] = { value: 'Units Sold', bold: true, bgColor: '#1e293b', color: '#f8fafc', align: 'right' };
    cells['C3'] = { value: 'Unit Price', bold: true, bgColor: '#1e293b', color: '#f8fafc', align: 'right' };
    cells['D3'] = { value: 'Total Revenue', bold: true, bgColor: '#1e293b', color: '#f8fafc', align: 'right' };

    cells['A4'] = { value: 'Excel Course Pro' };
    cells['B4'] = { value: '145', align: 'right' };
    cells['C4'] = { value: '49', align: 'right' };
    cells['D4'] = { value: '=B4*C4', align: 'right' };

    cells['A5'] = { value: 'Mock Exams Pass' };
    cells['B5'] = { value: '98', align: 'right' };
    cells['C5'] = { value: '99', align: 'right' };
    cells['D5'] = { value: '=B5*C5', align: 'right' };

    cells['A6'] = { value: 'Corporate Licenses' };
    cells['B6'] = { value: '12', align: 'right' };
    cells['C6'] = { value: '899', align: 'right' };
    cells['D6'] = { value: '=B6*C6', align: 'right' };

    cells['A8'] = { value: 'Total Sum', bold: true };
    cells['B8'] = { value: '=SUM(B4:B6)', bold: true, align: 'right' };
    cells['D8'] = { value: '=SUM(D4:D6)', bold: true, align: 'right', color: '#10b981' };
  }

  return {
    id,
    name,
    cells,
    rowCount: 100000, // 100,000 rows
    colCount: 1000,   // 1,000 columns
    selectedRange: { startRow: 1, startCol: 1, endRow: 1, endCol: 1 },
    activeCell: 'A1'
  };
};

export const SpreadsheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workbook, setWorkbook] = useState<WorkbookState>(() => {
    const sheet1 = createInitialSheet('sheet-1', 'Sheet1');
    return {
      sheets: { 'sheet-1': sheet1 },
      sheetOrder: ['sheet-1'],
      activeSheetId: 'sheet-1',
      clipboard: null
    };
  });

  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [zoom, setZoom] = useState<number>(100);

  // Undo / Redo stacks
  const [undoStack, setUndoStack] = useState<WorkbookState[]>([]);
  const [redoStack, setRedoStack] = useState<WorkbookState[]>([]);

  const activeSheet = workbook.sheets[workbook.activeSheetId];

  // Push to history helper
  const pushToHistory = (state: WorkbookState) => {
    setUndoStack(prev => [...prev.slice(-99), workbook]); // Limit stack to 100 states
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(prevStack => prevStack.slice(0, -1));
    setRedoStack(nextStack => [...nextStack, workbook]);
    setWorkbook(prev);
    setEditingCell(null);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(nextStack => nextStack.slice(0, -1));
    setUndoStack(prevStack => [...prevStack, workbook]);
    setWorkbook(next);
    setEditingCell(null);
  };

  // Sheet operations
  const setActiveSheet = (id: string) => {
    setEditingCell(null);
    setWorkbook(prev => ({ ...prev, activeSheetId: id }));
  };

  const addSheet = () => {
    pushToHistory(workbook);
    const newId = `sheet-${Date.now()}`;
    const nextNum = workbook.sheetOrder.length + 1;
    const newSheet = createInitialSheet(newId, `Sheet${nextNum}`);
    
    setWorkbook(prev => ({
      ...prev,
      sheets: { ...prev.sheets, [newId]: newSheet },
      sheetOrder: [...prev.sheetOrder, newId],
      activeSheetId: newId
    }));
  };

  const deleteSheet = (id: string) => {
    if (workbook.sheetOrder.length <= 1) return; // Prevent deleting last sheet
    pushToHistory(workbook);
    
    const newOrder = workbook.sheetOrder.filter(sId => sId !== id);
    const newSheets = { ...workbook.sheets };
    delete newSheets[id];

    let newActiveId = workbook.activeSheetId;
    if (workbook.activeSheetId === id) {
      newActiveId = newOrder[0];
    }

    setWorkbook(prev => ({
      ...prev,
      sheets: newSheets,
      sheetOrder: newOrder,
      activeSheetId: newActiveId
    }));
    setEditingCell(null);
  };

  const renameSheet = (id: string, name: string) => {
    if (!name.trim()) return;
    pushToHistory(workbook);
    
    setWorkbook(prev => ({
      ...prev,
      sheets: {
        ...prev.sheets,
        [id]: { ...prev.sheets[id], name: name.trim() }
      }
    }));
  };

  const duplicateSheet = (id: string) => {
    pushToHistory(workbook);
    const srcSheet = workbook.sheets[id];
    const newId = `sheet-${Date.now()}`;
    
    // Deep clone cells
    const clonedCells = JSON.parse(JSON.stringify(srcSheet.cells));

    const duplicated: SheetData = {
      ...srcSheet,
      id: newId,
      name: `${srcSheet.name} (Copy)`,
      cells: clonedCells,
      selectedRange: { startRow: 1, startCol: 1, endRow: 1, endCol: 1 },
      activeCell: 'A1'
    };

    setWorkbook(prev => {
      const idx = prev.sheetOrder.indexOf(id);
      const newOrder = [...prev.sheetOrder];
      newOrder.splice(idx + 1, 0, newId);

      return {
        ...prev,
        sheets: { ...prev.sheets, [newId]: duplicated },
        sheetOrder: newOrder,
        activeSheetId: newId
      };
    });
  };

  const reorderSheets = (startIndex: number, endIndex: number) => {
    pushToHistory(workbook);
    const newOrder = [...workbook.sheetOrder];
    const [removed] = newOrder.splice(startIndex, 1);
    newOrder.splice(endIndex, 0, removed);

    setWorkbook(prev => ({ ...prev, sheetOrder: newOrder }));
  };

  // Selections
  const selectCell = (cellKey: string, extendRange = false) => {
    const colMatch = cellKey.match(/^[A-Z]+/);
    const rowMatch = cellKey.match(/[0-9]+$/);
    if (!colMatch || !rowMatch) return;

    const colNum = colLetterToNumber(colMatch[0]);
    const rowNum = parseInt(rowMatch[0], 10);

    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      let newRange: CellRange;

      if (extendRange && sheet.selectedRange) {
        // Find anchors
        const activeColMatch = sheet.activeCell.match(/^[A-Z]+/);
        const activeRowMatch = sheet.activeCell.match(/[0-9]+$/);
        const activeCol = activeColMatch ? colLetterToNumber(activeColMatch[0]) : 1;
        const activeRow = activeRowMatch ? parseInt(activeRowMatch[0], 10) : 1;

        newRange = {
          startRow: Math.min(activeRow, rowNum),
          startCol: Math.min(activeCol, colNum),
          endRow: Math.max(activeRow, rowNum),
          endCol: Math.max(activeCol, colNum)
        };
      } else {
        newRange = {
          startRow: rowNum,
          startCol: colNum,
          endRow: rowNum,
          endCol: colNum
        };
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            selectedRange: newRange,
            activeCell: extendRange ? sheet.activeCell : cellKey
          }
        }
      };
    });

    if (!extendRange) {
      const cell = activeSheet.cells[cellKey];
      setEditValue(cell ? cell.value : '');
    }
  };

  const selectRange = (range: CellRange | null) => {
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            selectedRange: range
          }
        }
      };
    });
  };

  const selectRow = (rowNum: number, extendRange = false) => {
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      let newRange: CellRange;

      if (extendRange && sheet.selectedRange) {
        newRange = {
          startRow: Math.min(sheet.selectedRange.startRow, rowNum),
          startCol: 1,
          endRow: Math.max(sheet.selectedRange.endRow, rowNum),
          endCol: sheet.colCount
        };
      } else {
        newRange = {
          startRow: rowNum,
          startCol: 1,
          endRow: rowNum,
          endCol: sheet.colCount
        };
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            selectedRange: newRange,
            activeCell: `A${rowNum}`
          }
        }
      };
    });
  };

  const selectCol = (colNum: number, extendRange = false) => {
    const colLetter = colNumberToLetter(colNum);
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      let newRange: CellRange;

      if (extendRange && sheet.selectedRange) {
        newRange = {
          startRow: 1,
          startCol: Math.min(sheet.selectedRange.startCol, colNum),
          endRow: sheet.rowCount,
          endCol: Math.max(sheet.selectedRange.endCol, colNum)
        };
      } else {
        newRange = {
          startRow: 1,
          startCol: colNum,
          endRow: sheet.rowCount,
          endCol: colNum
        };
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            selectedRange: newRange,
            activeCell: `${colLetter}1`
          }
        }
      };
    });
  };

  // Editing and Grid value updates
  const updateCell = (cellKey: string, value: string) => {
    pushToHistory(workbook);
    
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells = { ...sheet.cells };

      if (value === '') {
        delete newCells[cellKey];
      } else {
        newCells[cellKey] = {
          ...(newCells[cellKey] || {}),
          value
        };
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells
          }
        }
      };
    });
  };

  const startEditing = (cellKey: string, initialVal?: string) => {
    setEditingCell(cellKey);
    if (initialVal !== undefined) {
      setEditValue(initialVal);
    } else {
      const cell = activeSheet.cells[cellKey];
      setEditValue(cell ? cell.value : '');
    }
  };

  const stopEditing = (commit = true) => {
    if (!editingCell) return;
    if (commit) {
      updateCell(editingCell, editValue);
    }
    setEditingCell(null);
  };

  const clearContents = () => {
    const range = activeSheet.selectedRange;
    if (!range) return;

    pushToHistory(workbook);
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells = { ...sheet.cells };

      for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
          const key = colNumberToLetter(c) + r;
          delete newCells[key];
        }
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells
          }
        }
      };
    });
    setEditValue('');
  };

  // Formatting Styles
  const applyFormatting = (styleKey: keyof CellData, value: any) => {
    const range = activeSheet.selectedRange;
    if (!range) return;

    pushToHistory(workbook);
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells = { ...sheet.cells };

      for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
          const key = colNumberToLetter(c) + r;
          const currentCell = newCells[key] || { value: '' };
          
          newCells[key] = {
            ...currentCell,
            [styleKey]: value
          };
        }
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells
          }
        }
      };
    });
  };

  const mergeCells = () => {
    const range = activeSheet.selectedRange;
    if (!range) return;
    
    // Merging requires at least 2 cells
    if (range.startRow === range.endRow && range.startCol === range.endCol) return;

    pushToHistory(workbook);
    const originKey = colNumberToLetter(range.startCol) + range.startRow;
    
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells = { ...sheet.cells };
      const mergedRanges = [...(sheet.mergedRanges || [])];
      
      const rangeStr = `${colNumberToLetter(range.startCol)}${range.startRow}:${colNumberToLetter(range.endCol)}${range.endRow}`;
      mergedRanges.push(rangeStr);

      for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
          const cellKey = colNumberToLetter(c) + r;
          if (cellKey !== originKey) {
            newCells[cellKey] = {
              ...(newCells[cellKey] || { value: '' }),
              mergedInto: originKey
            };
          }
        }
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells,
            mergedRanges
          }
        }
      };
    });
  };

  // Row and Column Context Operations
  const insertRow = () => {
    const range = activeSheet.selectedRange;
    if (!range) return;
    pushToHistory(workbook);

    const targetRow = range.startRow;
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells: Record<string, CellData> = {};

      Object.entries(sheet.cells).forEach(([key, cell]) => {
        const colMatch = key.match(/^[A-Z]+/);
        const rowMatch = key.match(/[0-9]+$/);
        if (!colMatch || !rowMatch) return;

        const col = colMatch[0];
        const row = parseInt(rowMatch[0], 10);

        if (row >= targetRow) {
          newCells[`${col}${row + 1}`] = cell;
        } else {
          newCells[key] = cell;
        }
      });

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells,
            rowCount: sheet.rowCount + 1
          }
        }
      };
    });
  };

  const deleteRow = () => {
    const range = activeSheet.selectedRange;
    if (!range) return;
    pushToHistory(workbook);

    const start = range.startRow;
    const count = range.endRow - range.startRow + 1;

    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells: Record<string, CellData> = {};

      Object.entries(sheet.cells).forEach(([key, cell]) => {
        const colMatch = key.match(/^[A-Z]+/);
        const rowMatch = key.match(/[0-9]+$/);
        if (!colMatch || !rowMatch) return;

        const col = colMatch[0];
        const row = parseInt(rowMatch[0], 10);

        if (row >= start && row < start + count) {
          // Skip deleted rows
          return;
        } else if (row >= start + count) {
          // Shift rows up
          newCells[`${col}${row - count}`] = cell;
        } else {
          newCells[key] = cell;
        }
      });

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells,
            rowCount: Math.max(1, sheet.rowCount - count)
          }
        }
      };
    });
  };

  const insertColumn = () => {
    const range = activeSheet.selectedRange;
    if (!range) return;
    pushToHistory(workbook);

    const targetCol = range.startCol;
    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells: Record<string, CellData> = {};

      Object.entries(sheet.cells).forEach(([key, cell]) => {
        const colMatch = key.match(/^[A-Z]+/);
        const rowMatch = key.match(/[0-9]+$/);
        if (!colMatch || !rowMatch) return;

        const colNum = colLetterToNumber(colMatch[0]);
        const row = rowMatch[0];

        if (colNum >= targetCol) {
          newCells[`${colNumberToLetter(colNum + 1)}${row}`] = cell;
        } else {
          newCells[key] = cell;
        }
      });

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells,
            colCount: sheet.colCount + 1
          }
        }
      };
    });
  };

  const deleteColumn = () => {
    const range = activeSheet.selectedRange;
    if (!range) return;
    pushToHistory(workbook);

    const start = range.startCol;
    const count = range.endCol - range.startCol + 1;

    setWorkbook(prev => {
      const sheet = prev.sheets[prev.activeSheetId];
      const newCells: Record<string, CellData> = {};

      Object.entries(sheet.cells).forEach(([key, cell]) => {
        const colMatch = key.match(/^[A-Z]+/);
        const rowMatch = key.match(/[0-9]+$/);
        if (!colMatch || !rowMatch) return;

        const colNum = colLetterToNumber(colMatch[0]);
        const row = rowMatch[0];

        if (colNum >= start && colNum < start + count) {
          // Skip deleted columns
          return;
        } else if (colNum >= start + count) {
          // Shift columns left
          newCells[`${colNumberToLetter(colNum - count)}${row}`] = cell;
        } else {
          newCells[key] = cell;
        }
      });

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...sheet,
            cells: newCells,
            colCount: Math.max(1, sheet.colCount - count)
          }
        }
      };
    });
  };

  // Copy / Cut / Paste
  const copy = () => {
    if (!activeSheet.selectedRange) return;
    setWorkbook(prev => ({
      ...prev,
      clipboard: {
        range: activeSheet.selectedRange!,
        sheetId: prev.activeSheetId,
        type: 'copy'
      }
    }));
  };

  const cut = () => {
    if (!activeSheet.selectedRange) return;
    setWorkbook(prev => ({
      ...prev,
      clipboard: {
        range: activeSheet.selectedRange!,
        sheetId: prev.activeSheetId,
        type: 'cut'
      }
    }));
  };

  const paste = () => {
    const clip = workbook.clipboard;
    const range = activeSheet.selectedRange;
    if (!clip || !range) return;

    pushToHistory(workbook);
    const sourceSheet = workbook.sheets[clip.sheetId];
    
    const deltaRow = range.startRow - clip.range.startRow;
    const deltaCol = range.startCol - clip.range.startCol;

    setWorkbook(prev => {
      const activeSheet = prev.sheets[prev.activeSheetId];
      const newCells = { ...activeSheet.cells };
      const sourceCells = { ...prev.sheets[clip.sheetId].cells };

      // Loop copy range cells
      for (let r = clip.range.startRow; r <= clip.range.endRow; r++) {
        for (let c = clip.range.startCol; c <= clip.range.endCol; c++) {
          const srcKey = colNumberToLetter(c) + r;
          const destKey = colNumberToLetter(c + deltaCol) + (r + deltaRow);

          // Get src cell
          const srcCell = sourceCells[srcKey];
          if (srcCell) {
            newCells[destKey] = JSON.parse(JSON.stringify(srcCell));
          } else {
            delete newCells[destKey];
          }

          // If cut, delete original
          if (clip.type === 'cut') {
            const isSelfPaste = clip.sheetId === prev.activeSheetId;
            if (isSelfPaste) {
              // Delete only if it is outside of the dest key to prevent deleting overwriting cell
              if (r < range.startRow || r > range.startRow + (clip.range.endRow - clip.range.startRow) ||
                  c < range.startCol || c > range.startCol + (clip.range.endCol - clip.range.startCol)) {
                delete newCells[srcKey];
              }
            } else {
              delete prev.sheets[clip.sheetId].cells[srcKey];
            }
          }
        }
      }

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...activeSheet,
            cells: newCells
          }
        },
        clipboard: clip.type === 'cut' ? null : clip // Clear clipboard if cut
      };
    });
  };

  const saveWorkbook = () => {
    // Save workbook mock
    console.log("Workbook Saved!", workbook);
    alert("Workbook state saved to cache!");
  };

  return (
    <SpreadsheetContext.Provider value={{
      workbook,
      activeSheet,
      editingCell,
      editValue,
      activeTab,
      zoom,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      
      undo,
      redo,
      
      setActiveSheet,
      addSheet,
      deleteSheet,
      renameSheet,
      duplicateSheet,
      reorderSheets,
      
      selectCell,
      selectRange,
      selectRow,
      selectCol,
      
      updateCell,
      startEditing,
      stopEditing,
      setEditValue,
      clearContents,
      
      insertRow,
      deleteRow,
      insertColumn,
      deleteColumn,
      
      applyFormatting,
      mergeCells,
      
      copy,
      cut,
      paste,
      
      setActiveTab,
      setZoom,
      saveWorkbook
    }}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
};
