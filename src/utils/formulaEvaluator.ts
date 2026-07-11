import { GridState } from '../types';

// Helper to parse raw string inputs into typed values
export function parseRawValue(val: string): string | number | boolean {
  if (val === undefined || val === null || val === '') {
    return '';
  }
  const trimmed = val.trim();
  if (trimmed.toLowerCase() === 'true') return true;
  if (trimmed.toLowerCase() === 'false') return false;
  
  // Check if it's a number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed);
  }
  
  // Return stripped string if it has quotes
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  
  return trimmed;
}

// Convert column letters (A, B, C...) to 1-based index (1, 2, 3...)
export function colLetterToNumber(col: string): number {
  let num = 0;
  const upperCol = col.toUpperCase();
  for (let i = 0; i < upperCol.length; i++) {
    num = num * 26 + (upperCol.charCodeAt(i) - 64);
  }
  return num;
}

// Convert 1-based index (1, 2, 3...) to column letters (A, B, C...)
export function colNumberToLetter(num: number): string {
  let col = '';
  let temp = num;
  while (temp > 0) {
    let rem = temp % 26;
    if (rem === 0) {
      rem = 26;
      temp = Math.floor(temp / 26) - 1;
    } else {
      temp = Math.floor(temp / 26);
    }
    col = String.fromCharCode(rem + 64) + col;
  }
  return col;
}

// Check if a string is a valid cell reference (e.g. A1, B12)
export function isCellReference(str: string): boolean {
  return /^[A-Z]+[0-9]+$/i.test(str.trim());
}

// Parse range (e.g. A1:B3) into list of cell keys
export function parseRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) {
    return [rangeStr.toUpperCase()];
  }
  
  const start = parts[0].trim().toUpperCase();
  const end = parts[1].trim().toUpperCase();
  
  const startColMatch = start.match(/^[A-Z]+/);
  const startRowMatch = start.match(/[0-9]+$/);
  const endColMatch = end.match(/^[A-Z]+/);
  const endRowMatch = end.match(/[0-9]+$/);
  
  if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
    return [start];
  }
  
  const startCol = startColMatch[0];
  const startRow = parseInt(startRowMatch[0], 10);
  const endCol = endColMatch[0];
  const endRow = parseInt(endRowMatch[0], 10);
  
  const startColNum = colLetterToNumber(startCol);
  const endColNum = colLetterToNumber(endCol);
  
  const minCol = Math.min(startColNum, endColNum);
  const maxCol = Math.max(startColNum, endColNum);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  
  const keys: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      keys.push(colNumberToLetter(c) + r);
    }
  }
  return keys;
}

// Split arguments of a function call, ignoring commas inside quotes and parentheses
function splitArguments(argsStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let inQuotes = false;
  let parenDepth = 0;
  
  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '(' && !inQuotes) {
      parenDepth++;
      current += char;
    } else if (char === ')' && !inQuotes) {
      parenDepth--;
      current += char;
    } else if (char === ',' && !inQuotes && parenDepth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}

// Helper to get cell value, with circular dependency detection
function getCellValue(cellKey: string, grid: GridState, visited: Set<string>): any {
  const key = cellKey.toUpperCase();
  const cell = grid[key];
  if (!cell) return 0; // treat empty cells as 0
  
  if (cell.value.startsWith('=')) {
    if (visited.has(key)) {
      return '#CIRCULAR!';
    }
    const nextVisited = new Set(visited);
    nextVisited.add(key);
    return evaluateFormulaWithVisited(cell.value, grid, nextVisited);
  }
  
  return parseRawValue(cell.value);
}

// Helper to resolve a single token (reference, string, or number)
function resolveToken(token: string, grid: GridState, visited: Set<string>): any {
  const trimmed = token.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  if (isCellReference(trimmed)) {
    return getCellValue(trimmed, grid, visited);
  }
  return parseRawValue(trimmed);
}

