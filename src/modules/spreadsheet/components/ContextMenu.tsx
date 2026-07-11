"use client";

import React, { useEffect, useRef } from 'react';
import { 
  Scissors, 
  Copy, 
  Clipboard, 
  PlusSquare, 
  Trash2, 
  Layers, 
  Eraser, 
  FileSpreadsheet 
} from 'lucide-react';
import { useSpreadsheet } from '../context/SpreadsheetContext';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const {
    workbook,
    copy,
    cut,
    paste,
    insertRow,
    deleteRow,
    insertColumn,
    deleteColumn,
    clearContents,
    mergeCells,
    applyFormatting
  } = useSpreadsheet();

  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="fixed z-50 w-52 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1.5 text-slate-300 font-sans text-xs select-none"
    >
      {/* Cut, Copy, Paste */}
      <button
        onClick={() => handleAction(cut)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <Scissors className="w-3.5 h-3.5 text-slate-500" />
        Cut
      </button>
      <button
        onClick={() => handleAction(copy)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <Copy className="w-3.5 h-3.5 text-slate-500" />
        Copy
      </button>
      <button
        onClick={() => handleAction(paste)}
        disabled={!workbook.clipboard}
        className={`w-full flex items-center gap-2.5 px-4.5 py-2 text-left transition ${
          workbook.clipboard 
            ? 'hover:bg-slate-800 hover:text-white' 
            : 'opacity-40 cursor-not-allowed'
        }`}
      >
        <Clipboard className="w-3.5 h-3.5 text-slate-500" />
        Paste
      </button>

      <div className="h-[1px] bg-slate-800 my-1.5" />

      {/* Row Operations */}
      <button
        onClick={() => handleAction(insertRow)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <PlusSquare className="w-3.5 h-3.5 text-slate-500" />
        Insert Row
      </button>
      <button
        onClick={() => handleAction(deleteRow)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <Trash2 className="w-3.5 h-3.5 text-slate-500" />
        Delete Row
      </button>

      <div className="h-[1px] bg-slate-800 my-1.5" />

      {/* Column Operations */}
      <button
        onClick={() => handleAction(insertColumn)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <PlusSquare className="w-3.5 h-3.5 text-slate-500" />
        Insert Column
      </button>
      <button
        onClick={() => handleAction(deleteColumn)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <Trash2 className="w-3.5 h-3.5 text-slate-500" />
        Delete Column
      </button>

      <div className="h-[1px] bg-slate-800 my-1.5" />

      {/* Merge & Formatting */}
      <button
        onClick={() => handleAction(mergeCells)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <Layers className="w-3.5 h-3.5 text-slate-500" />
        Merge Cells
      </button>
      <button
        onClick={() => handleAction(clearContents)}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <Eraser className="w-3.5 h-3.5 text-slate-500" />
        Clear Contents
      </button>
      
      <div className="h-[1px] bg-slate-800 my-1.5" />

      {/* Format as Currency */}
      <button
        onClick={() => handleAction(() => applyFormatting('format', 'currency'))}
        className="w-full flex items-center gap-2.5 px-4.5 py-2 hover:bg-slate-800 hover:text-white text-left transition"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
        Format as Currency ($)
      </button>
    </div>
  );
}
