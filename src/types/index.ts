export interface CellData {
  value: string; // The raw input, e.g. "=SUM(A1:A3)" or "150"
  computed?: string | number | boolean; // Evaluated result
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  bgColor?: string; // background color hex or CSS class
  textColor?: string; // text color hex or CSS class
}

export type GridState = Record<string, CellData>; // key e.g. "A1", "B2"

export interface SpreadsheetState {
  cells: GridState;
  rowCount: number;
  colCount: number;
}

export interface FormulaGuide {
  name: string;
  category: string;
  syntax: string;
  description: string;
  example: string;
  explanation: string;
}

export interface MiniPractice {
  taskDescription: string;
  initialGrid: SpreadsheetState;
  targetCell: string;
  expectedFormulas: string[];
  expectedValue: string | number | boolean;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  explanation: string;
  syntax: string;
  example: string;
  exampleTableHeaders: string[];
  exampleTableRows: string[][];
  stepByStep: string[];
  commonMistakes: string[];
  miniPractice: MiniPractice;
  nextLessonId?: string;
  estimatedTime: string;
  summary: string;
  imagesPlaceholder?: string;
  miniQuiz?: {
    question: string;
    options: string[];
    answerIndex: number;
  };
}

export interface Question {
  id: string;
  questionNum: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  scenario: string;
  task: string;
  estimatedTime: string;
  initialGrid: SpreadsheetState;
  targetCell: string;
  expectedFormulas: string[];
  expectedValue: string | number | boolean;
  hint: string;
  formulaSyntax: string;
  formulaExample: string;
  solutionFormula: string;
  explanation?: string;
  solution?: string;
  relatedLesson?: string;
}

export interface JobValidationRule {
  targetCell: string;
  expectedFormulas?: string[];
  expectedValue?: string | number | boolean;
  checkType: 'formula' | 'value' | 'both';
  description: string;
}

export interface JobProject {
  id: string;
  category: 'Accountant' | 'MIS Executive' | 'Office Admin' | 'Data Entry Operator' | 'Business Owner';
  title: string;
  description: string;
  scenario: string;
  tasks: string[];
  initialGrid: SpreadsheetState;
  validationRules: JobValidationRule[];
  hints: string[];
}

export interface Exam {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Job Ready';
  timeLimitSeconds: number;
  questions: Question[];
}

export interface ExamResult {
  examId: string;
  score: number; // e.g. 80
  accuracy: number; // e.g. 80
  correctCount: number;
  wrongCount: number;
  date: string;
  completed: boolean;
}

export interface UserProgress {
  currentLessonId: string | null;
  completedLessonIds: string[];
  completedQuestionIds: string[];
  correctCount: number;
  wrongCount: number;
  questionStats: Record<string, { attempts: number; solved: boolean; lastFormula: string; isCorrect: boolean }>;
  jobProjectStats: Record<string, { completed: boolean; lastUpdated: string }>;
  examResults: ExamResult[];
}
