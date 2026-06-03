# Quiz Builder — AI Agent Context

> Full-stack test assessment. Monorepo: `frontend/` (Next.js) + `backend/` (Express + Prisma).
> Status: **in development**.

---

## 1. Tech Stack

### Frontend (`frontend/`)

| Layer       | Technology                           |
| ----------- | ------------------------------------ |
| Framework   | Next.js 15 (App Router, React 19)    |
| Language    | TypeScript strict                    |
| Forms       | React Hook Form + Zod                |
| HTTP client | fetch (native) via `services/api.ts` |
| Styling     | Tailwind CSS v4                      |
| Linting     | ESLint + Prettier                    |

### Backend (`backend/`)

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Framework  | Express.js                       |
| Language   | TypeScript                       |
| ORM        | Prisma                           |
| Database   | SQLite (dev) / PostgreSQL (prod) |
| Validation | Zod                              |
| Linting    | ESLint + Prettier                |

---

## 2. Project Structure

```
quiz-builder/
├── AGENTS.md
├── README.md
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  ← redirect to /quizzes
│   │   ├── create/
│   │   │   └── page.tsx              ← quiz creation form
│   │   └── quizzes/
│   │       ├── page.tsx              ← quiz list dashboard
│   │       └── [id]/
│   │           └── page.tsx          ← quiz detail (read-only)
│   ├── components/
│   │   ├── QuizForm.tsx              ← main creation form
│   │   ├── QuestionField.tsx         ← renders one question by type
│   │   ├── QuizCard.tsx              ← card in list with delete button
│   │   └── ui/                       ← reusable primitives
│   ├── services/
│   │   └── api.ts                    ← ALL fetch calls (single entry point)
│   ├── types/
│   │   └── index.ts                  ← Quiz, Question, QuestionType interfaces
│   └── .env.local
└── backend/
    ├── src/
    │   ├── index.ts                  ← Express bootstrap
    │   ├── routes/
    │   │   └── quizzes.ts
    │   ├── controllers/
    │   │   └── quizzes.controller.ts
    │   ├── services/
    │   │   └── quizzes.service.ts    ← business logic + Prisma calls
    │   └── middleware/
    │       └── validate.ts           ← Zod request validation
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    └── .env
```

---

## 3. TypeScript Types

**Location:** `frontend/types/index.ts`

```typescript
type QuestionType = "boolean" | "input" | "checkbox";

interface Option {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[]; // checkbox only
  answer?: boolean; // boolean type only
  correctAnswer?: string; // input type only
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}
```

---

## 4. API — Full Endpoint Reference

Base URL: `process.env.NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4000`)
All calls go through `frontend/services/api.ts` — never fetch directly in components.
Error shape: `{ "error": "message" }`

| Method | Path           | Description       | Request Body             |
| ------ | -------------- | ----------------- | ------------------------ |
| POST   | `/quizzes`     | Create quiz       | `{ title, questions[] }` |
| GET    | `/quizzes`     | List all quizzes  | —                        |
| GET    | `/quizzes/:id` | Full quiz details | —                        |
| DELETE | `/quizzes/:id` | Delete quiz       | —                        |

### POST `/quizzes` body shape

```json
{
  "title": "My Quiz",
  "questions": [
    { "type": "boolean", "text": "Is the sky blue?", "answer": true },
    { "type": "input", "text": "Capital of France?", "correctAnswer": "Paris" },
    {
      "type": "checkbox",
      "text": "Pick even numbers",
      "options": [
        { "label": "2", "isCorrect": true },
        { "label": "3", "isCorrect": false },
        { "label": "4", "isCorrect": true }
      ]
    }
  ]
}
```

---

## 5. Database Schema (Prisma)

```prisma
model Quiz {
  id        String     @id @default(uuid())
  title     String
  questions Question[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Question {
  id            String   @id @default(uuid())
  quizId        String
  quiz          Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  type          String   // "boolean" | "input" | "checkbox"
  text          String
  answer        Boolean?
  correctAnswer String?
  options       Option[]
}

model Option {
  id         String   @id @default(uuid())
  questionId String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  label      String
  isCorrect  Boolean  @default(false)
}
```

> All relations use `onDelete: Cascade` — deleting a quiz removes all questions and options automatically.

---

## 6. Pages & Component Behaviour

### `/create` — Quiz Creation

- `QuizForm.tsx` manages the entire form via React Hook Form + Zod
- "Add Question" appends a new question with a type selector (default: `boolean`)
- "Remove" button on each question removes it (minimum 1 question enforced)
- Question types render different inputs:
  - `boolean` → two radio buttons: True / False
  - `input` → single text field for the correct answer
  - `checkbox` → dynamic list of options (label + isCorrect toggle + remove); "Add option" button; minimum 2 options
- On submit: POST to `/quizzes`, redirect to `/quizzes`
- Validation: title required, at least 1 question, each question has non-empty text

### `/quizzes` — Quiz List

- Fetch on mount via `GET /quizzes`
- Shows `QuizCard` per quiz: title, question count, creation date
- Each card links to `/quizzes/:id`
- Delete icon: calls `DELETE /quizzes/:id`, removes card from local state optimistically

