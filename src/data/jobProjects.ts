import { JobProject } from '../types';

const manualQuestions: JobProject[] = [
  {
    id: 'salary-sheet',
    category: 'Accountant',
    title: 'Company Payroll & Salary Sheet',
    description: 'Calculate house rent allowance (HRA), dearness allowance (DA), and Gross Salary for company employees.',
    scenario: 'You are the payroll accountant at TechCorp. The HR department has sent you the basic salary details for three engineers. You must complete the salary sheet by calculating HRA (10% of Basic Pay), DA (5% of Basic Pay), and Gross Pay.',
    tasks: [
      'In cell C2, calculate the HRA (10% of Basic Pay) by writing =B2*0.1.',
      'Fill down the HRA formulas for cells C3 and C4 (=B3*0.1 and =B4*0.1).',
      'In cell E2, calculate the Gross Pay (Basic Pay + HRA + DA) by writing =B2+C2+D2 (or =SUM(B2:D2)).',
      'Fill down the Gross Pay formulas for cells E3 and E4.'
    ],
    initialGrid: {
      rowCount: 5,
      colCount: 6,
      cells: {
        A1: { value: 'Employee', bold: true },
        B1: { value: 'Basic Pay ($)', bold: true },
        C1: { value: 'HRA ($) [10%]', bold: true },
        D1: { value: 'DA ($) [5%]', bold: true },
        E1: { value: 'Gross Pay ($)', bold: true },
        A2: { value: 'Elena Gilbert' },
        B2: { value: '5000' },
        C2: { value: '' },
        D2: { value: '250' }, // 5% of 5000 is 250
        E2: { value: '' },
        A3: { value: 'Stefan Salvatore' },
        B3: { value: '7000' },
        C3: { value: '' },
        D3: { value: '350' }, // 5% of 7000 is 350
        E3: { value: '' },
        A4: { value: 'Damon Salvatore' },
        B4: { value: '8000' },
        C4: { value: '' },
        D4: { value: '400' }, // 5% of 8000 is 400
        E4: { value: '' }
      }
    },
    validationRules: [
      {
        targetCell: 'C2',
        expectedFormulas: ['=B2*0.1', '=B2*10%', '=b2*0.1', '=b2*10%', '=B2*0.10', '=b2*0.10'],
        expectedValue: 500,
        checkType: 'value',
        description: 'Elena\'s HRA (10% of Basic Pay)'
      },
      {
        targetCell: 'C3',
        expectedFormulas: ['=B3*0.1', '=B3*10%', '=b3*0.1', '=b3*10%', '=B3*0.10', '=b3*0.10'],
        expectedValue: 700,
        checkType: 'value',
        description: 'Stefan\'s HRA (10% of Basic Pay)'
      },
      {
        targetCell: 'C4',
        expectedFormulas: ['=B4*0.1', '=B4*10%', '=b4*0.1', '=b4*10%', '=B4*0.10', '=b4*0.10'],
        expectedValue: 800,
        checkType: 'value',
        description: 'Damon\'s HRA (10% of Basic Pay)'
      },
      {
        targetCell: 'E2',
        expectedFormulas: ['=B2+C2+D2', '=SUM(B2:D2)', '=sum(b2:d2)', '=b2+c2+d2'],
        expectedValue: 5750,
        checkType: 'value',
        description: 'Elena\'s Gross Pay (Basic + HRA + DA)'
      },
      {
        targetCell: 'E3',
        expectedFormulas: ['=B3+C3+D3', '=SUM(B3:D3)', '=sum(b3:d3)', '=b3+c3+d3'],
        expectedValue: 8050,
        checkType: 'value',
        description: 'Stefan\'s Gross Pay (Basic + HRA + DA)'
      },
      {
        targetCell: 'E4',
        expectedFormulas: ['=B4+C4+D4', '=SUM(B4:D4)', '=sum(b4:d4)', '=b4+c4+d4'],
        expectedValue: 9200,
        checkType: 'value',
        description: 'Damon\'s Gross Pay (Basic + HRA + DA)'
      }
    ],
    hints: [
      'To calculate HRA in C2, select cell C2 and write =B2*0.1. (Or =B2*10%)',
      'For Gross Pay in E2, select cell E2 and write =B2+C2+D2 or =SUM(B2:D2).',
      'Remember to copy the formulas down for Row 3 and Row 4.'
    ]
  },
  {
    id: 'gst-invoice',
    category: 'Office Admin',
    title: 'Customer Invoice & GST Tax',
    description: 'Calculate item totals, 18% GST amounts, and final order invoice totals.',
    scenario: 'You are working as an office admin. A client purchased multiple laptops, keyboards, and monitors. Complete the sales quotation by calculating the line item amounts, the GST tax, and the final grand total.',
    tasks: [
      'In cell D2, calculate the Amount (Price * Qty) by writing =B2*C2.',
      'Copy the formula down to D3 and D4.',
      'In cell E2, calculate the GST tax (18% of Amount) by writing =D2*0.18.',
      'Copy the formula down to E3 and E4.',
      'In cell F2, calculate the Total (Amount + GST) by writing =D2+E2.',
      'Copy the formula down to F3 and F4.'
    ],
    initialGrid: {
      rowCount: 5,
      colCount: 7,
      cells: {
        A1: { value: 'Item Description', bold: true },
        B1: { value: 'Price ($)', bold: true },
        C1: { value: 'Qty', bold: true },
        D1: { value: 'Amount ($)', bold: true },
        E1: { value: 'GST ($) [18%]', bold: true },
        F1: { value: 'Total ($)', bold: true },
        A2: { value: 'Business Laptop' },
        B2: { value: '1200' },
        C2: { value: '3' },
        D2: { value: '' },
        E2: { value: '' },
        F2: { value: '' },
        A3: { value: 'Mechanical Keyboard' },
        B3: { value: '150' },
        C3: { value: '10' },
        D3: { value: '' },
        E3: { value: '' },
        F3: { value: '' },
        A4: { value: '4K Monitor' },
        B4: { value: '400' },
        C4: { value: '5' },
        D4: { value: '' },
        E4: { value: '' },
        F4: { value: '' }
      }
    },
    validationRules: [
      {
        targetCell: 'D2',
        expectedFormulas: ['=B2*C2', '=C2*B2', '=b2*c2', '=c2*b2'],
        expectedValue: 3600,
        checkType: 'value',
        description: 'Laptop Amount (Price * Qty)'
      },
      {
        targetCell: 'E2',
        expectedFormulas: ['=D2*0.18', '=D2*18%', '=d2*0.18', '=d2*18%'],
        expectedValue: 648,
        checkType: 'value',
        description: 'Laptop GST Tax (18%)'
      },
      {
        targetCell: 'F2',
        expectedFormulas: ['=D2+E2', '=E2+D2', '=d2+e2', '=e2+d2', '=SUM(D2:E2)', '=sum(d2:e2)'],
        expectedValue: 4248,
        checkType: 'value',
        description: 'Laptop Total Cost'
      },
      {
        targetCell: 'D3',
        expectedFormulas: ['=B3*C3', '=C3*B3', '=b3*c3', '=c3*b3'],
        expectedValue: 1500,
        checkType: 'value',
        description: 'Keyboard Amount (Price * Qty)'
      },
      {
        targetCell: 'E3',
        expectedFormulas: ['=D3*0.18', '=D3*18%', '=d3*0.18', '=d3*18%'],
        expectedValue: 270,
        checkType: 'value',
        description: 'Keyboard GST Tax (18%)'
      },
      {
        targetCell: 'F3',
        expectedFormulas: ['=D3+E3', '=E3+D3', '=d3+e3', '=e3+d3', '=SUM(D3:E3)', '=sum(d3:e3)'],
        expectedValue: 1770,
        checkType: 'value',
        description: 'Keyboard Total Cost'
      },
      {
        targetCell: 'D4',
        expectedFormulas: ['=B4*C4', '=C4*B4', '=b4*c4', '=c4*b4'],
        expectedValue: 2000,
        checkType: 'value',
        description: 'Monitor Amount (Price * Qty)'
      },
      {
        targetCell: 'E4',
        expectedFormulas: ['=D4*0.18', '=D4*18%', '=d4*0.18', '=d4*18%'],
        expectedValue: 360,
        checkType: 'value',
        description: 'Monitor GST Tax (18%)'
      },
      {
        targetCell: 'F4',
        expectedFormulas: ['=D4+E4', '=E4+D4', '=d4+e4', '=e4+d4', '=SUM(D4:E4)', '=sum(d4:e4)'],
        expectedValue: 2360,
        checkType: 'value',
        description: 'Monitor Total Cost'
      }
    ],
    hints: [
      'In D2, write =B2*C2. Copy it down to row 3 and 4 by writing B3*C3 and B4*C4.',
      'In E2, write =D2*0.18 to find the tax. Copy it down to row 3 and 4.',
      'In F2, sum the Amount and GST: =D2+E2. Copy it down to row 3 and 4.'
    ]
  },
  {
    id: 'mis-dashboard',
    category: 'MIS Executive',
    title: 'MIS Quarterly Sales Summary',
    description: 'Summarize quarterly regional sales data and calculate overall corporate revenue.',
    scenario: 'As an MIS Executive, you are tasked with preparing the quarterly executive briefing sheet. Sum the quarterly sales for each region, and then compute the corporate grand total.',
    tasks: [
      'In cell F2, sum the sales for the North region across Q1-Q4 (=SUM(B2:E2)).',
      'In cell F3, sum the sales for the South region across Q1-Q4 (=SUM(B3:E3)).',
      'In cell F4, sum the sales for the East region across Q1-Q4 (=SUM(B4:E4)).',
      'In cell F5, calculate the Grand Total of all regional sales (=SUM(F2:F4)).'
    ],
    initialGrid: {
      rowCount: 6,
      colCount: 7,
      cells: {
        A1: { value: 'Region', bold: true },
        B1: { value: 'Q1 Sales ($)', bold: true },
        C1: { value: 'Q2 Sales ($)', bold: true },
        D1: { value: 'Q3 Sales ($)', bold: true },
        E1: { value: 'Q4 Sales ($)', bold: true },
        F1: { value: 'Total Sales ($)', bold: true },
        A2: { value: 'North' },
        B2: { value: '45000' },
        C2: { value: '48000' },
        D2: { value: '52000' },
        E2: { value: '55000' },
        F2: { value: '' },
        A3: { value: 'South' },
        B3: { value: '38000' },
        C3: { value: '41000' },
        D3: { value: '39000' },
        E3: { value: '42000' },
        F3: { value: '' },
        A4: { value: 'East' },
        B4: { value: '56000' },
        C4: { value: '60000' },
        D4: { value: '58000' },
        E4: { value: '62000' },
        F4: { value: '' },
        A5: { value: 'Grand Total', bold: true },
        B5: { value: '' },
        C5: { value: '' },
        D5: { value: '' },
        E5: { value: '' },
        F5: { value: '', bold: true }
      }
    },
    validationRules: [
      {
        targetCell: 'F2',
        expectedFormulas: ['=SUM(B2:E2)', '=sum(b2:e2)'],
        expectedValue: 200000,
        checkType: 'value',
        description: 'North region sales total'
      },
      {
        targetCell: 'F3',
        expectedFormulas: ['=SUM(B3:E3)', '=sum(b3:e3)'],
        expectedValue: 160000,
        checkType: 'value',
        description: 'South region sales total'
      },
      {
        targetCell: 'F4',
        expectedFormulas: ['=SUM(B4:E4)', '=sum(b4:e4)'],
        expectedValue: 236000,
        checkType: 'value',
        description: 'East region sales total'
      },
      {
        targetCell: 'F5',
        expectedFormulas: ['=SUM(F2:F4)', '=sum(f2:f4)'],
        expectedValue: 596000,
        checkType: 'value',
        description: 'Grand Total of all regions'
      }
    ],
    hints: [
      'In cell F2, type =SUM(B2:E2) and press Enter.',
      'Copy the SUM formula to F3 and F4 for the South and East regions.',
      'For the grand total in F5, sum the column totals: =SUM(F2:F4).'
    ]
  }
];

