import { formulaLibrary } from '../formula-library';

// Helper to flatten args (which may contain ranges or arrays of values)
export function flattenArgs(args: any[]): any[] {
  const result: any[] = [];
  args.forEach(arg => {
    if (Array.isArray(arg)) {
      result.push(...flattenArgs(arg));
    } else {
      result.push(arg);
    }
  });
  return result;
}

export function parseNumber(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

// Register SUM
formulaLibrary.register('SUM', (args) => {
  const flat = flattenArgs(args);
  return flat.reduce((sum, val) => sum + parseNumber(val), 0);
});

// Register AVERAGE
formulaLibrary.register('AVERAGE', (args) => {
  const flat = flattenArgs(args);
  if (flat.length === 0) return 0;
  const sum = flat.reduce((acc, val) => acc + parseNumber(val), 0);
  return sum / flat.length;
});

// Register COUNT
formulaLibrary.register('COUNT', (args) => {
  const flat = flattenArgs(args);
  return flat.filter(val => {
    if (typeof val === 'number') return true;
    if (typeof val === 'string') {
      return !isNaN(parseFloat(val)) && isFinite(Number(val));
    }
    return false;
  }).length;
});

// Register MIN
formulaLibrary.register('MIN', (args) => {
  const flat = flattenArgs(args);
  if (flat.length === 0) return 0;
  return Math.min(...flat.map(parseNumber));
});

// Register MAX
formulaLibrary.register('MAX', (args) => {
  const flat = flattenArgs(args);
  if (flat.length === 0) return 0;
  return Math.max(...flat.map(parseNumber));
});
