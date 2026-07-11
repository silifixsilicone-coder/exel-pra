import { functionDatabase } from '../formula-library/metadata';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

/**
 * Validates a formula string for syntax errors, arguments count, and function names.
 */
export function validateFormula(formulaText: string): ValidationResult {
  if (!formulaText.startsWith('=')) {
    return { isValid: true };
  }

  const formula = formulaText.substring(1).trim();
  if (!formula) {
    return { isValid: true };
  }

  // 1. Parenthesis mismatch check
  let openCount = 0;
  let closeCount = 0;
  let inDoubleQuotes = false;
  let inSingleQuotes = false;

  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
    } else if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
    } else if (!inDoubleQuotes && !inSingleQuotes) {
      if (char === '(') openCount++;
      if (char === ')') closeCount++;
    }
  }

  if (openCount > closeCount) {
    return { 
      isValid: false, 
      errorMessage: `Mismatched parenthesis: missing ${openCount - closeCount} closing parenthesis ')'` 
    };
  }
  if (closeCount > openCount) {
    return { 
      isValid: false, 
      errorMessage: `Mismatched parenthesis: missing ${closeCount - openCount} opening parenthesis '('` 
    };
  }

  // 2. Validate function names and argument counts
  // Match word characters followed by '('
  const functionRegex = /\b([A-Z_]+)\s*\(/gi;
  let match;
  
  while ((match = functionRegex.exec(formula)) !== null) {
    const name = match[1].toUpperCase();
    const metadata = functionDatabase.find(fn => fn.name === name);
    
    if (!metadata) {
      return { 
        isValid: false, 
        errorMessage: `Unknown function name: "${name}"` 
      };
    }

    // Attempt to extract arguments for this matched function index
    const argsStart = match.index + match[0].length;
    const argsStr = extractArgumentsString(formula, argsStart);
    const argsCount = parseArgsList(argsStr).length;

    const requiredParams = metadata.parameters.filter(p => !p.optional).length;
    const totalParams = metadata.parameters.length;
    const hasVarArgs = metadata.syntax.includes('...');

    if (argsCount < requiredParams) {
      return {
        isValid: false,
        errorMessage: `Too few arguments for ${name}(). Expected at least ${requiredParams}, but got ${argsCount}.`
      };
    }

    if (!hasVarArgs && argsCount > totalParams) {
      return {
        isValid: false,
        errorMessage: `Too many arguments for ${name}(). Expected at most ${totalParams}, but got ${argsCount}.`
      };
    }
  }

  // 3. Invalid range format check (e.g. "A1:B" or "A:1")
  const invalidRangeRegex = /\b([A-Z]+[0-9]+):([A-Z]+(?![0-9])|[0-9]+(?![A-Z]))\b/gi;
  if (invalidRangeRegex.test(formula)) {
    return {
      isValid: false,
      errorMessage: 'Invalid range reference format (e.g., must be A1:B10).'
    };
  }

  return { isValid: true };
}

// Extracts arguments substring by matching braces
function extractArgumentsString(formula: string, startIdx: number): string {
  let depth = 1;
  let endIdx = startIdx;
  let inDoubleQuotes = false;
  let inSingleQuotes = false;

  while (endIdx < formula.length && depth > 0) {
    const char = formula[endIdx];
    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
    } else if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
    } else if (!inDoubleQuotes && !inSingleQuotes) {
      if (char === '(') depth++;
      if (char === ')') depth--;
    }
    if (depth > 0) endIdx++;
  }

  return formula.substring(startIdx, endIdx);
}

// Parses comma-separated arguments at depth 0
function parseArgsList(argsStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let inDoubleQuotes = false;
  let inSingleQuotes = false;

  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];
    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
      current += char;
    } else if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      current += char;
    } else if (!inDoubleQuotes && !inSingleQuotes) {
      if (char === '(') {
        depth++;
        current += char;
      } else if (char === ')') {
        depth--;
        current += char;
      } else if (char === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}
