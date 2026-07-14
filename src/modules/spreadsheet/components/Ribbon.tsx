"use client";

import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Scissors, 
  Copy, 
  Clipboard, 
  ChevronDown, 
  HelpCircle,
  TableProperties,
  Sparkles,
  BarChart,
  Filter,
  Eye,
  Settings,
  Lock,
  Maximize2
} from 'lucide-react';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { useBI } from '../bi/context/BIContext';

const fontFamilies = ['Calibri', 'Arial', 'Inter', 'Segoe UI', 'Times New Roman', 'Courier New'];
const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72];

export default function Ribbon() {
  const { 
    activeTab, 
    setActiveTab, 
    applyFormatting, 
    mergeCells,
    copy, 
    cut, 
    paste,
    activeSheet,
    updateCell
  } = useSpreadsheet();

  const {
    activeView,
    setActiveView,
    collapsiblePanel,
    setCollapsiblePanel,
    addChart,
    addDashboardWidget,
    loadTemplate
  } = useBI();

  const [activeFontFamily, setActiveFontFamily] = useState('Calibri');
  const [activeFontSize, setActiveFontSize] = useState(11);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);

  const tabs = ['Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View', 'Help'];

  // Handle cell formatting style changes
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveFontFamily(e.target.value);
    applyFormatting('fontFamily', e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    setActiveFontSize(size);
    applyFormatting('fontSize', size);
  };

  const toggleBold = () => {
    // Get active cell value
    const cellKey = activeSheet.activeCell;
    const current = activeSheet.cells[cellKey]?.bold || false;
    applyFormatting('bold', !current);
  };

  const toggleItalic = () => {
    const cellKey = activeSheet.activeCell;
    const current = activeSheet.cells[cellKey]?.italic || false;
    applyFormatting('italic', !current);
  };

  const toggleUnderline = () => {
    const cellKey = activeSheet.activeCell;
    const current = activeSheet.cells[cellKey]?.underline || false;
    applyFormatting('underline', !current);
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    applyFormatting('align', alignment);
  };

  const handleValign = (valign: 'top' | 'middle' | 'bottom') => {
    applyFormatting('valign', valign);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFormatting('format', e.target.value);
  };

  return (
    <div className="flex flex-col bg-slate-900 border-b border-slate-800 shrink-0 text-slate-200 select-none">
      {/* 1. Tab Menu Bar */}
      <div className="flex items-center px-4 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4.5 py-2.5 text-xs font-bold transition-all relative border-t-2 border-transparent ${
                activeTab === tab 
                  ? 'bg-slate-900 text-emerald-450 border-t-emerald-500 font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Ribbon Content Panel */}
      <div className="h-[75px] px-6 py-2 bg-slate-900 flex items-center gap-6 overflow-x-auto scrollbar-none">
        {activeTab === 'Home' && (
          <>
            {/* Clipboard Section */}
            <div className="flex items-center gap-1.5 border-r border-slate-800/80 pr-4 h-full">
              <button
                onClick={paste}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-slate-800 hover:text-white transition w-11 h-11"
                title="Paste (Ctrl+V)"
              >
                <Clipboard className="w-4.5 h-4.5 text-emerald-450" />
                <span className="text-[10px] mt-1">Paste</span>
              </button>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800 text-[10px] transition text-left"
                  title="Copy (Ctrl+C)"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                  Copy
                </button>
                <button
                  onClick={cut}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800 text-[10px] transition text-left"
                  title="Cut (Ctrl+X)"
                >
                  <Scissors className="w-3 h-3 text-slate-400" />
                  Cut
                </button>
              </div>
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Clipboard</span>
            </div>

            {/* Font & Styles Section */}
            <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 h-full">
              <div className="flex flex-col gap-1.5">
                {/* Font Family / Font Size selects */}
                <div className="flex items-center gap-1">
                  <select
                    value={activeFontFamily}
                    onChange={handleFontChange}
                    className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-medium font-sans focus:outline-none focus:border-emerald-500 w-24 text-slate-200"
                  >
                    {fontFamilies.map(f => (
                      <option key={f} value={f} className="bg-slate-950">{f}</option>
                    ))}
                  </select>
                  <select
                    value={activeFontSize}
                    onChange={handleFontSizeChange}
                    className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-medium font-sans focus:outline-none focus:border-emerald-500 w-14 text-slate-200"
                  >
                    {fontSizes.map(s => (
                      <option key={s} value={s} className="bg-slate-950">{s}</option>
                    ))}
                  </select>
                </div>
                {/* Style Buttons: B, I, U, Color Pickers */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleBold}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={toggleItalic}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={toggleUnderline}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                    title="Underline (Ctrl+U)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-800 mx-1" />

                  {/* Text Color Picker */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setColorPickerOpen(!colorPickerOpen);
                        setBgPickerOpen(false);
                      }}
                      className="p-1 rounded hover:bg-slate-800 hover:text-white transition flex items-center gap-0.5"
                      title="Font Color"
                    >
                      <span className="text-xs font-bold border-b-2 border-emerald-500 px-0.5">A</span>
                    </button>
                    {colorPickerOpen && (
                      <div className="absolute top-7 left-0 z-50 p-2 bg-slate-950 border border-slate-800 rounded-lg grid grid-cols-4 gap-1.5 shadow-xl">
                        {['#f8fafc', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#020617', '#94a3b8'].map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              applyFormatting('color', c);
                              setColorPickerOpen(false);
                            }}
                            className="w-4.5 h-4.5 rounded border border-slate-800 hover:scale-110 transition"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fill Color Picker */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setBgPickerOpen(!bgPickerOpen);
                        setColorPickerOpen(false);
                      }}
                      className="p-1 rounded hover:bg-slate-800 hover:text-white transition flex items-center gap-0.5 font-sans"
                      title="Fill Color"
                    >
                      <div className="w-3.5 h-3.5 rounded border border-slate-600 bg-emerald-500/20" />
                    </button>
                    {bgPickerOpen && (
                      <div className="absolute top-7 left-0 z-50 p-2 bg-slate-950 border border-slate-800 rounded-lg grid grid-cols-4 gap-1.5 shadow-xl">
                        {['bg-emerald-500/10 text-emerald-600 dark:text-emerald-350 dark:bg-emerald-950/40', 'bg-blue-500/10 text-blue-600 dark:text-blue-350 dark:bg-blue-950/40', 'bg-amber-500/10 text-amber-600 dark:text-amber-350 dark:bg-amber-950/40', 'bg-rose-500/10 text-rose-600 dark:text-rose-350 dark:bg-rose-950/40', 'bg-purple-500/10 text-purple-600 dark:text-purple-350 dark:bg-purple-950/40', 'bg-slate-500/10 text-slate-650 dark:text-slate-350 dark:bg-slate-900/60', ''].map((c, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              applyFormatting('bgColor', c === '' ? undefined : c);
                              setBgPickerOpen(false);
                            }}
                            className={`w-5 h-5 rounded border border-slate-800 hover:scale-110 transition text-[9px] font-bold ${c}`}
                          >
                            {c === '' ? 'None' : 'Clr'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Font & Style</span>
            </div>

            {/* Alignment Section */}
            <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 h-full">
              <div className="flex flex-col gap-1.5">
                {/* Horizontal Alignment */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAlign('left')}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign('center')}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                    title="Align Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign('right')}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Wrap Text & Merge */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => applyFormatting('wrapText', true)}
                    className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-800 rounded hover:bg-slate-800 transition"
                    title="Wrap Text"
                  >
                    Wrap Text
                  </button>
                  <button
                    onClick={mergeCells}
                    className="px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-800 rounded hover:bg-slate-800 transition"
                    title="Merge Selected Cells"
                  >
                    Merge
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Alignment</span>
            </div>

            {/* Numbers Formats Section */}
            <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 h-full">
              <div className="flex flex-col gap-1.5 justify-center">
                <select
                  onChange={handleFormatChange}
                  className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-medium font-sans focus:outline-none focus:border-emerald-500 w-28 text-slate-200"
                >
                  <option value="general">General</option>
                  <option value="currency">Currency ($)</option>
                  <option value="percent">Percentage (%)</option>
                  <option value="date">Short Date</option>
                  <option value="time">Time</option>
                </select>
                <div className="flex items-center gap-1.5 justify-center">
                  <button
                    onClick={() => applyFormatting('format', 'currency')}
                    className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded hover:bg-slate-800 transition text-[9px] font-mono font-bold"
                    title="Format as Currency"
                  >
                    $
                  </button>
                  <button
                    onClick={() => applyFormatting('format', 'percent')}
                    className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded hover:bg-slate-800 transition text-[9px] font-mono font-bold"
                    title="Format as Percentage"
                  >
                    %
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Number Format</span>
            </div>
          </>
        )}

        {activeTab === 'Insert' && (
          <div className="flex items-center gap-4 h-full text-slate-300">
            {/* Chart Insert buttons */}
            <div className="flex items-center gap-1.5 border-r border-slate-800/80 pr-4 h-full">
              {['column', 'bar', 'line', 'area', 'pie', 'doughnut'].map(chartType => (
                <button
                  key={chartType}
                  onClick={() => addChart(chartType as any)}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-semibold transition capitalize"
                >
                  {chartType}
                </button>
              ))}
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Charts</span>
            </div>

            {/* Pivot table & widgets section */}
            <div className="flex items-center gap-2 h-full">
              <button
                onClick={() => setActiveView('pivot')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-[10px] transition"
              >
                Insert Pivot Table
              </button>
              <button
                onClick={() => addDashboardWidget({ type: 'kpi', title: 'Sales Summary KPI', w: 3, h: 2, config: { prefix: '$', value: '1,450' } })}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-semibold transition"
              >
                Insert KPI Card
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Data' && (
          <div className="flex items-center gap-4 h-full text-slate-350">
            {/* Template loaders */}
            <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 h-full">
              <button
                onClick={() => loadTemplate('gst', (cells) => {
                  Object.entries(cells).forEach(([key, cell]: [string, any]) => updateCell(key, cell.value));
                })}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-semibold transition"
              >
                GST Billing Template
              </button>
              <button
                onClick={() => loadTemplate('inventory', (cells) => {
                  Object.entries(cells).forEach(([key, cell]: [string, any]) => updateCell(key, cell.value));
                })}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-semibold transition"
              >
                Inventory Sheet
              </button>
              <button
                onClick={() => loadTemplate('crm', (cells) => {
                  Object.entries(cells).forEach(([key, cell]: [string, any]) => updateCell(key, cell.value));
                })}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-semibold transition"
              >
                Sales CRM Tracker
              </button>
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Templates</span>
            </div>
          </div>
        )}

        {activeTab === 'View' && (
          <div className="flex items-center gap-4 h-full text-slate-350">
            {/* View selectors */}
            <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 h-full">
              <button
                onClick={() => setActiveView('grid')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${activeView === 'grid' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300'}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${activeView === 'dashboard' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300'}`}
              >
                Dashboard View
              </button>
              <button
                onClick={() => setActiveView('pivot')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${activeView === 'pivot' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300'}`}
              >
                Pivot View
              </button>
              <span className="text-[9px] text-slate-500 self-end font-bold font-sans uppercase">Workbook Views</span>
            </div>

            {/* Sidebar toggle buttons */}
            <div className="flex items-center gap-2 h-full">
              <button
                onClick={() => setCollapsiblePanel(collapsiblePanel === 'ai-insights' ? 'none' : 'ai-insights')}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition ${collapsiblePanel === 'ai-insights' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-400'}`}
              >
                AI Insights Panel
              </button>
              <button
                onClick={() => setCollapsiblePanel(collapsiblePanel === 'recommendations' ? 'none' : 'recommendations')}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition ${collapsiblePanel === 'recommendations' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-400'}`}
              >
                Recommendations
              </button>
              <button
                onClick={() => setCollapsiblePanel(collapsiblePanel === 'natural-language' ? 'none' : 'natural-language')}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition ${collapsiblePanel === 'natural-language' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-400'}`}
              >
                AI Query Bar
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'Home' && activeTab !== 'Insert' && activeTab !== 'Data' && activeTab !== 'View' && (
          <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Options under tab <strong className="text-slate-200">{activeTab}</strong> are currently locked. Double click grid to edit cells directly.</span>
          </div>
        )}
      </div>
    </div>
  );
}
