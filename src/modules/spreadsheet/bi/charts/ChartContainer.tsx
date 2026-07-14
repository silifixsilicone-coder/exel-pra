"use client";

import React from 'react';
import { ChartItem } from '../context/BIContext';
import { parseRangeData } from '../analytics/DataAnalyzer';
import { useSpreadsheet } from '../../context/SpreadsheetContext';

interface ChartContainerProps {
  chart: ChartItem;
  onUpdate: (id: string, updates: Partial<ChartItem>) => void;
  onDelete: (id: string) => void;
}

const themeColors: Record<string, { fill: string; stroke: string; gradientStart: string; gradientEnd: string }> = {
  emerald: { fill: 'rgba(16, 185, 129, 0.6)', stroke: '#10b981', gradientStart: '#10b981', gradientEnd: '#047857' },
  blue: { fill: 'rgba(59, 130, 246, 0.6)', stroke: '#3b82f6', gradientStart: '#3b82f6', gradientEnd: '#1d4ed8' },
  amber: { fill: 'rgba(245, 158, 11, 0.6)', stroke: '#f59e0b', gradientStart: '#f59e0b', gradientEnd: '#b45309' },
  rose: { fill: 'rgba(239, 68, 68, 0.6)', stroke: '#ef4444', gradientStart: '#ef4444', gradientEnd: '#b91c1c' },
  purple: { fill: 'rgba(139, 92, 246, 0.6)', stroke: '#8b5cf6', gradientStart: '#8b5cf6', gradientEnd: '#6d28d9' }
};

