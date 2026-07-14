"use client";

import React, { useState } from 'react';
import { useBI, DashboardWidget } from '../context/BIContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { BarChart, Table, FileText, Sparkles, LayoutGrid } from 'lucide-react';

export default function DashboardBuilder() {
  const { dashboardWidgets, addDashboardWidget, deleteDashboardWidget, updateDashboardWidget } = useBI();
  const { activeSheet } = useSpreadsheet();

  // Add Widget Helper
  const handleCreateWidget = (type: DashboardWidget['type']) => {
    addDashboardWidget({
      type,
      title: `Custom ${type.toUpperCase()} Card`,
      w: 3,
      h: 2,
      config: type === 'progress' ? { value: 75 } : type === 'gauge' ? { value: 60 } : { text: 'Custom description text.' }
    });
  };

  // Reorder helper
  const handleShiftWidget = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dashboardWidgets.length) return;

    const list = [...dashboardWidgets];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    
    // In a real database we would update coordinate positions; here we re-arrange array
    // Since BIContext maps this list to state, it will refresh layout!
  };

  return (
    <div className="space-y-6 text-xs text-slate-100 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      
      {/* 1. Controller Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-200 uppercase tracking-widest text-[10px]">
            Dashboard Canvas Builder
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Drag-and-arrange dynamic KPI widgets, gauge charts, and progress bars.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['kpi', 'progress', 'gauge', 'heatmap', 'text'].map(type => (
            <button
              key={type}
              onClick={() => handleCreateWidget(type as any)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/35 hover:text-emerald-400 rounded-lg transition font-semibold capitalize text-[10px]"
            >
              + Add {type}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grid Dashboard Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dashboardWidgets.map((w, idx) => {
          return (
            <div
              key={w.id}
              className="bg-slate-950 border border-slate-850 p-5 rounded-2xl relative flex flex-col justify-between min-h-[160px] group shadow-inner hover:border-slate-750 transition"
            >
              {/* Header options */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-2">
                <input
                  type="text"
                  value={w.title}
                  onChange={(e) => updateDashboardWidget(w.id, { title: e.target.value })}
                  className="bg-transparent border-none text-[10px] font-bold text-slate-350 focus:outline-none focus:bg-slate-900 rounded px-1"
                />

                {/* Arrange and delete buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-150">
                  <button
                    onClick={() => handleShiftWidget(idx, 'up')}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-slate-200"
                    title="Move Left/Up"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleShiftWidget(idx, 'down')}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-slate-200"
                    title="Move Right/Down"
                  >
                    →
                  </button>
                  <button
                    onClick={() => deleteDashboardWidget(w.id)}
                    className="p-1 hover:bg-slate-900 text-rose-500 rounded ml-1"
                    title="Delete widget"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Render dynamic widget content */}
              <div className="flex-1 flex flex-col justify-center py-2 select-none">
                {w.type === 'kpi' && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Real-time KPI Metric</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight block">
                      {w.config.prefix || ''}{w.config.value}{w.config.suffix || ''}
                    </span>
                  </div>
                )}

                {w.type === 'progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-mono">
                      <span>Target Milestone Achievement</span>
                      <span>{w.config.value}%</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-850 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                        style={{ width: `${w.config.value}%` }}
                      />
                    </div>
                  </div>
                )}

                {w.type === 'gauge' && (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <svg className="w-24 h-12" viewBox="0 0 100 50">
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="125"
                        strokeDashoffset={`${125 - (125 * w.config.value) / 100}`}
                      />
                      <text x="50" y="45" textAnchor="middle" fill="#ffffff" className="text-[12px] font-bold font-mono">
                        {w.config.value}%
                      </text>
                    </svg>
                    <span className="text-[9px] text-slate-500 font-medium">Efficiency Index</span>
                  </div>
                )}

                {w.type === 'heatmap' && (
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-lg">
                    {[
                      'bg-emerald-500/10', 'bg-emerald-500/20', 'bg-emerald-500/40', 'bg-emerald-500/60',
                      'bg-emerald-500/20', 'bg-emerald-500/40', 'bg-emerald-500/60', 'bg-emerald-500/80',
                      'bg-emerald-500/40', 'bg-emerald-500/60', 'bg-emerald-500/80', 'bg-emerald-500'
                    ].map((color, cIdx) => (
                      <div key={cIdx} className={`h-4 rounded ${color} animate-pulse`} />
                    ))}
                  </div>
                )}

                {w.type === 'text' && (
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    {w.config.text}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-900 pt-2 text-[8px] text-slate-500 font-mono">
                Widget ID: {w.id} • Dynamic update enabled
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
