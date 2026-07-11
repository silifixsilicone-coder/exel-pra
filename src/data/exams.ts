import { Exam } from '../types';

export const examsData: Exam[] = [
  {
    id: 'beginner-exam',
    title: 'Beginner Certification Exam',
    difficulty: 'Beginner',
    timeLimitSeconds: 600, // 10 minutes
    questions: [
      {
        id: 'eb-q1',
        questionNum: 1,
        category: 'Excel Basics',
        difficulty: 'Beginner',
        title: 'Basic Addition',
        description: 'Verify basic addition skills by referencing two cells.',
        scenario: 'Calculate the total headcount by combining permanent employees and contractors.',
        task: 'In cell C2, write a formula to add cells A2 and B2.',
        estimatedTime: '2 min',
        initialGrid: {
          rowCount: 3,
          colCount: 4,
          cells: {
            A1: { value: 'Permanent Staff', bold: true },
            B1: { value: 'Contractors', bold: true },
            C1: { value: 'Total Staff', bold: true },
            A2: { value: '45' },
            B2: { value: '12' },
            C2: { value: '' }
          }
        },
        targetCell: 'C2',
        expectedFormulas: ['=A2+B2', '=B2+A2', '=a2+b2', '=b2+a2', '=SUM(A2:B2)', '=sum(a2:b2)'],
        expectedValue: 57,
        hint: 'Use =A2+B2 in cell C2.',
        formulaSyntax: '=A2+B2',
        formulaExample: '=A2+B2',
        solutionFormula: '=A2+B2'
      },
      {
        id: 'eb-q2',
        questionNum: 2,
        category: 'Basic Formulas',
        difficulty: 'Beginner',
        title: 'Sum of Values',
        description: 'Sum the values of a dataset.',
        scenario: 'Calculate the total units sold in the inventory report.',
        task: 'Use SUM in cell B5 to calculate the total units from B2 to B4.',
        estimatedTime: '3 min',
        initialGrid: {
          rowCount: 6,
          colCount: 3,
          cells: {
            A1: { value: 'Product', bold: true },
            B1: { value: 'Units Sold', bold: true },
            A2: { value: 'Laptop' },
            B2: { value: '150' },
            A3: { value: 'Phone' },
            B3: { value: '300' },
            A4: { value: 'Tablet' },
            B4: { value: '120' },
            A5: { value: 'Total Units', bold: true },
            B5: { value: '' }
          }
        },
        targetCell: 'B5',
        expectedFormulas: ['=SUM(B2:B4)', '=sum(b2:b4)', '=SUM(B2:B4)'],
        expectedValue: 570,
        hint: 'Enter =SUM(B2:B4) in cell B5.',
        formulaSyntax: '=SUM(range)',
        formulaExample: '=SUM(B2:B4)',
        solutionFormula: '=SUM(B2:B4)'
      },
      {
        id: 'eb-q3',
        questionNum: 3,
        category: 'Basic Formulas',
        difficulty: 'Beginner',
        title: 'Average Test Scores',
        description: 'Calculate average values using the AVERAGE function.',
        scenario: 'Find the average test score achieved by a group of students.',
        task: 'Enter the AVERAGE formula in cell B6 to average the scores from B2 to B5.',
        estimatedTime: '3 min',
        initialGrid: {
          rowCount: 7,
          colCount: 3,
          cells: {
            A1: { value: 'Student', bold: true },
            B1: { value: 'Score', bold: true },
            A2: { value: 'Kevin' },
            B2: { value: '95' },
            A3: { value: 'Sarah' },
            B3: { value: '88' },
            A4: { value: 'Dave' },
            B4: { value: '72' },
            A5: { value: 'Tina' },
            B5: { value: '85' },
            A6: { value: 'Average Score', bold: true },
            B6: { value: '' }
          }
        },
        targetCell: 'B6',
        expectedFormulas: ['=AVERAGE(B2:B5)', '=average(b2:b5)'],
        expectedValue: 85, // (95 + 88 + 72 + 85) / 4 = 340 / 4 = 85
        hint: 'Use =AVERAGE(B2:B5) in cell B6.',
        formulaSyntax: '=AVERAGE(range)',
        formulaExample: '=AVERAGE(B2:B5)',
        solutionFormula: '=AVERAGE(B2:B5)'
      }
    ]
  },
  {
    id: 'intermediate-exam',
    title: 'Intermediate Certification Exam',
    difficulty: 'Intermediate',
    timeLimitSeconds: 900, // 15 minutes
    questions: [
      {
        id: 'ie-q1',
        questionNum: 1,
        category: 'Logical Functions',
        difficulty: 'Intermediate',
        title: 'Grade Evaluation',
        description: 'Evaluate score records to check if they passed.',
        scenario: 'The passing mark for this subject is 50. Evaluate cell B2.',
        task: 'In cell C2, write an IF statement to check B2. If it is 50 or above, output "Pass"; otherwise, output "Fail".',
        estimatedTime: '3 min',
        initialGrid: {
          rowCount: 3,
          colCount: 4,
          cells: {
            A1: { value: 'Student', bold: true },
            B1: { value: 'Score', bold: true },
            C1: { value: 'Grade', bold: true },
            A2: { value: 'Lars Ulrich' },
            B2: { value: '48' },
            C2: { value: '' }
          }
        },
        targetCell: 'C2',
        expectedFormulas: [
          '=IF(B2>=50, "Pass", "Fail")',
          '=if(b2>=50,"Pass","Fail")',
          '=IF(B2>=50,"Pass","Fail")',
          '=if(b2>=50, "Pass", "Fail")'
        ],
        expectedValue: 'Fail',
        hint: 'Type =IF(B2>=50, "Pass", "Fail") in cell C2.',
        formulaSyntax: '=IF(condition, true_val, false_val)',
        formulaExample: '=IF(B2>=50, "Pass", "Fail")',
        solutionFormula: '=IF(B2>=50, "Pass", "Fail")'
      },
      {
        id: 'ie-q2',
        questionNum: 2,
        category: 'Lookup Functions',
        difficulty: 'Intermediate',
        title: 'Employee Department VLOOKUP',
        description: 'Retrieve matching details using vertical lookup.',
        scenario: 'Find the department of the employee code specified in cell E2.',
        task: 'In cell F2, write a VLOOKUP formula to look up the value in E2 within table A2:C5. Retrieve the department name from the 3rd column. Use FALSE for exact matching.',
        estimatedTime: '5 min',
        initialGrid: {
          rowCount: 6,
          colCount: 7,
          cells: {
            A1: { value: 'Code', bold: true },
            B1: { value: 'Name', bold: true },
            C1: { value: 'Department', bold: true },
            A2: { value: 'EMP-01' },
            B2: { value: 'John' },
            C2: { value: 'Sales' },
            A3: { value: 'EMP-02' },
            B3: { value: 'Jane' },
            C3: { value: 'Marketing' },
            A4: { value: 'EMP-03' },
            B4: { value: 'Jim' },
            C4: { value: 'HR' },
            A5: { value: 'EMP-04' },
            B5: { value: 'Jack' },
            C5: { value: 'Engineering' },
            E1: { value: 'Lookup Code', bold: true },
            F1: { value: 'Dept Output', bold: true },
            E2: { value: 'EMP-03', bold: true },
            F2: { value: '' }
          }
        },
        targetCell: 'F2',
        expectedFormulas: [
          '=VLOOKUP(E2, A2:C5, 3, FALSE)',
          '=vlookup(e2,a2:c5,3,false)',
          '=VLOOKUP(E2, A2:C5, 3, 0)',
          '=vlookup(e2, a2:c5, 3, false)'
        ],
        expectedValue: 'HR',
        hint: 'Use =VLOOKUP(E2, A2:C5, 3, FALSE) in cell F2.',
        formulaSyntax: '=VLOOKUP(value, table, col, false)',
        formulaExample: '=VLOOKUP(E2, A2:C5, 3, FALSE)',
        solutionFormula: '=VLOOKUP(E2, A2:C5, 3, FALSE)'
      }
    ]
  },
  {
    id: 'advanced-exam',
    title: 'Advanced Certification Exam',
    difficulty: 'Advanced',
    timeLimitSeconds: 1200, // 20 minutes
    questions: [
      {
        id: 'ae-q1',
        questionNum: 1,
        category: 'Math Functions',
        difficulty: 'Advanced',
        title: 'Selective Cost Summing',
        description: 'Apply criteria-based summing with SUMIF.',
        scenario: 'Find the total costs incurred specifically for the "Marketing" category.',
        task: 'In cell B8, write a SUMIF formula to sum the values in range B2:B6 if the corresponding label in range A2:A6 is equal to "Marketing".',
        estimatedTime: '5 min',
        initialGrid: {
          rowCount: 9,
          colCount: 3,
          cells: {
            A1: { value: 'Category', bold: true },
            B1: { value: 'Cost ($)', bold: true },
            A2: { value: 'Marketing' },
            B2: { value: '1500' },
            A3: { value: 'Development' },
            B3: { value: '5000' },
            A4: { value: 'Marketing' },
            B4: { value: '2500' },
            A5: { value: 'HR' },
            B5: { value: '800' },
            A6: { value: 'Marketing' },
            B6: { value: '1200' },
            A8: { value: 'Marketing Total', bold: true },
            B8: { value: '' }
          }
        },
        targetCell: 'B8',
        expectedFormulas: [
          '=SUMIF(A2:A6, "Marketing", B2:B6)',
          '=sumif(a2:a6,"Marketing",b2:b6)',
          '=SUMIF(A2:A6,"Marketing",B2:B6)',
          '=sumif(a2:a6, "Marketing", B2:B6)'
        ],
        expectedValue: 5200, // 1500 + 2500 + 1200 = 5200
        hint: 'Use =SUMIF(A2:A6, "Marketing", B2:B6) in B8.',
        formulaSyntax: '=SUMIF(range, criteria, sum_range)',
        formulaExample: '=SUMIF(A2:A6, "Marketing", B2:B6)',
        solutionFormula: '=SUMIF(A2:A6, "Marketing", B2:B6)'
      }
    ]
  }
];