export default function ChartContainer({ chart, onUpdate, onDelete }: ChartContainerProps) {
  const { activeSheet } = useSpreadsheet();
  const { labels, numbers } = parseRangeData(chart.dataRange, activeSheet.cells);

  const colors = themeColors[chart.colorTheme] || themeColors.emerald;
  const maxVal = Math.max(...numbers, 10);
  const chartHeight = 160;
  const chartWidth = 380;
  const padding = 30;

  // Render SVG based on chart type
  const renderChartBody = () => {
    if (numbers.length === 0) {
      return (
        <text x="100" y="100" fill="#94a3b8" className="text-xs">
          No numbers found in range selection.
        </text>
      );
    }

    switch (chart.type) {
      case 'column':
      case 'stacked': {
        const barWidth = (chartWidth - padding * 2) / numbers.length - 8;
        return (
          <g>
            {numbers.map((num, i) => {
              const xPos = padding + i * ((chartWidth - padding * 2) / numbers.length) + 4;
              const barHeight = (num / maxVal) * chartHeight;
              const yPos = chartHeight - barHeight;
              return (
                <rect
                  key={i}
                  x={xPos}
                  y={yPos}
                  width={Math.max(barWidth, 5)}
                  height={Math.max(barHeight, 2)}
                  fill={`url(#grad-${chart.id})`}
                  stroke={colors.stroke}
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                >
                  <title>{labels[i]}: {num}</title>
                </rect>
              );
            })}
          </g>
        );
      }

      case 'bar': {
        const barHeight = (chartHeight - padding * 2) / numbers.length - 6;
        return (
          <g>
            {numbers.map((num, i) => {
              const yPos = padding + i * ((chartHeight - padding * 2) / numbers.length) + 3;
              const barWidth = (num / maxVal) * (chartWidth - padding * 2);
              return (
                <rect
                  key={i}
                  x={padding}
                  y={yPos}
                  width={Math.max(barWidth, 2)}
                  height={Math.max(barHeight, 5)}
                  fill={`url(#grad-${chart.id})`}
                  stroke={colors.stroke}
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </g>
        );
      }

      case 'line':
      case 'area': {
        const points = numbers.map((num, i) => {
          const xPos = padding + i * ((chartWidth - padding * 2) / (numbers.length - 1 || 1));
          const yPos = chartHeight - (num / maxVal) * chartHeight;
          return `${xPos},${yPos}`;
        }).join(' ');

        const areaPoints = `${padding},${chartHeight} ${points} ${chartWidth - padding},${chartHeight}`;

        return (
          <g>
            {chart.type === 'area' && (
              <polygon
                points={areaPoints}
                fill={colors.fill}
                className="transition-opacity duration-300"
              />
            )}
            <polyline
              points={points}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {numbers.map((num, i) => {
              const xPos = padding + i * ((chartWidth - padding * 2) / (numbers.length - 1 || 1));
              const yPos = chartHeight - (num / maxVal) * chartHeight;
              return (
                <circle
                  key={i}
                  cx={xPos}
                  cy={yPos}
                  r="4"
                  fill="#ffffff"
                  stroke={colors.stroke}
                  strokeWidth="2"
                  className="hover:scale-125 transition-transform cursor-pointer"
                />
              );
            })}
          </g>
        );
      }

      case 'pie':
      case 'doughnut': {
        const sum = numbers.reduce((a, b) => a + b, 0) || 1;
        let cumulativeAngle = 0;
        const radius = 50;
        const cx = chartWidth / 2;
        const cy = chartHeight / 2;
        const strokeColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#a855f7', '#06b6d4'];

        return (
          <g>
            {numbers.map((num, i) => {
              const percentage = num / sum;
              const angle = percentage * 360;
              const x1 = cx + radius * Math.cos((cumulativeAngle - 90) * Math.PI / 180);
              const y1 = cy + radius * Math.sin((cumulativeAngle - 90) * Math.PI / 180);
              cumulativeAngle += angle;
              const x2 = cx + radius * Math.cos((cumulativeAngle - 90) * Math.PI / 180);
              const y2 = cy + radius * Math.sin((cumulativeAngle - 90) * Math.PI / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;
              const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={strokeColors[i % strokeColors.length]}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  className="hover:opacity-85 cursor-pointer transition-opacity"
                />
              );
            })}
            {chart.type === 'doughnut' && (
              <circle
                cx={cx}
                cy={cy}
                r={radius * 0.55}
                fill="#0f172a"
              />
            )}
          </g>
        );
      }

      default: {
        // Combo / Scatter fallback: circles plotted on scatter layout
        return (
          <g>
            {numbers.map((num, i) => {
              const xPos = padding + i * ((chartWidth - padding * 2) / (numbers.length - 1 || 1));
              const yPos = chartHeight - (num / maxVal) * chartHeight;
              return (
                <circle
                  key={i}
                  cx={xPos}
                  cy={yPos}
                  r="6"
                  fill={colors.stroke}
                  className="hover:scale-125 transition-transform"
                />
              );
            })}
          </g>
        );
      }
    }
  };

  return (
    <div
      style={{ left: chart.x, top: chart.y, width: chart.width, height: chart.height }}
      className="absolute bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl flex flex-col justify-between select-none z-30 group overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <input
          type="text"
          value={chart.title}
          onChange={(e) => onUpdate(chart.id, { title: e.target.value })}
          className="bg-transparent border-none text-xs font-bold text-slate-100 focus:outline-none focus:bg-slate-950 px-1 rounded min-w-[120px]"
        />
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <select
            value={chart.colorTheme}
            onChange={(e) => onUpdate(chart.id, { colorTheme: e.target.value as any })}
            className="bg-slate-950 border border-slate-800 rounded px-1 text-[9px] text-slate-400 focus:outline-none"
          >
            <option value="emerald">Emerald</option>
            <option value="blue">Blue</option>
            <option value="amber">Amber</option>
            <option value="rose">Rose</option>
            <option value="purple">Purple</option>
          </select>
          <button
            onClick={() => onDelete(chart.id)}
            className="text-[9px] bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 px-1.5 py-0.5 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative min-h-0 py-2">
        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id={`grad-${chart.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.gradientStart} />
              <stop offset="100%" stopColor={colors.gradientEnd} />
            </linearGradient>
          </defs>
          {renderChartBody()}
        </svg>
      </div>

      {/* Axis text helper */}
      <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono border-t border-slate-800/60 pt-1.5">
        <span className="truncate max-w-[200px]">Data Range: A2:B5</span>
        <span className="capitalize">{chart.type} Mode</span>
      </div>
    </div>
  );
}
