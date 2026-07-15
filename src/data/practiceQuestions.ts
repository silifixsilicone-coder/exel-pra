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

// Reusable Indian Business Datasets
const indianNames = [
  'Amit Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Joshi', 'Vikram Singh',
  'Neha Gupta', 'Rajesh Kumar', 'Anjali Mehta', 'Sunil Pawar', 'Deepa Nair',
  'Rohan Das', 'Kiran Shah', 'Pooja Roy', 'Arjun Sen', 'Maya Rao', 'Suresh Iyer'
];

const indianCities = [
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Hyderabad', 'Bangalore', 'Delhi', 'Chennai', 'Kolkata', 'Ahmedabad'
];

const products = [
  'Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Chair', 'Printer', 'Desk', 'Webcam', 'Router', 'UPS', 'Scanner'
];

const gsteins = [
  '27AAAAA1111A1Z1', '27BBBBB2222B2Z2', '27CCCCC3333C3Z3', '27DDDDD4444D4Z4'
];

// Dynamic Spreadsheet Generator Engine
export function generateQuestion(num: number): Question {
  const catIndex = (num - 1) % practiceCategories.length;
  const category = practiceCategories[catIndex];
  
  const difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 
    num % 3 === 0 ? 'Advanced' : num % 2 === 0 ? 'Intermediate' : 'Beginner';

  // Determine row count dynamically: Small (5-8 rows), Medium (15-20 rows), Large (50+ rows)
  let rowCount = 6;
  if (num % 3 === 1) {
    rowCount = 18; // Medium
  } else if (num % 3 === 2) {
    rowCount = 52; // Large
  }

  const cells: Record<string, { value: string; bold?: boolean }> = {};
  
  // Reusable random seed selector based on num index
  const selectValue = <T>(arr: T[], offset: number = 0): T => {
    const idx = Math.abs(num + offset) % arr.length;
    return arr[idx];
  };

  // Determine business templates
  const templateType = selectValue([
    'Marksheet', 'SalarySheet', 'GSTInvoice', 'SalesRegister', 
    'ExpenseTracker', 'InventoryManagement', 'MonthlyBudget', 'ProfitLoss'
  ], catIndex);

  let task = '';
  let hint = '';
  let expectedValue: string | number = 0;
  let expectedFormulas: string[] = [];
  let solutionFormula = '';
  let title = `${category} - ${templateType} Check`;
  let scenario = `Configure metrics for this ${templateType} scenario inside the ${category} workflow.`;

  if (templateType === 'Marksheet') {
    title = `${category} - Student Marksheet (#${num})`;
    scenario = `Analyze student grades inside a school Marks registry layout. Row size is ${rowCount}.`;
    
    // Headers
    cells['A1'] = { value: 'Student Name', bold: true };
    cells['B1'] = { value: 'Marks Obtained', bold: true };
    
    let sumVal = 0;
    for (let r = 2; r <= rowCount; r++) {
      const name = selectValue(indianNames, r);
      const marks = 45 + (Math.abs(num + r) % 50); // marks between 45 and 95
      cells[`A${r}`] = { value: name };
      cells[`B${r}`] = { value: String(marks) };
      sumVal += marks;
    }
    
    // Target cell at bottom
    const targetRow = rowCount + 1;
    cells[`A${targetRow}`] = { value: 'Average Marks', bold: true };
    cells[`B${targetRow}`] = { value: '' };

    const avgVal = Math.round((sumVal / (rowCount - 1)) * 10) / 10;
    expectedValue = avgVal;
    expectedFormulas = [
      `=AVERAGE(B2:B${rowCount})`,
      `=average(b2:b${rowCount})`
    ];
    solutionFormula = `=AVERAGE(B2:B${rowCount})`;
    task = `Calculate the AVERAGE marks of students in cell B${targetRow} from range B2 to B${rowCount}.`;
    hint = `Type =AVERAGE(B2:B${rowCount}) in cell B${targetRow}.`;

  } else if (templateType === 'GSTInvoice') {
    title = `${category} - Indian GST Register (#${num})`;
    scenario = `Track tax payments across GST transactions. Total row size is ${rowCount}.`;
    
    cells['A1'] = { value: 'Invoice No', bold: true };
    cells['B1'] = { value: 'GSTIN', bold: true };
    cells['C1'] = { value: 'Base Amount', bold: true };
    cells['D1'] = { value: 'GST Tax', bold: true };

    let baseSum = 0;
    for (let r = 2; r <= rowCount; r++) {
      const invNo = `INV-2026-${1000 + r}`;
      const gst = selectValue(gsteins, r);
      const amt = 1000 + (Math.abs(num + r) % 9) * 500; // amounts 1000 to 5000
      cells[`A${r}`] = { value: invNo };
      cells[`B${r}`] = { value: gst };
      cells[`C${r}`] = { value: String(amt) };
      cells[`D${r}`] = { value: String(Math.round(amt * 0.18)) }; // GST 18%
      baseSum += amt;
    }

    const targetRow = rowCount + 1;
    cells[`B${targetRow}`] = { value: 'Total Base Sum', bold: true };
    cells[`C${targetRow}`] = { value: '' };

    expectedValue = baseSum;
    expectedFormulas = [
      `=SUM(C2:C${rowCount})`,
      `=sum(c2:c${rowCount})`
    ];
    solutionFormula = `=SUM(C2:C${rowCount})`;
    task = `Calculate the total base sales sum in cell C${targetRow} from range C2 to C${rowCount}.`;
    hint = `Type =SUM(C2:C${rowCount}) in cell C${targetRow}.`;

  } else if (templateType === 'ExpenseTracker') {
    title = `${category} - Business Expense Tracker (#${num})`;
    scenario = `Summarize corporate department expenditures. Total row size is ${rowCount}.`;
    
    cells['A1'] = { value: 'Department', bold: true };
    cells['B1'] = { value: 'Expense ($)', bold: true };

    const departments = ['Marketing', 'Sales', 'HR', 'IT', 'Operations', 'Finance', 'Legal', 'Support'];
    let totalExpense = 0;
    for (let r = 2; r <= rowCount; r++) {
      const dept = selectValue(departments, r);
      const cost = 200 + (Math.abs(num + r) % 15) * 100;
      cells[`A${r}`] = { value: `${dept} - Unit ${r}` };
      cells[`B${r}`] = { value: String(cost) };
      totalExpense += cost;
    }

    const targetRow = rowCount + 1;
    cells[`A${targetRow}`] = { value: 'Grand Total', bold: true };
    cells[`B${targetRow}`] = { value: '' };

    expectedValue = totalExpense;
    expectedFormulas = [
      `=SUM(B2:B${rowCount})`,
      `=sum(b2:b${rowCount})`
    ];
    solutionFormula = `=SUM(B2:B${rowCount})`;
    task = `Sum up the total expenses in cell B${targetRow} from range B2 to B${rowCount}.`;
    hint = `Type =SUM(B2:B${rowCount}) in B${targetRow}.`;

  } else {
    // Default template: Sales Register
    title = `${category} - Regional Sales Register (#${num})`;
    scenario = `Review retail units sales registers in cities. Total row size is ${rowCount}.`;
    
    cells['A1'] = { value: 'City', bold: true };
    cells['B1'] = { value: 'Product SKU', bold: true };
    cells['C1'] = { value: 'Sales Amount', bold: true };

    let maxSales = 0;
    for (let r = 2; r <= rowCount; r++) {
      const city = selectValue(indianCities, r);
      const prod = selectValue(products, r);
      const sales = 1500 + (Math.abs(num + r) % 8) * 800;
      cells[`A${r}`] = { value: city };
      cells[`B${r}`] = { value: prod };
      cells[`C${r}`] = { value: String(sales) };
      if (sales > maxSales) maxSales = sales;
    }

    const targetRow = rowCount + 1;
    cells[`B${targetRow}`] = { value: 'Max Sale Value', bold: true };
    cells[`C${targetRow}`] = { value: '' };

    expectedValue = maxSales;
    expectedFormulas = [
      `=MAX(C2:C${rowCount})`,
      `=max(c2:c${rowCount})`
    ];
    solutionFormula = `=MAX(C2:C${rowCount})`;
    task = `Find the maximum sale value in cell C${targetRow} from range C2 to C${rowCount}.`;
    hint = `Type =MAX(C2:C${rowCount}) in C${targetRow}.`;
  }

  return {
    id: `q-gen-${num}`,
    questionNum: num,
    category,
    difficulty,
    title,
    description: `Solve this practical ${category} case study exercise using Excel formulas.`,
    scenario,
    task,
    estimatedTime: `${3 + (num % 5)} min`,
    initialGrid: {
      rowCount: rowCount + 2,
      colCount: 5,
      cells
    },
    targetCell: expectedFormulas[0].match(/:([A-Z]\d+)/)?.[1] || 'B2', // dynamically matches the target cell B[N]
    expectedFormulas,
    expectedValue,
    hint,
    formulaSyntax: `=FORMULA(cell_coordinates)`,
    formulaExample: solutionFormula,
    solutionFormula,
    explanation: `Perfect! The spreadsheet calculated the formulas dynamic evaluations matching this unique dataset.`,
    solution: solutionFormula,
    relatedLesson: `Lesson related to ${category}`
  };
}

// Generate the catalog list of challenges (let's populate 20 per category, giving 340+ base challenges)
const catalogQuestions: Question[] = [];
let idx = 5;
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
