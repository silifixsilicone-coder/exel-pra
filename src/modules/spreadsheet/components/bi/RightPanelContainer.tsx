"use client";

import React from 'react';
import { useBI } from '../../bi/context/BIContext';
import AIInsightsPanel from '../../bi/ai-insights/AIInsightsPanel';
import RecommendationsPanel from '../../bi/recommendations/RecommendationsPanel';
import NLQueryPanel from '../../bi/natural-language/NLQueryPanel';

export default function RightPanelContainer() {
  const { collapsiblePanel } = useBI();

  if (collapsiblePanel === 'none') return null;

  return (
    <div className="flex border-l border-slate-800 bg-slate-950 shrink-0 h-full">
      <AIInsightsPanel />
      <RecommendationsPanel />
      <NLQueryPanel />
    </div>
  );
}
