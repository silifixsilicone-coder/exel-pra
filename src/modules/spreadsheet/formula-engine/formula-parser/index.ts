import { CellData } from '../../types';
import { formulaLibrary } from '../formula-library';

// Helper to convert range letters
function colLetterToNum(letter: string): number {
  let num = 0;
  for (let i = 0; i < letter.length; i++) {
    num = num * 26 + (letter.charCodeAt(i) - 64);
  }
  return num;
}
function numToColLetter(num: number): string {
  let temp = num;
  let letter = '';
  while (temp > 0) {
    let modulo = (temp - 1) % 26;
    letter = String.fromCharCode(65 + modulo) + letter;
    temp = Math.floor((temp - modulo) / 26);
  }
  return letter;
}

// Extract dependencies (all cell references inside a formula string)
export function getDependencies(formula: string): string[] {
  if (!formula.startsWith('=')) return [];
  const clean = formula.substring(1);
  const cellRegex = /[A-Z]+[0-9]+/g;
  
  // Find all ranges like A1:B3
  const rangeRegex = /([A-Z]+[0-9]+):([A-Z]+[0-9]+)/g;
  const deps: Set<string> = new Set();
  
  let match;
  // Resolve ranges
  while ((match = rangeRegex.exec(clean)) !== null) {
    const startCell = match[1];
    const endCell = match[2];
    const startMatch = startCell.match(/^([A-Z]+)([0-9]+)$/);
    const endMatch = endCell.match(/^([A-Z]+)([0-9]+)$/);
    if (startMatch && endMatch) {
      const startCol = colLetterToNum(startMatch[1]);
      const endCol = colLetterToNum(endMatch[1]);
      const startRow = parseInt(startMatch[2], 10);
      const endRow = parseInt(endMatch[2], 10);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          deps.add(`${numToColLetter(c)}${r}`);
        }
      }
    }
  }

  // Find remaining single cells
  let singleMatch;
  while ((singleMatch = cellRegex.exec(clean)) !== null) {
    deps.add(singleMatch[0]);
  }
  
  return Array.from(deps);
}

// Parses and evaluates a formula string
export function parseAndEvaluate(
  formula: string,
  cells: Record<string, CellData>,
  evaluatingCells: Set<string> = new Set()
): string | number | boolean {
  if (!formula.startsWith('=')) {
    const num = Number(formula);
    return isNaN(num) ? formula : num;
  }

  const expression = formula.substring(1).trim();
  
  try {
    // 1. Check if it's a simple function call like SUM(A1:A3)
    const funcMatch = expression.match(/^([A-Z]+)\((.*)\)$/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const funcArgsRaw = funcMatch[2];
      
      if (formulaLibrary.has(funcName)) {
        // Resolve arguments (comma-separated, but respecting brackets/ranges)
        const args = parseArgs(funcArgsRaw, cells, evaluatingCells);
        const executor = formulaLibrary.get(funcName)!;
        return executor(args, cells);
      }
      return '#NAME?';
    }

    // 2. Resolve basic arithmetic operations: e.g. A1*B1
    return evaluateArithmeticExpression(expression, cells, evaluatingCells);
  } catch (err) {
    console.error("Formula parsing error: ", err);
    return '#VALUE!';
  }
}

// Splitting function arguments respecting commas and parentheses
function parseArgs(argsStr: string, cells: Record<string, CellData>, evaluatingCells: Set<string>): any[] {
  const args: any[] = [];
  let bracketDepth = 0;
  let currentArg = '';
  
  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];
    if (char === '(') bracketDepth++;
    if (char === ')') bracketDepth--;
    
    if (char === ',' && bracketDepth === 0) {
      args.push(resolveArgValue(currentArg.trim(), cells, evaluatingCells));
      currentArg = '';
    } else {
      currentArg += char;
    }
  }
  
  if (currentArg.trim() !== '') {
    args.push(resolveArgValue(currentArg.trim(), cells, evaluatingCells));
  }
  
  return args;
}

