import { formulaLibrary } from '../formula-library';
import { FormulaError, isFormulaError } from '../formula-errors';

// IF
formulaLibrary.register('IF', (args) => {
  const condition = args[0];
  const trueVal = args[1];
  const falseVal = args[2] !== undefined ? args[2] : false;
  return condition ? trueVal : falseVal;
});

// AND
formulaLibrary.register('AND', (args) => {
  if (args.length === 0) return false;
  return args.every(arg => !!arg);
});

// OR
formulaLibrary.register('OR', (args) => {
  if (args.length === 0) return false;
  return args.some(arg => !!arg);
});

// NOT
formulaLibrary.register('NOT', (args) => {
  return !args[0];
});

// IFERROR
formulaLibrary.register('IFERROR', (args) => {
  if (args.length < 2) return args[0];
  const val = args[0];
  if (isFormulaError(val)) {
    return args[1];
  }
  return val;
});

// ISNUMBER
formulaLibrary.register('ISNUMBER', (args) => {
  if (args.length === 0) return false;
  const val = args[0];
  return typeof val === 'number' && !isNaN(val);
});

// ISTEXT
formulaLibrary.register('ISTEXT', (args) => {
  if (args.length === 0) return false;
  const val = args[0];
  return typeof val === 'string' && isNaN(Number(val));
});

// ISBLANK
formulaLibrary.register('ISBLANK', (args) => {
  if (args.length === 0) return true;
  const val = args[0];
  return val === '' || val === undefined || val === null;
});
