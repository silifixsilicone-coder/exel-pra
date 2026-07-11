import { formulaLibrary } from '../formula-library';

// Register VLOOKUP
formulaLibrary.register('VLOOKUP', (args, cells) => {
  const lookupValue = String(args[0] || '').toLowerCase();
  const rangeStr = String(args[1] || ''); // e.g. "A4:D6"
  const colIndex = parseInt(args[2], 10) - 1; // 1-indexed in Excel
  const exactMatch = args[3] !== undefined ? !args[3] : true; // default true

  // Parse range
  const parts = rangeStr.split(':');
  if (parts.length < 2) return '#REF!';
  
  const startMatch = parts[0].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  const endMatch = parts[1].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!startMatch || !endMatch) return '#REF!';

  // Helper to convert column letters to numbers
  const colLetterToNum = (letter: string) => {
    let num = 0;
    for (let i = 0; i < letter.length; i++) {
      num = num * 26 + (letter.charCodeAt(i) - 64);
    }
    return num;
  };
  const numToColLetter = (num: number) => {
    let temp = num;
    let letter = '';
    while (temp > 0) {
      let modulo = (temp - 1) % 26;
      letter = String.fromCharCode(65 + modulo) + letter;
      temp = Math.floor((temp - modulo) / 26);
    }
    return letter;
  };

  const startCol = colLetterToNum(startMatch[1]);
  const endCol = colLetterToNum(endMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);

  // Search row-by-row
  for (let r = startRow; r <= endRow; r++) {
    // Left-most column is startCol
    const leftCellKey = numToColLetter(startCol) + r;
    const cellValue = String(cells[leftCellKey]?.computed ?? cells[leftCellKey]?.value ?? '').toLowerCase();

    if (cellValue === lookupValue) {
      const targetColNum = startCol + colIndex;
      if (targetColNum > endCol) return '#REF!';
      const targetCellKey = numToColLetter(targetColNum) + r;
      return cells[targetCellKey]?.computed ?? cells[targetCellKey]?.value ?? '';
    }
  }

  return '#N/A';
});

// Register MATCH
formulaLibrary.register('MATCH', (args, cells) => {
  const lookupValue = String(args[0] || '').toLowerCase();
  const rangeStr = String(args[1] || ''); // e.g. "A4:A6" or "A4:C4"
  
  const parts = rangeStr.split(':');
  if (parts.length < 2) return '#REF!';
  
  const startMatch = parts[0].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  const endMatch = parts[1].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!startMatch || !endMatch) return '#REF!';

  const colLetterToNum = (letter: string) => {
    let num = 0;
    for (let i = 0; i < letter.length; i++) {
      num = num * 26 + (letter.charCodeAt(i) - 64);
    }
    return num;
  };
  const numToColLetter = (num: number) => {
    let temp = num;
    let letter = '';
    while (temp > 0) {
      let modulo = (temp - 1) % 26;
      letter = String.fromCharCode(65 + modulo) + letter;
      temp = Math.floor((temp - modulo) / 26);
    }
    return letter;
  };

  const startCol = colLetterToNum(startMatch[1]);
  const endCol = colLetterToNum(endMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);

  let index = 1;
  if (startCol === endCol) {
    // Vertical lookup range
    for (let r = startRow; r <= endRow; r++) {
      const cellKey = numToColLetter(startCol) + r;
      const cellValue = String(cells[cellKey]?.computed ?? cells[cellKey]?.value ?? '').toLowerCase();
      if (cellValue === lookupValue) return index;
      index++;
    }
  } else if (startRow === endRow) {
    // Horizontal lookup range
    for (let c = startCol; c <= endCol; c++) {
      const cellKey = numToColLetter(c) + startRow;
      const cellValue = String(cells[cellKey]?.computed ?? cells[cellKey]?.value ?? '').toLowerCase();
      if (cellValue === lookupValue) return index;
      index++;
    }
  }

  return '#N/A';
});

// Register INDEX
formulaLibrary.register('INDEX', (args, cells) => {
  const rangeStr = String(args[0] || ''); // e.g. "A4:D6"
  const rowOffset = parseInt(args[1], 10); // 1-indexed
  const colOffset = args[2] !== undefined ? parseInt(args[2], 10) : 1; // 1-indexed

  const parts = rangeStr.split(':');
  if (parts.length < 2) return '#REF!';
  
  const startMatch = parts[0].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  const endMatch = parts[1].toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!startMatch || !endMatch) return '#REF!';

  const colLetterToNum = (letter: string) => {
    let num = 0;
    for (let i = 0; i < letter.length; i++) {
      num = num * 26 + (letter.charCodeAt(i) - 64);
    }
    return num;
  };
  const numToColLetter = (num: number) => {
    let temp = num;
    let letter = '';
    while (temp > 0) {
      let modulo = (temp - 1) % 26;
      letter = String.fromCharCode(65 + modulo) + letter;
      temp = Math.floor((temp - modulo) / 26);
    }
    return letter;
  };

  const startCol = colLetterToNum(startMatch[1]);
  const endCol = colLetterToNum(endMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);

  const targetRow = startRow + rowOffset - 1;
  const targetCol = startCol + colOffset - 1;

  if (targetRow > endRow || targetCol > endCol) return '#REF!';

  const cellKey = numToColLetter(targetCol) + targetRow;
  return cells[cellKey]?.computed ?? cells[cellKey]?.value ?? '';
});
