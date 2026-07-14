"use client";

import React from 'react';
import { useBI } from '../context/BIContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { parseRangeData, calculateMetrics } from '../analytics/DataAnalyzer';
import { Sparkles, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';

export default function AIInsightsPanel() {
  const { activeSheet } = useSpreadsheet();
  const { collapsiblePanel, setCollapsiblePanel } = useBI();

  if (collapsiblePanel !== 'ai-insights') return null;

  // Parse first 5 rows (B2:C5 range)
  const range = { startRow: 1, startCol: 0, endRow: 4, endCol: 1 };
  const { labels, numbers } = parseRangeData(range, activeSheet.cells);
  const metrics = calculateMetrics(numbers);

  // Generate dynamic insights
  const insights: string[] = [];
  if (numbers.length > 0) {
    insights.push(`Analyzed dataset containing ${metrics.count} rows of transactions.`);
    insights.push(`Overall aggregated sum totals represent $${metrics.sum.toLocaleString()}.`);
    insights.push(`Average value is evaluated at $${Math.round(metrics.avg).toLocaleString()} per unit.`);
    
    // Find highest value item name
    const maxIdx = numbers.indexOf(metrics.max);
    if (maxIdx !== -1) {
      insights.push(`Peak performer detected: ${labels[maxIdx]} generating $${metrics.max.toLocaleString()}.`);
    }

    if (metrics.growthRate !== 0) {
      insights.push(`Calculated period-over-period growth is trended at ${metrics.growthRate.toFixed(1)}%.`);
    }

    // Warnings
    const lowStockItems = labels.filter((l, i) => numbers[i] < 200);
    if (lowStockItems.length > 0) {
      insights.push(`Alert: inventory units for [${lowStockItems.join(', ')}] are running below optimal threshold.`);
    }
  } else {
    insights.push('Add numeric values to columns B to generate real-time AI BI insights.');
  }


  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 shrink-0 flex flex-col justify-between shadow-2xl z-40 select-none animate-in slide-in-from-right duration-250">
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
          <h3 className="text-xs font-bold text-emerald-450 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            AI Insights Panel
          </h3>
          <button
            onClick={() => setCollapsiblePanel('none')}
            className="text-slate-500 hover:text-slate-350 text-[10px] font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5 pt-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-350">
              {insight.includes('Alert:') || insight.includes('Warning:') ? (
                <AlertTriangle className="w-4 h-4 text-rose-455 shrink-0 mt-0.5" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-455 shrink-0 mt-0.5" />
              )}
              <p className="font-sans leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-850 pt-4 text-[9px] text-slate-500 font-mono">
        Models: GPT-4 BI Agent • Live Updates enabled
      </div>
    </div>
  );
}
