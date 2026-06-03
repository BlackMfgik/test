# Quiz Builder

Full-stack quiz management application. Create quizzes with multiple question types, view a list of all quizzes, and inspect each quiz in detail.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Backend | Express.js, TypeScript |
| ORM | Prisma |
| Database | SQLite (dev) |
| Validation | Zod |

## Project Structure

```
quiz-builder/
├── frontend/               # Next.js 15 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── create/     # Quiz creation page
│   │   │   └── quizzes/    # Quiz list + detail pages
│   │   ├── components/     # QuizForm, QuestionField, QuizCard
│   │   ├── services/       # api.ts — single fetch entry point
│   │   └── types/          # Shared TypeScript interfaces
│   └── .env.local
└── backend/                # Express.js API
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   └── middleware/
    └── prisma/
        ├── schema.prisma
        └── seed.ts
```

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Backend

```powershell
cd backend
npm install
```

Create the environment file (copy from example):

```powershell
# Windows PowerShell
Copy-Item .env.example .env

# or create manually with:
# DATABASE_URL="file:./dev.db"
# PORT=4000
```

Run database migrations and start:

```powershell
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs at: **http://localhost:4000**

#### Optional: seed sample data

```powershell
npx ts-node prisma/seed.ts
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

> Make sure the backend is running before starting the frontend.

## Running Both Servers

Open two separate PowerShell windows:

```powershell
# Terminal 1 — backend
cd backend; npm run dev

# Terminal 2 — frontend
cd frontend; npm run dev
```

## API Reference

Base URL: `http://localhost:4000`

| Method | Path | Description |
|---|---|---|
| `POST` | `/quizzes` | Create a new quiz |
| `GET` | `/quizzes` | List all quizzes (title + question count) |
| `GET` | `/quizzes/:id` | Full quiz details with questions |
| `DELETE` | `/quizzes/:id` | Delete a quiz |

### Create quiz — request body

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

## Creating a Sample Quiz

1. Open **http://localhost:3000** — redirects to `/quizzes`
2. Click **Create Quiz**
3. Enter a title
4. Add questions using the type selector:
   - **True / False** — select the correct answer with radio buttons
   - **Text Input** — type the expected correct answer
   - **Multiple Choice** — add options, check which ones are correct
5. Click **Create Quiz** to save

Or run the seed script to insert a sample quiz automatically:

```powershell
cd backend
npx ts-node prisma/seed.ts
```

## Lint & Format

Run in both `frontend/` and `backend/` directories before committing:

```powershell
npm run lint
npm run format
```

## Environment Variables

### `backend/.env` (not committed)

```
DATABASE_URL="file:./dev.db"
PORT=4000
```

### `frontend/.env.local` (not committed)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
