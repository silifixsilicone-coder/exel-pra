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
    description: 'Learn layout, cell referencing, and basic navigation.',
    difficulty: 'Beginner',
    lessonsCount: 1
  },
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'Format text, cell fills, currency, percentages, and borders.',
    difficulty: 'Beginner',
    lessonsCount: 0 // Will extend later
  },
  {
    id: 'basic-formulas',
    name: 'Basic Formulas',
    description: 'Master simple calculations, SUM, AVERAGE, MIN, and MAX.',
    difficulty: 'Beginner',
    lessonsCount: 1
  },
  {
    id: 'logical-functions',
    name: 'Logical Functions',
    description: 'Implement criteria checking with IF, AND, OR, and COUNTIF.',
    difficulty: 'Intermediate',
    lessonsCount: 1
  },
  {
    id: 'text-functions',
    name: 'Text Functions',
    description: 'Clean and manipulate strings with CONCAT, LEFT, RIGHT, and MID.',
    difficulty: 'Beginner',
    lessonsCount: 0
  },
  {
    id: 'date-functions',
    name: 'Date Functions',
    description: 'Calculate dates and timing with TODAY, NOW, and YEAR.',
    difficulty: 'Beginner',
    lessonsCount: 0
  },
  {
    id: 'lookup-functions',
    name: 'Lookup Functions',
    description: 'Search data across sheets with VLOOKUP, INDEX, and MATCH.',
    difficulty: 'Intermediate',
    lessonsCount: 1
  },
  {
    id: 'math-functions',
    name: 'Math Functions',
    description: 'Advanced summing and rounding using SUMIF, SUMIFS, and ROUND.',
    difficulty: 'Advanced',
    lessonsCount: 0
  },
  {
    id: 'charts',
    name: 'Charts',
    description: 'Visualize data using column, bar, line, and pie charts.',
    difficulty: 'Intermediate',
    lessonsCount: 0
  },
  {
    id: 'pivot-tables',
    name: 'Pivot Tables',
    description: 'Summarize large datasets dynamically without writing code.',
    difficulty: 'Advanced',
    lessonsCount: 0
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Design beautiful summary grids and dynamic panels.',
    difficulty: 'Advanced',
    lessonsCount: 0
  },
  {
    id: 'mis-reports',
    name: 'MIS Reports',
    description: 'Compile management information reports for business decisions.',
    difficulty: 'Advanced',
    lessonsCount: 0
  }
];
