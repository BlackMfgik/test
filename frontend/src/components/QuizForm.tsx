'use client';

import { useState } from 'react';
import { useForm, useFieldArray, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createQuiz } from '@/services/api';
import { QuestionField } from '@/components/QuestionField';

const optionSchema = z.object({
  label: z.string().min(1, 'Option label is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('boolean'),
    text: z.string().min(1, 'Question text is required'),
    answer: z.boolean(),
  }),
  z.object({
    type: z.literal('input'),
    text: z.string().min(1, 'Question text is required'),
    correctAnswer: z.string().min(1, 'Correct answer is required'),
  }),
  z.object({
    type: z.literal('checkbox'),
    text: z.string().min(1, 'Question text is required'),
    options: z.array(optionSchema).min(2, 'Add at least 2 options'),
  }),
]);

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

interface FormOption {
  label: string;
  isCorrect: boolean;
}

interface FormQuestion {
  type: 'boolean' | 'input' | 'checkbox';
  text: string;
  answer: boolean;
  correctAnswer: string;
  options: FormOption[];
}

interface QuizFormData {
  title: string;
  questions: FormQuestion[];
}

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          type: 'boolean',
          text: '',
          answer: true,
          correctAnswer: '',
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormData) => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        questions: data.questions.map((q) => {
          if (q.type === 'boolean')
            return { type: q.type, text: q.text, answer: q.answer };
          if (q.type === 'input')
            return {
              type: q.type,
              text: q.text,
              correctAnswer: q.correctAnswer,
            };
          return { type: q.type, text: q.text, options: q.options };
        }),
      };
      await createQuiz(payload);
      router.push('/quizzes');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quiz Title
        </label>
        <input
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. General Knowledge"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-700">Questions</h2>
        {fields.map((field, index) => (
          <QuestionField
            key={field.id}
            questionName={`questions.${index}`}
            index={index}
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            remove={remove}
            errors={errors.questions?.[index] as FieldError | undefined}
          />
        ))}
      </div>

      {errors.questions && !Array.isArray(errors.questions) && (
        <p className="text-red-600 text-sm">{errors.questions.message}</p>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() =>
            append({
              type: 'boolean',
              text: '',
              answer: true,
              correctAnswer: '',
              options: [],
            })
          }
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          + Add Question
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {isSubmitting ? 'Creating...' : 'Create Quiz'}
        </button>
      </div>

      {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
    </form>
  );
}
