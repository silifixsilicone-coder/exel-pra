import { Lesson } from '../types';

export const lessonsData: Lesson[] = [
  {
    id: 'excel-basics-1',
    title: 'Cell References & Entering Values',
    category: 'Excel Basics',
    difficulty: 'Beginner',
    explanation: 'Every cell in an Excel grid has an address, called a cell reference, determined by its Column letter and Row number (e.g., A1 is the top-left cell). To enter values, select a cell and type numbers or text. To enter a formula, always start with an equal sign (=).',
    syntax: '= [cell reference] or = [value]',
    example: 'Enter the value 500 in cell A1 and type =A1 in cell B1 to reference it.',
    exampleTableHeaders: ['Column A', 'Column B'],
    exampleTableRows: [
      ['500', 'Active cell references A1 (=A1)'],
      ['100', 'Hardcoded value']
    ],
    stepByStep: [
      'Click on cell A1.',
      'Type 500 and press Enter.',
      'Click on cell B1.',
      'Type =A1 and press Enter. Cell B1 will now display 500.'
    ],
    commonMistakes: [
      'Forgetting the equals sign (=) when typing a cell reference, which makes Excel treat it as plain text.',
      'Referencing the wrong column or row (e.g., typing A2 when you mean A1).'
    ],
    miniPractice: {
      taskDescription: 'Select cell B2 and write a reference to cell A2 so that B2 displays the value of A2.',
      initialGrid: {
        rowCount: 4,
        colCount: 3,
        cells: {
          A1: { value: 'Item Code', bold: true },
          B1: { value: 'Referenced Code', bold: true },
          A2: { value: 'EX-904' },
          B2: { value: '' }
        }
      },
      targetCell: 'B2',
      expectedFormulas: ['=A2', '= a2'],
      expectedValue: 'EX-904',
      hint: 'Click on cell B2, type =A2, and click Check Answer.'
    },
    nextLessonId: 'basic-formulas-1'
  },
  {
    id: 'basic-formulas-1',
    title: 'The SUM Function',
    category: 'Basic Formulas',
    difficulty: 'Beginner',
    explanation: 'The SUM function is used to add numbers or a range of cells quickly. Instead of writing =A1+A2+A3, you can write =SUM(A1:A3). This is much cleaner, especially for larger tables.',
    syntax: 'SUM(range_or_cells)',
    example: '=SUM(B2:B5) adds the numbers in cells B2, B3, B4, and B5.',
    exampleTableHeaders: ['Month', 'Sales'],
    exampleTableRows: [
      ['January', '12000'],
      ['February', '15000'],
      ['March', '18000'],
      ['Total', '=SUM(B2:B4)']
    ],
    stepByStep: [
      'Identify the range of numbers you want to add.',
      'Select the cell where you want the total to appear (e.g. B5).',
      'Type =SUM(B2:B4).',
      'Press Enter to calculate the sum (which returns 45000).'
    ],
    commonMistakes: [
      'Using a semicolon instead of a colon (e.g. SUM(A1;A5) instead of SUM(A1:A5)).',
      'Including the total cell itself inside the SUM range, which creates a circular reference error.'
    ],
    miniPractice: {
      taskDescription: 'Calculate the total budget in cell B5 by writing a SUM formula for range B2 to B4.',
      initialGrid: {
        rowCount: 5,
        colCount: 3,
        cells: {
          A1: { value: 'Department', bold: true },
          B1: { value: 'Budget ($)', bold: true },
          A2: { value: 'Marketing' },
          B2: { value: '5000' },
          A3: { value: 'Engineering' },
          B3: { value: '12000' },
          A4: { value: 'HR' },
          B4: { value: '3000' },
          A5: { value: 'Total', bold: true },
          B5: { value: '' }
        }
      },
      targetCell: 'B5',
      expectedFormulas: ['=SUM(B2:B4)', '=sum(b2:b4)', '=SUM(B2:B4)'],
      expectedValue: 20000,
      hint: 'Type =SUM(B2:B4) in cell B5 and check your work.'
    },
    nextLessonId: 'logical-functions-1'
  },
  {
    id: 'logical-functions-1',
    title: 'The IF Function',
    category: 'Logical Functions',
    difficulty: 'Intermediate',
    explanation: 'The IF function lets you make logical comparisons between a value and what you expect. An IF statement has two results: a value if the comparison is True, and a value if the comparison is False.',
    syntax: 'IF(logical_test, value_if_true, value_if_false)',
    example: '=IF(C2>=60, "Pass", "Fail")',
    exampleTableHeaders: ['Student', 'Score', 'Status'],
    exampleTableRows: [
      ['Alice', '85', '=IF(B2>=60, "Pass", "Fail")'],
      ['Bob', '45', '=IF(B3>=60, "Pass", "Fail")']
    ],
    stepByStep: [
      'Specify the logical test (e.g. B2>=60).',
      'Provide what should be displayed if TRUE (e.g., "Pass"). Text must be inside quotes.',
      'Provide what should be displayed if FALSE (e.g., "Fail").',
      'Combine them: =IF(B2>=60, "Pass", "Fail").'
    ],
    commonMistakes: [
      'Forgetting to wrap text outputs in double quotes. Writing =IF(B2>=60, Pass, Fail) will result in a #NAME? error.',
      'Using the wrong comparison operator (e.g., using < when you mean <=).'
    ],
    miniPractice: {
      taskDescription: 'Write an IF function in cell C2 that displays "Active" if B2 is greater than 100, otherwise displays "Inactive".',
      initialGrid: {
        rowCount: 3,
        colCount: 4,
        cells: {
          A1: { value: 'Server', bold: true },
          B1: { value: 'Connections', bold: true },
          C1: { value: 'Status', bold: true },
          A2: { value: 'US-East' },
          B2: { value: '150' },
          C2: { value: '' }
        }
      },
      targetCell: 'C2',
      expectedFormulas: [
        '=IF(B2>100, "Active", "Inactive")',
        '=if(b2>100,"Active","Inactive")',
        '=IF(B2>100,"Active","Inactive")',
        '=if(b2>100, "Active", "Inactive")'
      ],
      expectedValue: 'Active',
      hint: 'In C2, enter =IF(B2>100, "Active", "Inactive"). Note the capitalization of Active/Inactive.'
    },
    nextLessonId: 'lookup-functions-1'
  },
  {
    id: 'lookup-functions-1',
    title: 'The VLOOKUP Function',
    category: 'Lookup Functions',
    difficulty: 'Intermediate',
    explanation: 'VLOOKUP (Vertical Lookup) searches for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify. It is widely used to join related datasets.',
    syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    example: '=VLOOKUP(F2, A2:C10, 3, FALSE) looks up value in F2 in table A2:C10 and returns the value in the 3rd column.',
    exampleTableHeaders: ['Product ID', 'Name', 'Price'],
    exampleTableRows: [
      ['P101', 'Keyboard', '45'],
      ['P102', 'Mouse', '25'],
      ['P103', 'Monitor', '180']
    ],
    stepByStep: [
      'Select the value to search for (lookup_value).',
      'Select the table or range containing the lookup value and the output (table_array).',
      'Count the columns in that range and write the column number of the value you want to retrieve (col_index_num).',
      'For an exact match, always set range_lookup to FALSE.'
    ],
    commonMistakes: [
      'Looking up a value that is NOT in the first column of the table_array. VLOOKUP can only search from left to right.',
      'Specifying a column index number that is greater than the number of columns in the table range, which results in a #REF! error.'
    ],
    miniPractice: {
      taskDescription: 'Look up the price of product "P102" in cell F2. Use cell E2 as the lookup value and range A2:C4 as the table array. Retrieve the price (3rd column).',
      initialGrid: {
        rowCount: 5,
        colCount: 7,
        cells: {
          A1: { value: 'ID', bold: true },
          B1: { value: 'Item', bold: true },
          C1: { value: 'Price', bold: true },
          A2: { value: 'P101' },
          B2: { value: 'Laptop' },
          C2: { value: '800' },
          A3: { value: 'P102' },
          B3: { value: 'Phone' },
          C3: { value: '500' },
          A4: { value: 'P103' },
          B4: { value: 'Tablet' },
          C4: { value: '300' },
          E2: { value: 'P102', bold: true },
          F2: { value: '' }
        }
      },
      targetCell: 'F2',
      expectedFormulas: [
        '=VLOOKUP(E2, A2:C4, 3, FALSE)',
        '=vlookup(e2,a2:c4,3,false)',
        '=VLOOKUP(E2, A2:C4, 3, 0)',
        '=vlookup(e2, a2:c4, 3, false)'
      ],
      expectedValue: 500,
      hint: 'Type =VLOOKUP(E2, A2:C4, 3, FALSE) in cell F2.'
    }
  }
];