// Resolves a single argument (which can be a range, a cell ref, or a value)
function resolveArgValue(arg: string, cells: Record<string, CellData>, evaluatingCells: Set<string>): any {
  // Check if range: A1:B2
  if (arg.includes(':')) {
    const parts = arg.split(':');
    const startMatch = parts[0].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
    const endMatch = parts[1].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
    if (startMatch && endMatch) {
      const startCol = colLetterToNum(startMatch[1]);
      const endCol = colLetterToNum(endMatch[1]);
      const startRow = parseInt(startMatch[2], 10);
      const endRow = parseInt(endMatch[2], 10);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      
      const values: any[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const key = `${numToColLetter(c)}${r}`;
          values.push(getCellValue(key, cells, evaluatingCells));
        }
      }
      return values;
    }
    return '#REF!';
  }

  // Check if single cell reference
  if (/^[A-Z]+[0-9]+$/i.test(arg)) {
    return getCellValue(arg.toUpperCase(), cells, evaluatingCells);
  }

  // Check if string literal
  if (arg.startsWith('"') && arg.endsWith('"')) {
    return arg.substring(1, arg.length - 1);
  }

  // Number or boolean
  if (arg.toUpperCase() === 'TRUE') return true;
  if (arg.toUpperCase() === 'FALSE') return false;
  
  const num = Number(arg);
  return isNaN(num) ? arg : num;
}

// Gets the evaluated value of a cell
function getCellValue(cellKey: string, cells: Record<string, CellData>, evaluatingCells: Set<string>): any {
  if (evaluatingCells.has(cellKey)) {
    return '#CIRC!'; // Circular dependency
  }
  
  const cell = cells[cellKey];
  if (!cell) return 0;
  
  if (cell.computed !== undefined) {
    return cell.computed;
  }
  
  // Evaluate cell lazily
  evaluatingCells.add(cellKey);
  const result = parseAndEvaluate(cell.value, cells, evaluatingCells);
  evaluatingCells.delete(cellKey);
  
  return result;
}

// Simple arithmetic evaluator supporting +, -, *, /
function evaluateArithmeticExpression(expr: string, cells: Record<string, CellData>, evaluatingCells: Set<string>): any {
  // Resolve cell refs in expression first
  let resolvedExpr = expr;
  
  // Find cell references and replace with their values
  const cellRegex = /\b[A-Z]+[0-9]+\b/g;
  let match;
  const references: string[] = [];
  while ((match = cellRegex.exec(expr)) !== null) {
    references.push(match[0]);
  }
  
  // Replace from longest cell reference to shortest to prevent partial replaces
  references.sort((a, b) => b.length - a.length);
  references.forEach(ref => {
    const val = getCellValue(ref, cells, evaluatingCells);
    const escapedVal = typeof val === 'string' ? `"${val}"` : val;
    resolvedExpr = resolvedExpr.replace(new RegExp(`\\b${ref}\\b`, 'g'), String(escapedVal));
  });

  // Evaluate safely using Function constructor (standard parser fallback)
  // Check for safe characters to prevent code injection
  if (/^[0-9+\-*/().\s"']+$|^[0-9+\-*/().\s"']+&[0-9+\-*/().\s"']+$/.test(resolvedExpr)) {
    try {
      // Handle string concatenation like "Hello " & "World"
      if (resolvedExpr.includes('&')) {
        return resolvedExpr.split('&').map(part => {
          // Eval each part
          const cleanPart = part.trim();
          if (cleanPart.startsWith('"') && cleanPart.endsWith('"')) {
            return cleanPart.substring(1, cleanPart.length - 1);
          }
          const res = new Function(`return (${cleanPart})`)();
          return String(res);
        }).join('');
      }
      return new Function(`return (${resolvedExpr})`)();
    } catch {
      return '#VALUE!';
    }
  }

  return expr;
}
