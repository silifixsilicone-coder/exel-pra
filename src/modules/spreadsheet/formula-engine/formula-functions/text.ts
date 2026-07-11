import { formulaLibrary } from '../formula-library';
import { FormulaError } from '../formula-errors';
import { flattenArgs } from './math';

// LEFT
formulaLibrary.register('LEFT', (args) => {
  const str = String(args[0] || '');
  const num = args[1] !== undefined ? Math.max(0, parseInt(args[1], 10)) : 1;
  return str.substring(0, num);
});

// RIGHT
formulaLibrary.register('RIGHT', (args) => {
  const str = String(args[0] || '');
  const num = args[1] !== undefined ? Math.max(0, parseInt(args[1], 10)) : 1;
  return str.substring(str.length - num);
});

// MID
formulaLibrary.register('MID', (args) => {
  const str = String(args[0] || '');
  const start = args[1] !== undefined ? Math.max(1, parseInt(args[1], 10)) - 1 : 0; // Excel is 1-indexed
  const length = args[2] !== undefined ? Math.max(0, parseInt(args[2], 10)) : str.length;
  return str.substring(start, start + length);
});

// LEN
formulaLibrary.register('LEN', (args) => {
  const str = String(args[0] !== undefined ? args[0] : '');
  return str.length;
});

// CONCAT
formulaLibrary.register('CONCAT', (args) => {
  const flat = flattenArgs(args);
  return flat.map(arg => String(arg !== undefined ? arg : '')).join('');
});

// CONCATENATE
formulaLibrary.register('CONCATENATE', (args) => {
  const flat = flattenArgs(args);
  return flat.map(arg => String(arg !== undefined ? arg : '')).join('');
});

// TEXT
formulaLibrary.register('TEXT', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const val = Number(args[0]);
  const format = String(args[1]).toLowerCase();
  
  if (isNaN(val)) return String(args[0]);

  if (format.includes('%')) {
    return `${(val * 100).toFixed(2)}%`;
  }
  if (format.includes('$') || format.includes('currency')) {
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return val.toFixed(2);
});

// LOWER
formulaLibrary.register('LOWER', (args) => {
  const str = String(args[0] !== undefined ? args[0] : '');
  return str.toLowerCase();
});

// UPPER
formulaLibrary.register('UPPER', (args) => {
  const str = String(args[0] !== undefined ? args[0] : '');
  return str.toUpperCase();
});

// PROPER
formulaLibrary.register('PROPER', (args) => {
  const str = String(args[0] !== undefined ? args[0] : '');
  return str.replace(/\b\w/g, char => char.toUpperCase());
});

// TRIM
formulaLibrary.register('TRIM', (args) => {
  const str = String(args[0] !== undefined ? args[0] : '');
  // Removes leading/trailing spaces and shrinks internal multiple spaces to a single space
  return str.trim().replace(/\s+/g, ' ');
});
