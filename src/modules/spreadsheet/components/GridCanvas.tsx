"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { colNumberToLetter, colLetterToNumber, getCellAddress, parseCellAddress } from '../utils/gridUtils';
import { evaluateGrid } from '../formula-engine/evaluator';
import ContextMenu from './ContextMenu';

const ROW_HEIGHT = 25;
const COL_WIDTH = 100;
const ROW_HEADER_WIDTH = 48;
const COL_HEADER_HEIGHT = 25;

export default function GridCanvas() {
  const {
    workbook,
    activeSheet,
    editingCell,
    startEditing,
    stopEditing,
    editValue,
    setEditValue,
    selectCell,
    selectRange,
    selectRow,
    selectCol,
    updateCell,
    clearContents,
    undo,
    redo,
    copy,
    cut,
    paste,
    zoom
  } = useSpreadsheet();

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Viewport scroll and dimension states
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  
  // Drag selection state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCoord, setDragStartCoord] = useState<{ row: number; col: number } | null>(null);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Measure visible dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync scroll positions
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  // Evaluate cells for visual display
  const evaluatedCells = evaluateGrid(activeSheet.cells);

  // Parse active cell coordinate details
  const activeCellCoord = parseCellAddress(activeSheet.activeCell) || { row: 1, col: 1 };

  // Calculate viewport boundaries
  const visibleRowsStart = Math.max(1, Math.floor(scrollTop / ROW_HEIGHT) + 1);
  const visibleRowsEnd = Math.min(activeSheet.rowCount, visibleRowsStart + Math.ceil(dimensions.height / ROW_HEIGHT) + 4);

  const visibleColsStart = Math.max(1, Math.floor(scrollLeft / COL_WIDTH) + 1);
  const visibleColsEnd = Math.min(activeSheet.colCount, visibleColsStart + Math.ceil(dimensions.width / COL_WIDTH) + 2);

  // Scroll active cell into view
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Active cell bounds
    const cellTop = (activeCellCoord.row - 1) * ROW_HEIGHT;
    const cellBottom = cellTop + ROW_HEIGHT;
    const cellLeft = (activeCellCoord.col - 1) * COL_WIDTH;
    const cellRight = cellLeft + COL_WIDTH;

    // Viewport bounds
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + dimensions.height - COL_HEADER_HEIGHT;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + dimensions.width - ROW_HEADER_WIDTH;

    if (cellTop < viewTop) {
      container.scrollTop = cellTop;
    } else if (cellBottom > viewBottom) {
      container.scrollTop = cellBottom - dimensions.height + COL_HEADER_HEIGHT;
    }

    if (cellLeft < viewLeft) {
      container.scrollLeft = cellLeft;
    } else if (cellRight > viewRight) {
      container.scrollLeft = cellRight - dimensions.width + ROW_HEADER_WIDTH;
    }
  }, [activeSheet.activeCell]);

  // Focus editor input if active
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // Drag selection handlers
  const handleCellMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    if (e.button === 2) return; // Right click
    setIsDragging(true);
    setDragStartCoord({ row, col });
    
    const key = getCellAddress(row, col);
    selectCell(key, e.shiftKey);
    setContextMenu(null);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isDragging || !dragStartCoord) return;
    
    selectRange({
      startRow: Math.min(dragStartCoord.row, row),
      startCol: Math.min(dragStartCoord.col, col),
      endRow: Math.max(dragStartCoord.row, row),
      endCol: Math.max(dragStartCoord.col, col)
    });
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Keyboard navigation & Shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        stopEditing(true);
        moveSelection(1, 0); // Move down
      } else if (e.key === 'Tab') {
        e.preventDefault();
        stopEditing(true);
        moveSelection(0, 1); // Move right
      } else if (e.key === 'Escape') {
        e.preventDefault();
        stopEditing(false);
      }
      return;
    }

    // Grid shortcuts & movement
    const shift = e.shiftKey;
    const ctrl = e.ctrlKey || e.metaKey;

    if (ctrl) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          copy();
          break;
        case 'v':
          e.preventDefault();
          paste();
          break;
        case 'x':
          e.preventDefault();
          cut();
          break;
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 's':
          e.preventDefault();
          alert("Workbook Saved!");
          break;
        default:
          break;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveSelection(-1, 0, shift);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveSelection(1, 0, shift);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveSelection(0, -1, shift);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveSelection(0, 1, shift);
        break;
      case 'Tab':
        e.preventDefault();
        moveSelection(0, e.shiftKey ? -1 : 1, false);
        break;
      case 'Enter':
        e.preventDefault();
        startEditing(activeSheet.activeCell);
        break;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        clearContents();
        break;
      case 'F2':
        e.preventDefault();
        startEditing(activeSheet.activeCell);
        break;
      case 'Home':
        e.preventDefault();
        selectCell(`A${activeCellCoord.row}`);
        break;
      case 'PageUp':
        e.preventDefault();
        moveSelection(-20, 0, shift);
        break;
      case 'PageDown':
        e.preventDefault();
        moveSelection(20, 0, shift);
        break;
      default:
        // Direct character typing triggers edit mode
        if (e.key.length === 1 && !e.altKey) {
          startEditing(activeSheet.activeCell, e.key);
        }
        break;
    }
  };

  const moveSelection = (rowDelta: number, colDelta: number, extendRange = false) => {
    const nextRow = Math.max(1, Math.min(activeSheet.rowCount, activeCellCoord.row + rowDelta));
    const nextCol = Math.max(1, Math.min(activeSheet.colCount, activeCellCoord.col + colDelta));
    const nextKey = getCellAddress(nextRow, nextCol);
    selectCell(nextKey, extendRange);
  };

  // Right click context menu handler
  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    const cellKey = getCellAddress(row, col);
    
    // If cell not in range, select it
    const range = activeSheet.selectedRange;
    let inRange = false;
    if (range) {
      inRange = (
        row >= range.startRow && 
        row <= range.endRow && 
        col >= range.startCol && 
        col <= range.endCol
      );
    }
    if (!inRange) {
      selectCell(cellKey);
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Render headers calculations
  const cols = Array.from(
    { length: visibleColsEnd - visibleColsStart + 1 }, 
    (_, i) => visibleColsStart + i
  );
  
  const rows = Array.from(
    { length: visibleRowsEnd - visibleRowsStart + 1 }, 
    (_, i) => visibleRowsStart + i
  );

  const totalWidth = ROW_HEADER_WIDTH + activeSheet.colCount * COL_WIDTH;
  const totalHeight = COL_HEADER_HEIGHT + activeSheet.rowCount * ROW_HEIGHT;

  // Selection overlay bounding calculations
  let selectionStyle: React.CSSProperties | null = null;
  const range = activeSheet.selectedRange;
  if (range) {
    const top = COL_HEADER_HEIGHT + (range.startRow - 1) * ROW_HEIGHT;
    const left = ROW_HEADER_WIDTH + (range.startCol - 1) * COL_WIDTH;
    const width = (range.endCol - range.startCol + 1) * COL_WIDTH;
    const height = (range.endRow - range.startRow + 1) * ROW_HEIGHT;
    selectionStyle = { top, left, width, height };
  }

  // Active cell editor positioning
  let editorStyle: React.CSSProperties | null = null;
  if (editingCell) {
    const top = COL_HEADER_HEIGHT + (activeCellCoord.row - 1) * ROW_HEIGHT;
    const left = ROW_HEADER_WIDTH + (activeCellCoord.col - 1) * COL_WIDTH;
    editorStyle = { 
      top, 
      left, 
      width: COL_WIDTH, 
      height: ROW_HEIGHT 
    };
  }

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="flex-1 overflow-auto bg-slate-950 outline-none relative select-none custom-scrollbar"
    >
      {/* Scrollable Spacer container */}
      <div 
        style={{ width: totalWidth, height: totalHeight }}
        className="relative"
      >
        {/* Visible Rendered grid table */}
        <table 
          ref={tableRef}
          className="border-collapse table-fixed absolute left-0 top-0 select-none font-mono"
        >
          {/* Column sizing details */}
          <colgroup>
            <col style={{ width: ROW_HEADER_WIDTH }} />
            {/* Left spacer column */}
            {visibleColsStart > 1 && (
              <col style={{ width: (visibleColsStart - 1) * COL_WIDTH }} />
            )}
            {cols.map(c => (
              <col key={c} style={{ width: COL_WIDTH }} />
            ))}
          </colgroup>

          <thead>
            {/* Header Column letters */}
            <tr className="bg-slate-900 sticky top-0 z-30 h-[25px]">
              {/* Intersection corner */}
              <th className="sticky left-0 top-0 z-40 bg-slate-900 border-r border-b border-slate-800 text-[10px] text-slate-550 font-bold select-none text-center cursor-default h-[25px]" />
              {/* Left spacer cell */}
              {visibleColsStart > 1 && (
                <th className="bg-slate-900/60 border-b border-slate-800" />
              )}
              {cols.map(c => (
                <th
                  key={c}
                  onClick={() => selectCol(c)}
                  className="bg-slate-900 border-r border-b border-slate-800 text-[10px] text-slate-450 hover:text-white font-bold select-none text-center cursor-pointer h-[25px]"
                >
                  {colNumberToLetter(c)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Top spacer row */}
            {visibleRowsStart > 1 && (
              <tr style={{ height: (visibleRowsStart - 1) * ROW_HEIGHT }}>
                <td className="sticky left-0 bg-slate-900 border-r border-slate-800" />
                <td colSpan={cols.length + 1} />
              </tr>
            )}

            {/* Grid rows */}
            {rows.map(r => (
              <tr key={r} style={{ height: ROW_HEIGHT }}>
                {/* Row number header */}
                <td
                  onClick={() => selectRow(r)}
                  className="sticky left-0 z-25 bg-slate-900 border-r border-b border-slate-800 text-[10px] text-slate-450 hover:text-white font-bold text-center select-none cursor-pointer h-[25px]"
                >
                  {r}
                </td>
                {/* Left spacer cell */}
                {visibleColsStart > 1 && <td className="border-r border-b border-slate-900" />}

                {cols.map(c => {
                  const key = getCellAddress(r, c);
                  const cell = evaluatedCells[key];
                  const rawCell = activeSheet.cells[key];
                  const isMerged = !!rawCell?.mergedInto;

                  // Rendered styling
                  let cellStyleClass = 'border-r border-b border-slate-900 px-2 truncate h-[25px] overflow-hidden text-xs text-left align-middle select-none';
                  
                  if (rawCell) {
                    if (rawCell.bold) cellStyleClass += ' font-bold';
                    if (rawCell.italic) cellStyleClass += ' italic';
                    if (rawCell.underline) cellStyleClass += ' underline';
                    if (rawCell.align === 'center') cellStyleClass += ' text-center';
                    else if (rawCell.align === 'right') cellStyleClass += ' text-right';
                    
                    if (rawCell.bgColor) {
                      cellStyleClass += ` ${rawCell.bgColor}`;
                    } else {
                      cellStyleClass += ' text-slate-300';
                    }
                  } else {
                    cellStyleClass += ' text-slate-350';
                  }

                  // Render display value
                  let displayVal = '';
                  if (!isMerged) {
                    if (cell !== undefined && cell.computed !== undefined) {
                      displayVal = String(cell.computed);
                    } else if (rawCell) {
                      displayVal = String(rawCell.value);
                    }
                  }

                  return (
                    <td
                      key={key}
                      onMouseDown={(e) => handleCellMouseDown(r, c, e)}
                      onMouseEnter={() => handleCellMouseEnter(r, c)}
                      onDoubleClick={() => startEditing(key)}
                      onContextMenu={(e) => handleContextMenu(e, r, c)}
                      className={cellStyleClass}
                      style={{
                        color: rawCell?.color || undefined,
                        fontFamily: rawCell?.fontFamily || undefined,
                        fontSize: rawCell?.fontSize ? `${rawCell.fontSize}px` : undefined,
                      }}
                    >
                      {displayVal}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 1. Selection border outline Overlay */}
        {selectionStyle && (
          <div
            style={selectionStyle}
            className="absolute border border-emerald-500 bg-emerald-500/5 pointer-events-none z-10 select-none"
          >
            {/* Active Cell Corner Handler */}
            <div className="absolute right-[-3px] bottom-[-3px] w-1.5 h-1.5 bg-emerald-500 border border-slate-950" />
          </div>
        )}

        {/* 2. Active Cell Edit input Overlay */}
        {editingCell && editorStyle && (
          <input
            ref={inputRef}
            style={editorStyle}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              updateCell(editingCell, e.target.value);
            }}
            onBlur={() => stopEditing(true)}
            className="absolute bg-slate-950 text-slate-100 border border-emerald-500 font-mono text-xs px-2 z-40 outline-none shadow-xl"
          />
        )}
      </div>

      {/* 3. Context Menu dropdown */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
