"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Trash2, 
  AlertOctagon, 
  Check, 
  RefreshCw,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

type Theme = 'dark' | 'light';

export default function SettingsPage() {
  const { resetProgress, isLoaded } = useProgress();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Load active theme
  useEffect(() => {
    const activeTheme = (localStorage.getItem('path_excel_theme') as Theme) || 'dark';
    setTheme(activeTheme);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('path_excel_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const handleReset = () => {
    resetProgress();
    setResetConfirm(false);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      window.location.reload();
    }, 1500);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-text-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b border-border-custom pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-text-muted bg-clip-text text-transparent flex items-center gap-2">
          <Settings className="w-8 h-8 text-emerald-500 shrink-0" />
          System Settings
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Manage local databases, active configurations, and adjust interface themes.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 1. Theme Selection Card */}
        <div className="bg-card-bg border border-border-custom rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-md font-bold text-foreground">Theme Preferences</h2>
            <p className="text-xs text-text-muted font-sans">
              Choose the appearance of the spreadsheet workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Dark theme button */}
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border font-bold text-xs transition ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-md shadow-emerald-500/5'
                  : 'bg-background border-border-custom text-text-muted hover:text-foreground hover:bg-hover-bg'
              }`}
            >
              <Moon className="w-4.5 h-4.5" />
              Dark Mode
            </button>

            {/* Light theme button */}
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border font-bold text-xs transition ${
                theme === 'light'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-md shadow-emerald-500/5'
                  : 'bg-background border-border-custom text-text-muted hover:text-foreground hover:bg-hover-bg'
              }`}
            >
              <Sun className="w-4.5 h-4.5" />
              Light Mode
            </button>
          </div>
        </div>

        {/* 2. Danger Zone Card */}
        <div className="bg-card-bg border border-border-custom rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-md font-bold text-foreground flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              Danger Zone
            </h2>
            <p className="text-xs text-text-muted font-sans leading-relaxed">
              Deleting progress will permanently clear all lessons completed, questions solved, accuracy rates, job projects completed, and exam scores from your browser's local cache. This action is irreversible.
            </p>
          </div>

          {/* Success Alert */}
          {successMsg && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold animate-pulse">
              <Check className="w-4 h-4 text-emerald-500" />
              All metrics deleted. Resetting workspace...
            </div>
          )}

          {/* Reset Actions */}
          <div className="pt-4 border-t border-border-custom flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Reset Learning Database</h3>
              <span className="text-[10px] text-text-muted block">Clears browser localStorage database</span>
            </div>

            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3.5 py-2 hover:bg-hover-bg text-text-muted rounded-xl text-xs font-semibold border border-border-custom transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/5 animate-pulse"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-background hover:bg-red-950/20 text-text-muted hover:text-red-400 border border-border-custom hover:border-red-900/40 rounded-xl text-xs font-semibold transition active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Progress
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
