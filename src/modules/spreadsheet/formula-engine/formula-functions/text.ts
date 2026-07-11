import { formulaLibrary } from '../formula-library';

// Register LEFT
formulaLibrary.register('LEFT', (args) => {
  const str = String(args[0] || '');
  const num = args[1] !== undefined ? parseInt(args[1], 10) : 1;
  return str.substring(0, num);
});

// Register RIGHT
formulaLibrary.register('RIGHT', (args) => {
  const str = String(args[0] || '');
  const num = args[1] !== undefined ? parseInt(args[1], 10) : 1;
  return str.substring(str.length - num);
});

// Register MID
formulaLibrary.register('MID', (args) => {
  const str = String(args[0] || '');
  const start = args[1] !== undefined ? parseInt(args[1], 10) - 1 : 0; // Excel is 1-indexed
  const length = args[2] !== undefined ? parseInt(args[2], 10) : str.length;
  return str.substring(start, start + length);
});

// Register LEN
formulaLibrary.register('LEN', (args) => {
  const str = String(args[0] || '');
  return str.length;
});

// Register CONCAT
formulaLibrary.register('CONCAT', (args) => {
  return args.map(arg => String(arg || '')).join('');
});
