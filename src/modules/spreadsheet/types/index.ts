export interface CellData {
  value: string; // Raw user input, e.g. "=SUM(A1:A5)" or "150" or "Hello"
  computed?: string | number | boolean; // Evaluated formula outcome or value
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  color?: string; // Text hex color
  bgColor?: string; // Fill hex color
  fontFamily?: string; // e.g. "Arial", "Calibri", "Inter"
  fontSize?: number; // Font size in pixels
  wrapText?: boolean;
  border?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  format?: 'general' | 'currency' | 'percent' | 'date' | 'time';
  mergedInto?: string; // Cell address reference (e.g. "A1") if merged
}

export interface CellRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface SheetData {
  id: string;
  name: string;
  cells: Record<string, CellData>;
  rowCount: number;
  colCount: number;
  selectedRange: CellRange | null;
  activeCell: string; // e.g. "A1"
  columnWidths?: Record<number, number>; // colNum -> widthpx
  rowHeights?: Record<number, number>; // rowNum -> heightpx
  mergedRanges?: string[]; // e.g. ["A1:B2"]
}

export interface ClipboardData {
  range: CellRange;
  sheetId: string;
  type: 'copy' | 'cut';
}

export interface WorkbookState {
  sheets: Record<string, SheetData>;
  sheetOrder: string[];
  activeSheetId: string;
  clipboard: ClipboardData | null;
}
