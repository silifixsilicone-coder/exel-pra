import { CellRange } from '../../types';
import { colNumberToLetter } from '../../utils/gridUtils';

export interface DataMetrics {
  max: number;
  min: number;
  avg: number;
  sum: number;
  growthRate: number;
  count: number;
}

export function parseRangeData(range: CellRange, cells: any): { labels: string[]; numbers: number[] } {
  const labels: string[] = [];
  const numbers: number[] = [];

  for (let r = range.startRow; r <= range.endRow; r++) {
    // First column holds the item labels/names
    const colLetter0 = colNumberToLetter(range.startCol);
    const cellKey0 = `${colLetter0}${r + 1}`;
    const labelVal = cells[cellKey0]?.computed ?? cells[cellKey0]?.value ?? `Row ${r + 1}`;
    labels.push(String(labelVal));

    // Second column holds numbers
    const colLetter1 = colNumberToLetter(range.startCol + 1);
    const cellKey1 = `${colLetter1}${r + 1}`;
    const rawVal = cells[cellKey1]?.computed ?? cells[cellKey1]?.value ?? '0';
    const numVal = isNaN(Number(rawVal)) ? 0 : Number(rawVal);
    numbers.push(numVal);
  }

  return { labels, numbers };
}

export function calculateMetrics(numbers: number[]): DataMetrics {
  if (numbers.length === 0) {
    return { max: 0, min: 0, avg: 0, sum: 0, growthRate: 0, count: 0 };
  }

  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  const avg = sum / numbers.length;
  
  // Growth rate from first to last element
  const first = numbers[0];
  const last = numbers[numbers.length - 1];
  const growthRate = first !== 0 ? ((last - first) / first) * 100 : 0;

  return {
    max,
    min,
    avg,
    sum,
    growthRate,
    count: numbers.length
  };
}
