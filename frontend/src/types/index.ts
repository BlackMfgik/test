export type QuestionType = 'boolean' | 'input' | 'checkbox';

export interface Option {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  answer?: boolean;
  correctAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}
