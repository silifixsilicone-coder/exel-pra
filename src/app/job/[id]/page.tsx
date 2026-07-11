"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import Spreadsheet from '@/components/shared/Spreadsheet';
import { jobProjectsData } from '@/data/jobProjects';
import { SpreadsheetState, JobProject } from '@/types';
import { evaluateFormula } from '@/utils/formulaEvaluator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { progress, isLoaded, updateJobProjectProgress } = useProgress();
  const [project, setProject] = useState<JobProject | null>(null);
  
  // Spreadsheet state
  const [sheetState, setSheetState] = useState<SpreadsheetState | null>(null);
  
  // Checking results
  const [evaluationResult, setEvaluationResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    errors: string[];
  } | null>(null);

  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  // Load project details
  useEffect(() => {
    const foundProject = jobProjectsData.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      setSheetState(JSON.parse(JSON.stringify(foundProject.initialGrid)));
      
      // Reset evaluations
      setEvaluationResult(null);
      setActiveHintIndex(null);
    }
  }, [id]);

  if (!isLoaded || !project || !sheetState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading project sheet...</span>
        </div>
      </div>
    );
  }

  const handleGridChange = (newState: SpreadsheetState) => {
    setSheetState(newState);
  };

  const handleCheckAnswer = () => {
    if (!sheetState || !project) return;

    const errors: string[] = [];

    project.validationRules.forEach((rule) => {
      const targetCellKey = rule.targetCell.toUpperCase();
      const cell = sheetState.cells[targetCellKey];
      
      const userValue = cell ? cell.value.trim() : '';
      const userComputed = cell ? evaluateFormula(cell.value, sheetState.cells) : '';

      const isFormula = userValue.startsWith('=');
      const normalizedFormula = userValue.replace(/\s+/g, '').toUpperCase();
      
      // 1. Check formula match if required
      let isFormulaCorrect = true;
      if (rule.checkType === 'formula' || rule.checkType === 'both') {
        isFormulaCorrect = isFormula && (rule.expectedFormulas?.some(f => {
          const normalizedExpected = f.replace(/\s+/g, '').toUpperCase();
          return normalizedFormula === normalizedExpected;
        }) || false);
      }

      // 2. Check value match if required
      let isValueCorrect = true;
      if (rule.checkType === 'value' || rule.checkType === 'both') {
        isValueCorrect = String(userComputed).toLowerCase() === String(rule.expectedValue).toLowerCase();
      }

      // Combine check outcome
      let passed = false;
      if (rule.checkType === 'formula') passed = isFormulaCorrect;
      else if (rule.checkType === 'value') passed = isValueCorrect;
      else passed = isFormulaCorrect || isValueCorrect; // Accept formula or evaluated correct output

      if (!passed) {
        if (!isFormula && rule.checkType !== 'value') {
          errors.push(`${rule.description} (${targetCellKey}): Input must be a valid formula starting with "=".`);
        } else {
          errors.push(`${rule.description} (${targetCellKey}) is incorrect or missing. Expected: ${rule.expectedValue}`);
        }
      }
    });

    const isCorrect = errors.length === 0;

    setEvaluationResult({
      checked: true,
      isCorrect,
      errors
    });

    if (isCorrect) {
      updateJobProjectProgress(project.id, true);
    }
  };

  const handleResetProject = () => {
    setSheetState(JSON.parse(JSON.stringify(project.initialGrid)));
    setEvaluationResult(null);
    setActiveHintIndex(null);
  };

  const handleNextProject = () => {
    const currentIndex = jobProjectsData.findIndex(p => p.id === project.id);
    const nextIndex = (currentIndex + 1) % jobProjectsData.length;
    const nextProj = jobProjectsData[nextIndex];
    router.push(`/job/${nextProj.id}`);
  };

  const isCompleted = progress.jobProjectStats[project.id]?.completed;

  return (
    <div className="flex flex-col min-h-full p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      
      {/* Back and Status Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/job"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Job Mode
        </Link>
        {isCompleted && (
          <span className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-emerald-950/20 text-emerald-450 border border-emerald-900/40 rounded-full select-none">
            <Check className="w-3.5 h-3.5" />
            Project Completed
          </span>
        )}
      </div>

      {/* Main Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Large Spreadsheet Section (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* Project Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Role: {project.category}
                </span>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-450 shrink-0" />
                  {project.title}
                </h2>
              </div>
              
              <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-950 border border-slate-850 text-slate-350 rounded-md shrink-0 w-fit">
                Business Simulation
              </span>
            </div>

            {/* Scenario and task description */}
            <div className="space-y-3.5 text-sm leading-relaxed text-slate-350 font-sans">
              <p><strong className="text-slate-200">Business Scenario:</strong> {project.scenario}</p>
              
              <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-4 mt-2">
                <strong className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block mb-2">Company Task List:</strong>
                <ol className="list-decimal pl-4 space-y-2 text-slate-100 font-medium">
                  {project.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Live spreadsheet practice canvas */}
            <div className="w-full h-[300px] sm:h-[420px] pt-2">
              <Spreadsheet 
                initialState={sheetState} 
                onChange={handleGridChange}
              />
            </div>

            {/* Verification buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex gap-2">
                <button
                  onClick={handleResetProject}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sheet
                </button>
                <button
                  onClick={() => setActiveHintIndex(prev => prev === null ? 0 : null)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    activeHintIndex !== null 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {activeHintIndex !== null ? 'Hide Hints' : 'Show Project Hints'}
                </button>
              </div>

              <div className="flex gap-2">
                {evaluationResult?.isCorrect && (
                  <button
                    onClick={handleNextProject}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Next Project
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleCheckAnswer}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/10"
                >
                  <Check className="w-4 h-4" />
                  Verify Deliverables
                </button>
              </div>
            </div>

            {/* Answer Feedbacks */}
            {evaluationResult && (
              <div className={`border rounded-xl p-5 mt-4 flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                evaluationResult.isCorrect 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-350' 
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-350'
              }`}>
                {evaluationResult.isCorrect ? (
                  <CheckCircle className="w-5.5 h-5.5 text-emerald-450 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5.5 h-5.5 text-rose-455 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 w-full text-xs">
                  <h4 className="font-bold text-sm">
                    {evaluationResult.isCorrect ? 'Project Complete! All cells validated.' : 'Validation Errors Found'}
                  </h4>
                  
                  {evaluationResult.isCorrect ? (
                    <p className="text-slate-350 font-sans leading-relaxed">
                      Excellent job! All spreadsheet rows, formulas, and cells meet the required company specs. The financials and calculations align perfectly.
                    </p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-slate-400 font-sans font-medium mb-1">
                        The company auditing tool detected the following discrepancy reports:
                      </p>
                      <ul className="list-disc pl-4 space-y-1.5 font-mono text-[11px] text-rose-400">
                        {evaluationResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Project Hints / Instructions (1 Col) */}
        <div className="space-y-6">
          
          {/* Active Hints widget */}
          {activeHintIndex !== null && (
            <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Project Guidelines
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {project.hints[activeHintIndex]}
              </p>

              {project.hints.length > 1 && (
                <div className="flex items-center justify-between border-t border-slate-850 pt-3 text-[10px] text-slate-500">
                  <span>Hint {activeHintIndex + 1} of {project.hints.length}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={activeHintIndex === 0}
                      onClick={() => setActiveHintIndex(prev => prev !== null ? Math.max(0, prev - 1) : null)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 disabled:opacity-50 text-slate-300 font-bold transition hover:text-white"
                    >
                      Prev
                    </button>
                    <button
                      disabled={activeHintIndex === project.hints.length - 1}
                      onClick={() => setActiveHintIndex(prev => prev !== null ? Math.min(project.hints.length - 1, prev + 1) : null)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 disabled:opacity-50 text-slate-300 font-bold transition hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Job Requirements sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Evaluation Rules
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Unlike practice questions, corporate projects require you to fill in multiple columns or rows.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Verify your column sums, cell references, and fill-down ranges before clicking <strong>Verify Deliverables</strong>. No penalties are incurred for checking.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
