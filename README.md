# AI Course Generator

An AI-powered learning platform that turns a topic into a fully structured course with modules, lessons, objectives, content blocks, videos, and multiple-choice questions — presented in a modern dark obsidian UI.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- AI-generated course outlines using Google Gemini
- AI-generated lesson content, objectives, code examples, videos, and MCQs
- Lazy lesson generation — content is only generated when a learner opens a lesson
- Course ownership checks so users can access only their own content
- Interactive MCQs and PDF lesson export
- PostgreSQL data storage with Prisma ORM
- Dark obsidian glassmorphism UI (inspired by Google Gemini)
- Collapsible left sidebar with course history navigation across all pages
- Tabbed lesson viewer — Content, Code, Videos, and Exercises in separate tabs
- Fully responsive layout with micro-animations and smooth transitions
- CI/CD pipeline with GitHub Actions deploying to Vercel (frontend) and Render (backend)

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, Prisma ORM |
| Database | Neon PostgreSQL |
| AI | Google Gemini API |
| Deployment | Vercel (frontend), Render (backend) |
| CI/CD | GitHub Actions |

## Architecture

```text
React frontend
  -> Express REST API
  -> Prisma Client
  -> Neon PostgreSQL

Express REST API
  -> Google Gemini API
```

The course data is stored in this hierarchy:

```text
User -> Course -> Module -> Lesson
```

## UI Overview

The interface follows a dark obsidian aesthetic (`#131314` background, `#1e1f20` surface cards) with glassmorphism effects across all pages.

| Page | Description |
| --- | --- |
| Dashboard | Centered AI prompt input with suggestion chips and a collapsible left course history sidebar |
| Course Detail | Grid of module cards with module numbering and a View Lessons arrow |
| Module Detail | Module overview banner followed by a lessons list with difficulty badges |
| Lesson Viewer | Sticky header with tabbed content — 📖 Content, 💻 Code, 🎥 Videos, ❓ Exercises |
| Login / Register | Glassmorphic auth cards with gradient title and animated focus states |

## Project Structure

```text
AI-Course-Generator/
├── client/                  # React frontend
│   └── src/
│       ├── api/             # Axios API client
│       ├── components/      # Reusable UI and lesson blocks
│       │   └── blocks/      # HeadingBlock, ParagraphBlock, CodeBlock, MCQBlock, VideoBlockWrapper
│       ├── context/         # Authentication state
│       └── pages/           # Dashboard, CourseDetail, ModuleDetail, LessonViewer, Login, Register
├── server/                  # Express backend
│   ├── config/              # Prisma client setup
│   ├── controllers/         # API business logic
│   ├── middlewares/         # JWT middleware
│   ├── prisma/              # Prisma schema and migrations
│   ├── routes/              # API endpoints
│   ├── services/            # Gemini integration
│   └── utils/               # JWT helper
├── vercel.json              # Vercel build configuration
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/courses/generate` | Generate and save an AI course |
| GET | `/api/courses` | Get courses belonging to the logged-in user |
| GET | `/api/courses/:id` | Get one course and its modules |
| DELETE | `/api/courses/:id` | Delete a course and its contents |
| GET | `/api/modules/:id` | Get a module and its lessons |
| GET | `/api/lessons/:id` | Get or generate lesson content |
| GET | `/api/health` | Check backend health |

## Local Setup

### Prerequisites

- Node.js 20 or later
- A Neon PostgreSQL database
- Google Gemini API key
- Optional: YouTube Data API key for video search blocks

### 1. Clone the repository

```bash
git clone https://github.com/adityaandhavarpu/AI-Course-Generator.git
cd AI-Course-Generator
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
DATABASE_URL="your-neon-postgresql-connection-url"
JWT_SECRET="use-a-long-random-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

Generate Prisma Client and apply committed migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Start the backend:

```bash
npm run dev
```

The API is available at `http://localhost:5000`.

### 3. Configure the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_YOUTUBE_API_KEY="your-youtube-data-api-key"
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deployment

### Backend: Render

Create a Render Web Service from this repository and use:

```text
Root Directory: server
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

Add these environment variables in Render:

```text
DATABASE_URL=<your Neon PostgreSQL connection URL>
JWT_SECRET=<your JWT secret>
GEMINI_API_KEY=<your Gemini API key>
PORT=5000
```

### Frontend: Vercel

Import the repository in Vercel and use:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
```

### CI/CD: GitHub Actions

The `.github/workflows/cicd.yml` pipeline runs on every push to `main`:

1. Builds the frontend from `./client`
2. Installs and checks the backend from `./server`
3. Triggers a Render deploy hook for the backend
4. Deploys the frontend to Vercel using `VERCEL_TOKEN`

Add these secrets in GitHub → Settings → Secrets:

```text
VERCEL_TOKEN=<your Vercel API token>
RENDER_DEPLOY_HOOK_URL=<your Render deploy hook URL>
```

## Security Notes

- Passwords are hashed before storage and are never returned by the API.
- Protected endpoints require `Authorization: Bearer <token>`.
- Course, module, and lesson access is checked against the authenticated owner.
- Never commit `.env` files, database URLs, JWT secrets, or API keys.
- Browser-exposed `VITE_` variables are public; restrict any YouTube API key by domain in Google Cloud.

## Author

Aditya Andhavarpu
