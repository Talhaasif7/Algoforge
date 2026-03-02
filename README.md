# AlgoForge

AlgoForge is a modern algorithmic coding platform built with Next.js, featuring a robust code execution engine, user progress tracking, and gamification elements. It provides an immersive environment for practicing Data Structures and Algorithms (DSA), Competitive Programming (CP), and Interview Preparation.

## Features

- **Robust Code Execution**: Securely execute user-submitted code in isolated Docker containers.
- **Progress Tracking & Gamification**: Earn XP, level up, track streaks, and unlock achievements as you solve problems.
- **Multiple Supported Languages**: Write solutions in Python, C++, Java, or JavaScript.
- **Categorized Problem Sets**: Problems organized by track (DSA, CP, Interview), topics, and subtopics.
- **Modern UI**: A sleek, responsive interface built with Tailwind CSS, Framer Motion, and Radix UI components.
- **Responsive Split Panes**: Code editor and problem description side-by-side using `react-resizable-panels`.
- **Monaco Editor Integration**: Feature-rich code editing experience with syntax highlighting and auto-completion.

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Cache & Message Broker**: Redis
- **Code Execution Engine**: Custom Node.js worker using Docker API (`dockerode`)
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
- **UI Components**: Radix UI, Framer Motion, Lucide React
- **State Management**: Zustand
- **Authentication**: JWT, bcrypt, Next.js Middleware

## Prerequisites

Before setting up the project, make sure you have the following installed on your machine:

- **Node.js** (v20+ recommended)
- **Docker** and **Docker Compose** (for running the database, Redis, and code execution worker)
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd algoforge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file to create your local `.env` file:

```bash
cp .env.example .env
```

Review the `.env` file and update any variables if necessary. The default values are set up to work out-of-the-box with the local Docker Compose setup. Ensure `JWT_SECRET` is set to a secure random string.

### 4. Start Infrastructure Services (Database & Redis)

Start the required background services using the development Docker Compose file:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will spin up a PostgreSQL instance (`algoforge-db`) and a Redis instance (`algoforge-redis`).

### 5. Setup the Database

Generate the Prisma client and push the schema to the database:

```bash
npx prisma generate
npx prisma db push
```

*(Optional)* If you have seed data scripts (e.g., in `prisma/seeds/`), you can run them now to populate the database with topics and problems.
```bash
npx tsx prisma/seeds/seed_problems.ts
```

### 6. Start the Code Execution Worker

The worker process is responsible for polling Redis for code execution jobs, running the code securely inside temporary Docker containers, and updating the submission status in the database.

In a separate terminal, start the worker:

```bash
npm run worker
```

**Note**: The worker requires access to the Docker daemon to spawn isolated environments for code execution. Ensure Docker is running.

### 7. Run the Next.js Development Server

In your main terminal, start the Next.js application:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

---

## Production Deployment

For production, the application is containerized and managed entirely via `docker-compose.prod.yml`.

1. Ensure your `.env` file is properly configured for production (strong passwords, proper URLs).
2. Build and start all services:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

This will build the Next.js app (`algoforge-app`) and the Worker (`algoforge-worker`), and link them with the production PostgreSQL and Redis instances.

## Code Execution Architecture

Code execution in AlgoForge is entirely decoupled from the main web server for security and performance.
1. When a user submits code, the API creates a `Submission` record and pushes a job to a Redis queue.
2. The standalone **Worker** (running via `npm run worker`) picks up the job.
3. The worker spawns a temporary, isolated Docker container for the specific language (e.g., `python:3.9-alpine`), injects the user's code and test cases, executes them, and captures the stdout/stderr.
4. The worker evaluates the output, updates the PostgreSQL database with the results (Accepted, Wrong Answer, etc.), and assigns XP if the problem was solved successfully.
