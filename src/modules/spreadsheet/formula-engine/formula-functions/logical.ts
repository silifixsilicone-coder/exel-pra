import { formulaLibrary } from '../formula-library';

// Register IF
formulaLibrary.register('IF', (args) => {
  const condition = args[0];
  const trueVal = args[1];
  const falseVal = args[2] !== undefined ? args[2] : false;
  return condition ? trueVal : falseVal;
});

// Register AND
formulaLibrary.register('AND', (args) => {
  if (args.length === 0) return false;
  return args.every(arg => !!arg);
});

// Register OR
formulaLibrary.register('OR', (args) => {
  if (args.length === 0) return false;
  return args.some(arg => !!arg);
});

// Register NOT
formulaLibrary.register('NOT', (args) => {
  return !args[0];
});
