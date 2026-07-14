"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CellRange } from '../../types';

export interface ChartItem {
  id: string;
  type: 'column' | 'bar' | 'line' | 'area' | 'pie' | 'doughnut' | 'scatter' | 'bubble' | 'histogram' | 'combo' | 'stacked';
  title: string;
  dataRange: CellRange;
  x: number;
  y: number;
  width: number;
  height: number;
  colorTheme: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
}

export interface PivotConfig {
  id: string;
  dataRange: CellRange;
  rows: string[];
  columns: string[];
  values: { field: string; agg: 'sum' | 'count' | 'average' | 'min' | 'max' }[];
  filters: { field: string; value: string }[];
  calculatedFields: { name: string; formula: string }[];
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'progress' | 'gauge' | 'heatmap' | 'text' | 'image' | 'table';
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: any; // widget-specific metadata
}

export interface BIFilter {
  id: string;
  type: 'date' | 'dropdown' | 'checkbox' | 'multiselect' | 'search' | 'range';
  label: string;
  field: string;
  value: any;
}

interface BIContextType {
  activeView: 'grid' | 'dashboard' | 'pivot';
  setActiveView: (view: 'grid' | 'dashboard' | 'pivot') => void;
  collapsiblePanel: 'none' | 'ai-insights' | 'recommendations' | 'search' | 'natural-language';
  setCollapsiblePanel: (panel: 'none' | 'ai-insights' | 'recommendations' | 'search' | 'natural-language') => void;
  charts: ChartItem[];
  addChart: (type: ChartItem['type']) => void;
  updateChart: (id: string, updates: Partial<ChartItem>) => void;
  deleteChart: (id: string) => void;
  duplicateChart: (id: string) => void;
  pivotConfig: PivotConfig | null;
  setPivotConfig: (config: PivotConfig | null) => void;
  dashboardWidgets: DashboardWidget[];
  addDashboardWidget: (widget: Omit<DashboardWidget, 'id' | 'x' | 'y'>) => void;
  updateDashboardWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  deleteDashboardWidget: (id: string) => void;
  biFilters: BIFilter[];
  updateFilter: (id: string, value: any) => void;
  loadTemplate: (templateName: string, cellsUpdater: (cells: any) => void) => void;
}

const BIContext = createContext<BIContextType | undefined>(undefined);

