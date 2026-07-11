import { CellData } from '../types';
import { evaluateGrid } from '../formula-engine/evaluator';

export function colNumberToLetter(colNum: number): string {
  let temp = colNum;
  let letter = '';
  while (temp > 0) {
    let modulo = (temp - 1) % 26;
    letter = String.fromCharCode(65 + modulo) + letter;
    temp = Math.floor((temp - modulo) / 26);
  }
  return letter;
}

export function colLetterToNumber(letter: string): number {
  let num = 0;
  const upper = letter.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    num = num * 26 + (upper.charCodeAt(i) - 64);
  }
  return num;
}

// Coordinate utilities
export interface CellCoord {
  row: number;
  col: number;
}

export function parseCellAddress(address: string): CellCoord | null {
  const match = address.toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  return {
    row: parseInt(match[2], 10),
    col: colLetterToNumber(match[1])
  };
}

export function getCellAddress(row: number, col: number): string {
  return colNumberToLetter(col) + row;
}

// Resolves a range string like "A1:B3" into a list of cell coordinates
export function resolveRange(rangeStr: string): CellCoord[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) {
    const coord = parseCellAddress(parts[0]);
    return coord ? [coord] : [];
  }
  
  const start = parseCellAddress(parts[0]);
  const end = parseCellAddress(parts[1]);
  if (!start || !end) return [];

  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  const coords: CellCoord[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      coords.push({ row: r, col: c });
    }
  }
  return coords;
}

// Triggers full grid evaluation
export function evaluateFormula(val: string, cells: Record<string, CellData>): string | number | boolean {
  if (!val.startsWith('=')) return val;
  // Evaluate single cell formula using the formula engine
  const evaluated = evaluateGrid(cells);
  // Find key of this val if possible, otherwise resolve using simple evaluator
  return val;
}
