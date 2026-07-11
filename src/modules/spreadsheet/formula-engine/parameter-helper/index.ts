export interface ActiveParameterInfo {
  functionName: string;
  parameterIndex: number;
}

/**
 * Parses the active function name and active parameter index from the text value and cursor position.
 * Example: "=IF(A1 > 10, " -> returns { functionName: 'IF', parameterIndex: 1 }
 */
export function getActiveParameter(val: string, cursorIdx: number): ActiveParameterInfo | null {
  if (!val.startsWith('=')) return null;
  const sub = val.substring(0, cursorIdx);

  let balance = 0;
  let argsStartIdx = -1;
  let functionName = '';

  // Scan backward to find the innermost unclosed parenthesis
  for (let i = sub.length - 1; i >= 0; i--) {
    const char = sub[i];
    if (char === ')') {
      balance++;
    } else if (char === '(') {
      if (balance === 0) {
        argsStartIdx = i;
        // Extract function name preceding '('
        const nameMatch = sub.substring(0, i).match(/([A-Z0-9_]+)$/i);
        if (nameMatch) {
          functionName = nameMatch[1].toUpperCase();
        }
        break;
      } else {
        balance--;
      }
    }
  }

  if (argsStartIdx === -1 || !functionName) {
    return null;
  }

  // Count commas after argsStartIdx that are not in nested parenthesis or string quotes
  let nestedParenCount = 0;
  let inDoubleQuotes = false;
  let inSingleQuotes = false;
  let parameterIndex = 0;

  for (let i = argsStartIdx + 1; i < sub.length; i++) {
    const char = sub[i];

    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
    } else if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
    } else if (!inDoubleQuotes && !inSingleQuotes) {
      if (char === '(') {
        nestedParenCount++;
      } else if (char === ')') {
        nestedParenCount--;
      } else if (char === ',' && nestedParenCount === 0) {
        parameterIndex++;
      }
    }
  }

  return {
    functionName,
    parameterIndex
  };
}
