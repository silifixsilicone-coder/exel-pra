"use client";

import React from 'react';
import QuickToolbar from './QuickToolbar';
import Ribbon from './Ribbon';
import FormulaBar from './FormulaBar';
import GridCanvas from './GridCanvas';
import SheetTabs from './SheetTabs';
import StatusBar from './StatusBar';

export default function SpreadsheetWorkspace() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans border border-slate-800 rounded-xl shadow-2xl">
      {/* 1. Quick Access Toolbar */}
      <QuickToolbar />

      {/* 2. Ribbon Toolbar */}
      <Ribbon />

      {/* 3. Formula Bar */}
      <FormulaBar />

      {/* 4. Main Grid Viewport */}
      <GridCanvas />

      {/* 5. Bottom Navigation Tabs */}
      <SheetTabs />

      {/* 6. Status Bar */}
      <StatusBar />
    </div>
  );
}
