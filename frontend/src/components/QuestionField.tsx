'use client';

import { useEffect } from 'react';
import {
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  useFieldArray,
  FieldError,
} from 'react-hook-form';

type QuestionType = 'boolean' | 'input' | 'checkbox';

interface FormOption {
  label: string;
  isCorrect: boolean;
}

interface FormQuestion {
  type: QuestionType;
  text: string;
  answer: boolean;
  correctAnswer: string;
  options: FormOption[];
}

interface QuizFormData {
  title: string;
  questions: FormQuestion[];
}

interface QuestionFieldProps {
  questionName: string;
  index: number;
  control: Control<QuizFormData>;
  register: UseFormRegister<QuizFormData>;
  watch: UseFormWatch<QuizFormData>;
  setValue: UseFormSetValue<QuizFormData>;
  remove: (index: number) => void;
  errors?: FieldError;
}

export function QuestionField({
  questionName,
  index,
  control,
  register,
  watch,
  setValue,
  remove,
  errors,
}: QuestionFieldProps) {
  const type = watch(`${questionName}.type` as `questions.0.type`);
  const optionArrayName = `${questionName}.options` as `questions.0.options`;

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: optionArrayName });

  useEffect(() => {
    if (type === 'checkbox' && optionFields.length === 0) {
      setValue(optionArrayName, [
        { label: '', isCorrect: false },
        { label: '', isCorrect: false },
      ]);
    }
    if (type === 'boolean') {
      setValue(`${questionName}.answer` as `questions.0.answer`, true);
    }
    if (type === 'input') {
      setValue(`${questionName}.correctAnswer` as `questions.0.correctAnswer`, '');
    }
  }, [type, questionName, setValue, optionFields.length, optionArrayName]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Question {index + 1}
        </span>
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-sm text-red-500 hover:text-red-700 hover:underline"
        >
          Remove
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) =>
            setValue(`${questionName}.type` as `questions.0.type`, e.target.value as QuestionType)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="boolean">True / False</option>
          <option value="input">Text Input</option>
          <option value="checkbox">Multiple Choice</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
        <input
          {...register(`${questionName}.text` as `questions.0.text`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question"
        />
        {errors?.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
      </div>

      {type === 'boolean' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
          <div className="flex gap-6">
            {(['True', 'False'] as const).map((label) => {
              const val = label === 'True';
              return (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={watch(`${questionName}.answer` as `questions.0.answer`) === val}
                    onChange={() =>
                      setValue(`${questionName}.answer` as `questions.0.answer`, val)
                    }
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {type === 'input' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
          <input
            {...register(`${questionName}.correctAnswer` as `questions.0.correctAnswer`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Expected answer"
          />
        </div>
      )}

      {type === 'checkbox' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {optionFields.map((field, optIndex) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(
                  `${questionName}.options.${optIndex}.label` as `questions.0.options.0.label`
                )}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${optIndex + 1}`}
              />
              <label className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
                <input
                  type="checkbox"
                  {...register(
                    `${questionName}.options.${optIndex}.isCorrect` as `questions.0.options.0.isCorrect`
                  )}
                  className="accent-blue-600"
                />
                Correct
              </label>
              <button
                type="button"
                onClick={() => removeOption(optIndex)}
                className="text-gray-400 hover:text-red-500 px-1 text-lg leading-none"
                aria-label="Remove option"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendOption({ label: '', isCorrect: false })}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
}