### `/quizzes/:id` — Quiz Detail

- Fetch via `GET /quizzes/:id`
- Read-only — not interactive or solvable
- Each question rendered with a type badge:
  - `boolean` → "True / False" with correct answer highlighted
  - `input` → correct answer shown as text
  - `checkbox` → all options listed, correct ones visually marked

---

## 7. Coding Rules

### ✅ DO

```typescript
// Single entry point for all API calls
export async function getQuizzes(): Promise<QuizSummary[]> {
  const res = await fetch(`${BASE_URL}/quizzes`);
  if (!res.ok) throw new Error("Failed to fetch quizzes");
  return res.json();
}

// Zod discriminated union for question validation
const questionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("boolean"),
    text: z.string().min(1),
    answer: z.boolean(),
  }),
  z.object({
    type: z.literal("input"),
    text: z.string().min(1),
    correctAnswer: z.string().min(1),
  }),
  z.object({
    type: z.literal("checkbox"),
    text: z.string().min(1),
    options: z.array(optionSchema).min(2),
  }),
]);

// Named exports for components
export function QuizCard({ quiz, onDelete }: Props) {}

// Prisma cascade handles children — just delete the parent
await prisma.quiz.delete({ where: { id } });
```

### ❌ DON'T

```typescript
// ❌ Fetch directly in components → use services/api.ts
// ❌ Hardcode base URL
// ❌ Commit .env or .env.local files
// ❌ Manually delete questions/options before deleting a quiz (cascade handles it)
// ❌ Use `any` type
// ❌ Skip lint/format before committing
// ❌ Components longer than ~150 lines — split them
```

---

## 8. Environment Variables

### Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend `.env`

```
DATABASE_URL="file:./dev.db"
# DATABASE_URL="postgresql://user:pass@localhost:5432/quiz_builder"
PORT=4000
```

---

## 9. Commands

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev                      # http://localhost:4000

# Optional seed
npx ts-node prisma/seed.ts

# Frontend
cd frontend
npm install
npm run dev                      # http://localhost:3000

# Lint & format (run in both dirs before committing)
npm run lint
npm run format
```

---

## 10. Response Format for AI

- Return only changed files — never the full project
- First line of each file must be a path comment: `// frontend/components/QuizCard.tsx`
- Fix all TypeScript errors in the same response
- No `as any` without an explanatory comment
- Avoid comments — only add them where truly necessary (non-obvious logic, gotchas)
- Split components if they exceed ~150 lines

---

## 11. Windows Terminal Guide

The developer is on **Windows**. Always use Windows-compatible commands.

### Shell

Use **PowerShell** or **cmd** — never assume bash is available unless explicitly inside WSL.

### Path separators

```powershell
# ✅ Windows
cd frontend\components
# ✅ Also fine in PowerShell
cd frontend/components

# ❌ Never use bash-only syntax like:
# cd frontend && npm run dev   ← breaks in cmd
```

### Running two servers at once

```powershell
# Recommended: open two separate terminal windows

# Terminal 1:
cd backend; npm run dev

# Terminal 2:
cd frontend; npm run dev

# Alternative: cmd opens new windows automatically
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
```

### Environment variables

```powershell
# PowerShell
$env:PORT = "4000"
$env:NODE_ENV = "development"

# cmd
set PORT=4000

# ❌ Never use bash export syntax
# export PORT=4000
```

### Inline env before a command

```powershell
# PowerShell
$env:DATABASE_URL="file:./dev.db"; npx prisma migrate dev

# cross-env (works everywhere — preferred in npm scripts)
npx cross-env DATABASE_URL="file:./dev.db" npx prisma migrate dev
```

### .env files

- `.env` and `.env.local` are read automatically by Prisma and Next.js on Windows — no extra setup
- Save with **LF** line endings, not CRLF. Add to `.gitattributes`:
  ```
  * text=auto eol=lf
  ```

### Kill a port

```powershell
# Find what is using port 4000
netstat -ano | findstr :4000

# Kill by PID (replace 1234 with the actual PID from above)
taskkill /PID 1234 /F
```

### Common gotchas

| Issue                         | Fix                                                             |
| ----------------------------- | --------------------------------------------------------------- |
| `'prisma' is not recognized`  | Use `npx prisma` instead of `prisma`                            |
| Script execution policy error | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Port already in use           | `netstat -ano \| findstr :<port>` → `taskkill /PID <pid> /F`    |
| CRLF line ending issues       | Add `.gitattributes`: `* text=auto eol=lf`                      |
| `NODE_ENV` not set inline     | Use `cross-env` package in npm scripts                          |

---

## 12. Reference Links

| Topic              | URL                              |
| ------------------ | -------------------------------- |
| Next.js App Router | https://nextjs.org/docs/app      |
| React Hook Form    | https://react-hook-form.com/docs |
| Zod                | https://zod.dev                  |
| Prisma             | https://www.prisma.io/docs       |
| Tailwind CSS v4    | https://tailwindcss.com/docs     |
| Express.js         | https://expressjs.com            |
