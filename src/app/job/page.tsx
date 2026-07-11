"use client";

import React from 'react';
import Link from 'next/link';
import { Briefcase, CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { jobProjectsData } from '@/data/jobProjects';

export default function JobModeIndex() {
  const { progress, isLoaded } = useProgress();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading Job Mode...</span>
        </div>
      </div>
    );
  }

  // Group projects by category
  const categories = ['Accountant', 'MIS Executive', 'Office Admin', 'Data Entry Operator', 'Business Owner'] as const;

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Job Mode
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Simulate real-world corporate tasks. Complete spreadsheets to match typical requirements for various professional roles.
        </p>
      </div>

      {/* Role Categories */}
      <div className="space-y-8">
        {categories.map((category) => {
          const projects = jobProjectsData.filter(p => p.category === category);
          
          return (
            <div key={category} className="space-y-4">
              {/* Category Title */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Briefcase className="w-5 h-5 text-emerald-450" />
                <h2 className="text-lg font-bold text-slate-200">{category} Role</h2>
              </div>

              {/* Projects Grid */}
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => {
                    const projectProgress = progress.jobProjectStats[project.id];
                    const isCompleted = projectProgress?.completed;

                    return (
                      <Link
                        key={project.id}
                        href={`/job/${project.id}`}
                        className={`group flex items-start justify-between p-5 bg-slate-900 border rounded-xl hover:border-slate-700/60 hover:bg-slate-900/80 active:scale-[0.99] transition ${
                          isCompleted ? 'border-emerald-950/40 bg-emerald-950/5' : 'border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-450" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-755" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                              {project.title}
                            </h3>
                            <p className="text-xs text-slate-450 leading-relaxed font-sans max-w-sm">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-650 group-hover:translate-x-0.5 group-hover:text-slate-400 transition shrink-0 mt-1" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-950/60 border border-slate-900/60 rounded-xl text-xs text-slate-500 italic select-none">
                  Currently no projects defined for this role. Check back soon.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
