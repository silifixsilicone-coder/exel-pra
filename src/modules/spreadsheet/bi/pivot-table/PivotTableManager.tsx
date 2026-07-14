"use client";

import React, { useState } from 'react';
import { useBI, PivotConfig } from '../context/BIContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { colNumberToLetter } from '../../utils/gridUtils';

export default function PivotTableManager() {
  const { pivotConfig, setPivotConfig } = useBI();
  const { activeSheet } = useSpreadsheet();

  const [selectedRowField, setSelectedRowField] = useState('Region');
  const [selectedValField, setSelectedValField] = useState('Sales');
  const [aggregation, setAggregation] = useState<'sum' | 'count' | 'average'>('sum');
  const [drillDownRow, setDrillDownRow] = useState<string | null>(null);

  // Extract keys and headers
  const headers = ['Region', 'Product', 'Sales', 'Cost'];
  const mockDataset = [
    { Region: 'North', Product: 'Laptop', Sales: 1200, Cost: 900 },
    { Region: 'North', Product: 'Mouse', Sales: 250, Cost: 180 },
    { Region: 'South', Product: 'Laptop', Sales: 2400, Cost: 1800 },
    { Region: 'South', Product: 'Keyboard', Sales: 300, Cost: 200 },
    { Region: 'East', Product: 'Mouse', Sales: 150, Cost: 100 },
    { Region: 'West', Product: 'Keyboard', Sales: 450, Cost: 300 }
  ];

  // Pivot calculation logic: group rows by selectedRowField
  const groupedData: Record<string, { totalVal: number; items: typeof mockDataset }> = {};

  mockDataset.forEach(row => {
    const key = String((row as any)[selectedRowField] || 'Unknown');
    const val = Number((row as any)[selectedValField] || 0);

    if (!groupedData[key]) {
      groupedData[key] = { totalVal: 0, items: [] };
    }

    groupedData[key].totalVal += val;
    groupedData[key].items.push(row);
  });

  // Calculate averages if selected
  if (aggregation === 'average') {
    Object.keys(groupedData).forEach(key => {
      groupedData[key].totalVal = Math.round(groupedData[key].totalVal / (groupedData[key].items.length || 1));
    });
  }

  const handleInitPivot = () => {
    setPivotConfig({
      id: 'pivot-1',
      dataRange: { startRow: 1, startCol: 0, endRow: 7, endCol: 3 },
      rows: [selectedRowField],
      columns: [],
      values: [{ field: selectedValField, agg: aggregation as any }],
      filters: [],
      calculatedFields: []
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-xs text-slate-100">
      
      {/* 1. Pivot Fields Panel */}
      <div className="w-full lg:w-1/3 bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4">
        <div>
          <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-2 select-none uppercase tracking-wider text-[10px]">
            Pivot Table Fields
          </h3>
          <p className="text-[10px] text-slate-500 mb-4">Choose fields to drop into rows, columns, and value aggregations.</p>
        </div>

        {/* Row field selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Rows dimension</label>
          <select
            value={selectedRowField}
            onChange={(e) => setSelectedRowField(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="Region">Region</option>
            <option value="Product">Product</option>
          </select>
        </div>

        {/* Value field selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Values (Calculations)</label>
          <select
            value={selectedValField}
            onChange={(e) => setSelectedValField(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="Sales">Sales ($)</option>
            <option value="Cost">Cost ($)</option>
          </select>
        </div>

        {/* Aggregation type select */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase">Summarize Value By</label>
          <select
            value={aggregation}
            onChange={(e) => setAggregation(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="sum">Sum</option>
            <option value="count">Count</option>
            <option value="average">Average</option>
          </select>
        </div>

        <button
          onClick={handleInitPivot}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition"
        >
          Generate Pivot Grid
        </button>
      </div>

      {/* 2. Pivot Output Table */}
      <div className="flex-1 bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4">
        <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Active Pivot Layout</span>
          {pivotConfig && (
            <span className="text-[9px] bg-emerald-950/20 text-emerald-450 border border-emerald-900/50 px-2 py-0.5 rounded uppercase font-mono">
              Auto-Aggregations Live
            </span>
          )}
        </h3>

        {!pivotConfig ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 italic select-none">
            Click "Generate Pivot Grid" to calculate values dynamically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="p-2.5 border-r border-slate-800">Group Row ({selectedRowField})</th>
                  <th className="p-2.5 border-r border-slate-800 text-center">{aggregation.toUpperCase()} of {selectedValField}</th>
                  <th className="p-2.5 text-center">Drill Down Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {Object.entries(groupedData).map(([key, group]) => (
                  <React.Fragment key={key}>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-2.5 border-r border-slate-800 font-semibold text-slate-200 flex items-center gap-2">
                        <button
                          onClick={() => setDrillDownRow(drillDownRow === key ? null : key)}
                          className="w-4 h-4 rounded bg-slate-800 hover:bg-slate-700 text-emerald-450 flex items-center justify-center font-sans font-bold"
                        >
                          {drillDownRow === key ? '-' : '+'}
                        </button>
                        {key}
                      </td>
                      <td className="p-2.5 border-r border-slate-800 text-center font-bold text-emerald-400">
                        {group.totalVal}
                      </td>
                      <td className="p-2.5 text-center text-slate-500 font-sans">
                        {group.items.length} records aggregated
                      </td>
                    </tr>
                    
                    {/* Expandable Drill Down */}
                    {drillDownRow === key && (
                      <tr>
                        <td colSpan={3} className="p-3 bg-slate-900/50">
                          <div className="border border-slate-800 rounded-lg p-2.5 bg-slate-950/80 space-y-1.5">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Drill Down Logs:</span>
                            <div className="divide-y divide-slate-850 text-[10px]">
                              {group.items.map((item, idx) => (
                                <div key={idx} className="py-1 flex justify-between text-slate-400">
                                  <span>Product: {item.Product}</span>
                                  <span>Val: ${item.Sales} (COGS: ${item.Cost})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
