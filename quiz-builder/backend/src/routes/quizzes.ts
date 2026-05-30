import { Router } from 'express';
import { z } from 'zod';
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  deleteQuiz,
} from '../controllers/quizzes.controller';
import { validate } from '../middleware/validate';

const router = Router();

const optionSchema = z.object({
  label: z.string().min(1),
  isCorrect: z.boolean(),
});

const questionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('boolean'),
    text: z.string().min(1),
    answer: z.boolean(),
  }),
  z.object({
    type: z.literal('input'),
    text: z.string().min(1),
    correctAnswer: z.string().min(1),
  }),
  z.object({
    type: z.literal('checkbox'),
    text: z.string().min(1),
    options: z.array(optionSchema).min(2),
  }),
]);

const createQuizSchema = z.object({
  title: z.string().min(1),
  questions: z.array(questionSchema).min(1),
});

router.post('/', validate(createQuizSchema), createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.delete('/:id', deleteQuiz);

export default router;
