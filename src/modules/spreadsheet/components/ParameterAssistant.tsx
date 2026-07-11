"use client";

import React from 'react';
import { getActiveParameter } from '../formula-engine/parameter-helper';
import { functionDatabase } from '../formula-engine/formula-library/metadata';

interface ParameterAssistantProps {
  val: string;
  cursorIdx: number;
}

export default function ParameterAssistant({ val, cursorIdx }: ParameterAssistantProps) {
  const activeParam = getActiveParameter(val, cursorIdx);
  if (!activeParam) return null;

  const { functionName, parameterIndex } = activeParam;
  const fnMeta = functionDatabase.find(fn => fn.name === functionName);
  if (!fnMeta) return null;

  // For varargs or indices larger than parameters list, clamp to the last parameter
  const currentParam = fnMeta.parameters[parameterIndex] || 
                       (fnMeta.syntax.includes('...') ? fnMeta.parameters[fnMeta.parameters.length - 1] : null);

  return (
    <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3 shadow-2xl text-xs font-sans text-slate-300 w-[380px] select-none pointer-events-none animate-in fade-in zoom-in-95 duration-150">
      {/* Function name & syntax highlight */}
      <div className="font-mono text-[11px] mb-1.5 flex items-center gap-1 border-b border-slate-800/80 pb-1.5">
        <span className="text-emerald-450 font-extrabold">{functionName}(</span>
        <span className="truncate max-w-[280px]">
          {fnMeta.parameters.map((param, idx) => {
            const isActive = idx === parameterIndex || (idx === fnMeta.parameters.length - 1 && parameterIndex >= fnMeta.parameters.length);
            return (
              <React.Fragment key={param.name}>
                {idx > 0 && <span className="text-slate-500">, </span>}
                <span className={isActive ? 'text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.5 rounded' : 'text-slate-400'}>
                  {param.name}
                  {param.optional ? '?' : ''}
                </span>
              </React.Fragment>
            );
          })}
        </span>
        <span className="text-emerald-450 font-extrabold">)</span>
      </div>

      {/* Active parameter description */}
      {currentParam && (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Argument:</span>
            <span className="text-[10.5px] text-slate-200 font-semibold font-mono">{currentParam.name}</span>
            <span className="text-[9px] bg-slate-900 text-slate-400 px-1 rounded font-mono">{currentParam.type}</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal mt-1">
            {currentParam.description}
          </p>
        </div>
      )}
    </div>
  );
}
