"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Grid, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  TrendingUp,
  LayoutDashboard,
  Table
} from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { metrics } = useProgress();

  // Load and apply theme on startup
  useEffect(() => {
    const theme = localStorage.getItem('path_excel_theme') || 'dark';
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Practice', href: '/practice', icon: Grid },
    { name: 'Job Mode', href: '/job', icon: Briefcase },
    { name: 'Exams', href: '/exam', icon: GraduationCap },
    { name: 'Spreadsheet', href: '/spreadsheet', icon: Table },
    { name: 'Progress', href: '/progress', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar-bg border-r border-border-custom shrink-0">
        {/* Brand / Logo */}
        <div className="flex flex-col px-6 py-5 border-b border-border-custom bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <span className="font-mono font-bold text-slate-950 text-lg">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-text-muted bg-clip-text text-transparent">
              Path Excel
            </span>
          </div>
          <span className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-semibold">
            Learn • Practice • Job Ready
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-450 border-l-2 border-emerald-500 shadow-md shadow-emerald-500/5'
                    : 'text-text-muted hover:text-foreground hover:bg-hover-bg'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats Footer */}
        <div className="p-4 border-t border-border-custom bg-slate-950/30">
          <div className="bg-background border border-border-custom rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Your Progress
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-text-muted">Solved</div>
                <div className="text-sm font-semibold text-foreground font-mono mt-0.5">{metrics.questionsSolved}</div>
              </div>
              <div>
                <div className="text-text-muted">Accuracy</div>
                <div className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">{metrics.accuracy}%</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Nav Header & Sidebar Drawer */}
      <div className="flex flex-col flex-1 h-screen min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-5 py-4 bg-sidebar-bg border-b border-border-custom md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
              <span className="font-mono font-bold text-slate-950 text-sm">P</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Path Excel</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg bg-hover-bg text-text-muted hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="relative flex flex-col w-64 max-w-xs bg-sidebar-bg h-full border-r border-border-custom p-5 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-border-custom">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 font-mono text-sm">P</div>
                  <span className="font-bold text-lg">Path Excel</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-md text-text-muted hover:text-foreground hover:bg-hover-bg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-450 border-l-2 border-emerald-500'
                          : 'text-text-muted hover:text-foreground hover:bg-hover-bg'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border-custom">
                <div className="bg-slate-950/40 rounded-xl p-3 space-y-1">
                  <div className="text-[10px] text-text-muted font-semibold uppercase">Your Accuracy</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">{metrics.accuracy}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Main Scrollable Content Window */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-background relative">
          {children}
        </main>
      </div>
    </div>
  );
}
