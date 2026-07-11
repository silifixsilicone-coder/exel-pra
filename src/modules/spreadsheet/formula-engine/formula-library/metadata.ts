export interface ParameterInfo {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

export interface FunctionMetadata {
  name: string;
  category: string;
  description: string;
  syntax: string;
  parameters: ParameterInfo[];
  returnType: string;
  examples: string[];
  notes?: string;
  keywords: string[];
  aliases?: string[];
  relatedFunctions?: string[];
  commonMistakes?: string[];
}

export const functionDatabase: FunctionMetadata[] = [
  // Math
  {
    name: 'SUM',
    category: 'Math',
    description: 'Adds all numbers in a range of cells or arguments.',
    syntax: 'SUM(number1, [number2], ...)',
    parameters: [
      { name: 'number1', type: 'Number/Range', description: 'First number or cell range to add.' },
      { name: 'number2', type: 'Number/Range', description: 'Additional numbers or cell ranges to add.', optional: true }
    ],
    returnType: 'Number',
    examples: ['SUM(A1:A20)', 'SUM(B4, B6, C8)'],
    keywords: ['total', 'addition', 'add', 'sum', 'calculate', 'plus'],
    relatedFunctions: ['SUMIF', 'SUMIFS', 'SUBTOTAL', 'AVERAGE'],
    commonMistakes: ['Passing non-numeric values which are ignored, or having circular references.']
  },
  {
    name: 'SQRT',
    category: 'Math',
    description: 'Returns the positive square root of a number.',
    syntax: 'SQRT(number)',
    parameters: [
      { name: 'number', type: 'Number', description: 'The number for which you want the square root. Must be non-negative.' }
    ],
    returnType: 'Number',
    examples: ['SQRT(D4)', 'SQRT(144)'],
    keywords: ['root', 'square', 'radical', 'math'],
    relatedFunctions: ['POWER'],
    commonMistakes: ['Passing a negative number, which results in a #NUM! error.']
  },
  {
    name: 'ABS',
    category: 'Math',
    description: 'Returns the absolute value of a number (without its sign).',
    syntax: 'ABS(number)',
    parameters: [
      { name: 'number', type: 'Number', description: 'The real number of which you want the absolute value.' }
    ],
    returnType: 'Number',
    examples: ['ABS(-45)', 'ABS(D4)'],
    keywords: ['negative', 'positive', 'sign', 'distance', 'magnitude'],
    relatedFunctions: ['SIGN'],
    commonMistakes: ['Passing a non-numeric text string, which returns #VALUE!.']
  },
  {
    name: 'ROUND',
    category: 'Math',
    description: 'Rounds a number to a specified number of digits.',
    syntax: 'ROUND(number, num_digits)',
    parameters: [
      { name: 'number', type: 'Number', description: 'The number you want to round.' },
      { name: 'num_digits', type: 'Number', description: 'The number of digits to which you want to round.' }
    ],
    returnType: 'Number',
    examples: ['ROUND(3.14159, 2)', 'ROUND(A1, 0)'],
    keywords: ['round', 'decimal', 'precision', 'truncate'],
    relatedFunctions: ['ROUNDUP', 'ROUNDDOWN', 'INT'],
    commonMistakes: ['Using a negative num_digits mistakenly, which rounds to the left of the decimal point (e.g. tens, hundreds).']
  },
  {
    name: 'ROUNDUP',
    category: 'Math',
    description: 'Rounds a number up, away from zero, to a specified number of decimals.',
    syntax: 'ROUNDUP(number, num_digits)',
    parameters: [
      { name: 'number', type: 'Number', description: 'The number you want to round up.' },
      { name: 'num_digits', type: 'Number', description: 'The number of digits to which you want to round.' }
    ],
    returnType: 'Number',
    examples: ['ROUNDUP(3.14159, 2)', 'ROUNDUP(14.01, 0)'],
    keywords: ['up', 'ceil', 'ceiling', 'round'],
    relatedFunctions: ['ROUND', 'ROUNDDOWN'],
    commonMistakes: ['Assuming it rounds toward positive infinity; it rounds away from zero (negative numbers get more negative).']
  },
  {
    name: 'ROUNDDOWN',
    category: 'Math',
    description: 'Rounds a number down, toward zero, to a specified number of decimals.',
    syntax: 'ROUNDDOWN(number, num_digits)',
    parameters: [
      { name: 'number', type: 'Number', description: 'The number you want to round down.' },
      { name: 'num_digits', type: 'Number', description: 'The number of digits to which you want to round.' }
    ],
    returnType: 'Number',
    examples: ['ROUNDDOWN(3.14159, 2)', 'ROUNDDOWN(14.99, 0)'],
    keywords: ['down', 'floor', 'truncate', 'round'],
    relatedFunctions: ['ROUND', 'ROUNDUP'],
    commonMistakes: ['Assuming it rounds toward negative infinity; it rounds toward zero.']
  },
  {
    name: 'POWER',
    category: 'Math',
    description: 'Returns the result of a number raised to a power.',
    syntax: 'POWER(number, power)',
    parameters: [
      { name: 'number', type: 'Number', description: 'The base number.' },
      { name: 'power', type: 'Number', description: 'The exponent to which the base number is raised.' }
    ],
    returnType: 'Number',
    examples: ['POWER(5, 2)', 'POWER(A1, 3)'],
    keywords: ['exponent', 'pow', 'square', 'cube', 'raise'],
    relatedFunctions: ['SQRT'],
    commonMistakes: ['Entering arguments in the wrong order (e.g. power first).']
  },

  // Statistical
  {
    name: 'AVERAGE',
    category: 'Statistical',
    description: 'Returns the average (arithmetic mean) of its arguments.',
    syntax: 'AVERAGE(number1, [number2], ...)',
    parameters: [
      { name: 'number1', type: 'Number/Range', description: 'First number or cell range to average.' },
      { name: 'number2', type: 'Number/Range', description: 'Additional numbers or cell ranges to average.', optional: true }
    ],
    returnType: 'Number',
    examples: ['AVERAGE(B4:B6)', 'AVERAGE(A1, B2, C3)'],
    keywords: ['mean', 'average', 'middle', 'midpoint', 'div'],
    relatedFunctions: ['SUM', 'COUNT'],
    commonMistakes: ['Cells with text or empty cells are ignored, which changes the divisor count.']
  },
  {
    name: 'COUNT',
    category: 'Statistical',
    description: 'Counts the number of cells in a range that contain numbers.',
    syntax: 'COUNT(value1, [value2], ...)',
    parameters: [
      { name: 'value1', type: 'Any/Range', description: 'First item or cell range to count.' },
      { name: 'value2', type: 'Any/Range', description: 'Additional items or cell ranges to count.', optional: true }
    ],
    returnType: 'Number',
    examples: ['COUNT(B4:C6)', 'COUNT(A1:A10)'],
    keywords: ['numbers', 'numeric', 'quantity', 'tally', 'count'],
    relatedFunctions: ['COUNTA', 'COUNTBLANK'],
    commonMistakes: ['Expecting it to count text; COUNT only tallies numeric values. Use COUNTA for all non-empty cells.']
  },
  {
    name: 'COUNTA',
    category: 'Statistical',
    description: 'Counts the number of cells in a range that are not empty.',
    syntax: 'COUNTA(value1, [value2], ...)',
    parameters: [
      { name: 'value1', type: 'Any/Range', description: 'First item or cell range to count.' },
      { name: 'value2', type: 'Any/Range', description: 'Additional items or cell ranges to count.', optional: true }
    ],
    returnType: 'Number',
    examples: ['COUNTA(A4:A10)', 'COUNTA(B4, B6, C8)'],
    keywords: ['nonempty', 'filled', 'cells', 'tally', 'items'],
    relatedFunctions: ['COUNT', 'COUNTBLANK'],
    commonMistakes: ['Cells containing formula errors or empty spaces " " are counted because they are not empty.']
  },
  {
    name: 'MIN',
    category: 'Statistical',
    description: 'Returns the smallest (minimum) value in a set of values.',
    syntax: 'MIN(number1, [number2], ...)',
    parameters: [
      { name: 'number1', type: 'Number/Range', description: 'First value or range to compare.' },
      { name: 'number2', type: 'Number/Range', description: 'Additional values or ranges to compare.', optional: true }
    ],
    returnType: 'Number',
    examples: ['MIN(B4:B6)', 'MIN(A1:C10)'],
    keywords: ['minimum', 'lowest', 'smallest', 'least', 'min'],
    relatedFunctions: ['MAX', 'AVERAGE'],
    commonMistakes: ['Passing text ranges, which are ignored.']
  },
  {
    name: 'MAX',
    category: 'Statistical',
    description: 'Returns the largest (maximum) value in a set of values.',
    syntax: 'MAX(number1, [number2], ...)',
    parameters: [
      { name: 'number1', type: 'Number/Range', description: 'First value or range to compare.' },
      { name: 'number2', type: 'Number/Range', description: 'Additional values or ranges to compare.', optional: true }
    ],
    returnType: 'Number',
    examples: ['MAX(B4:B6)', 'MAX(A1:C10)'],
    keywords: ['maximum', 'highest', 'largest', 'greatest', 'max'],
    relatedFunctions: ['MIN', 'AVERAGE'],
    commonMistakes: ['Passing text ranges, which are ignored.']
  },

  // Logical
  {
    name: 'IF',
    category: 'Logical',
    description: 'Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE.',
    syntax: 'IF(logical_test, value_if_true, [value_if_false])',
    parameters: [
      { name: 'logical_test', type: 'Boolean', description: 'Any value or expression that can be evaluated to TRUE or FALSE.' },
      { name: 'value_if_true', type: 'Any', description: 'The value that you want returned if the condition is TRUE.' },
      { name: 'value_if_false', type: 'Any', description: 'The value that you want returned if the condition is FALSE.', optional: true }
    ],
    returnType: 'Any',
    examples: ['IF(D4>1000, "Bonus", "Standard")', 'IF(A1="", "Empty", "Filled")'],
    keywords: ['conditional', 'test', 'choice', 'decision', 'logical', 'branch'],
    relatedFunctions: ['AND', 'OR', 'IFERROR'],
    commonMistakes: ['Forgetting quotation marks around text return values, or nesting too many IFs.']
  },
  {
    name: 'AND',
    category: 'Logical',
    description: 'Returns TRUE if all of its arguments are TRUE; returns FALSE if one or more arguments are FALSE.',
    syntax: 'AND(logical1, [logical2], ...)',
    parameters: [
      { name: 'logical1', type: 'Boolean', description: 'First condition to evaluate.' },
      { name: 'logical2', type: 'Boolean', description: 'Additional conditions to evaluate.', optional: true }
    ],
    returnType: 'Boolean',
    examples: ['AND(B4>100, C4<50)', 'AND(A1=1, A2=2)'],
    keywords: ['all', 'intersection', 'logical', 'both', 'conjunction'],
    relatedFunctions: ['OR', 'NOT'],
    commonMistakes: ['Entering ranges directly in argument lists without comparison operators.']
  },
  {
    name: 'OR',
    category: 'Logical',
    description: 'Returns TRUE if any of its arguments are TRUE; returns FALSE if all arguments are FALSE.',
    syntax: 'OR(logical1, [logical2], ...)',
    parameters: [
      { name: 'logical1', type: 'Boolean', description: 'First condition to evaluate.' },
      { name: 'logical2', type: 'Boolean', description: 'Additional conditions to evaluate.', optional: true }
    ],
    returnType: 'Boolean',
    examples: ['OR(B4>100, C4>100)', 'OR(A1="Yes", B1="Yes")'],
    keywords: ['any', 'union', 'logical', 'either', 'disjunction'],
    relatedFunctions: ['AND', 'NOT'],
    commonMistakes: ['Confusing OR with AND logic in compound statements.']
  },
  {
    name: 'NOT',
    category: 'Logical',
    description: 'Reverses the value of its argument (TRUE to FALSE, or FALSE to TRUE).',
    syntax: 'NOT(logical)',
    parameters: [
      { name: 'logical', type: 'Boolean', description: 'A value or expression that evaluates to TRUE or FALSE.' }
    ],
    returnType: 'Boolean',
    examples: ['NOT(B4>100)', 'NOT(TRUE)'],
    keywords: ['reverse', 'inverse', 'negate', 'opposite'],
    relatedFunctions: ['AND', 'OR'],
    commonMistakes: ['Applying NOT to non-boolean values.']
  },
  {
    name: 'IFERROR',
    category: 'Logical',
    description: 'Returns a value you specify if a formula evaluates to an error; otherwise, returns the result of the formula.',
    syntax: 'IFERROR(value, value_if_error)',
    parameters: [
      { name: 'value', type: 'Any', description: 'The argument that is checked for an error.' },
      { name: 'value_if_error', type: 'Any', description: 'The value to return if the formula evaluates to an error.' }
    ],
    returnType: 'Any',
    examples: ['IFERROR(D4/B4, 0)', 'IFERROR(VLOOKUP(A1, B1:C10, 2, FALSE), "Not Found")'],
    keywords: ['error', 'fallback', 'safe', 'catch', 'clean'],
    relatedFunctions: ['IF'],
    commonMistakes: ['Masking critical formula bugs that should be fixed rather than hidden.']
  },

  // Text
  {
    name: 'LEN',
    category: 'Text',
    description: 'Returns the number of characters in a text string.',
    syntax: 'LEN(text)',
    parameters: [
      { name: 'text', type: 'String', description: 'The text whose length you want to find. Spaces count as characters.' }
    ],
    returnType: 'Number',
    examples: ['LEN(A4)', 'LEN("Excel")'],
    keywords: ['length', 'count', 'characters', 'text', 'size'],
    relatedFunctions: ['MID', 'LEFT', 'RIGHT'],
    commonMistakes: ['Forgetting that blank spaces and trailing spaces are counted in the length.']
  },
  {
    name: 'LEFT',
    category: 'Text',
    description: 'Returns the specified number of characters from the start of a text string.',
    syntax: 'LEFT(text, [num_chars])',
    parameters: [
      { name: 'text', type: 'String', description: 'The text string containing the characters you want to extract.' },
      { name: 'num_chars', type: 'Number', description: 'The number of characters you want to extract. Defaults to 1.', optional: true }
    ],
    returnType: 'String',
    examples: ['LEFT(A4, 5)', 'LEFT("Antigravity")'],
    keywords: ['extract', 'start', 'substring', 'text'],
    relatedFunctions: ['RIGHT', 'MID'],
    commonMistakes: ['Specifying a negative num_chars, which returns #VALUE!.']
  },
  {
    name: 'RIGHT',
    category: 'Text',
    description: 'Returns the specified number of characters from the end of a text string.',
    syntax: 'RIGHT(text, [num_chars])',
    parameters: [
      { name: 'text', type: 'String', description: 'The text string containing the characters you want to extract.' },
      { name: 'num_chars', type: 'Number', description: 'The number of characters you want to extract. Defaults to 1.', optional: true }
    ],
    returnType: 'String',
    examples: ['RIGHT(A4, 5)', 'RIGHT("Spreadsheet")'],
    keywords: ['extract', 'end', 'substring', 'text'],
    relatedFunctions: ['LEFT', 'MID'],
    commonMistakes: ['Specifying a negative num_chars, which returns #VALUE!.']
  },
  {
    name: 'MID',
    category: 'Text',
    description: 'Returns a specific number of characters from a text string, starting at the position you specify.',
    syntax: 'MID(text, start_num, num_chars)',
    parameters: [
      { name: 'text', type: 'String', description: 'The text string containing the characters you want to extract.' },
      { name: 'start_num', type: 'Number', description: 'The position of the first character you want to extract. (1-indexed).' },
      { name: 'num_chars', type: 'Number', description: 'The number of characters you want MID to return.' }
    ],
    returnType: 'String',
    examples: ['MID(A4, 2, 4)', 'MID("Developer", 3, 5)'],
    keywords: ['extract', 'middle', 'substring', 'text'],
    relatedFunctions: ['LEFT', 'RIGHT'],
    commonMistakes: ['Providing a start_num less than 1, which returns #VALUE!.']
  },
  {
    name: 'CONCAT',
    category: 'Text',
    description: 'Concatenates a list or range of text strings.',
    syntax: 'CONCAT(text1, [text2], ...)',
    parameters: [
      { name: 'text1', type: 'String/Range', description: 'First text item or cell range to join.' },
      { name: 'text2', type: 'String/Range', description: 'Additional text items or ranges to join.', optional: true }
    ],
    returnType: 'String',
    examples: ['CONCAT("Pass Rate: ", B5, "%")', 'CONCAT(A1:B2)'],
    keywords: ['join', 'merge', 'concatenate', 'combine', 'text'],
    relatedFunctions: ['CONCATENATE', 'TEXTJOIN'],
    commonMistakes: ['Forgetting to add spacing between arguments (e.g. results in "JohnDoe" instead of "John Doe").']
  },
  {
    name: 'CONCATENATE',
    category: 'Text',
    description: 'Joins several text items into one text item.',
    syntax: 'CONCATENATE(text1, [text2], ...)',
    parameters: [
      { name: 'text1', type: 'String', description: 'First text item to join.' },
      { name: 'text2', type: 'String', description: 'Additional text items to join.', optional: true }
    ],
    returnType: 'String',
    examples: ['CONCATENATE(A4, " - ", B4)'],
    keywords: ['join', 'merge', 'combine', 'text'],
    relatedFunctions: ['CONCAT'],
    commonMistakes: ['Unlike CONCAT, CONCATENATE does not support cell ranges (e.g. A1:B2).']
  },
  {
    name: 'TEXT',
    category: 'Text',
    description: 'Formats a number and converts it to text.',
    syntax: 'TEXT(value, format_text)',
    parameters: [
      { name: 'value', type: 'Number', description: 'A numeric value, a reference to a cell, or a formula.' },
      { name: 'format_text', type: 'String', description: 'A numeric format in quotation marks.' }
    ],
    returnType: 'String',
    examples: ['TEXT(C4, "$#,##0.00")', 'TEXT(TODAY(), "YYYY-MM-DD")'],
    keywords: ['format', 'convert', 'number', 'text', 'string'],
    relatedFunctions: ['VALUE'],
    commonMistakes: ['Forgetting quotation marks around the format_text string.']
  },
  {
    name: 'LOWER',
    category: 'Text',
    description: 'Converts all uppercase letters in a text string to lowercase.',
    syntax: 'LOWER(text)',
    parameters: [
      { name: 'text', type: 'String', description: 'The text you want to convert to lowercase.' }
    ],
    returnType: 'String',
    examples: ['LOWER(A4)', 'LOWER("EXCEL")'],
    keywords: ['lowercase', 'small', 'casing', 'text'],
    relatedFunctions: ['UPPER', 'PROPER'],
    commonMistakes: ['Expecting it to alter non-alphabetic characters.']
  },
  {
    name: 'UPPER',
    category: 'Text',
    description: 'Converts all lowercase letters in a text string to uppercase.',
    syntax: 'UPPER(text)',
    parameters: [
      { name: 'text', type: 'String', description: 'The text you want to convert to uppercase.' }
    ],
    returnType: 'String',
    examples: ['UPPER(A4)', 'UPPER("excel")'],
    keywords: ['uppercase', 'capital', 'casing', 'text'],
    relatedFunctions: ['LOWER', 'PROPER'],
    commonMistakes: ['None.']
  },
  {
    name: 'PROPER',
    category: 'Text',
    description: 'Capitalizes the first letter in each word of a text value, and converts all other letters to lowercase.',
    syntax: 'PROPER(text)',
    parameters: [
      { name: 'text', type: 'String', description: 'Text, a formula, or a cell reference.' }
    ],
    returnType: 'String',
    examples: ['PROPER(A4)', 'PROPER("john doe")'],
    keywords: ['titlecase', 'capitalize', 'casing', 'text', 'name'],
    relatedFunctions: ['UPPER', 'LOWER'],
    commonMistakes: ['Capitalizes any letters following non-alphabetic chars (e.g. "semi-colon" becomes "Semi-Colon").']
  },
  {
    name: 'TRIM',
    category: 'Text',
    description: 'Removes all spaces from text except for single spaces between words.',
    syntax: 'TRIM(text)',
    parameters: [
      { name: 'text', type: 'String', description: 'The text from which you want spaces removed.' }
    ],
    returnType: 'String',
    examples: ['TRIM("   Spaced   Out   ")', 'TRIM(A4)'],
    keywords: ['whitespace', 'strip', 'clean', 'spaces'],
    relatedFunctions: ['CLEAN'],
    commonMistakes: ['Expecting it to remove non-breaking space characters.']
  },

  // Date & Time
  {
    name: 'TODAY',
    category: 'Date & Time',
    description: 'Returns the current date in YYYY-MM-DD format.',
    syntax: 'TODAY()',
    parameters: [],
    returnType: 'String',
    examples: ['TODAY()'],
    keywords: ['date', 'today', 'current', 'time'],
    relatedFunctions: ['NOW'],
    commonMistakes: ['Passing arguments inside the parenthesis.']
  },
  {
    name: 'NOW',
    category: 'Date & Time',
    description: 'Returns the current date and time in YYYY-MM-DD HH:MM:SS format.',
    syntax: 'NOW()',
    parameters: [],
    returnType: 'String',
    examples: ['NOW()'],
    keywords: ['datetime', 'current', 'now', 'time', 'timestamp'],
    relatedFunctions: ['TODAY'],
    commonMistakes: ['Passing arguments inside the parenthesis.']
  },

  // Information
  {
    name: 'ISNUMBER',
    category: 'Information',
    description: 'Returns TRUE if the value is a number, otherwise FALSE.',
    syntax: 'ISNUMBER(value)',
    parameters: [
      { name: 'value', type: 'Any', description: 'The value you want to test.' }
    ],
    returnType: 'Boolean',
    examples: ['ISNUMBER(B4)', 'ISNUMBER("123")'],
    keywords: ['check', 'isnum', 'numeric', 'test'],
    relatedFunctions: ['ISTEXT', 'ISBLANK'],
    commonMistakes: ['Passing text representation of numbers (e.g. "10"), which evaluates to FALSE.']
  },
  {
    name: 'ISTEXT',
    category: 'Information',
    description: 'Returns TRUE if the value is text, otherwise FALSE.',
    syntax: 'ISTEXT(value)',
    parameters: [
      { name: 'value', type: 'Any', description: 'The value you want to test.' }
    ],
    returnType: 'Boolean',
    examples: ['ISTEXT(A4)', 'ISTEXT(123)'],
    keywords: ['check', 'istxt', 'string', 'text', 'test'],
    relatedFunctions: ['ISNUMBER', 'ISBLANK'],
    commonMistakes: ['None.']
  },
  {
    name: 'ISBLANK',
    category: 'Information',
    description: 'Returns TRUE if the referenced cell is empty, otherwise FALSE.',
    syntax: 'ISBLANK(value)',
    parameters: [
      { name: 'value', type: 'Any', description: 'Reference to the cell you want to test.' }
    ],
    returnType: 'Boolean',
    examples: ['ISBLANK(B9)', 'ISBLANK(A1)'],
    keywords: ['empty', 'null', 'void', 'check', 'test'],
    relatedFunctions: ['ISNUMBER', 'ISTEXT'],
    commonMistakes: ['A cell containing spaces " " is not blank and returns FALSE.']
  },

  // Lookup & Reference
  {
    name: 'SUBTOTAL',
    category: 'Lookup & Reference',
    description: 'Returns a subtotal in a list or database.',
    syntax: 'SUBTOTAL(function_num, ref1, [ref2], ...)',
    parameters: [
      { name: 'function_num', type: 'Number', description: 'Number 1-11 or 101-111 specifying the function to use (9 = SUM, 1 = AVERAGE, etc.).' },
      { name: 'ref1', type: 'Range', description: 'The first named range or reference to subtotal.' },
      { name: 'ref2', type: 'Range', description: 'Additional ranges or references to subtotal.', optional: true }
    ],
    returnType: 'Number',
    examples: ['SUBTOTAL(9, A1:A10)', 'SUBTOTAL(1, B4:B10)'],
    keywords: ['subtotal', 'sum', 'average', 'summary', 'aggregate'],
    relatedFunctions: ['SUM', 'AVERAGE'],
    commonMistakes: ['Using incorrect function numbers.']
  },
  {
    name: 'SORT',
    category: 'Lookup & Reference',
    description: 'Sorts the contents of a range or array.',
    syntax: 'SORT(array, [sort_index], [sort_order], [by_col])',
    parameters: [
      { name: 'array', type: 'Range/Array', description: 'The range of cells or array to sort.' },
      { name: 'sort_index', type: 'Number', description: 'Column or row index indicating what to sort by.', optional: true },
      { name: 'sort_order', type: 'Number', description: '1 for ascending, -1 for descending.', optional: true },
      { name: 'by_col', type: 'Boolean', description: 'FALSE to sort by row, TRUE to sort by column.', optional: true }
    ],
    returnType: 'Array',
    examples: ['SORT(A1:B10, 1, 1)', 'SORT(C4:E20, 2, -1)'],
    keywords: ['arrange', 'order', 'sort', 'filter', 'sequence'],
    relatedFunctions: ['FILTER', 'UNIQUE'],
    commonMistakes: ['None.']
  },
  {
    name: 'SEARCH',
    category: 'Lookup & Reference',
    description: 'Locates one text string within another text string (case-insensitive).',
    syntax: 'SEARCH(find_text, within_text, [start_num])',
    parameters: [
      { name: 'find_text', type: 'String', description: 'The text you want to find. Wildcards (*, ?) are supported.' },
      { name: 'within_text', type: 'String', description: 'The text in which you want to search.' },
      { name: 'start_num', type: 'Number', description: 'The character index where searching starts.', optional: true }
    ],
    returnType: 'Number',
    examples: ['SEARCH("Pro", A4)', 'SEARCH("course", "Excel Course Pro")'],
    keywords: ['find', 'locate', 'indexof', 'text', 'match'],
    relatedFunctions: ['FIND', 'MID'],
    commonMistakes: ['Returning #VALUE! if find_text is not found.']
  },
  {
    name: 'VLOOKUP',
    category: 'Lookup & Reference',
    description: 'Looks for a value in the leftmost column of a table, and then returns a value in the same row from another column.',
    syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    parameters: [
      { name: 'lookup_value', type: 'Any', description: 'The value to search for in the first column of the table.' },
      { name: 'table_array', type: 'Range', description: 'The range of cells that contains the table.' },
      { name: 'col_index_num', type: 'Number', description: 'The column number in the table_array from which to retrieve the value.' },
      { name: 'range_lookup', type: 'Boolean', description: 'TRUE for approximate match, FALSE for exact match.', optional: true }
    ],
    returnType: 'Any',
    examples: ['VLOOKUP(A1, B1:C10, 2, FALSE)', 'VLOOKUP("Pro", D4:F100, 3, TRUE)'],
    keywords: ['vlookup', 'vertical', 'search', 'find', 'lookup', 'match'],
    relatedFunctions: ['HLOOKUP', 'XLOOKUP', 'INDEX', 'MATCH'],
    commonMistakes: ['Entering col_index_num less than 1, or expecting it to search columns other than the leftmost column.']
  },

  // Custom
  {
    name: 'GST',
    category: 'Custom',
    description: 'Calculates the Goods and Services Tax (GST) amount for a given amount and rate.',
    syntax: 'GST(amount, rate)',
    parameters: [
      { name: 'amount', type: 'Number', description: 'The base amount.' },
      { name: 'rate', type: 'Number', description: 'The GST rate in percentage (e.g. 18 for 18%).' }
    ],
    returnType: 'Number',
    examples: ['GST(10000, 18)', 'GST(A1, 5)'],
    keywords: ['tax', 'gst', 'goods', 'services', 'cgst', 'sgst', 'igst', 'calculate', 'vat'],
    aliases: ['TAX'],
    relatedFunctions: ['CGST', 'SGST', 'IGST'],
    commonMistakes: ['Passing the rate as a decimal (0.18) instead of a percentage value (18).']
  },
  {
    name: 'CGST',
    category: 'Custom',
    description: 'Calculates the Central Goods and Services Tax (CGST) amount (usually 50% of total GST).',
    syntax: 'CGST(amount, rate)',
    parameters: [
      { name: 'amount', type: 'Number', description: 'The base amount.' },
      { name: 'rate', type: 'Number', description: 'The total GST rate in percentage (e.g. 18 for 18%).' }
    ],
    returnType: 'Number',
    examples: ['CGST(10000, 18)', 'CGST(A1, 5)'],
    keywords: ['tax', 'cgst', 'central', 'gst', 'state'],
    relatedFunctions: ['GST', 'SGST', 'IGST'],
    commonMistakes: ['None.']
  },
  {
    name: 'SGST',
    category: 'Custom',
    description: 'Calculates the State Goods and Services Tax (SGST) amount (usually 50% of total GST).',
    syntax: 'SGST(amount, rate)',
    parameters: [
      { name: 'amount', type: 'Number', description: 'The base amount.' },
      { name: 'rate', type: 'Number', description: 'The total GST rate in percentage (e.g. 18 for 18%).' }
    ],
    returnType: 'Number',
    examples: ['SGST(10000, 18)', 'SGST(A1, 5)'],
    keywords: ['tax', 'sgst', 'state', 'gst', 'central'],
    relatedFunctions: ['GST', 'CGST', 'IGST'],
    commonMistakes: ['None.']
  },
  {
    name: 'IGST',
    category: 'Custom',
    description: 'Calculates the Integrated Goods and Services Tax (IGST) amount for interstate transactions.',
    syntax: 'IGST(amount, rate)',
    parameters: [
      { name: 'amount', type: 'Number', description: 'The base amount.' },
      { name: 'rate', type: 'Number', description: 'The IGST rate in percentage (e.g. 18 for 18%).' }
    ],
    returnType: 'Number',
    examples: ['IGST(10000, 18)', 'IGST(A1, 12)'],
    keywords: ['tax', 'igst', 'integrated', 'gst', 'interstate'],
    relatedFunctions: ['GST', 'CGST', 'SGST'],
    commonMistakes: ['None.']
  },
  {
    name: 'EMI',
    category: 'Custom',
    description: 'Calculates the Equated Monthly Installment (EMI) for a loan.',
    syntax: 'EMI(principal, annual_rate, months)',
    parameters: [
      { name: 'principal', type: 'Number', description: 'The loan principal amount.' },
      { name: 'annual_rate', type: 'Number', description: 'The annual interest rate in percentage (e.g. 8.5 for 8.5%).' },
      { name: 'months', type: 'Number', description: 'The tenure of the loan in months.' }
    ],
    returnType: 'Number',
    examples: ['EMI(500000, 8.5, 60)', 'EMI(A1, B1, C1)'],
    keywords: ['loan', 'emi', 'finance', 'mortgage', 'payment', 'monthly', 'installment', 'interest'],
    relatedFunctions: ['PMT'],
    commonMistakes: ['Using months instead of years or passing annual rate as a decimal.']
  },
  {
    name: 'AGE',
    category: 'Custom',
    description: 'Calculates the current age in years from a specified birthdate string.',
    syntax: 'AGE(birthdate)',
    parameters: [
      { name: 'birthdate', type: 'String/Date', description: 'The birthdate in YYYY-MM-DD format.' }
    ],
    returnType: 'Number',
    examples: ['AGE("1995-05-15")', 'AGE(A4)'],
    keywords: ['age', 'years', 'birth', 'date', 'birthday', 'calculate'],
    relatedFunctions: ['TODAY'],
    commonMistakes: ['Passing invalid date format. Use YYYY-MM-DD.']
  },
  {
    name: 'PANVALID',
    category: 'Custom',
    description: 'Checks if a string is a valid Permanent Account Number (PAN) in India.',
    syntax: 'PANVALID(pan)',
    parameters: [
      { name: 'pan', type: 'String', description: 'The PAN card string.' }
    ],
    returnType: 'Boolean',
    examples: ['PANVALID("ABCDE1234F")', 'PANVALID(A4)'],
    keywords: ['tax', 'pan', 'valid', 'india', 'permanent', 'account', 'verify'],
    relatedFunctions: ['AADHARVALID'],
    commonMistakes: ['PAN format is ABCDE1234F (5 letters, 4 numbers, 1 letter).']
  },
  {
    name: 'AADHARVALID',
    category: 'Custom',
    description: 'Checks if a string is a valid 12-digit Aadhaar number in India.',
    syntax: 'AADHARVALID(aadhar)',
    parameters: [
      { name: 'aadhar', type: 'String/Number', description: 'The 12-digit Aadhaar number.' }
    ],
    returnType: 'Boolean',
    examples: ['AADHARVALID("123456789012")', 'AADHARVALID(A4)'],
    keywords: ['aadhar', 'valid', 'india', 'identity', 'verify', 'uidai'],
    relatedFunctions: ['PANVALID'],
    commonMistakes: ['Must be exactly 12 digits.']
  }
];
