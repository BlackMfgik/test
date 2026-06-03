'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QuizCard } from '@/components/QuizCard';
import { getQuizzes, deleteQuiz } from '@/services/api';
import { QuizSummary } from '@/types';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuizzes()
      .then(setQuizzes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quizzes
          </h1>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-4">No quizzes yet.</p>
            <Link href="/create" className="text-blue-600 hover:underline">
              Create your first quiz →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
