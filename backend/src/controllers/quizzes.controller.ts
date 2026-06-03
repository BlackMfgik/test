import { Request, Response } from 'express';
import * as quizService from '../services/quizzes.service';

export async function createQuiz(req: Request, res: Response) {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
}

export async function getQuizzes(req: Request, res: Response) {
  try {
    const quizzes = await quizService.getQuizzes();
    res.json(quizzes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
}

export async function getQuizById(req: Request, res: Response) {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
}

export async function deleteQuiz(req: Request, res: Response) {
  try {
    await quizService.deleteQuiz(req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
}
