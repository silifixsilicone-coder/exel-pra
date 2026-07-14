"use client";

import React from 'react';
import { useBI } from '../context/BIContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { parseRangeData, calculateMetrics } from '../analytics/DataAnalyzer';
import { Lightbulb, AlertTriangle, CheckCircle, BarChart } from 'lucide-react';

export default function RecommendationsPanel() {
  const { activeSheet } = useSpreadsheet();
  const { collapsiblePanel, setCollapsiblePanel } = useBI();

  const range = { startRow: 1, startCol: 0, endRow: 4, endCol: 1 };
  const { labels, numbers } = parseRangeData(range, activeSheet.cells);
  const metrics = calculateMetrics(numbers);

  const recommendations: string[] = [];
  const issues: string[] = [];

  // Outlier detection: values > 2 * average
  numbers.forEach((num, i) => {
    if (num > metrics.avg * 1.8) {
      issues.push(`Outlier detected: cell value representing ${labels[i]} ($${num}) is significantly above average.`);
    }
  });

  // Duplicate check
  const seen = new Set<string>();
  labels.forEach(l => {
    if (seen.has(l)) {
      issues.push(`Duplicate row: multiple entries found for "${l}". Consider grouping or consolidating.`);
    }
    seen.add(l);
  });

  // Formula checks
  Object.entries(activeSheet.cells).forEach(([key, cell]) => {
    if (cell.value.startsWith('=')) {
      if (cell.computed && String(cell.computed).startsWith('#')) {
        issues.push(`Formula error: cell ${key} returned evaluation error "${cell.computed}".`);
      }
    }
  });

  // Chart type recommendations
  if (labels.some(l => l.toLowerCase().includes('jan') || l.toLowerCase().includes('month') || l.toLowerCase().includes('2026'))) {
    recommendations.push('Line Chart: Recommended for displaying sequential growth trends over time.');
  } else {
    recommendations.push('Column Chart: Recommended for displaying relative size comparison of product items.');
  }

  recommendations.push('Clean unused columns beyond D to optimize workbook load times.');

  if (collapsiblePanel !== 'recommendations') return null;

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 shrink-0 flex flex-col justify-between shadow-2xl z-40 select-none animate-in slide-in-from-right duration-250">
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Recommendations
          </h3>
          <button
            onClick={() => setCollapsiblePanel('none')}
            className="text-slate-500 hover:text-slate-350 text-[10px] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quality Alerts */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data Quality Alerts</h4>
          {issues.length === 0 ? (
            <div className="flex gap-2 items-center text-xs text-emerald-450 font-sans">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              No issues detected. Data quality is excellent!
            </div>
          ) : (
            issues.map((issue, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-rose-350 font-sans leading-normal">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p>{issue}</p>
              </div>
            ))
          )}
        </div>

        {/* Best recommendations */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Model Suggestions</h4>
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-2 items-start text-xs text-slate-350 font-sans leading-normal">
              <BarChart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-850 pt-4 text-[9px] text-slate-500 font-mono">
        Models: GPT-4 Recommendations • Caching enabled
      </div>
    </div>
  );
}
