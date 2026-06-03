import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuiz } from '@/services/api';
import { Question } from '@/types';

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = await getQuiz(id).catch(() => null);
  if (!quiz) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/quizzes"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          ← Back to quizzes
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {quiz.title}
          </h1>
          <p className="text-gray-500 mt-1">
            {quiz.questions.length} question
            {quiz.questions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, idx) => (
            <QuestionDetail key={q.id} question={q} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionDetail({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const typeLabel: Record<string, string> = {
    boolean: 'True / False',
    input: 'Text Input',
    checkbox: 'Multiple Choice',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Q{index + 1}
        </span>
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          {typeLabel[question.type] ?? question.type}
        </span>
      </div>

      <p className="text-base sm:text-lg font-medium text-gray-900 mb-4">
        {question.text}
      </p>

      {question.type === 'boolean' && (
        <div className="flex gap-3">
          {(['True', 'False'] as const).map((label) => {
            const isCorrect =
              (label === 'True' && question.answer === true) ||
              (label === 'False' && question.answer === false);
            return (
              <span
                key={label}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  isCorrect
                    ? 'bg-green-100 text-green-800 ring-1 ring-green-300'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {label}
                {isCorrect && ' ✓'}
              </span>
            );
          })}
        </div>
      )}

      {question.type === 'input' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-xs text-green-600 font-medium uppercase tracking-wide">
            Answer:
          </span>
          <span className="font-medium text-green-800">
            {question.correctAnswer}
          </span>
        </div>
      )}

      {question.type === 'checkbox' && question.options && (
        <ul className="space-y-2">
          {question.options.map((opt) => (
            <li
              key={opt.id}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                opt.isCorrect
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-100'
              }`}
            >
              <span
                className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center ${
                  opt.isCorrect
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}
              >
                {opt.isCorrect && (
                  <svg
                    viewBox="0 0 10 8"
                    className="w-2.5 h-2 text-white fill-current"
                  >
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                )}
              </span>
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