// Evaluate comparison expression (e.g. B2>=80)
function evaluateComparison(testStr: string, grid: GridState, visited: Set<string>): boolean {
  const operators = ['>=', '<=', '>', '<', '=', '<>'];
  let op = '';
  let parts: string[] = [];
  
  for (const o of operators) {
    if (testStr.includes(o)) {
      op = o;
      parts = testStr.split(o);
      break;
    }
  }
  
  if (!op || parts.length !== 2) return false;
  
  const left = resolveToken(parts[0].trim(), grid, visited);
  const right = resolveToken(parts[1].trim(), grid, visited);
  
  const leftNum = typeof left === 'string' ? parseFloat(left) : left;
  const rightNum = typeof right === 'string' ? parseFloat(right) : right;
  
  const isLeftNum = typeof leftNum === 'number' && !isNaN(leftNum);
  const isRightNum = typeof rightNum === 'number' && !isNaN(rightNum);
  
  const l = isLeftNum ? leftNum : left;
  const r = isRightNum ? rightNum : right;
  
  switch (op) {
    case '>=': return l >= r;
    case '<=': return l <= r;
    case '>': return l > r;
    case '<': return l < r;
    case '=': return l === r;
    case '<>': return l !== r;
    default: return false;
  }
}

// Main internal formula evaluator with visited set to track loops
function evaluateFormulaWithVisited(formula: string, grid: GridState, visited: Set<string>): any {
  if (!formula.startsWith('=')) {
    return parseRawValue(formula);
  }
  
  const content = formula.substring(1).trim();
  
  // 1. Check for standard function: FUNCTION_NAME(...)
  const functionMatch = content.match(/^([A-Z0-9_.]+)\s*\((.*)\)$/i);
  if (functionMatch) {
    const funcName = functionMatch[1].toUpperCase();
    const argsStr = functionMatch[2];
    const rawArgs = splitArguments(argsStr);
    
    return executeFunction(funcName, rawArgs, grid, visited);
  }
  
  // 2. Fallback to basic arithmetic evaluation (e.g. =A2+B2 or =B2*0.1)
  return evaluateArithmetic(content, grid, visited);
}

