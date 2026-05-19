# Team Task Manager

A small full-stack task manager for teams. It has a Next.js frontend, an Express API, Prisma, and PostgreSQL. The app covers the basics: sign up / login, projects, task assignment, task status updates, and a dashboard with task counts.

This was built as a practical project, so the structure is intentionally simple: frontend in one folder, backend in another, and the API kept close to the Prisma models.

## Tech stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn-style UI components
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma
- Auth: JWT with bcrypt password hashing

## Project structure

```text
team-task-manager/
  backend/
    src/
      controllers/
      middleware/
      routes/
      validations/
      app.ts
    prisma/
      schema.prisma
      migrations/
  frontend/
    src/
      app/
      components/
      services/
```

## What it does

- Users can sign up and log in
- Users can choose either `ADMIN` or `MEMBER` during signup
- Admins can create projects and tasks
- Members can view assigned work and update task status
- Dashboard shows task totals, pending work, in-progress work, completed tasks, and overdue tasks
- API routes are protected with JWT auth where needed

## Getting started

You will need Node.js, npm, and a PostgreSQL database.

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd team-task-manager

cd backend
npm install

cd ../frontend
npm install
```

### 2. Backend environment

Create a `.env` file inside `backend/`.

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/team_task_manager"
JWT_SECRET="use-a-long-random-secret"
PORT=8080
```

Replace the database URL with your own Postgres connection string.

### 3. Set up the database

From the `backend` folder:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local development, `npx prisma migrate dev` is also fine if you are still changing the schema.

### 4. Frontend environment

Create a `.env.local` file inside `frontend/`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 5. Run the app locally

Open two terminals.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

The API health check should be available at:

```text
http://localhost:8080/health
```

## Useful scripts

Backend:

```bash
npm run dev      # start the Express API in development
npm run build    # generate Prisma client and compile TypeScript
npm start        # run migrations and start the compiled API
```

Frontend:

```bash
npm run dev      # start Next.js locally
npm run build    # create production build
npm start        # run production build
npm run lint     # run ESLint
```

## API overview

Main routes:

```text
POST   /api/auth/signup
POST   /api/auth/login

GET    /api/projects
POST   /api/projects

GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id/status
GET    /api/tasks/dashboard/stats

GET    /health
```

Protected routes need a bearer token:

```text
Authorization: Bearer <token>
```

## Roles

There are two roles in the app:

- `ADMIN`: can create projects and tasks
- `MEMBER`: can access assigned work and update status

The role values come from the Prisma schema, so keep them uppercase when working directly with the API.

## Notes

- The backend currently allows `http://localhost:3000` for local frontend requests.
- The frontend stores the token in `localStorage`.
- Task due dates should be sent as ISO date strings.
- If CORS blocks a deployed frontend, add that frontend URL to `allowedOrigins` in `backend/src/app.ts`.

