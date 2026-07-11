import { FormulaGuide } from '../types';

export const formulasData: FormulaGuide[] = [
  {
    name: 'SUM',
    category: 'Math Functions',
    syntax: 'SUM(number1, [number2], ...)',
    description: 'Adds all the numbers in a range of cells.',
    example: '=SUM(A1:A5)',
    explanation: 'Adds the values of cells A1 through A5.'
  },
  {
    name: 'AVERAGE',
    category: 'Math Functions',
    syntax: 'AVERAGE(number1, [number2], ...)',
    description: 'Calculates the arithmetic mean of a group of values.',
    example: '=AVERAGE(B1:B10)',
    explanation: 'Returns the average value of cells B1 through B10.'
  },
  {
    name: 'COUNT',
    category: 'Math Functions',
    syntax: 'COUNT(value1, [value2], ...)',
    description: 'Counts the number of cells that contain numbers.',
    example: '=COUNT(C1:C20)',
    explanation: 'Returns the count of numerical values present in cells C1 through C20.'
  },
  {
    name: 'MAX',
    category: 'Math Functions',
    syntax: 'MAX(number1, [number2], ...)',
    description: 'Returns the largest value in a set of values.',
    example: '=MAX(D1:D10)',
    explanation: 'Finds the highest value in the range D1 to D10.'
  },
  {
    name: 'MIN',
    category: 'Math Functions',
    syntax: 'MIN(number1, [number2], ...)',
    description: 'Returns the smallest value in a set of values.',
    example: '=MIN(D1:D10)',
    explanation: 'Finds the lowest value in the range D1 to D10.'
  },
  {
    name: 'IF',
    category: 'Logical Functions',
    syntax: 'IF(logical_test, value_if_true, [value_if_false])',
    description: 'Checks if a condition is met and returns one value if TRUE, and another if FALSE.',
    example: '=IF(E1>=50, "Pass", "Fail")',
    explanation: 'Checks if E1 is greater than or equal to 50. If true, returns "Pass"; otherwise, returns "Fail".'
  },
  {
    name: 'AND',
    category: 'Logical Functions',
    syntax: 'AND(logical1, [logical2], ...)',
    description: 'Returns TRUE if all its arguments are TRUE.',
    example: '=AND(A1>0, B1<100)',
    explanation: 'Checks if A1 is positive and B1 is less than 100. Returns TRUE if both conditions are met.'
  },
  {
    name: 'OR',
    category: 'Logical Functions',
    syntax: 'OR(logical1, [logical2], ...)',
    description: 'Returns TRUE if any argument is TRUE.',
    example: '=OR(A1>10, B1>10)',
    explanation: 'Returns TRUE if either A1 is greater than 10 or B1 is greater than 10.'
  },
  {
    name: 'CONCAT',
    category: 'Text Functions',
    syntax: 'CONCAT(text1, [text2], ...)',
    description: 'Combines the text from multiple ranges and/or strings.',
    example: '=CONCAT(A1, " ", B1)',
    explanation: 'Merges the text in A1 and B1 with a space in between.'
  },
  {
    name: 'LEFT',
    category: 'Text Functions',
    syntax: 'LEFT(text, [num_chars])',
    description: 'Returns the specified number of characters from the start of a text string.',
    example: '=LEFT(A1, 3)',
    explanation: 'Extracts the first 3 characters from cell A1.'
  },
  {
    name: 'RIGHT',
    category: 'Text Functions',
    syntax: 'RIGHT(text, [num_chars])',
    description: 'Returns the specified number of characters from the end of a text string.',
    example: '=RIGHT(A1, 4)',
    explanation: 'Extracts the last 4 characters from cell A1.'
  },
  {
    name: 'MID',
    category: 'Text Functions',
    syntax: 'MID(text, start_num, num_chars)',
    description: 'Returns characters from the middle of a text string, given a starting position and length.',
    example: '=MID(A1, 2, 5)',
    explanation: 'Extracts 5 characters from A1 starting at the second character.'
  },
  {
    name: 'UPPER',
    category: 'Text Functions',
    syntax: 'UPPER(text)',
    description: 'Converts text to all uppercase letters.',
    example: '=UPPER(A1)',
    explanation: 'Converts the content of cell A1 to UPPERCASE.'
  },
  {
    name: 'LOWER',
    category: 'Text Functions',
    syntax: 'LOWER(text)',
    description: 'Converts text to all lowercase letters.',
    example: '=LOWER(A1)',
    explanation: 'Converts the content of cell A1 to lowercase.'
  },
  {
    name: 'VLOOKUP',
    category: 'Lookup Functions',
    syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Searches for a value in the first column of a table array and returns a value in the same row from another column.',
    example: '=VLOOKUP("ID001", A1:D10, 3, FALSE)',
    explanation: 'Finds "ID001" in the first column of range A1:D10 and returns the value in the 3rd column of the matching row (exact match).'
  },
  {
    name: 'HLOOKUP',
    category: 'Lookup Functions',
    syntax: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    description: 'Searches for a value in the top row of a table or array of values and returns a value in the same column from a row you specify.',
    example: '=HLOOKUP("Sales", A1:Z5, 2, FALSE)',
    explanation: 'Looks for "Sales" in row 1, and returns the value from row 2 in the same column.'
  },
  {
    name: 'INDEX',
    category: 'Lookup Functions',
    syntax: 'INDEX(array, row_num, [column_num])',
    description: 'Returns a value or reference of the cell at the intersection of a particular row and column in a given range.',
    example: '=INDEX(A1:C5, 2, 3)',
    explanation: 'Returns the value of the cell at row 2, column 3 in range A1:C5.'
  },
  {
    name: 'MATCH',
    category: 'Lookup Functions',
    syntax: 'MATCH(lookup_value, lookup_array, [match_type])',
    description: 'Searches for a specified item in a range of cells, and then returns the relative position of that item in the range.',
    example: '=MATCH("John", A1:A10, 0)',
    explanation: 'Finds the exact match of "John" in A1:A10 and returns its 1-based relative index.'
  },
  {
    name: 'COUNTIF',
    category: 'Logical Functions',
    syntax: 'COUNTIF(range, criteria)',
    description: 'Counts the number of cells within a range that meet a single criteria.',
    example: '=COUNTIF(A1:A10, ">50")',
    explanation: 'Counts how many cells in range A1:A10 contain values greater than 50.'
  },
  {
    name: 'SUMIF',
    category: 'Math Functions',
    syntax: 'SUMIF(range, criteria, [sum_range])',
    description: 'Sums the cells specified by a given criteria.',
    example: '=SUMIF(A1:A10, "Sales", B1:B10)',
    explanation: 'Sums values in B1:B10 where the corresponding cells in A1:A10 equal "Sales".'
  }
];