// Perform execution of formula functions
function executeFunction(funcName: string, rawArgs: string[], grid: GridState, visited: Set<string>): any {
  // Resolve values or arrays for function arguments
  const resolveArgValues = (arg: string): any[] => {
    if (arg.includes(':')) {
      const cellKeys = parseRange(arg);
      return cellKeys.map(k => getCellValue(k, grid, visited));
    }
    return [resolveToken(arg, grid, visited)];
  };
  
  switch (funcName) {
    case 'SUM': {
      let sum = 0;
      for (const arg of rawArgs) {
        const vals = resolveArgValues(arg);
        for (const v of vals) {
          const num = typeof v === 'number' ? v : parseFloat(v);
          if (!isNaN(num)) sum += num;
        }
      }
      return sum;
    }
    
    case 'AVERAGE': {
      let sum = 0;
      let count = 0;
      for (const arg of rawArgs) {
        const vals = resolveArgValues(arg);
        for (const v of vals) {
          const num = typeof v === 'number' ? v : parseFloat(v);
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      }
      return count > 0 ? sum / count : '#DIV/0!';
    }
    
    case 'COUNT': {
      let count = 0;
      for (const arg of rawArgs) {
        const vals = resolveArgValues(arg);
        for (const v of vals) {
          if (typeof v === 'number' && !isNaN(v)) {
            count++;
          } else if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) {
            count++;
          }
        }
      }
      return count;
    }
    
    case 'MAX': {
      let maxVal: number | null = null;
      for (const arg of rawArgs) {
        const vals = resolveArgValues(arg);
        for (const v of vals) {
          const num = typeof v === 'number' ? v : parseFloat(v);
          if (!isNaN(num)) {
            if (maxVal === null || num > maxVal) maxVal = num;
          }
        }
      }
      return maxVal !== null ? maxVal : 0;
    }
    
    case 'MIN': {
      let minVal: number | null = null;
      for (const arg of rawArgs) {
        const vals = resolveArgValues(arg);
        for (const v of vals) {
          const num = typeof v === 'number' ? v : parseFloat(v);
          if (!isNaN(num)) {
            if (minVal === null || num < minVal) minVal = num;
          }
        }
      }
      return minVal !== null ? minVal : 0;
    }
    
    case 'IF': {
      if (rawArgs.length < 2) return '#value!';
      const conditionStr = rawArgs[0];
      const isTrue = evaluateComparison(conditionStr, grid, visited);
      
      if (isTrue) {
        return resolveToken(rawArgs[1], grid, visited);
      } else {
        return rawArgs[2] !== undefined ? resolveToken(rawArgs[2], grid, visited) : false;
      }
    }
    
    case 'AND': {
      for (const arg of rawArgs) {
        const val = evaluateComparison(arg, grid, visited);
        if (!val) return false;
      }
      return true;
    }
    
    case 'OR': {
      for (const arg of rawArgs) {
        const val = evaluateComparison(arg, grid, visited);
        if (val) return true;
      }
      return false;
    }
    
    case 'CONCAT':
    case 'CONCATENATE': {
      let result = '';
      for (const arg of rawArgs) {
        const vals = resolveArgValues(arg);
        result += vals.map(v => (v !== null && v !== undefined ? String(v) : '')).join('');
      }
      return result;
    }
    
    case 'LEFT': {
      if (rawArgs.length === 0) return '#VALUE!';
      const text = String(resolveToken(rawArgs[0], grid, visited));
      const chars = rawArgs[1] !== undefined ? parseInt(resolveToken(rawArgs[1], grid, visited), 10) : 1;
      return isNaN(chars) ? '#VALUE!' : text.substring(0, chars);
    }
    
    case 'RIGHT': {
      if (rawArgs.length === 0) return '#VALUE!';
      const text = String(resolveToken(rawArgs[0], grid, visited));
      const chars = rawArgs[1] !== undefined ? parseInt(resolveToken(rawArgs[1], grid, visited), 10) : 1;
      return isNaN(chars) ? '#VALUE!' : text.substring(text.length - chars);
    }
    
    case 'MID': {
      if (rawArgs.length < 3) return '#VALUE!';
      const text = String(resolveToken(rawArgs[0], grid, visited));
      const start = parseInt(resolveToken(rawArgs[1], grid, visited), 10) - 1; // 1-based index to 0-based
      const chars = parseInt(resolveToken(rawArgs[2], grid, visited), 10);
      if (isNaN(start) || isNaN(chars)) return '#VALUE!';
      return text.substring(start, start + chars);
    }
    
    case 'UPPER': {
      if (rawArgs.length === 0) return '';
      return String(resolveToken(rawArgs[0], grid, visited)).toUpperCase();
    }
    
    case 'LOWER': {
      if (rawArgs.length === 0) return '';
      return String(resolveToken(rawArgs[0], grid, visited)).toLowerCase();
    }
    
    case 'PROPER': {
      if (rawArgs.length === 0) return '';
      const text = String(resolveToken(rawArgs[0], grid, visited));
      return text.replace(/\b\w/g, c => c.toUpperCase());
    }
    
    case 'VLOOKUP': {
      if (rawArgs.length < 3) return '#VALUE!';
      const lookupVal = resolveToken(rawArgs[0], grid, visited);
      const rangeStr = rawArgs[1];
      const colIdx = parseInt(resolveToken(rawArgs[2], grid, visited), 10);
      
      if (isNaN(colIdx) || colIdx < 1) return '#VALUE!';
      
      const rangeParts = rangeStr.split(':');
      if (rangeParts.length !== 2) return '#VALUE!';
      
      const start = rangeParts[0].trim().toUpperCase();
      const end = rangeParts[1].trim().toUpperCase();
      
      const startColMatch = start.match(/^[A-Z]+/);
      const startRowMatch = start.match(/[0-9]+$/);
      const endColMatch = end.match(/^[A-Z]+/);
      const endRowMatch = end.match(/[0-9]+$/);
      
      if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
        return '#VALUE!';
      }
      
      const startColNum = colLetterToNumber(startColMatch[0]);
      const endColNum = colLetterToNumber(endColMatch[0]);
      const startRow = parseInt(startRowMatch[0], 10);
      const endRow = parseInt(endRowMatch[0], 10);
      
      const minCol = Math.min(startColNum, endColNum);
      const maxCol = Math.max(startColNum, endColNum);
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      
      // VLOOKUP checks the leftmost column of the range
      const lookupColLetter = colNumberToLetter(minCol);
      
      // Ensure the column index requested is within the range
      if (colIdx > (maxCol - minCol + 1)) return '#REF!';
      
      let matchedRow = -1;
      for (let r = minRow; r <= maxRow; r++) {
        const cellVal = getCellValue(lookupColLetter + r, grid, visited);
        // Compare values
        if (String(cellVal).toLowerCase() === String(lookupVal).toLowerCase()) {
          matchedRow = r;
          break;
        }
      }
      
      if (matchedRow === -1) return '#N/A';
      
      // Retrieve value at colIdx
      const outputColLetter = colNumberToLetter(minCol + colIdx - 1);
      return getCellValue(outputColLetter + matchedRow, grid, visited);
    }
    
    case 'COUNTIF': {
      if (rawArgs.length < 2) return '#VALUE!';
      const rangeStr = rawArgs[0];
      const criteriaToken = rawArgs[1];
      const cellKeys = parseRange(rangeStr);
      const cellValues = cellKeys.map(k => getCellValue(k, grid, visited));
      
      const criteriaStr = String(resolveToken(criteriaToken, grid, visited)).trim();
      
      let count = 0;
      for (const val of cellValues) {
        if (matchesCriteria(val, criteriaStr)) count++;
      }
      return count;
    }
    
    case 'SUMIF': {
      if (rawArgs.length < 2) return '#VALUE!';
      const rangeStr = rawArgs[0];
      const criteriaToken = rawArgs[1];
      const sumRangeStr = rawArgs[2] !== undefined ? rawArgs[2] : rangeStr;
      
      const rangeKeys = parseRange(rangeStr);
      const sumKeys = parseRange(sumRangeStr);
      const criteriaStr = String(resolveToken(criteriaToken, grid, visited)).trim();
      
      let sum = 0;
      for (let i = 0; i < rangeKeys.length; i++) {
        const val = getCellValue(rangeKeys[i], grid, visited);
        if (matchesCriteria(val, criteriaStr)) {
          const sumCellVal = getCellValue(sumKeys[i], grid, visited);
          const num = typeof sumCellVal === 'number' ? sumCellVal : parseFloat(sumCellVal);
          if (!isNaN(num)) sum += num;
        }
      }
      return sum;
    }
    
    default:
      return '#NAME?';
  }
}

