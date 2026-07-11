import { CellData } from '../../types';
import { Token, tokenize, shuntingYard, expandRange } from '../formula-parser';
import { formulaLibrary } from '../formula-library';
import { FormulaError } from '../formula-errors';

// Helper to get raw cell values or compute them recursively
export function getCellValue(
  cellKey: string,
  cells: Record<string, CellData>,
  evaluatingCells: Set<string> = new Set()
): any {
  if (evaluatingCells.has(cellKey)) {
    return FormulaError.CIRC; // Circular reference
  }

  const cell = cells[cellKey];
  if (!cell) return ''; // Empty cell is blank

  // If already computed, return cache
  if (cell.computed !== undefined) {
    return cell.computed;
  }

  // Evaluate lazily if formula
  if (cell.value.startsWith('=')) {
    evaluatingCells.add(cellKey);
    const result = evaluateFormula(cell.value, cells, evaluatingCells);
    evaluatingCells.delete(cellKey);
    return result;
  }

  // Parse plain number
  const val = cell.value;
  if (val === '') return '';
  
  if (val.toUpperCase() === 'TRUE') return true;
  if (val.toUpperCase() === 'FALSE') return false;

  const num = Number(val);
  return isNaN(num) ? val : num;
}

// Helper to parse arguments to float
function parseToFloat(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error('VALUE');
    return num;
  }
  if (typeof val === 'boolean') {
    return val ? 1 : 0;
  }
  throw new Error('VALUE');
}

// Master evaluation function for a formula string
export function evaluateFormula(
  formula: string,
  cells: Record<string, CellData>,
  evaluatingCells: Set<string> = new Set()
): any {
  if (!formula.startsWith('=')) {
    const num = Number(formula);
    return isNaN(num) ? formula : num;
  }

  try {
    const tokens = tokenize(formula);
    const postfix = shuntingYard(tokens);
    const stack: any[] = [];

    for (let i = 0; i < postfix.length; i++) {
      const token = postfix[i];

      switch (token.type) {
        case 'NUMBER':
          stack.push(Number(token.value));
          break;

        case 'STRING':
          stack.push(token.value);
          break;

        case 'REF': {
          const val = getCellValue(token.value, cells, evaluatingCells);
          if (Object.values(FormulaError).includes(val)) {
            return val; // Bubble up error
          }
          stack.push(val);
          break;
        }

        case 'RANGE': {
          // Resolve range cell values
          const rangeCells = expandRange(token.value);
          const values = rangeCells.map(c => {
            const val = getCellValue(c, cells, evaluatingCells);
            return val;
          });
          
          // Check circular reference in cells
          if (values.includes(FormulaError.CIRC)) {
            return FormulaError.CIRC;
          }
          stack.push(values);
          break;
        }

        case 'OPERATOR': {
          const op = token.value;
          
          // Percent operator is unary postfix
          if (op === '%') {
            const val = stack.pop();
            try {
              stack.push(parseToFloat(val) / 100);
            } catch {
              return FormulaError.VALUE;
            }
            break;
          }

          // Binary operators
          const right = stack.pop();
          const left = stack.pop();

          // Bubble up errors
          if (Object.values(FormulaError).includes(left)) return left;
          if (Object.values(FormulaError).includes(right)) return right;

          try {
            switch (op) {
              case '+':
                stack.push(parseToFloat(left) + parseToFloat(right));
                break;
              case '-':
                stack.push(parseToFloat(left) - parseToFloat(right));
                break;
              case '*':
                stack.push(parseToFloat(left) * parseToFloat(right));
                break;
              case '/': {
                const rNum = parseToFloat(right);
                if (rNum === 0) return FormulaError.DIV0;
                stack.push(parseToFloat(left) / rNum);
                break;
              }
              case '^':
                stack.push(Math.pow(parseToFloat(left), parseToFloat(right)));
                break;

              // Comparisons
              case '=':
                stack.push(left === right);
                break;
              case '<>':
                stack.push(left !== right);
                break;
              case '<':
                stack.push(left < right);
                break;
              case '>':
                stack.push(left > right);
                break;
              case '<=':
                stack.push(left <= right);
                break;
              case '>=':
                stack.push(left >= right);
                break;
              default:
                return FormulaError.VALUE;
            }
          } catch {
            return FormulaError.VALUE;
          }
          break;
        }

        case 'FUNCTION': {
          const [funcName, argCountStr] = token.value.split(':');
          const argCount = parseInt(argCountStr, 10);
          const args: any[] = [];
          
          for (let j = 0; j < argCount; j++) {
            args.push(stack.pop());
          }
          args.reverse(); // Stack pops arguments in reverse order!

          // Bubble up errors in arguments
          for (const arg of args) {
            if (Object.values(FormulaError).includes(arg)) return arg;
          }

          if (formulaLibrary.has(funcName)) {
            try {
              const fn = formulaLibrary.get(funcName)!;
              const res = fn(args, cells);
              stack.push(res);
            } catch (err: any) {
              if (Object.values(FormulaError).includes(err.message)) {
                return err.message;
              }
              return FormulaError.NUM;
            }
          } else {
            return FormulaError.NAME; // Function name not found
          }
          break;
        }

        default:
          break;
      }
    }

    if (stack.length === 1) {
      const finalRes = stack[0];
      if (finalRes === Infinity || finalRes === -Infinity || (typeof finalRes === 'number' && isNaN(finalRes))) {
        return FormulaError.NUM;
      }
      return finalRes;
    }
    return FormulaError.VALUE;
  } catch {
    return FormulaError.VALUE;
  }
}
