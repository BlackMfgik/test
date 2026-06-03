import { Quiz, QuizSummary } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getQuizzes(): Promise<QuizSummary[]> {
  const res = await fetch(`${BASE_URL}/quizzes`);
  if (!res.ok) throw new Error('Failed to fetch quizzes');
  return res.json();
}

export async function getQuiz(id: string): Promise<Quiz> {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}

export async function createQuiz(data: { title: string; questions: unknown[] }): Promise<Quiz> {
  const res = await fetch(`${BASE_URL}/quizzes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create quiz' }));
    throw new Error(err.error || 'Failed to create quiz');
  }
  return res.json();
}

export async function deleteQuiz(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete quiz');
}
