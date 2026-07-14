"use client";

import React from 'react';
import QuickToolbar from './QuickToolbar';
import Ribbon from './Ribbon';
import FormulaBar from './FormulaBar';
import GridCanvas from './GridCanvas';
import SheetTabs from './SheetTabs';
import StatusBar from './StatusBar';
import { BIProvider, useBI } from '../bi/context/BIContext';
import DashboardBuilder from '../bi/dashboard/DashboardBuilder';
import PivotTableManager from '../bi/pivot-table/PivotTableManager';
import RightPanelContainer from './bi/RightPanelContainer';
import ChartContainer from '../bi/charts/ChartContainer';
import ReportGenerator from '../bi/reports/ReportGenerator';

function WorkspaceContent() {
  const { activeView, charts, updateChart, deleteChart } = useBI();

  return (
    <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
      {/* Main View Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        {activeView === 'grid' && (
          <div className="flex-1 overflow-hidden relative min-h-0">
            <GridCanvas />
            {/* Absolute overlay charts */}
            {charts.map(chart => (
              <ChartContainer
                key={chart.id}
                chart={chart}
                onUpdate={updateChart}
                onDelete={deleteChart}
              />
            ))}
          </div>
        )}
        {activeView === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-950 min-h-0">
            <DashboardBuilder />
          </div>
        )}
        {activeView === 'pivot' && (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-950 min-h-0 space-y-6">
            <PivotTableManager />
            <ReportGenerator />
          </div>
        )}
      </div>

      {/* Right panel sidebars (AI insights, recommendations, query) */}
      <RightPanelContainer />
    </div>
  );
}

export default function SpreadsheetWorkspace() {
  return (
    <BIProvider>
      <div className="flex flex-col w-full h-full min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans border border-slate-800 rounded-xl shadow-2xl">
        {/* 1. Quick Access Toolbar */}
        <QuickToolbar />

        {/* 2. Ribbon Toolbar */}
        <Ribbon />

        {/* 3. Formula Bar */}
        <FormulaBar />

        {/* 4. Main Grid Viewport */}
        <WorkspaceContent />

        {/* 5. Bottom Navigation Tabs */}
        <SheetTabs />

        {/* 6. Status Bar */}
        <StatusBar />
      </div>
    </BIProvider>
  );
}
