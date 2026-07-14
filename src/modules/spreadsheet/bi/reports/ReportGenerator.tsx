"use client";

import React, { useState } from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { FileText, Download, Printer } from 'lucide-react';

export default function ReportGenerator() {
  const { activeSheet } = useSpreadsheet();
  const [selectedReportType, setSelectedReportType] = useState('Sales');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate simple CSV content from active sheet cells
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Address,Raw Value,Computed Value\n";
    
    Object.entries(activeSheet.cells).forEach(([key, cell]) => {
      csvContent += `${key},"${cell.value.replace(/"/g, '""')}","${String(cell.computed || '').replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReportType.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-xs text-slate-100 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="font-bold text-slate-200 uppercase tracking-widest text-[10px]">
          Professional Report Generator
        </h3>
        <span className="text-[9px] bg-emerald-950/20 text-emerald-450 border border-emerald-900/50 px-2 py-0.5 rounded">
          Export Ready
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <select
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full sm:w-48 focus:outline-none focus:border-emerald-500"
        >
          <option value="Sales">Sales Report</option>
          <option value="GST">GST Tax Report</option>
          <option value="Inventory">Inventory Balance Sheet</option>
          <option value="Expense">Expense Register</option>
          <option value="Payroll">Payroll Sheet</option>
        </select>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl font-bold transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-450" />
            CSV Export
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-950" />
            Print Report
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-sans leading-normal">
        Generates standard professional reports from your active cells layout. Formatted for layout sizing in accounting and auditing firms.
      </p>
    </div>
  );
}
