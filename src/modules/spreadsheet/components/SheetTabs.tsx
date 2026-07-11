"use client";

import React, { useState } from 'react';
import { Plus, X, Copy, RotateCcw } from 'lucide-react';
import { useSpreadsheet } from '../context/SpreadsheetContext';

export default function SheetTabs() {
  const { 
    workbook, 
    setActiveSheet, 
    addSheet, 
    deleteSheet, 
    renameSheet, 
    duplicateSheet 
  } = useSpreadsheet();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  const handleDoubleTabClick = (sheetId: string, currentName: string) => {
    setRenamingId(sheetId);
    setRenameVal(currentName);
  };

  const commitRename = (sheetId: string) => {
    if (renameVal.trim()) {
      renameSheet(sheetId, renameVal.trim());
    }
    setRenamingId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sheetId: string) => {
    if (e.key === 'Enter') {
      commitRename(sheetId);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  return (
    <div className="flex items-center bg-slate-900 border-t border-slate-800 shrink-0 text-slate-200 select-none font-sans overflow-x-auto scrollbar-none">
      {/* Scrollable Tabs */}
      <div className="flex items-center">
        {workbook.sheetOrder.map((sheetId, index) => {
          const sheet = workbook.sheets[sheetId];
          const isActive = workbook.activeSheetId === sheetId;
          const isRenaming = renamingId === sheetId;

          return (
            <div
              key={sheetId}
              onDoubleClick={() => handleDoubleTabClick(sheetId, sheet.name)}
              className={`flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-bold transition-all relative border-r border-slate-800/80 cursor-pointer ${
                isActive 
                  ? 'bg-slate-950 text-emerald-450 border-t-2 border-t-emerald-500 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
              }`}
              onClick={() => !isRenaming && setActiveSheet(sheetId)}
            >
              {isRenaming ? (
                <input
                  type="text"
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={() => commitRename(sheetId)}
                  onKeyDown={(e) => handleRenameKeyDown(e, sheetId)}
                  autoFocus
                  className="bg-slate-900 text-emerald-450 text-xs font-bold px-1 py-0.5 rounded border border-emerald-500 focus:outline-none w-20 text-center"
                />
              ) : (
                <span className="truncate">{sheet.name}</span>
              )}

              {/* Duplicate option */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSheet(sheetId);
                }}
                className="p-0.5 rounded hover:bg-slate-800 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition"
                title="Duplicate Sheet"
              >
                <Copy className="w-2.5 h-2.5 text-slate-500 hover:text-slate-400" />
              </button>

              {/* Close/delete button (only if > 1 sheets exist) */}
              {workbook.sheetOrder.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSheet(sheetId);
                  }}
                  className="p-0.5 rounded hover:bg-red-500/10 hover:text-red-500 transition ml-1"
                  title="Delete Sheet"
                >
                  <X className="w-3 h-3 text-slate-500 hover:text-red-400" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add sheet button */}
        <button
          onClick={addSheet}
          className="p-2 hover:bg-slate-950/60 hover:text-white transition"
          title="Insert New Sheet"
        >
          <Plus className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
