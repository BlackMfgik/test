import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.create({
    data: {
      title: 'Sample Quiz',
      questions: {
        create: [
          {
            type: 'boolean',
            text: 'Is the sky blue?',
            answer: true,
          },
          {
            type: 'input',
            text: 'Capital of France?',
            correctAnswer: 'Paris',
          },
          {
            type: 'checkbox',
            text: 'Pick even numbers',
            options: {
              create: [
                { label: '2', isCorrect: true },
                { label: '3', isCorrect: false },
                { label: '4', isCorrect: true },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('Seeded successfully');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
