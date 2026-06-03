import Link from 'next/link';
import { QuizSummary } from '@/types';

interface QuizCardProps {
  quiz: QuizSummary;
  onDelete: (id: string) => void;
}

export function QuizCard({ quiz, onDelete }: QuizCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
      <Link href={`/quizzes/${quiz.id}`} className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {quiz.title}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''} ·{' '}
          {new Date(quiz.createdAt).toLocaleDateString()}
        </p>
      </Link>
      <button
        onClick={() => onDelete(quiz.id)}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Delete quiz"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
