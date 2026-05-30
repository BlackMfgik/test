# Quick Start

**Requirements:** Node.js 20+, npm 9+

**Backend:**

```powershell
cd quiz-builder\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

**Frontend (other terminal):**

```powershell
cd quiz-builder\frontend
npm install
npm run dev
```

**Open in browser:** http://localhost:3000
