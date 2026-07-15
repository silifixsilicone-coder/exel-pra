export interface CurriculumCategory {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
}

export const curriculumCategories: CurriculumCategory[] = [
  {
    id: 'excel-basics',
    name: 'Excel Basics',
    description: 'Learn layout, navigation, grid coordinate basics, and entering data.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'Master font styles, cell borders, alignment, number, and currency formats.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'cell-references',
    name: 'Cell References',
    description: 'Learn relative, absolute ($A$1), and mixed reference types.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'basic-formulas',
    name: 'Basic Formulas',
    description: 'Implement core arithmetic operations and quick SUM, AVERAGE, MIN, and MAX aggregations.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'logical-functions',
    name: 'Logical Functions',
    description: 'Analyze criteria logs using logical checks like IF, AND, OR, XOR, and IFERROR.',
    difficulty: 'Intermediate',
    lessonsCount: 10
  },
  {
    id: 'text-functions',
    name: 'Text Functions',
    description: 'Manipulate text strings with CONCAT, LEFT, RIGHT, MID, LEN, and TRIM.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'date-time',
    name: 'Date & Time',
    description: 'Work with dates, calendar metrics, and timestamps using TODAY, NOW, DATEDIF, and YEAR.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'lookup-functions',
    name: 'Lookup Functions',
    description: 'Retrieve values across tables with VLOOKUP, HLOOKUP, XLOOKUP, INDEX, and MATCH.',
    difficulty: 'Intermediate',
    lessonsCount: 10
  },
  {
    id: 'math-statistical',
    name: 'Math & Statistical',
    description: 'Master advanced math calculations with SUMIF, SUMIFS, COUNTIF, COUNTIFS, and ROUND.',
    difficulty: 'Advanced',
    lessonsCount: 10
  },
  {
    id: 'data-cleaning',
    name: 'Data Cleaning',
    description: 'Clean raw data records, strip whitespace, remove duplicates, and resolve errors.',
    difficulty: 'Intermediate',
    lessonsCount: 10
  },
  {
    id: 'sorting-filtering',
    name: 'Sorting & Filtering',
    description: 'Organize data arrays, sort values alphabetically, and filter specific metrics.',
    difficulty: 'Beginner',
    lessonsCount: 10
  },
  {
    id: 'conditional-formatting',
    name: 'Conditional Formatting',
    description: 'Highlight cells dynamically based on numeric thresholds and text matches.',
    difficulty: 'Intermediate',
    lessonsCount: 10
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    description: 'Restrict inputs using custom dropdown lists, range bounds, and cell error popups.',
    difficulty: 'Intermediate',
    lessonsCount: 10
  },
  {
    id: 'charts',
    name: 'Charts',
    description: 'Visualize data values using column, bar, line, pie, scatter, and area graphs.',
    difficulty: 'Intermediate',
    lessonsCount: 10
  },
  {
    id: 'pivot-tables',
    name: 'Pivot Tables',
    description: 'Group, summarize, filter, and drill down into bulk databases dynamically.',
    difficulty: 'Advanced',
    lessonsCount: 10
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Assemble dynamic summary panels, KPI cards, milestone trackers, and heat maps.',
    difficulty: 'Advanced',
    lessonsCount: 10
  },
  {
    id: 'mis-reporting',
    name: 'MIS Reporting',
    description: 'Compile management information audit reports, variance registers, and P&L sheets.',
    difficulty: 'Advanced',
    lessonsCount: 10
  },
  {
    id: 'automation-basics',
    name: 'Automation Basics',
    description: 'Learn the basic concepts of automated worksheets, macro recording, and scripting loops.',
    difficulty: 'Advanced',
    lessonsCount: 10
  },
  {
    id: 'power-query',
    name: 'Power Query Basics',
    description: 'Connect, transform, shape, and merge multiple database spreadsheets dynamically.',
    difficulty: 'Advanced',
    lessonsCount: 10
  },
  {
    id: 'tips-tricks',
    name: 'Excel Tips & Tricks',
    description: 'Learn keyboard binding shortcuts, flash fill, paste special, and optimization tips.',
    difficulty: 'Beginner',
    lessonsCount: 10
  }
];
