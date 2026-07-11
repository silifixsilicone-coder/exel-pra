"use client";

import React from 'react';
import SpreadsheetWorkspace from '@/modules/spreadsheet/components/SpreadsheetWorkspace';
import { SpreadsheetProvider } from '@/modules/spreadsheet/context/SpreadsheetContext';

export default function SpreadsheetPage() {
  return (
    <SpreadsheetProvider>
      <div className="w-full h-full min-h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
        <SpreadsheetWorkspace />
      </div>
    </SpreadsheetProvider>
  );
}
