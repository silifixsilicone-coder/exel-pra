"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight, 
  Lightbulb, 
  BookOpen, 
  AlertTriangle,
  Award,
  Sparkles,
  Grid,
  Shield,
  Star,
  Users,
  Compass,
  FileText,
  Briefcase,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Demo Section 3 states
  const [demoInput, setDemoInput] = useState('');
  const [demoFeedback, setDemoFeedback] = useState<{ checked: boolean; isCorrect: boolean } | null>(null);
  const [demoHint, setDemoHint] = useState(false);

  // Interactive Section 6 states
  const [sec6Input, setSec6Input] = useState('');
  const [sec6Feedback, setSec6Feedback] = useState<{ checked: boolean; isCorrect: boolean } | null>(null);
  const [sec6Hint, setSec6Hint] = useState(false);

  // Monitor scroll for header background toggle
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckDemo = () => {
    const normalized = demoInput.trim().replace(/\s+/g, '').toUpperCase();
    const isCorrect = normalized === '=SUM(B2:B5)';
    setDemoFeedback({ checked: true, isCorrect });
  };

  const handleCheckSec6 = () => {
    const normalized = sec6Input.trim().replace(/\s+/g, '').toUpperCase();
    const isCorrect = normalized === '=SUM(B2:B5)';
    setSec6Feedback({ checked: true, isCorrect });
  };

  const faqData = [
    { q: 'What is Path Excel?', a: 'Path Excel is a professional online simulator platform that teaches Microsoft Excel through hands-on spreadsheet practice, rather than passive video lectures. It is LeetCode for Excel.' },
    { q: 'Who is this platform for?', a: 'Perfect for students, accountants, business analysts, data entry operators, and anyone aiming to transition to a high-paying corporate office job.' },
    { q: 'Can beginners learn?', a: 'Yes! We feature structured learning modules starting from raw basics, cell navigation, simple formulas, all the way to advanced dashboards and pivots.' },
    { q: 'Do I need Microsoft Excel installed?', a: 'No. Path Excel operates entirely inside a high-fidelity web-based spreadsheet component in your browser.' },
    { q: 'Is practice free?', a: 'We offer a free sandbox demo playground and initial lessons. Premium assessments require a subscription (Coming Soon).' },
    { q: 'How are interviews conducted?', a: 'Assessments simulate real-world MNC recruitment tests containing spreadsheet practical tasks, MCQs, and hotkey tests with auto-grading.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Header Sticky Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur border-b border-slate-800/80 shadow-sm py-3 text-slate-100' 
          : 'bg-transparent text-slate-100 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow shadow-emerald-500/10">
              <span className="font-mono font-bold text-slate-950 text-lg">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">Path Excel</span>
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link href="/learn" className="hover:text-emerald-450 transition">Learn</Link>
            <Link href="/practice" className="hover:text-emerald-450 transition">Practice</Link>
            <Link href="/formula-library" className="hover:text-emerald-450 transition">Formula Library</Link>
            <Link href="/shortcut-lab" className="hover:text-emerald-450 transition">Shortcut Lab</Link>
            <Link href="/job" className="hover:text-emerald-450 transition">Job Mode</Link>
            <Link href="/interview-lab" className="hover:text-emerald-450 transition">Interview Lab</Link>
            <Link href="/exam" className="hover:text-emerald-450 transition">Exams</Link>
            <span className="text-slate-500 cursor-not-allowed">Pricing (Soon)</span>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/10"
            >
              Start Practicing
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl transition hidden sm:inline-block text-xs font-semibold text-slate-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-slate-950 border-b border-slate-850">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-450 tracking-wider uppercase select-none">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Learning Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-100">
              Master Microsoft Excel <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 bg-clip-text text-transparent">
                Through Real Practice
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
              Learn Excel by solving real spreadsheet challenges, mastering formulas, practicing keyboard shortcuts, completing real office tasks, and preparing for interviews.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                href="/dashboard"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 transition active:scale-95"
              >
                Start Learning
              </Link>
              <Link 
                href="/practice"
                className="px-6 py-3 bg-slate-850 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-bold transition active:scale-95"
              >
                Practice Now
              </Link>
            </div>
          </div>

          {/* Right Side Mockup Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden transition hover:scale-[1.02] duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">path_excel_grid.xlsx</span>
              </div>

              {/* Grid Mockup */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-2">
                <div className="flex gap-1.5 items-center p-1.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-emerald-450 font-bold px-1.5 bg-slate-950 rounded">A1</span>
                  <span className="text-slate-500 font-serif italic select-none">fx</span>
                  <span className="text-emerald-400 font-bold font-mono text-[9px]">=VLOOKUP(D2, A1:B10, 2, FALSE)</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-slate-500 font-bold border-b border-slate-800 pb-1.5 select-none">
                  <span>ID</span>
                  <span>Product</span>
                  <span>Price</span>
                  <span>Status</span>
                </div>
                {[
                  ['101', 'Salary Log', '$12,000', 'Active'],
                  ['102', 'Tax Invoice', '$340', 'Pending'],
                  ['103', 'Inventory', '$7,900', 'Active']
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-1.5 text-center text-slate-350 py-1.5 border-b border-slate-850 last:border-0 hover:bg-slate-900 rounded transition">
                    <span>{row[0]}</span>
                    <span className="text-left pl-2 text-slate-200 font-medium">{row[1]}</span>
                    <span>{row[2]}</span>
                    <span className="text-emerald-450 font-bold">{row[3]}</span>
                  </div>
                ))}
              </div>

              {/* Floating Formula Card */}
              <div className="absolute bottom-6 left-6 bg-slate-950 border border-emerald-500/30 p-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                <Award className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] text-slate-200 font-bold">Formula Evaluated Success!</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Section 2: Trust Bar */}
      <section className="bg-slate-900 border-b border-slate-800 py-8 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-wrap justify-center gap-4 text-center">
          {[
            '10,000+ Practice Questions',
            '500+ Formulas',
            '100+ Job Tasks',
            '100+ Interview Assessments',
            'Beginner Friendly',
            'No Signup Required for Demo'
          ].map(stat => (
            <span key={stat} className="px-3.5 py-1 bg-slate-950 border border-slate-850 text-slate-300 rounded-full text-xs font-semibold shadow-sm">
              {stat}
            </span>
          ))}
        </div>
      </section>

      {/* 4. Section 3: Try Without Signup Sandbox */}
      <section className="py-20 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Try Path Excel in 30 Seconds
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              No signup required. Experience real Excel practice instantly.
            </p>
          </div>

          {/* Interactive Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Question details card (col-span-5) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Assessment Demo
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                  Beginner • 30s
                </span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                <p><strong className="text-slate-100">Scenario:</strong> A shop owner wants today's total sales calculated.</p>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl text-slate-200">
                  <strong className="text-emerald-450 block mb-0.5">Task:</strong>
                  Calculate the Total Sales using the SUM formula inside cell B6.
                </div>
              </div>

              <button
                onClick={() => setDemoHint(prev => !prev)}
                className="text-[11px] font-semibold text-amber-550 hover:text-amber-500 flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {demoHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              {demoHint && (
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-400">
                  Use the SUM function to add all sales values: `=SUM(B2:B5)`.
                </div>
              )}
            </div>

            {/* Right Mini Spreadsheet (col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono">
                  <div className="w-10 text-center font-bold text-emerald-450 bg-slate-900 border border-slate-800 py-1 rounded">B6</div>
                  <span className="text-slate-500 font-serif italic select-none">fx</span>
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="Enter formula (e.g. =SUM(B2:B5))"
                    className="flex-1 bg-transparent text-emerald-400 font-bold focus:outline-none placeholder-slate-500"
                  />
                </div>

                {/* Grid */}
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 font-mono text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                        <th className="p-2 border-r border-slate-800 w-10" />
                        <th className="p-2 border-r border-slate-800 text-center">A</th>
                        <th className="p-2 border-r border-slate-800 text-center">B</th>
                      </tr>
                      <tr className="bg-slate-950 border-b border-slate-850 text-slate-350">
                        <th className="p-2 border-r border-slate-850 select-none text-slate-500 w-10 text-center font-bold">1</th>
                        <th className="p-2 border-r border-slate-850 text-center">Item</th>
                        <th className="p-2 border-r border-slate-850 text-center">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Pen', '250'],
                        ['Book', '450'],
                        ['Bag', '800'],
                        ['Bottle', '300'],
                        ['Total', '']
                      ].map((row, idx) => {
                        const rowNum = idx + 2;
                        const isTarget = rowNum === 6;
                        return (
                          <tr key={idx} className="border-b border-slate-850 bg-slate-900">
                            <td className="p-2 border-r border-slate-850 text-slate-500 text-center font-bold select-none">{rowNum}</td>
                            <td className="p-2 border-r border-slate-800 text-center text-slate-200">{row[0]}</td>
                            <td className={`p-2 border-r border-slate-800 text-center text-slate-250 ${isTarget ? 'bg-slate-950 font-bold text-emerald-450 ring-2 ring-emerald-500 ring-inset' : ''}`}>
                              {isTarget ? (
                                <input
                                  type="text"
                                  value={demoInput}
                                  onChange={(e) => setDemoInput(e.target.value)}
                                  placeholder="Enter formula"
                                  className="w-full text-center bg-transparent text-emerald-450 font-bold focus:outline-none placeholder-slate-550"
                                />
                              ) : (
                                row[1]
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setDemoInput(''); setDemoFeedback(null); }}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-350 border border-slate-800 rounded-xl text-xs font-semibold transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleCheckDemo}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition"
                  >
                    Check Answer
                  </button>
                </div>

                {/* Feedback overlay */}
                {demoFeedback && (
                  <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs mt-3 ${
                    demoFeedback.isCorrect 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {demoFeedback.isCorrect ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold">
                        {demoFeedback.isCorrect ? '✅ Correct! Excellent.' : '❌ Incorrect'}
                      </h4>
                      <p className="text-slate-300 leading-normal font-sans">
                        {demoFeedback.isCorrect 
                          ? 'You solved your first Excel problem successfully. Proceed below to practice more!'
                          : 'Try again! Check if you typed `=SUM(B2:B5)` correctly.'
                        }
                      </p>
                      {demoFeedback.isCorrect && (
                        <div className="flex gap-2 pt-2">
                          <Link href="/dashboard" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded text-[10px] transition">
                            Continue Learning
                          </Link>
                          <Link href="/practice" className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-205 rounded text-[10px] transition">
                            Practice More
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section 4: Features Grid */}
      <section className="py-20 bg-slate-950 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Everything You Need to Master Excel
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Six premium interactive environments engineered for absolute job readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Learn', desc: 'Step-by-step Excel lessons.', href: '/learn', icon: BookOpen },
              { title: 'Practice', desc: 'Interactive spreadsheet challenges.', href: '/practice', icon: Grid },
              { title: 'Formula Library', desc: '500+ Excel formulas with examples.', href: '/formula-library', icon: Bookmark },
              { title: 'Shortcut Lab', desc: 'Practice Excel keyboard shortcuts.', href: '/shortcut-lab', icon: Users },
              { title: 'Job Mode', desc: 'Real company Excel work.', href: '/job', icon: Briefcase },
              { title: 'Interview Lab', desc: 'Prepare for Excel hiring assessments.', href: '/interview-lab', icon: Compass }
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <Link
                  key={idx}
                  href={f.href}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col justify-between gap-6 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-xl w-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-normal font-sans">{f.desc}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-450">
                    Start Environment
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Section 5: How Path Excel Works (Timeline) */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              How Path Excel Works
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Your step-by-step roadmap to job readiness.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { step: '1', title: 'Learn', desc: 'Review brief, structured lessons.' },
              { step: '2', title: 'Practice', desc: 'Solve matching cell tasks.' },
              { step: '3', title: 'Real Job Tasks', desc: 'Build spreadsheets in Job Mode.' },
              { step: '4', title: 'Interview Lab', desc: 'Ace mock hiring tests.' },
              { step: '5', title: 'Exams', desc: 'Secure verified credentials.' },
              { step: '6', title: 'Job Ready', desc: 'Start applying with confidence.' }
            ].map((s, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm hover:scale-105 transition duration-300"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono inline-flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="text-xs font-bold text-slate-100">{s.title}</h4>
                <p className="text-[10px] text-slate-450 leading-normal font-sans">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Section 6: Large Live Spreadsheet Preview */}
      <section className="py-20 bg-slate-950 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Live Spreadsheet Simulator
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Interact, edit, and test formulas inside our live playground.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                Formula Bar Task: Calculate Total Sales
              </span>
              <button
                onClick={() => setSec6Hint(prev => !prev)}
                className="text-[10px] text-slate-400 hover:text-slate-100 flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {sec6Hint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono">
              <div className="w-10 text-center font-bold text-emerald-455 bg-slate-900 py-1 rounded">B6</div>
              <span className="text-slate-500 font-serif italic select-none">fx</span>
              <input
                type="text"
                value={sec6Input}
                onChange={(e) => setSec6Input(e.target.value)}
                placeholder="Enter cell formula (e.g. =SUM(B2:B5))"
                className="flex-1 bg-transparent text-emerald-450 font-bold focus:outline-none placeholder-slate-550"
              />
            </div>

            {/* Grid */}
            <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950 font-mono text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="p-2 border-r border-slate-800 w-10" />
                    <th className="p-2 border-r border-slate-800 text-center">A</th>
                    <th className="p-2 border-r border-slate-800 text-center">B</th>
                  </tr>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-350">
                    <th className="p-2 border-r border-slate-850 select-none text-slate-500 w-10 text-center font-bold">1</th>
                    <th className="p-2 border-r border-slate-850 text-center">Item</th>
                    <th className="p-2 border-r border-slate-850 text-center">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Pen', '250'],
                    ['Book', '450'],
                    ['Bag', '800'],
                    ['Bottle', '300'],
                    ['Total', '']
                  ].map((row, idx) => {
                    const rowNum = idx + 2;
                    const isTarget = rowNum === 6;
                    return (
                      <tr key={idx} className="border-b border-slate-850 bg-slate-900">
                        <td className="p-2 border-r border-slate-850 text-slate-500 text-center font-bold select-none">{rowNum}</td>
                        <td className="p-2 border-r border-slate-800 text-center text-slate-205">{row[0]}</td>
                        <td className={`p-2 border-r border-slate-800 text-center text-slate-205 ${isTarget ? 'bg-slate-950 font-bold text-emerald-450 ring-2 ring-emerald-500 ring-inset' : ''}`}>
                          {isTarget ? (
                            <input
                              type="text"
                              value={sec6Input}
                              onChange={(e) => setSec6Input(e.target.value)}
                              placeholder="Enter formula"
                              className="w-full text-center bg-transparent text-emerald-450 font-bold focus:outline-none placeholder-slate-550"
                            />
                          ) : (
                            row[1]
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sec6Hint && (
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-400 font-sans">
                Formula target: `=SUM(B2:B5)`.
              </div>
            )}

            {/* Actions Check */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setSec6Input(''); setSec6Feedback(null); }}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-350 border border-slate-800 rounded-xl text-xs font-semibold transition"
              >
                Reset Grid
              </button>
              <button
                onClick={handleCheckSec6}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Check Answer
              </button>
            </div>

            {sec6Feedback && (
              <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs ${
                sec6Feedback.isCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {sec6Feedback.isCorrect ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold">
                    {sec6Feedback.isCorrect ? '✅ Success!' : '❌ Incorrect'}
                  </h4>
                  <p className="text-slate-300 leading-normal font-sans">
                    {sec6Feedback.isCorrect 
                      ? 'The formula calculated correctly.'
                      : 'Please type `=SUM(B2:B5)` to evaluate total Sales.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Section 7: Learning Roadmap Modules */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Learning Roadmap
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Full curriculum mapping essential corporate operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Excel Basics', 'Formatting', 'Basic Formulas', 'Logical Functions',
              'Text Functions', 'Date Functions', 'Lookup Functions', 'Math Functions',
              'Charts', 'Pivot Tables', 'Dashboard', 'MIS Reports', 'Job Templates', 'Interview Preparation'
            ].map((module, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{module}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">10 Lessons • Not Started</span>
                </div>
                <Link
                  href="/learn"
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-emerald-450 rounded-lg transition"
                >
                  Start
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Section 8: Job Ready Excel Projects */}
      <section className="py-20 bg-slate-950 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Real Excel Projects
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Build standard financial spreadsheets required by hiring companies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              'Salary Sheet', 'Attendance Sheet', 'GST Invoice', 'Inventory',
              'Sales Report', 'Expense Tracker', 'Payroll', 'MIS Dashboard',
              'Quotation', 'Employee Database'
            ].map((p, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-2 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xs font-bold border border-emerald-500/20">
                  {idx + 1}
                </div>
                <h4 className="text-[10px] font-bold text-slate-350">{p}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Section 9: Why Path Excel (Comparison Table) */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Why Path Excel?
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              The world's most practical platform to learn spreadsheet formulas.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900 max-w-2xl mx-auto shadow-sm">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-955 border-b border-slate-850 font-bold text-slate-300">
                  <th className="p-4">Features</th>
                  <th className="p-4 text-emerald-450">Path Excel</th>
                  <th className="p-4 text-slate-500">Video Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-medium">
                {[
                  ['Interactive Spreadsheet', true, false],
                  ['Formula Practice', true, false],
                  ['Keyboard Shortcut Trainer', true, false],
                  ['Job Tasks', true, false],
                  ['Interview Practice', true, false],
                  ['Progress Tracking', true, false]
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950">
                    <td className="p-4 text-slate-400">{row[0]}</td>
                    <td className="p-4 text-emerald-455 font-bold">
                      {row[1] ? '✔ Interactive Grid' : '✘ Passive'}
                    </td>
                    <td className="p-4 text-slate-500 font-bold">
                      {row[2] ? '✔ Yes' : '✘ Passive Lectures'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 11. Section 10: Statistics counters */}
      <section className="py-16 bg-slate-900 border-y border-slate-800 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            { c: '500+', t: 'Lessons' },
            { c: '10,000+', t: 'Practice Questions' },
            { c: '500+', t: 'Formulas' },
            { c: '100+', t: 'Job Tasks' },
            { c: '100+', t: 'Mock Interviews' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-3xl font-extrabold text-emerald-450 font-mono block">
                {stat.c}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                {stat.t}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Section 11: Testimonials */}
      <section className="py-20 bg-slate-955 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Student Success Stories
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Real outcomes from our self-paced learning framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Arjun Mehta', role: 'Student', quote: 'The interactive practice sheets helped me master XLOOKUP and IF formulas in just a week! Much better than watching 10-hour videos.' },
              { name: 'Priya Sharma', role: 'Accountant', quote: 'Shortcut Lab is amazing! Learning keyboard bindings saved me hours of manual audit editing every week.' },
              { name: 'Rahul Sen', role: 'MIS Executive', quote: 'The Mock Company Assessments felt exactly like the Excel test I was given during my final interview round. Highly recommended!' }
            ].map((t, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed font-sans">
                  "{t.quote}"
                </p>
                <div className="border-t border-slate-800 pt-3">
                  <h4 className="text-xs font-bold text-slate-205">{t.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Section 12: FAQ Accordion */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-xs">Everything you need to know about the platform.</p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left text-xs font-semibold text-slate-300 hover:text-slate-100 flex justify-between items-center transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed font-sans border-t border-slate-850 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Section 13: Final CTA */}
      <section className="py-24 bg-slate-950 text-center relative overflow-hidden border-t border-slate-850">
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            Practice Excel. <br />
            Build Real Skills. <br />
            Get Job Ready.
          </h2>
          <div className="flex justify-center gap-3 pt-2">
            <Link 
              href="/dashboard"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-sm font-bold shadow-lg transition active:scale-95"
            >
              Start Learning
            </Link>
            <Link 
              href="/practice"
              className="px-6 py-3 bg-slate-850 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-bold transition active:scale-95"
            >
              Practice Excel
            </Link>
          </div>
        </div>
      </section>

      {/* 15. Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-slate-900 pb-10">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center shadow-sm">
                <span className="font-mono font-bold text-slate-950 text-sm">P</span>
              </div>
              <span className="font-bold text-slate-200">Path Excel</span>
            </div>
            <p className="max-w-xs leading-relaxed font-sans text-slate-450">
              The world's most practical online spreadsheet training platform. Master formulas, formatting, shortcut logs, and hiring assessments.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-350 uppercase tracking-wider text-[10px]">Quick Links</h4>
            <ul className="space-y-2 font-sans">
              <li><Link href="/learn" className="hover:text-slate-205 transition">Lessons</Link></li>
              <li><Link href="/practice" className="hover:text-slate-205 transition">Spreadsheet Practice</Link></li>
              <li><Link href="/formula-library" className="hover:text-slate-205 transition">Formula Reference</Link></li>
              <li><Link href="/shortcut-lab" className="hover:text-slate-205 transition">Shortcut Lab</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-350 uppercase tracking-wider text-[10px]">Resources</h4>
            <ul className="space-y-2 font-sans">
              <li><Link href="/job" className="hover:text-slate-205 transition">Job Mode</Link></li>
              <li><Link href="/interview-lab" className="hover:text-slate-205 transition">Interview assessments</Link></li>
              <li><Link href="/exam" className="hover:text-slate-205 transition">Corporate Exams</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-350 uppercase tracking-wider text-[10px]">Legal</h4>
            <ul className="space-y-2 font-sans text-slate-400">
              <li><span className="hover:text-slate-205 transition cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-slate-205 transition cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 font-mono text-[10px] text-slate-500">
          <span>© {new Date().getFullYear()} Path Excel. All rights reserved.</span>
          <span>Handcrafted for Professional Office Readiness.</span>
        </div>
      </footer>

    </div>
  );
}
