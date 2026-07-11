import { Question } from '../types';

export const practiceQuestionsData: Question[] = [
  {
    id: 'q1',
    questionNum: 1,
    category: 'Excel Basics',
    difficulty: 'Beginner',
    title: 'Adding Two Cells',
    description: 'Learn the most fundamental calculation in Excel: referencing two cells and adding them together.',
    scenario: 'You are reviewing a simple inventory list. You need to calculate the total units available by combining the warehouse stock and the store display stock.',
    task: 'In cell C2, write a formula to add cell A2 and cell B2.',
    estimatedTime: '2 min',
    initialGrid: {
      rowCount: 3,
      colCount: 4,
      cells: {
        A1: { value: 'Warehouse Stock', bold: true },
        B1: { value: 'Store Stock', bold: true },
        C1: { value: 'Total Stock', bold: true },
        A2: { value: '140' },
        B2: { value: '35' },
        C2: { value: '' }
      }
    },
    targetCell: 'C2',
    expectedFormulas: ['=A2+B2', '=B2+A2', '=a2+b2', '=b2+a2', '=SUM(A2,B2)', '=sum(a2,b2)', '=SUM(A2:B2)', '=sum(a2:b2)'],
    expectedValue: 175,
    hint: 'Formulas always start with =. To add the two cells, you can type =A2+B2 or use the SUM function like =SUM(A2:B2).',
    formulaSyntax: '=[Cell1] + [Cell2]  or  =SUM([Cell1]:[Cell2])',
    formulaExample: '=A2+B2',
    solutionFormula: '=A2+B2'
  },
  {
    id: 'q2',
    questionNum: 2,
    category: 'Basic Formulas',
    difficulty: 'Beginner',
    title: 'Summing Expenses',
    description: 'Calculate the total of a list of expenses using the SUM function.',
    scenario: 'The finance manager needs to know the total operating expenses for the first quarter.',
    task: 'Use the SUM function in cell B7 to calculate the sum of expenses from B2 to B6.',
    estimatedTime: '2 min',
    initialGrid: {
      rowCount: 8,
      colCount: 3,
      cells: {
        A1: { value: 'Expense Item', bold: true },
        B1: { value: 'Amount ($)', bold: true },
        A2: { value: 'Rent' },
        B2: { value: '2500' },
        A3: { value: 'Utilities' },
        B3: { value: '450' },
        A4: { value: 'Salaries' },
        B4: { value: '8000' },
        A5: { value: 'Software' },
        B5: { value: '300' },
        A6: { value: 'Marketing' },
        B6: { value: '1200' },
        A7: { value: 'Total Expenses', bold: true },
        B7: { value: '' }
      }
    },
    targetCell: 'B7',
    expectedFormulas: ['=SUM(B2:B6)', '=sum(b2:b6)', '=SUM(B2:B6)'],
    expectedValue: 12450,
    hint: 'Type =SUM(B2:B6) in cell B7. Do not add the values manually; use the range B2:B6.',
    formulaSyntax: '=SUM(start_cell:end_cell)',
    formulaExample: '=SUM(B2:B6)',
    solutionFormula: '=SUM(B2:B6)'
  },
  {
    id: 'q3',
    questionNum: 3,
    category: 'Basic Formulas',
    difficulty: 'Beginner',
    title: 'Calculate Average Sales',
    description: 'Find the average sales across multiple retail stores using the AVERAGE function.',
    scenario: 'You are analyzing weekly performance. You want to see the average sales generated across five branches.',
    task: 'Enter the AVERAGE formula in cell B7 to find the average of cells B2 to B6.',
    estimatedTime: '3 min',
    initialGrid: {
      rowCount: 8,
      colCount: 3,
      cells: {
        A1: { value: 'Branch', bold: true },
        B1: { value: 'Sales ($)', bold: true },
        A2: { value: 'North' },
        B2: { value: '15000' },
        A3: { value: 'South' },
        B3: { value: '18500' },
        A4: { value: 'East' },
        B4: { value: '12000' },
        A5: { value: 'West' },
        B5: { value: '22000' },
        A6: { value: 'Central' },
        B6: { value: '16500' },
        A7: { value: 'Average Sales', bold: true },
        B7: { value: '' }
      }
    },
    targetCell: 'B7',
    expectedFormulas: ['=AVERAGE(B2:B6)', '=average(b2:b6)'],
    expectedValue: 16800,
    hint: 'Write =AVERAGE(B2:B6) in B7 to find the mean value.',
    formulaSyntax: '=AVERAGE(start_cell:end_cell)',
    formulaExample: '=AVERAGE(B2:B6)',
    solutionFormula: '=AVERAGE(B2:B6)'
  },
  {
    id: 'q4',
    questionNum: 4,
    category: 'Logical Functions',
    difficulty: 'Intermediate',
    title: 'Employee Bonus Qualification',
    description: 'Apply conditional logic to determine employee eligibility for bonuses.',
    scenario: 'Employees qualify for a performance bonus if their quarterly rating is 80 or higher.',
    task: 'In cell C2, write an IF statement that checks cell B2. If it is 80 or above, display "Yes", otherwise display "No".',
    estimatedTime: '4 min',
    initialGrid: {
      rowCount: 4,
      colCount: 4,
      cells: {
        A1: { value: 'Employee', bold: true },
        B1: { value: 'Rating', bold: true },
        C1: { value: 'Bonus?', bold: true },
        A2: { value: 'Jessica Watson' },
        B2: { value: '85' },
        C2: { value: '' },
        A3: { value: 'Mark Ruffalo' },
        B3: { value: '72' },
        C3: { value: 'No' } // Prepulating the rest for ease
      }
    },
    targetCell: 'C2',
    expectedFormulas: [
      '=IF(B2>=80, "Yes", "No")',
      '=if(b2>=80,"Yes","No")',
      '=IF(B2>=80,"Yes","No")',
      '=if(b2>=80, "Yes", "No")'
    ],
    expectedValue: 'Yes',
    hint: 'The syntax is =IF(condition, value_if_true, value_if_false). Check if B2 >= 80, and output "Yes" or "No". Remember the double quotes around text.',
    formulaSyntax: '=IF(logical_test, value_if_true, value_if_false)',
    formulaExample: '=IF(B2>=80, "Yes", "No")',
    solutionFormula: '=IF(B2>=80, "Yes", "No")'
  },
  {
    id: 'q5',
    questionNum: 5,
    category: 'Text Functions',
    difficulty: 'Beginner',
    title: 'Merging First and Last Name',
    description: 'Combine strings together with spacing using the CONCAT function.',
    scenario: 'You have a customer contact database where first and last names are in separate columns. You need to combine them for mailing labels.',
    task: 'Use CONCAT in cell C2 to join First Name (A2), a space (" "), and Last Name (B2).',
    estimatedTime: '3 min',
    initialGrid: {
      rowCount: 4,
      colCount: 4,
      cells: {
        A1: { value: 'First Name', bold: true },
        B1: { value: 'Last Name', bold: true },
        C1: { value: 'Full Name', bold: true },
        A2: { value: 'Arthur' },
        B2: { value: 'Dent' },
        C2: { value: '' }
      }
    },
    targetCell: 'C2',
    expectedFormulas: [
      '=CONCAT(A2, " ", B2)',
      '=concat(a2," ",b2)',
      '=CONCAT(A2," ",B2)',
      '=concat(a2, " ", b2)',
      '=A2&" "&B2', // Also accept ampersand concatenation!
      '=a2&" "&b2'
    ],
    expectedValue: 'Arthur Dent',
    hint: 'Use =CONCAT(A2, " ", B2) or the ampersand operator =A2&" "&B2 to combine names with a space character.',
    formulaSyntax: '=CONCAT(text1, text2, ...)',
    formulaExample: '=CONCAT(A2, " ", B2)',
    solutionFormula: '=CONCAT(A2, " ", B2)'
  },
  {
    id: 'q6',
    questionNum: 6,
    category: 'Lookup Functions',
    difficulty: 'Intermediate',
    title: 'VLOOKUP Product Prices',
    description: 'Use vertical lookup to dynamically retrieve matching records from a pricing catalog table.',
    scenario: 'A retail clerk needs to find the price of a specific product ID entered in cell E2.',
    task: 'In cell F2, write a VLOOKUP formula to find the price of the product ID in cell E2, using range A2:B6 as your catalog. Retrieve the price from the 2nd column. Use FALSE for exact matching.',
    estimatedTime: '5 min',
    initialGrid: {
      rowCount: 7,
      colCount: 7,
      cells: {
        A1: { value: 'Product ID', bold: true },
        B1: { value: 'Price ($)', bold: true },
        A2: { value: 'SKU-01' },
        B2: { value: '15' },
        A3: { value: 'SKU-02' },
        B3: { value: '29' },
        A4: { value: 'SKU-03' },
        B4: { value: '45' },
        A5: { value: 'SKU-04' },
        B5: { value: '89' },
        A6: { value: 'SKU-05' },
        B6: { value: '120' },
        E1: { value: 'Target SKU', bold: true },
        F1: { value: 'Retrieved Price', bold: true },
        E2: { value: 'SKU-03', bold: true },
        F2: { value: '' }
      }
    },
    targetCell: 'F2',
    expectedFormulas: [
      '=VLOOKUP(E2, A2:B6, 2, FALSE)',
      '=vlookup(e2,a2:b6,2,false)',
      '=VLOOKUP(E2, A2:B6, 2, 0)',
      '=vlookup(e2, a2:b6, 2, false)'
    ],
    expectedValue: 45,
    hint: 'Type =VLOOKUP(E2, A2:B6, 2, FALSE) in cell F2. It searches for "SKU-03" in column A and fetches the price from column B.',
    formulaSyntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    formulaExample: '=VLOOKUP(E2, A2:B6, 2, FALSE)',
    solutionFormula: '=VLOOKUP(E2, A2:B6, 2, FALSE)'
  },
  {
    id: 'q7',
    questionNum: 7,
    category: 'Math Functions',
    difficulty: 'Advanced',
    title: 'Conditional Sum with SUMIF',
    description: 'Sum sales numbers dynamically based on region using the SUMIF function.',
    scenario: 'Your regional sales director wants to know the total revenue generated specifically in the "North" region.',
    task: 'Use SUMIF in cell B9 to calculate the sum of Sales (B2:B7) where the corresponding Region (A2:A7) is "North".',
    estimatedTime: '6 min',
    initialGrid: {
      rowCount: 10,
      colCount: 3,
      cells: {
        A1: { value: 'Region', bold: true },
        B1: { value: 'Sales ($)', bold: true },
        A2: { value: 'North' },
        B2: { value: '5200' },
        A3: { value: 'South' },
        B3: { value: '4100' },
        A4: { value: 'North' },
        B4: { value: '3800' },
        A5: { value: 'East' },
        B5: { value: '6000' },
        A6: { value: 'North' },
        B6: { value: '7100' },
        A7: { value: 'West' },
        B7: { value: '3200' },
        A9: { value: 'North Sales Total', bold: true },
        B9: { value: '' }
      }
    },
    targetCell: 'B9',
    expectedFormulas: [
      '=SUMIF(A2:A7, "North", B2:B7)',
      '=sumif(a2:a7,"North",b2:b7)',
      '=SUMIF(A2:A7,"North",B2:B7)',
      '=sumif(a2:a7, "North", B2:B7)'
    ],
    expectedValue: 16100, // 5200 + 3800 + 7100 = 16100
    hint: 'Write =SUMIF(A2:A7, "North", B2:B7) in cell B9. The criteria is "North".',
    formulaSyntax: '=SUMIF(range, criteria, [sum_range])',
    formulaExample: '=SUMIF(A2:A7, "North", B2:B7)',
    solutionFormula: '=SUMIF(A2:A7, "North", B2:B7)'
  },
  {
    id: 'q8',
    questionNum: 8,
    category: 'Logical Functions',
    difficulty: 'Intermediate',
    title: 'Conditional Count with COUNTIF',
    description: 'Count how many items match a specific status using the COUNTIF function.',
    scenario: 'You are managing project deliverables and need to report the total count of tasks that have been "Completed".',
    task: 'Use COUNTIF in cell B8 to count how many cells in range B2:B6 contain the word "Completed".',
    estimatedTime: '4 min',
    initialGrid: {
      rowCount: 9,
      colCount: 3,
      cells: {
        A1: { value: 'Task', bold: true },
        B1: { value: 'Status', bold: true },
        A2: { value: 'Database Schema' },
        B2: { value: 'Completed' },
        A3: { value: 'API Endpoints' },
        B3: { value: 'In Progress' },
        A4: { value: 'Spreadsheet Grid' },
        B4: { value: 'Completed' },
        A5: { value: 'Auth Integration' },
        B5: { value: 'Not Started' },
        A6: { value: 'Unit Testing' },
        B6: { value: 'Completed' },
        A8: { value: 'Total Completed', bold: true },
        B8: { value: '' }
      }
    },
    targetCell: 'B8',
    expectedFormulas: [
      '=COUNTIF(B2:B6, "Completed")',
      '=countif(b2:b6,"Completed")',
      '=COUNTIF(B2:B6,"Completed")',
      '=countif(b2:b6, "Completed")'
    ],
    expectedValue: 3,
    hint: 'Type =COUNTIF(B2:B6, "Completed") in cell B8.',
    formulaSyntax: '=COUNTIF(range, criteria)',
    formulaExample: '=COUNTIF(B2:B6, "Completed")',
    solutionFormula: '=COUNTIF(B2:B6, "Completed")'
  }
];