// Helper to check if a value matches COUNTIF/SUMIF criteria
function matchesCriteria(val: any, criteriaStr: string): boolean {
  const criteria = criteriaStr.trim();
  const valStr = String(val).toLowerCase();
  
  // Check condition prefixes: >=, <=, >, <, <>
  const opMatch = criteria.match(/^(>=|<=|>|<|<>|=)/);
  if (opMatch) {
    const op = opMatch[0];
    const comparisonValStr = criteria.substring(op.length).trim();
    const comparisonVal = parseRawValue(comparisonValStr);
    
    const valNum = typeof val === 'number' ? val : parseFloat(val);
    const compNum = typeof comparisonVal === 'number' ? comparisonVal : parseFloat(comparisonValStr);
    
    const isValNum = typeof valNum === 'number' && !isNaN(valNum);
    const isCompNum = typeof compNum === 'number' && !isNaN(compNum);
    
    const v = isValNum ? valNum : val;
    const c = isCompNum ? compNum : comparisonVal;
    
    switch (op) {
      case '>=': return v >= c;
      case '<=': return v <= c;
      case '>': return v > c;
      case '<': return v < c;
      case '<>': return v !== c;
      case '=': return v === c;
      default: return false;
    }
  }
  
  // Direct equality comparison
  return valStr === criteria.toLowerCase();
}

// Math expression evaluation helper
function evaluateArithmetic(expr: string, grid: GridState, visited: Set<string>): any {
  // Replace cell references with their resolved values
  let resolvedExpr = expr.trim();
  const cellRefRegex = /\b([A-Z]+[0-9]+)\b/gi;
  
  resolvedExpr = resolvedExpr.replace(cellRefRegex, (match) => {
    const val = getCellValue(match, grid, visited);
    if (typeof val === 'number') {
      return val.toString();
    }
    // Return string literal in quotes
    return `"${val}"`;
  });
  
  // Check if string ampersand concatenation is used: e.g. "Arthur" & " " & "Dent"
  if (resolvedExpr.includes('&')) {
    const parts = resolvedExpr.split('&').map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
      }
      return trimmed;
    });
    return parts.join('');
  }
  
  // Safe math calculation
  try {
    if (/^[0-9.+\-*/()\s]+$/.test(resolvedExpr)) {
      // Safe execution using Function construct
      const evaluator = new Function(`return (${resolvedExpr});`);
      const result = evaluator();
      return isNaN(result) ? '#VALUE!' : result;
    }
  } catch (e) {
    return '#VALUE!';
  }
  
  // Strip quotes if they surrounding the evaluated string
  if (resolvedExpr.startsWith('"') && resolvedExpr.endsWith('"')) {
    return resolvedExpr.slice(1, -1);
  }
  
  return '#VALUE!';
}

// Public API for evaluating formula
export function evaluateFormula(formula: string, grid: GridState): any {
  return evaluateFormulaWithVisited(formula, grid, new Set());
}

// Evaluate entire grid state
export function evaluateGrid(grid: GridState): GridState {
  const result: GridState = {};
  for (const [key, cell] of Object.entries(grid)) {
    result[key] = {
      ...cell,
      computed: evaluateFormula(cell.value, grid)
    };
  }
  return result;
}
