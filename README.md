An immersive developer portfolio presented as a Windows-inspired virtual operating system.

This project is not a standard portfolio landing page. It is a full-screen React experience where visitors boot into a desktop, open apps, browse projects in windows, use a terminal, talk to an AI assistant, and submit contact requests through a cinematic form flow.

## What This Contains

- A Windows-style boot, lockscreen, sign-in, desktop, taskbar, Start Menu, and power flow
- Draggable, focusable, minimizable, maximizable, and snap-capable application windows
- Portfolio apps for hero, about, works/projects, project detail, and contact
- A terminal-style interface with portfolio commands
- A Paint-style app and browser/app placeholders
- An AI assistant that answers questions about the developer, skills, projects, and contact info
- A backend API for AI chat, project data, and contact form submission
- Supabase integration for contact messages, attachments, and optional project records

## Repository Structure

```txt
.
|-- frontend/              # Main React Router virtual OS experience
|-- backend/               # Next.js API service
|-- postman/               # API testing assets
|-- .postman/              # Postman workspace/config assets
|-- .github/               # GitHub workflow/config files
`-- README.md              # Project documentation
```

## Frontend

The frontend lives in `frontend/` and is built with:

- React 19
- React Router 7
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- Lucide React
- GSAP / Lenis for animation and scroll behavior

Important frontend areas:

```txt
frontend/app/root.tsx                         # App shell, theme provider, boot loader
frontend/app/routes.ts                        # Route definitions
frontend/app/Pages/                           # Main route pages
frontend/app/components/layout/SystemShell.tsx # Global OS shell
frontend/app/components/taskbar/              # Taskbar and Start Menu
frontend/app/components/windows/              # Window manager and window UI
frontend/app/state/                           # Zustand stores
frontend/app/apps/registry.ts                 # App registry used by windows/taskbar
frontend/app/apps/portfolio/                  # Portfolio experience
frontend/app/apps/assistant/                  # AI assistant UI
frontend/app/apps/terminal/                   # Terminal app
frontend/app/assets/                          # Images, SVGs, videos, wallpapers
```

## Backend

The backend lives in `backend/` and is built with:

- Next.js
- TypeScript
- Supabase
- Multiple AI provider adapters

Important backend areas:

```txt
backend/src/app/api/chat/route.ts             # Portfolio AI assistant endpoint
backend/src/app/api/contact/route.ts          # Contact form and attachment endpoint
backend/src/app/api/projects/route.ts         # Supabase projects endpoint
backend/src/libs/ai/router.ts                 # AI provider fallback chain
backend/src/libs/context/                     # Local portfolio context for AI
backend/src/libs/supabase/server.ts           # Supabase clients
backend/src/libs/cors.ts                      # CORS configuration
```

## Main User Flow

1. The visitor sees a boot loader.
2. The system opens to a lockscreen/sign-in style interface.
3. After sign-in, the visitor enters the desktop.
4. Desktop icons and taskbar items open apps inside OS-like windows.
5. The portfolio can be explored through apps such as Portfolio, About, Projects, Contact, Terminal, and Etmae AI.
6. The Start Menu power actions support lock, restart, and shutdown.
7. Shutdown moves to a powered-off screen with a large switch button that boots the system back on.

## Local Development

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on:

```txt
https://localhost:5173
```

Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```txt
http://localhost:3000
```

## Environment Variables

Create environment files as needed for local development.

Frontend variables:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000/api/contact
```

Backend variables:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=
DEEPSEEK_API_KEY=
GEMINI_API_KEY=
AI_PROVIDER_TIMEOUT_MS=15000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The AI assistant uses OpenRouter first, then falls back to DeepSeek and Gemini if configured.

## API Overview

### `POST /api/chat`

Receives a user message and returns a structured assistant response.

Expected response shape:

```json
{
  "message": "Assistant response",
  "action": "NONE",
  "payload": {}
}
```

Supported actions include:

- `NONE`
- `OPEN_PROJECT`
- `OPEN_SKILLS`
- `OPEN_CONTACT`

### `POST /api/contact`

Accepts contact form data and optional file attachment.

Supported attachment types:

- PDF
- DOC
- DOCX

Maximum attachment size:

```txt
5 MB
```

### `GET /api/projects`

Reads project records from the Supabase `projects` table.

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

Backend:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes for Future Development

- Keep OS-level behavior in the shell, taskbar, window manager, and Zustand stores.
- Register new apps in `frontend/app/apps/registry.ts`.
- Add desktop/taskbar shortcuts through the data files in `frontend/app/data/`.
- Keep backend AI context small and intentional in `backend/src/libs/context/`.
- Update CORS origins in `backend/src/libs/cors.ts` before production deployment.
- Replace placeholder social/profile links before launch.

## Project Identity

Etmae Portfolio OS showcases Olujimi Erioluwa Elijah as a full-stack developer through an interactive desktop metaphor. The experience is designed to make the portfolio feel like a working product rather than a static resume.