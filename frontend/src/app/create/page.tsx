import { QuizForm } from '@/components/QuizForm';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Quiz
          </h1>
          <p className="text-gray-500 mt-1">
            Add a title and one or more questions
          </p>
        </div>
        <QuizForm />
      </div>
    </div>
  );
}
