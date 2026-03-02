# AlgoForge Architecture

This document provides a high-level overview of the architectural design, system components, database schema, and workflows that power the AlgoForge platform.

## 1. System Overview

AlgoForge is designed as a modular, containerized application built around a Next.js full-stack framework. It separates the web serving layer from the computationally intensive and potentially insecure code execution layer.

### Core Components

1.  **Web Application Core (Next.js)**: Handles routing, UI rendering (React/Tailwind), authentication, API endpoints, and database interactions.
2.  **Relational Database (PostgreSQL)**: The primary data store for user profiles, problems, submissions, progress, and gamification data. Interacted with via Prisma ORM.
3.  **Message Queue & Cache (Redis)**: Acts as the intermediary broker for code execution jobs and short-term caching.
4.  **Execution Engine (Node.js Worker)**: A background process that polls Redis for pending code submissions.
5.  **Isolation Layer (Docker)**: Ephemeral containers spawned by the execution engine to safely run untrusted user code.

---

## 2. Component Architecture

### The Next.js App (Frontend & API)

The application uses the Next.js App Router paradigm.

*   **Frontend (`src/app`, `src/components`)**:
    *   **UI Library**: Exclusively uses custom components styled with Tailwind CSS v4, integrated with `radix-ui` for accessible primitives (dialogs, accordions, etc.) and `framer-motion` for animations.
    *   **State Management**: Zustand is utilized for client-side state across different domains (`authStore.ts`, `editorStore.ts`, `executionStore.ts`, `uiStore.ts`).
    *   **Editor Environment**: Integrates `@monaco-editor/react` for the specialized code input component, side-by-side with markdown-rendered problem descriptions using `react-resizable-panels`.

*   **Backend / API (`src/app/api`, `src/lib`)**:
    *   **Authentication**: Handled via custom JWT tokens stored in cookies, verified by Next.js edge middleware (`src/middleware.ts`) to protect routes like `/dashboard` and `/profile`.
    *   **Data Access Layer**: All database interactions are routed through strictly typed Prisma client calls (`src/lib/db/prisma.ts`).
    *   **Queueing**: When a user submits code, an API route receives the payload, creates a database record, and queues metadata to Redis (`src/lib/execution/queue.ts`).

### The Code Execution Worker (`src/worker`)

The worker is a critical, decoupled component. It ensures that the web server is never bogged down or compromised by malicious or infinite-looping user code.

1.  **Polling Loop**: The worker (`src/worker/index.ts`) continuously polls the Redis queue for new tasks.
2.  **Container Orchestration**: When a task is found, it uses the `dockerode` library to interface with the host machine's Docker daemon.
3.  **Execution Lifecycle**:
    *    Pulls required base images if missing (e.g., lightweight alpine variants for node, python, gcc).
    *    Constructs a temporary script/binary combining the boilerplate and user code.
    *    Runs the container with strict CPU, memory, and timeout limits.
    *    Feeds test cases into the container's stdin and captures stdout/stderr.
4.  **Evaluation and State Update**: The worker compares actual output vs expected output, determines the final status (ACCEPTED, TIME_LIMIT_EXCEEDED, WRONG_ANSWER), and writes this directly back to PostgreSQL. It also triggers XP and gamification logic upon successful solves.

---

## 3. Data Model (Prisma Schema)

The core data entities handled by Prisma (`prisma/schema.prisma`) are categorized into four logical groups:

### 1. Users & Authentication
*   **User**: Stores credentials, profile data, and gamification stats (XP, level, streaks).
*   **RefreshToken**: Manages long-lived session tokens.

### 2. Content & Organization
*   **Topic** & **Subtopic**: Organizes the curriculum (e.g., Topic: "Graph Theory", Subtopic: "Shortest Path").
*   **Problem**: Contains the master definition of a challenge—markdown descriptions, constraints, examples, difficulty rating, and boilerplate code placeholders.
*   **TestCase**: Individual I/O pairs associated with a problem. Flags indicate if a test case is meant to be hidden from the user during standard "RUN" operations.

### 3. Execution & Progress
*   **Submission**: A historic record of every piece of code run by a user, including the snapshot of the code, language used, runtime metrics, and pass/fail status.
*   **UserProgress**: Tracks aggregate success per problem—whether the user has attempted a problem or solved it completely, along with their best runtime and memory usage.

### 4. Gamification
*   **Achievement** & **UserAchievement**: Definitions of unlockable badges/milestones and the junction table mapping them to users who have earned them.

---

## 4. Key Workflows

### The Submission Workflow

This is the primary user journey in the application:

1.  **Code Editor**: The user writes an algorithm in the Monaco editor and clicks "Submit" (or "Run").
2.  **API Gateway**: `POST /api/submissions` validates the request, creates a `Submission` record with status `PENDING` in Postgres, and enqueues a job payload to Redis containing the submission ID and raw code.
3.  **Client-Side Polling**: The frontend begins polling `GET /api/submissions/[id]` every few seconds to monitor the status.
4.  **Worker Processing**: The detached Worker process pops the job from Redis. Wait state ends; status updates to `RUNNING`.
5.  **Secure Execution**: The Worker runs the code against all test cases inside an isolated Docker container. Piped outputs are analyzed for correctness.
6.  **Resolution & Gamification**: The Worker updates the `Submission` in Postgres with the final result (e.g., `ACCEPTED`). If successful, it calculates XP gains and updates the user's streak in the `User` table, and marks the `UserProgress` table for that specific problem.
7.  **Client Update**: The frontend polling receives the terminal status (`ACCEPTED`), stops polling, and displays the success animation, runtime metrics, and newly acquired XP to the user.

### Authentication Workflow

1.  User logs in via `/api/auth/login`.
2.  Server verifies credentials via bcrypt against the Postgres `User` table.
3.  Server generates a short-lived Access JWT and a long-lived Refresh Token.
4.  Cookies are set: Access JWT goes into an HTTP-only cookie to be used automatically on subsequent requests.
5.  For protected page loads, Next.js Middleware intercepts the request, decodes the JWT, and allows access if valid, or redirects to `/login` if missing/expired.
