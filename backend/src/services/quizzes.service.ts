import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CreateQuestion = {
  type: string;
  text: string;
  answer?: boolean;
  correctAnswer?: string;
  options?: Array<{ label: string; isCorrect: boolean }>;
};

export async function createQuiz(data: {
  title: string;
  questions: CreateQuestion[];
}) {
  return prisma.quiz.create({
    data: {
      title: data.title,
      questions: {
        create: data.questions.map((q) => ({
          type: q.type,
          text: q.text,
          answer: q.answer,
          correctAnswer: q.correctAnswer,
          options: q.options ? { create: q.options } : undefined,
        })),
      },
    },
    include: {
      questions: {
        include: { options: true },
      },
    },
  });
}

export async function getQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz._count.questions,
    createdAt: quiz.createdAt.toISOString(),
  }));
}

export async function getQuizById(id: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: { options: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type as 'boolean' | 'input' | 'checkbox',
      text: q.text,
      answer: q.answer ?? undefined,
      correctAnswer: q.correctAnswer ?? undefined,
      options:
        q.options.length > 0
          ? q.options.map((o) => ({
              id: o.id,
              label: o.label,
              isCorrect: o.isCorrect,
            }))
          : undefined,
    })),
  };
}

export async function deleteQuiz(id: string) {
  await prisma.quiz.delete({ where: { id } });
}
