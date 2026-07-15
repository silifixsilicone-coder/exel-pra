import { Question } from '../types';

const manualQuestions: Question[] = [
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
    solutionFormula: '=A2+B2',
    explanation: 'Cell references link specific data entries. Adding them combines the values dynamically.',
    solution: '=A2+B2',
    relatedLesson: 'Excel Basics - Part 1'
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
    expectedFormulas: ['=SUM(B2:B6)', '=sum(b2:b6)'],
    expectedValue: 12450,
    hint: 'Type =SUM(B2:B6) in cell B7. Do not add the values manually; use the range B2:B6.',
    formulaSyntax: '=SUM(start_cell:end_cell)',
    formulaExample: '=SUM(B2:B6)',
    solutionFormula: '=SUM(B2:B6)',
    explanation: 'The SUM function totals all values in a range of cells efficiently.',
    solution: '=SUM(B2:B6)',
    relatedLesson: 'Basic Formulas - Part 2'
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
    solutionFormula: '=AVERAGE(B2:B6)',
    explanation: 'AVERAGE sums a series of values and divides by the total count.',
    solution: '=AVERAGE(B2:B6)',
    relatedLesson: 'Basic Formulas - Part 3'
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
        C3: { value: 'No' }
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
    hint: 'The syntax is =IF(condition, value_if_true, value_if_false). Check if B2 >= 80, and output "Yes" or "No".',
    formulaSyntax: '=IF(logical_test, value_if_true, value_if_false)',
    formulaExample: '=IF(B2>=80, "Yes", "No")',
    solutionFormula: '=IF(B2>=80, "Yes", "No")',
    explanation: 'IF branches values based on True/False check evaluations.',
    solution: '=IF(B2>=80, "Yes", "No")',
    relatedLesson: 'Logical Functions - Part 1'
  }
];

export const practiceCategories = [
  'Basic',
  'Formatting',
  'Formula',
  'Lookup',
  'Charts',
  'Pivot',
  'Dashboard',
  'MIS',
  'Accounting',
  'HR',
  'Inventory',
  'Sales',
  'Attendance',
  'GST',
  'Payroll',
  'Data Cleaning',
  'Interview'
];

// Deterministic seed-based question generator (supporting IDs up to 10,500)
export function generateQuestion(num: number): Question {
  const catIndex = (num - 1) % practiceCategories.length;
  const category = practiceCategories[catIndex];
  const difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 
    num % 3 === 0 ? 'Advanced' : num % 2 === 0 ? 'Intermediate' : 'Beginner';

  let expectedFormulas = [`=A2*B2`, `=a2*b2`];
  let expectedValue: string | number | boolean = 600;
  let task = `Calculate the total revenue in cell C2 by multiplying Units (A2) and Price (B2).`;
  let hint = `Type =A2*B2 inside target cell C2.`;
  let solutionFormula = `=A2*B2`;
  
  let cells: Record<string, { value: string; bold?: boolean }> = {
    A1: { value: 'Units', bold: true },
    B1: { value: 'Price ($)', bold: true },
    C1: { value: 'Revenue', bold: true },
    A2: { value: '50' },
    B2: { value: '12' },
    C2: { value: '' }
  };

  if (category === 'Accounting') {
    task = `Calculate the net asset balance in cell C2 by subtracting liabilities (B2) from assets (A2).`;
    cells = {
      A1: { value: 'Assets', bold: true },
      B1: { value: 'Liabilities', bold: true },
      C1: { value: 'Net Balance', bold: true },
      A2: { value: '5000' },
      B2: { value: '1800' },
      C2: { value: '' }
    };
    expectedFormulas = [`=A2-B2`, `=a2-b2`];
    expectedValue = 3200;
    solutionFormula = `=A2-B2`;
  } else if (category === 'GST') {
    task = `Find the 18% GST value in cell C2 for tax base amount (A2).`;
    cells = {
      A1: { value: 'Amount ($)', bold: true },
      B1: { value: 'GST Rate', bold: true },
      C1: { value: 'Calculated GST', bold: true },
      A2: { value: '2500' },
      B2: { value: '0.18' },
      C2: { value: '' }
    };
    expectedFormulas = [`=A2*B2`, `=a2*b2`, `=A2*0.18`, `=a2*0.18`];
    expectedValue = 450;
    solutionFormula = `=A2*B2`;
  } else if (category === 'Data Cleaning') {
    task = `Clean whitespace values in cell A2 by applying the TRIM function inside cell C2.`;
    cells = {
      A1: { value: 'Raw Text', bold: true },
      B1: { value: 'State', bold: true },
      C1: { value: 'Clean Output', bold: true },
      A2: { value: '  FormatText  ' },
      B2: { value: 'Pending' },
      C2: { value: '' }
    };
    expectedFormulas = [`=TRIM(A2)`, `=trim(a2)`];
    expectedValue = 'FormatText';
    solutionFormula = `=TRIM(A2)`;
  }

  return {
    id: `q-gen-${num}`,
    questionNum: num,
    category,
    difficulty,
    title: `${category} Challenge #${num}`,
    description: `Solve this practical ${category} case study exercise using Excel functions.`,
    scenario: `This exercise represents standard corporate situations inside the ${category} category.`,
    task,
    estimatedTime: `${3 + (num % 5)} min`,
    initialGrid: {
      rowCount: 4,
      colCount: 4,
      cells
    },
    targetCell: 'C2',
    expectedFormulas,
    expectedValue,
    hint,
    formulaSyntax: `=FORMULA(cell_coordinates)`,
    formulaExample: solutionFormula,
    solutionFormula,
    explanation: `Using the correct formulas ensures that your ${category} calculations remain fully dynamic.`,
    solution: solutionFormula,
    relatedLesson: `Lesson related to ${category}`
  };
}

// Generate the catalog list of challenges (let's populate 20 per category, giving 340+ base challenges)
const catalogQuestions: Question[] = [];
let idx = 5; // Start generating catalog challenges from index 5 onwards
practiceCategories.forEach((cat) => {
  for (let i = 1; i <= 20; i++) {
    catalogQuestions.push(generateQuestion(idx++));
  }
});

export const practiceQuestionsData: Question[] = [...manualQuestions, ...catalogQuestions];

// Fetch any question deterministically by its unique ID
export function getQuestionById(id: string): Question | undefined {
  const manual = manualQuestions.find(q => q.id === id);
  if (manual) return manual;

  const catalog = catalogQuestions.find(q => q.id === id);
  if (catalog) return catalog;

  // Handle dynamic lookup up to 10,500
  const match = id.match(/^q-gen-(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 10500) {
      return generateQuestion(num);
    }
  }
  return undefined;
}
export const totalQuestionsCount = 10500;
