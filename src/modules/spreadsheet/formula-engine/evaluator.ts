import { CellData } from '../types';
import { getCellValue } from './formula-evaluator';

// Import function files to ensure self-registration
import './formula-functions/math';
import './formula-functions/logical';
import './formula-functions/text';
import './formula-functions/lookup';
import './formula-functions/date';

export function evaluateGrid(cells: Record<string, CellData>): Record<string, CellData> {
  const result: Record<string, CellData> = {};
  
  // Clone cells and clear previously computed cache
  Object.keys(cells).forEach(key => {
    result[key] = { 
      ...cells[key],
      computed: undefined 
    };
  });

  // Evaluate cell values recursively (getCellValue handles lazy evaluation, dependency resolution, and circular loop checks)
  Object.keys(result).forEach(key => {
    result[key].computed = getCellValue(key, result);
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
