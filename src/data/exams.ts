import { Exam, Question } from '../types';
import { practiceQuestionsData, generateQuestion } from './practiceQuestions';

export const examsData: Exam[] = [
  {
    id: 'beginner-exam',
    title: 'Beginner Excel Certification',
    difficulty: 'Beginner',
    timeLimitSeconds: 1800, // 30 minutes
    questions: []
  },
  {
    id: 'intermediate-exam',
    title: 'Intermediate Excel Certification',
    difficulty: 'Intermediate',
    timeLimitSeconds: 1800,
    questions: []
  },
  {
    id: 'advanced-exam',
    title: 'Advanced Excel Certification',
    difficulty: 'Advanced',
    timeLimitSeconds: 1800,
    questions: []
  },
  {
    id: 'accountant-exam',
    title: 'Corporate Accountant Certification',
    difficulty: 'Job Ready',
    timeLimitSeconds: 1800,
    questions: []
  },
  {
    id: 'mis-exam',
    title: 'MIS Executive Certification',
    difficulty: 'Job Ready',
    timeLimitSeconds: 1800,
    questions: []
  },
  {
    id: 'hr-exam',
    title: 'HR & Payroll Specialist Certification',
    difficulty: 'Job Ready',
    timeLimitSeconds: 1800,
    questions: []
  },
  {
    id: 'data-entry-exam',
    title: 'Data Entry Operator Certification',
    difficulty: 'Beginner',
    timeLimitSeconds: 1800,
    questions: []
  },
  {
    id: 'office-admin-exam',
    title: 'Office Administration Certification',
    difficulty: 'Intermediate',
    timeLimitSeconds: 1800,
    questions: []
  }
];

// Dynamically retrieve exactly 30 shuffled questions matching the exam filters from the question bank
export function getQuestionsForExam(examId: string): Question[] {
  let pool = [...practiceQuestionsData];

  if (examId === 'beginner-exam') {
    pool = practiceQuestionsData.filter(q => q.difficulty === 'Beginner');
  } else if (examId === 'intermediate-exam') {
    pool = practiceQuestionsData.filter(q => q.difficulty === 'Intermediate');
  } else if (examId === 'advanced-exam') {
    pool = practiceQuestionsData.filter(q => q.difficulty === 'Advanced');
  } else if (examId === 'accountant-exam') {
    pool = practiceQuestionsData.filter(q => q.category === 'Accounting' || q.category === 'GST' || q.category === 'Payroll');
  } else if (examId === 'mis-exam') {
    pool = practiceQuestionsData.filter(q => q.category === 'MIS' || q.category === 'Dashboard' || q.category === 'Charts');
  } else if (examId === 'hr-exam') {
    pool = practiceQuestionsData.filter(q => q.category === 'HR' || q.category === 'Attendance' || q.category === 'Payroll');
  } else if (examId === 'data-entry-exam') {
    pool = practiceQuestionsData.filter(q => q.category === 'Data Entry' || q.category === 'Formatting');
  } else if (examId === 'office-admin-exam') {
    pool = practiceQuestionsData.filter(q => q.category === 'Office Admin' || q.category === 'Basic');
  }

  // Shuffle matching items randomly
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 30);

  // If pool size is less than 30, generate fresh dynamic filler questions to guarantee exactly 30 questions
  let fillerIdx = 500;
  while (selected.length < 30) {
    const fillerQ = generateQuestion(fillerIdx++);
    if (!selected.some(q => q.id === fillerQ.id)) {
      selected.push(fillerQ);
    }
  }

  // Number the chosen questions sequentially for the active exam session
  return selected.map((q, idx) => ({
    ...q,
    questionNum: idx + 1
  }));
}
