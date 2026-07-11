import { CellData } from '../types';
import { parseAndEvaluate } from './formula-parser';

// Import function files to ensure self-registration
import './formula-functions/math';
import './formula-functions/logical';
import './formula-functions/text';
import './formula-functions/lookup';

export function evaluateGrid(cells: Record<string, CellData>): Record<string, CellData> {
  const result: Record<string, CellData> = {};
  
  // Clone cells and clear previous evaluation cache
  Object.keys(cells).forEach(key => {
    result[key] = { 
      ...cells[key],
      computed: undefined 
    };
  });

  // Evaluate formulas
  Object.keys(result).forEach(key => {
    const cell = result[key];
    if (cell.value.startsWith('=')) {
      cell.computed = parseAndEvaluate(cell.value, result);
    } else {
      // Parse plain values
      const val = cell.value;
      if (val === '') {
        cell.computed = '';
      } else {
        const num = Number(val);
        cell.computed = isNaN(num) ? val : num;
      }
    }
  });

  // Resolve merged cell display values
  Object.keys(result).forEach(key => {
    const cell = result[key];
    if (cell.mergedInto) {
      const parent = result[cell.mergedInto];
      if (parent) {
        cell.computed = parent.computed;
      }
    }
  });

  return result;
}
