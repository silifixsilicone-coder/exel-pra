import { formulaLibrary } from '../formula-library';
import { FormulaError } from '../formula-errors';

// Helper to flatten args (which may contain ranges or arrays of values)
export function flattenArgs(args: any[]): any[] {
  const result: any[] = [];
  args.forEach(arg => {
    if (Array.isArray(arg)) {
      result.push(...flattenArgs(arg));
    } else if (arg !== null && arg !== undefined) {
      result.push(arg);
    }
  });
  return result;
}

export function parseNumber(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error(FormulaError.VALUE);
    return num;
  }
  if (typeof val === 'boolean') return val ? 1 : 0;
  throw new Error(FormulaError.VALUE);
}

// SUM
formulaLibrary.register('SUM', (args) => {
  const flat = flattenArgs(args);
  return flat.reduce((sum, val) => sum + parseNumber(val), 0);
});

// AVERAGE
formulaLibrary.register('AVERAGE', (args) => {
  const flat = flattenArgs(args);
  if (flat.length === 0) return 0;
  const sum = flat.reduce((acc, val) => acc + parseNumber(val), 0);
  return sum / flat.length;
});

// COUNT
formulaLibrary.register('COUNT', (args) => {
  const flat = flattenArgs(args);
  return flat.filter(val => {
    if (typeof val === 'number') return true;
    if (typeof val === 'string') {
      return !isNaN(parseFloat(val)) && isFinite(Number(val));
    }
    return typeof val === 'boolean';
  }).length;
});

// COUNTA
formulaLibrary.register('COUNTA', (args) => {
  const flat = flattenArgs(args);
  return flat.filter(val => val !== '').length;
});

// MIN
formulaLibrary.register('MIN', (args) => {
  const flat = flattenArgs(args);
  if (flat.length === 0) return 0;
  return Math.min(...flat.map(parseNumber));
});

// MAX
formulaLibrary.register('MAX', (args) => {
  const flat = flattenArgs(args);
  if (flat.length === 0) return 0;
  return Math.max(...flat.map(parseNumber));
});

// ABS
formulaLibrary.register('ABS', (args) => {
  if (args.length === 0) throw new Error(FormulaError.VALUE);
  return Math.abs(parseNumber(args[0]));
});

// ROUND
formulaLibrary.register('ROUND', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const num = parseNumber(args[0]);
  const decimals = parseNumber(args[1]);
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
});

// ROUNDUP
formulaLibrary.register('ROUNDUP', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const num = parseNumber(args[0]);
  const decimals = parseNumber(args[1]);
  const factor = Math.pow(10, decimals);
  const sign = num >= 0 ? 1 : -1;
  return (sign * Math.ceil(Math.abs(num) * factor)) / factor;
});

// ROUNDDOWN
formulaLibrary.register('ROUNDDOWN', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const num = parseNumber(args[0]);
  const decimals = parseNumber(args[1]);
  const factor = Math.pow(10, decimals);
  const sign = num >= 0 ? 1 : -1;
  return (sign * Math.floor(Math.abs(num) * factor)) / factor;
});

// POWER
formulaLibrary.register('POWER', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const base = parseNumber(args[0]);
  const exponent = parseNumber(args[1]);
  const res = Math.pow(base, exponent);
  if (isNaN(res) || !isFinite(res)) throw new Error(FormulaError.NUM);
  return res;
});

// SQRT
formulaLibrary.register('SQRT', (args) => {
  if (args.length === 0) throw new Error(FormulaError.VALUE);
  const num = parseNumber(args[0]);
  if (num < 0) throw new Error(FormulaError.NUM);
  return Math.sqrt(num);
});
