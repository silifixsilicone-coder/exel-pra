export interface FunctionMetadata {
  name: string;
  description: string;
  syntax: string;
  example: string;
}

export const functionSuggestions: FunctionMetadata[] = [
  {
    name: 'SUM',
    description: 'Adds all numbers in a range of cells or arguments.',
    syntax: 'SUM(number1, [number2], ...)',
    example: 'SUM(A1:A20)'
  },
  {
    name: 'SQRT',
    description: 'Returns a positive square root of a number.',
    syntax: 'SQRT(number)',
    example: 'SQRT(D4)'
  },
  {
    name: 'SUBTOTAL',
    description: 'Returns a subtotal in a list or database.',
    syntax: 'SUBTOTAL(function_num, ref1, [ref2], ...)',
    example: 'SUBTOTAL(9, A1:A10)'
  },
  {
    name: 'SORT',
    description: 'Sorts the contents of a range or array.',
    syntax: 'SORT(array, [sort_index], [sort_order], [by_col])',
    example: 'SORT(A1:B10, 1, 1)'
  },
  {
    name: 'SEARCH',
    description: 'Locates one text string within another text string (case-insensitive).',
    syntax: 'SEARCH(find_text, within_text, [start_num])',
    example: 'SEARCH("Pro", A4)'
  },
  {
    name: 'AVERAGE',
    description: 'Returns the average (arithmetic mean) of its arguments.',
    syntax: 'AVERAGE(number1, [number2], ...)',
    example: 'AVERAGE(B4:B6)'
  },
  {
    name: 'COUNT',
    description: 'Counts the number of cells that contain numbers.',
    syntax: 'COUNT(value1, [value2], ...)',
    example: 'COUNT(B4:C6)'
  },
  {
    name: 'COUNTA',
    description: 'Counts the number of cells that are not empty.',
    syntax: 'COUNTA(value1, [value2], ...)',
    example: 'COUNTA(A4:A10)'
  },
  {
    name: 'MIN',
    description: 'Returns the minimum value in a set of values.',
    syntax: 'MIN(number1, [number2], ...)',
    example: 'MIN(B4:B6)'
  },
  {
    name: 'MAX',
    description: 'Returns the maximum value in a set of values.',
    syntax: 'MAX(number1, [number2], ...)',
    example: 'MAX(B4:B6)'
  },
  {
    name: 'IF',
    description: 'Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE.',
    syntax: 'IF(logical_test, value_if_true, [value_if_false])',
    example: 'IF(D4>1000, "Bonus", "Standard")'
  },
  {
    name: 'AND',
    description: 'Returns TRUE if all its arguments are TRUE.',
    syntax: 'AND(logical1, [logical2], ...)',
    example: 'AND(B4>100, C4<50)'
  },
  {
    name: 'OR',
    description: 'Returns TRUE if any argument is TRUE.',
    syntax: 'OR(logical1, [logical2], ...)',
    example: 'OR(B4>100, C4>100)'
  },
  {
    name: 'NOT',
    description: 'Reverses the value of its argument.',
    syntax: 'NOT(logical)',
    example: 'NOT(B4>100)'
  },
  {
    name: 'ABS',
    description: 'Returns the absolute value of a number.',
    syntax: 'ABS(number)',
    example: 'ABS(-45)'
  },
  {
    name: 'ROUND',
    description: 'Rounds a number to a specified number of digits.',
    syntax: 'ROUND(number, num_digits)',
    example: 'ROUND(3.14159, 2)'
  },
  {
    name: 'ROUNDUP',
    description: 'Rounds a number up, away from zero.',
    syntax: 'ROUNDUP(number, num_digits)',
    example: 'ROUNDUP(3.14159, 2)'
  },
  {
    name: 'ROUNDDOWN',
    description: 'Rounds a number down, toward zero.',
    syntax: 'ROUNDDOWN(number, num_digits)',
    example: 'ROUNDDOWN(3.14159, 2)'
  },
  {
    name: 'POWER',
    description: 'Returns the result of a number raised to a power.',
    syntax: 'POWER(number, power)',
    example: 'POWER(5, 2)'
  },
  {
    name: 'TODAY',
    description: 'Returns the current date in YYYY-MM-DD format.',
    syntax: 'TODAY()',
    example: 'TODAY()'
  },
  {
    name: 'NOW',
    description: 'Returns the current date and time in YYYY-MM-DD HH:MM:SS format.',
    syntax: 'NOW()',
    example: 'NOW()'
  },
  {
    name: 'LEN',
    description: 'Returns the number of characters in a text string.',
    syntax: 'LEN(text)',
    example: 'LEN(A4)'
  },
  {
    name: 'LEFT',
    description: 'Returns the specified number of characters from the start of a text string.',
    syntax: 'LEFT(text, [num_chars])',
    example: 'LEFT(A4, 5)'
  },
  {
    name: 'RIGHT',
    description: 'Returns the specified number of characters from the end of a text string.',
    syntax: 'RIGHT(text, [num_chars])',
    example: 'RIGHT(A4, 5)'
  },
  {
    name: 'MID',
    description: 'Returns characters from the middle of a text string, given a starting position and length.',
    syntax: 'MID(text, start_num, num_chars)',
    example: 'MID(A4, 2, 4)'
  },
  {
    name: 'CONCAT',
    description: 'Concatenates a list or range of text strings.',
    syntax: 'CONCAT(text1, [text2], ...)',
    example: 'CONCAT("Pass Rate: ", B5, "%")'
  },
  {
    name: 'CONCATENATE',
    description: 'Joins several text items into one text item.',
    syntax: 'CONCATENATE(text1, [text2], ...)',
    example: 'CONCATENATE(A4, " - ", B4)'
  },
  {
    name: 'TEXT',
    description: 'Formats a number and converts it to text.',
    syntax: 'TEXT(value, format_text)',
    example: 'TEXT(C4, "$#,##0.00")'
  },
  {
    name: 'LOWER',
    description: 'Converts all letters in a text string to lowercase.',
    syntax: 'LOWER(text)',
    example: 'LOWER(A4)'
  },
  {
    name: 'UPPER',
    description: 'Converts text to uppercase.',
    syntax: 'UPPER(text)',
    example: 'UPPER(A4)'
  },
  {
    name: 'PROPER',
    description: 'Capitalizes the first letter in each word of a text value.',
    syntax: 'PROPER(text)',
    example: 'PROPER(A4)'
  },
  {
    name: 'TRIM',
    description: 'Removes all spaces from text except for single spaces between words.',
    syntax: 'TRIM(text)',
    example: 'TRIM("   Spaced   Out   ")'
  },
  {
    name: 'IFERROR',
    description: 'Returns a value you specify if a formula evaluates to an error; otherwise, returns the result of the formula.',
    syntax: 'IFERROR(value, value_if_error)',
    example: 'IFERROR(D4/B4, 0)'
  },
  {
    name: 'ISNUMBER',
    description: 'Returns TRUE if the value is a number.',
    syntax: 'ISNUMBER(value)',
    example: 'ISNUMBER(B4)'
  },
  {
    name: 'ISTEXT',
    description: 'Returns TRUE if the value is text.',
    syntax: 'ISTEXT(value)',
    example: 'ISTEXT(A4)'
  },
  {
    name: 'ISBLANK',
    description: 'Returns TRUE if the cell is empty.',
    syntax: 'ISBLANK(value)',
    example: 'ISBLANK(B9)'
  }
];