export function BIProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<'grid' | 'dashboard' | 'pivot'>('grid');
  const [collapsiblePanel, setCollapsiblePanel] = useState<BIContextType['collapsiblePanel']>('none');
  const [charts, setCharts] = useState<ChartItem[]>([]);
  const [pivotConfig, setPivotConfig] = useState<PivotConfig | null>(null);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [biFilters, setBiFilters] = useState<BIFilter[]>([]);

  // Default initial mock chart and dashboard configurations
  useEffect(() => {
    // Inject base demo KPI widgets
    setDashboardWidgets([
      {
        id: 'kpi-sales',
        type: 'kpi',
        title: 'Total Sales',
        x: 0, y: 0, w: 3, h: 2,
        config: { field: 'sales', prefix: '$', value: '1,750' }
      },
      {
        id: 'kpi-profit',
        type: 'kpi',
        title: 'Net Profit Margin',
        x: 3, y: 0, w: 3, h: 2,
        config: { field: 'profit', suffix: '%', value: '23' }
      },
      {
        id: 'kpi-cogs',
        type: 'kpi',
        title: 'Total Expenses',
        x: 6, y: 0, w: 3, h: 2,
        config: { field: 'expenses', prefix: '$', value: '1,340' }
      }
    ]);

    setBiFilters([
      { id: 'filter-region', type: 'dropdown', label: 'Region', field: 'Region', value: 'All' },
      { id: 'filter-date', type: 'date', label: 'Date Range', field: 'Date', value: '' }
    ]);
  }, []);

  const addChart = (type: ChartItem['type']) => {
    // Generate dummy default range: Rows 2-5, Cols 1-2 (B2:C5)
    const defaultRange: CellRange = { startRow: 1, startCol: 0, endRow: 4, endCol: 1 };
    const newChart: ChartItem = {
      id: `chart-${Date.now()}`,
      type,
      title: `${type.toUpperCase()} Chart`,
      dataRange: defaultRange,
      x: 50,
      y: 50,
      width: 450,
      height: 280,
      colorTheme: 'emerald'
    };
    setCharts(prev => [...prev, newChart]);
  };

  const updateChart = (id: string, updates: Partial<ChartItem>) => {
    setCharts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteChart = (id: string) => {
    setCharts(prev => prev.filter(c => c.id !== id));
  };

  const duplicateChart = (id: string) => {
    const target = charts.find(c => c.id === id);
    if (!target) return;
    const copy: ChartItem = {
      ...target,
      id: `chart-${Date.now()}`,
      title: `${target.title} (Copy)`,
      x: target.x + 20,
      y: target.y + 20
    };
    setCharts(prev => [...prev, copy]);
  };

  const addDashboardWidget = (widget: Omit<DashboardWidget, 'id' | 'x' | 'y'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
      x: 0,
      y: 4
    };
    setDashboardWidgets(prev => [...prev, newWidget]);
  };

  const updateDashboardWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setDashboardWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteDashboardWidget = (id: string) => {
    setDashboardWidgets(prev => prev.filter(w => w.id !== id));
  };

  const updateFilter = (id: string, value: any) => {
    setBiFilters(prev => prev.map(f => f.id === id ? { ...f, value } : f));
  };

  const loadTemplate = (templateName: string, cellsUpdater: (cells: any) => void) => {
    const templateCells: Record<string, any> = {};
    if (templateName === 'gst') {
      templateCells['A1'] = { value: 'GST Billing Register', bold: true, fontSize: 14, color: '#10b981' };
      templateCells['A2'] = { value: 'Item Description', bold: true, bgColor: 'bg-slate-900' };
      templateCells['B2'] = { value: 'Unit Price', bold: true, bgColor: 'bg-slate-900' };
      templateCells['C2'] = { value: 'GST Rate', bold: true, bgColor: 'bg-slate-900' };
      templateCells['D2'] = { value: 'Tax Deduction', bold: true, bgColor: 'bg-slate-900' };
      templateCells['E2'] = { value: 'Total Price', bold: true, bgColor: 'bg-slate-900' };

      templateCells['A3'] = { value: 'Laptop' };
      templateCells['B3'] = { value: '1200' };
      templateCells['C3'] = { value: '0.18' };
      templateCells['D3'] = { value: '=B3*C3' };
      templateCells['E3'] = { value: '=B3+D3' };

      templateCells['A4'] = { value: 'Office Table' };
      templateCells['B4'] = { value: '450' };
      templateCells['C4'] = { value: '0.12' };
      templateCells['D4'] = { value: '=B4*C4' };
      templateCells['E4'] = { value: '=B4+D4' };

      templateCells['A5'] = { value: 'Total Sum' };
      templateCells['E5'] = { value: '=SUM(E3:E4)', bold: true };
    } else if (templateName === 'inventory') {
      templateCells['A1'] = { value: 'Warehouse Inventory Sheet', bold: true, fontSize: 14, color: '#3b82f6' };
      templateCells['A2'] = { value: 'SKU Description', bold: true, bgColor: 'bg-slate-900' };
      templateCells['B2'] = { value: 'Opening Stock', bold: true, bgColor: 'bg-slate-900' };
      templateCells['C2'] = { value: 'Received qty', bold: true, bgColor: 'bg-slate-900' };
      templateCells['D2'] = { value: 'Dispatched qty', bold: true, bgColor: 'bg-slate-900' };
      templateCells['E2'] = { value: 'Ending Balance', bold: true, bgColor: 'bg-slate-900' };

      templateCells['A3'] = { value: 'Hard Drive 1TB' };
      templateCells['B3'] = { value: '250' };
      templateCells['C3'] = { value: '50' };
      templateCells['D3'] = { value: '120' };
      templateCells['E3'] = { value: '=B3+C3-D3' };

      templateCells['A4'] = { value: 'RAM DDR4 16GB' };
      templateCells['B4'] = { value: '400' };
      templateCells['C4'] = { value: '100' };
      templateCells['D4'] = { value: '80' };
      templateCells['E4'] = { value: '=B4+C4-D4' };
    } else if (templateName === 'crm') {
      templateCells['A1'] = { value: 'Sales CRM Deal Pipeline', bold: true, fontSize: 14, color: '#f59e0b' };
      templateCells['A2'] = { value: 'Deal Name', bold: true, bgColor: 'bg-slate-900' };
      templateCells['B2'] = { value: 'Lead Value', bold: true, bgColor: 'bg-slate-900' };
      templateCells['C2'] = { value: 'Conversion %', bold: true, bgColor: 'bg-slate-900' };
      templateCells['D2'] = { value: 'Expected Revenue', bold: true, bgColor: 'bg-slate-900' };

      templateCells['A3'] = { value: 'Acme Corp Cloud Deal' };
      templateCells['B3'] = { value: '50000' };
      templateCells['C3'] = { value: '0.40' };
      templateCells['D3'] = { value: '=B3*C3' };

      templateCells['A4'] = { value: 'Stark Logistics Portal' };
      templateCells['B4'] = { value: '85000' };
      templateCells['C4'] = { value: '0.25' };
      templateCells['D4'] = { value: '=B4*C4' };
    } else {
      // Default fallback expense tracker template
      templateCells['A1'] = { value: 'Corporate Expense Tracker', bold: true, fontSize: 14, color: '#ef4444' };
      templateCells['A2'] = { value: 'Expense Category', bold: true, bgColor: 'bg-slate-900' };
      templateCells['B2'] = { value: 'Budget Amount', bold: true, bgColor: 'bg-slate-900' };
      templateCells['C2'] = { value: 'Spent Amount', bold: true, bgColor: 'bg-slate-900' };
      templateCells['D2'] = { value: 'Variance Balance', bold: true, bgColor: 'bg-slate-900' };

      templateCells['A3'] = { value: 'Marketing & Ads' };
      templateCells['B3'] = { value: '5000' };
      templateCells['C3'] = { value: '4200' };
      templateCells['D3'] = { value: '=B3-C3' };

      templateCells['A4'] = { value: 'Web Servers Hosting' };
      templateCells['B4'] = { value: '3000' };
      templateCells['C4'] = { value: '3100' };
      templateCells['D4'] = { value: '=B4-C4' };
    }

    cellsUpdater(templateCells);
    alert(`${templateName.toUpperCase()} template injected into worksheet successfully!`);
  };

  return (
    <BIContext.Provider value={{
      activeView,
      setActiveView,
      collapsiblePanel,
      setCollapsiblePanel,
      charts,
      addChart,
      updateChart,
      deleteChart,
      duplicateChart,
      pivotConfig,
      setPivotConfig,
      dashboardWidgets,
      addDashboardWidget,
      updateDashboardWidget,
      deleteDashboardWidget,
      biFilters,
      updateFilter,
      loadTemplate
    }}>
      {children}
    </BIContext.Provider>
  );
}

export function useBI() {
  const context = useContext(BIContext);
  if (!context) {
    throw new Error('useBI must be used within a BIProvider');
  }
  return context;
}
