"use client";

import React from 'react';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function StatusBar() {
  const { activeSheet, zoom, setZoom } = useSpreadsheet();

  const handleZoomOut = () => {
    setZoom(Math.max(50, zoom - 10));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(150, zoom + 10));
  };

  // Get selected range coordinates
  let selectionStr = activeSheet.activeCell;
  const range = activeSheet.selectedRange;
  if (range && (range.startRow !== range.endRow || range.startCol !== range.endCol)) {
    const colLetter = (colNum: number) => {
      let temp = colNum;
      let letter = '';
      while (temp > 0) {
        let modulo = (temp - 1) % 26;
        letter = String.fromCharCode(65 + modulo) + letter;
        temp = Math.floor((temp - modulo) / 26);
      }
      return letter;
    };
    selectionStr = `${colLetter(range.startCol)}${range.startRow}:${colLetter(range.endCol)}${range.endRow}`;
  }

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-[10.5px] font-medium text-slate-400 font-mono select-none shrink-0">
      {/* Ready indicator */}
      <div className="flex items-center gap-3">
        <span className="text-emerald-450 font-bold uppercase tracking-wider">Ready</span>
        <div className="h-3 w-[1px] bg-slate-800" />
        <span>Selected: <strong className="text-slate-200">{selectionStr}</strong></span>
      </div>

      {/* Grid metrics and zoom slider */}
      <div className="flex items-center gap-4">
        <span>Rows: {activeSheet.rowCount.toLocaleString()}</span>
        <span>Cols: {activeSheet.colCount.toLocaleString()}</span>
        
        <div className="h-3 w-[1px] bg-slate-800" />

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomOut}
            className="p-0.5 rounded hover:bg-slate-800 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span>{zoom}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-0.5 rounded hover:bg-slate-800 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