// Reusable Indian Corporate Datasets
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

const jobCategories: JobProject['category'][] = [
  'Accountant',
  'MIS Executive',
  'Office Admin',
  'Data Entry Operator',
  'Business Owner'
];

const jobTemplates = [
  'Salary Sheet', 'Attendance Tracker', 'GST Invoice Builder', 'Inventory Log',
  'Sales Summary', 'Purchase Order Register', 'Expense Audit Tracker', 'Cash Book Balance',
  'Payroll Registry', 'Customer CRM Database', 'Employee Record Register', 'Stock Inventory Sheet',
  'Client Quotation', 'MIS Executive Report', 'KPI Performance Dashboard', 'Bank Reconciliation Ledger',
  'Monthly Revenue Report'
];

const generatedJobs: JobProject[] = [];
let jobIdx = 4; // Start generating from ID index 4 onwards

jobCategories.forEach((role) => {
  for (let i = 1; i <= 20; i++) {
    const numId = jobIdx++;
    const template = jobTemplates[numId % jobTemplates.length];
    
    const difficulty: JobProject['difficulty'] = 
      numId % 4 === 0 ? 'Job Ready' : numId % 3 === 0 ? 'Advanced' : numId % 2 === 0 ? 'Intermediate' : 'Beginner';

    const empName1 = indianNames[numId % indianNames.length];
    const empName2 = indianNames[(numId + 1) % indianNames.length];
    const city = indianCities[numId % indianCities.length];
    const item = products[numId % products.length];

    const valA2 = 2000 + (numId % 10) * 500;
    const valB2 = 1000 + (numId % 5) * 200;

    let expectedValue = valA2 + valB2;
    let taskDesc = `In cell C2, calculate totals using =A2+B2.`;
    let expectedFormulas = [`=A2+B2`, `=a2+b2`, `=SUM(A2:B2)`, `=sum(a2:b2)`];
    
    let cells: Record<string, { value: string; bold?: boolean }> = {
      A1: { value: 'Base Value A', bold: true },
      B1: { value: 'Value B', bold: true },
      C1: { value: 'Computed Output', bold: true },
      A2: { value: String(valA2) },
      B2: { value: String(valB2) },
      C2: { value: '' },
      A3: { value: 'Elena Gilbert' },
      B3: { value: '1500' },
      C3: { value: '3500' } // Pre-populated for reference
    };

    if (template.includes('Invoice') || template.includes('Sales')) {
      taskDesc = `In cell C2, calculate the total line amount by multiplying Qty (A2) and Unit Price (B2).`;
      cells = {
        A1: { value: 'Quantity', bold: true },
        B1: { value: 'Unit Price ($)', bold: true },
        C1: { value: 'Total Amount', bold: true },
        A2: { value: '10' },
        B2: { value: '150' },
        C2: { value: '' }
      };
      expectedValue = 1500;
      expectedFormulas = [`=A2*B2`, `=a2*b2`];
    } else if (template.includes('Salary') || template.includes('Payroll')) {
      taskDesc = `In cell C2, calculate HRA allowance by multiplying Basic Pay (A2) by 10% (=A2*0.1).`;
      cells = {
        A1: { value: 'Basic Salary', bold: true },
        B1: { value: 'Allowances', bold: true },
        C1: { value: 'HRA (10%)', bold: true },
        A2: { value: '30000' },
        B2: { value: '2500' },
        C2: { value: '' }
      };
      expectedValue = 3000;
      expectedFormulas = [`=A2*0.1`, `=a2*0.1`, `=A2*10%`, `=a2*10%`];
    }

    generatedJobs.push({
      id: `job-gen-${numId}`,
      category: role,
      title: `${role} - ${template} (#${numId})`,
      description: `Complete the office ${template} sheet by evaluating required row metrics.`,
      scenario: `You are working as a ${role} at a corporate office in ${city}. You must complete this ${template} sheet detailing ${empName1} and ${empName2}'s registers.`,
      tasks: [
        taskDesc,
        `Verify output cells values are formatted correctly.`,
        `Click submit evaluation check.`
      ],
      initialGrid: {
        rowCount: 5,
        colCount: 4,
        cells
      },
      validationRules: [
        {
          targetCell: 'C2',
          expectedFormulas,
          expectedValue,
          checkType: 'value',
          description: `Line item calculations for target cell C2.`
        }
      ],
      hints: [
        `Select cell C2, type your formula starting with equal (=) sign.`,
        `Use cells A2 and B2 inside the calculation parameters.`
      ],
      difficulty,
      solution: `The expected formula is: ${expectedFormulas[0]}`
    });
  }
});

export const jobProjectsData: JobProject[] = [...manualQuestions, ...generatedJobs];
export const totalJobsCount = jobProjectsData.length;

