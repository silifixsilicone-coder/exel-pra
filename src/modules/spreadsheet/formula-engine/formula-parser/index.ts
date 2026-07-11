import { CellData } from '../../types';
import { colLetterToNumber, colNumberToLetter } from '../../utils/gridUtils';

export type TokenType = 
  | 'NUMBER' 
  | 'STRING' 
  | 'REF' 
  | 'RANGE' 
  | 'FUNCTION' 
  | 'OPERATOR' 
  | 'PAREN' 
  | 'SEPARATOR';

export interface Token {
  type: TokenType;
  value: string;
}

// Operator precedence definition
export const PRECEDENCE: Record<string, number> = {
  '=': 1, '<>': 1, '<': 1, '>': 1, '<=': 1, '>=': 1,
  '+': 2, '-': 2,
  '*': 3, '/': 3,
  '^': 4,
  '%': 5
};

// Tokenizes a formula string
export function tokenize(formula: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  // Strip starting '='
  const clean = formula.startsWith('=') ? formula.substring(1) : formula;

  while (i < clean.length) {
    const char = clean[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // 1. Double character comparison operators
    if (i < clean.length - 1) {
      const nextTwo = clean.substring(i, i + 2);
      if (nextTwo === '<>' || nextTwo === '<=' || nextTwo === '>=') {
        tokens.push({ type: 'OPERATOR', value: nextTwo });
        i += 2;
        continue;
      }
    }

    // 2. Single character operators
    if (['+', '-', '*', '/', '^', '%', '=', '<', '>'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // 3. Parentheses
    if (char === '(' || char === ')') {
      tokens.push({ type: 'PAREN', value: char });
      i++;
      continue;
    }

    // 4. Argument separator
    if (char === ',') {
      tokens.push({ type: 'SEPARATOR', value: char });
      i++;
      continue;
    }

    // 5. String literal
    if (char === '"') {
      let str = '';
      i++; // Skip opening quote
      while (i < clean.length && clean[i] !== '"') {
        str += clean[i];
        i++;
      }
      i++; // Skip closing quote
      tokens.push({ type: 'STRING', value: str });
      continue;
    }

    // 6. Number literal
    if (/[0-9.]/.test(char)) {
      let num = '';
      while (i < clean.length && /[0-9.]/.test(clean[i])) {
        num += clean[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // 7. References, Ranges, or Functions
    if (/[A-Za-z]/.test(char)) {
      let identifier = '';
      while (i < clean.length && /[A-Za-z0-9_.:]/.test(clean[i])) {
        identifier += clean[i];
        i++;
      }

      // Check if it's a range (contains ':')
      if (identifier.includes(':')) {
        tokens.push({ type: 'RANGE', value: identifier.toUpperCase() });
      } 
      // Check if it's followed by '(' -> function
      else if (i < clean.length && clean[i] === '(') {
        tokens.push({ type: 'FUNCTION', value: identifier.toUpperCase() });
      } 
      // Check if it's a cell reference (e.g. A1, AA12)
      else if (/^[A-Z]+[0-9]+$/i.test(identifier)) {
        tokens.push({ type: 'REF', value: identifier.toUpperCase() });
      } 
      // Boolean literal or fallback
      else if (identifier.toUpperCase() === 'TRUE' || identifier.toUpperCase() === 'FALSE') {
        tokens.push({ type: 'STRING', value: identifier.toUpperCase() });
      } else {
        tokens.push({ type: 'STRING', value: identifier });
      }
      continue;
    }

    // Fallback error token
    tokens.push({ type: 'STRING', value: char });
    i++;
  }

  return tokens;
}

// Convert infix tokens to postfix (RPN) using Shunting-Yard
export function shuntingYard(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];
  const argCounts: number[] = []; // Tracks function arguments count

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case 'NUMBER':
      case 'STRING':
      case 'REF':
      case 'RANGE':
        outputQueue.push(token);
        break;

      case 'FUNCTION':
        operatorStack.push(token);
        argCounts.push(1); // Start counting arguments
        break;

      case 'SEPARATOR':
        // Resolve arguments inside function
        while (
          operatorStack.length > 0 && 
          operatorStack[operatorStack.length - 1].value !== '('
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        if (argCounts.length > 0) {
          argCounts[argCounts.length - 1]++;
        }
        break;

      case 'OPERATOR': {
        const o1 = token.value;
        let top = operatorStack[operatorStack.length - 1];
        
        while (
          top &&
          top.type === 'OPERATOR' &&
          (PRECEDENCE[top.value] > PRECEDENCE[o1] ||
            (PRECEDENCE[top.value] === PRECEDENCE[o1] && o1 !== '^'))
        ) {
          outputQueue.push(operatorStack.pop()!);
          top = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(token);
        break;
      }

      case 'PAREN':
        if (token.value === '(') {
          operatorStack.push(token);
        } else {
          // Right parenthesis ')'
          while (
            operatorStack.length > 0 && 
            operatorStack[operatorStack.length - 1].value !== '('
          ) {
            outputQueue.push(operatorStack.pop()!);
          }
          if (operatorStack.length === 0) {
            throw new Error('Mismatched parentheses');
          }
          operatorStack.pop(); // Pop '('

          // If top is function, pop it to output with its argument count!
          const top = operatorStack[operatorStack.length - 1];
          if (top && top.type === 'FUNCTION') {
            const funcToken = operatorStack.pop()!;
            const count = argCounts.pop() || 0;
            // Append argument count to function value for evaluation
            outputQueue.push({
              type: 'FUNCTION',
              value: `${funcToken.value}:${count}`
            });
          }
        }
        break;
      default:
        break;
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.value === '(' || top.value === ')') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

// Helper to expand range string "A1:B3" to individual cell keys
export function expandRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length < 2) return [rangeStr];
  
  const startMatch = parts[0].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  const endMatch = parts[1].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!startMatch || !endMatch) return [rangeStr];

  const startCol = colLetterToNumber(startMatch[1]);
  const endCol = colLetterToNumber(endMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);

  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);

  const cells: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push(`${colNumberToLetter(c)}${r}`);
    }
  }
  return cells;
}

// Extracts cell keys that a formula references (used for dependency tree tracking)
export function getDependencies(formula: string): string[] {
  if (!formula.startsWith('=')) return [];
  
  try {
    const tokens = tokenize(formula);
    const deps = new Set<string>();

    tokens.forEach(tok => {
      if (tok.type === 'REF') {
        deps.add(tok.value);
      } else if (tok.type === 'RANGE') {
        expandRange(tok.value).forEach(c => deps.add(c));
      }
    });

    return Array.from(deps);
  } catch {
    return [];
  }
}
