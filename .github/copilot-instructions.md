**Purpose**
- **What**: Short, actionable guidance for AI coding agents to be immediately productive in this React + React Router v7 (framework mode) + Vite + Tailwind project.

**Big Picture**
- **App root**: The router tree is mounted under `app/root.tsx` which exports the default `App` and uses `<Outlet />` to render route children.
- **File-based routing**: Routes live in `app/routes/*` and mostly re-export components from `app/Pages/*`. Examples: `app/routes/lockscreen.tsx` -> `export { default } from "../Pages/WindowsLockscreen";`.
- **SPA mode**: `react-router.config.ts` sets `ssr: false` — this is a client SPA built with the `react-router` dev tools and Vite.

**Routing & Navigation Rules (concrete)**
- **Every route file must have a `default` export**. If missing, the route will 404. Example route file (use as template):

  `// app/routes/lockscreen.tsx`
  `export { default } from "../Pages/WindowsLockscreen";`

- **Pages should use `react-router-dom` hooks for navigation**. Example in a Page component:

  `import { useNavigate } from 'react-router-dom';`
  `const navigate = useNavigate();`
  `navigate('/signin');`

- **`app/root.tsx` must render `<Outlet />`** for nested routes — the repo already follows this pattern. Do not remove `<Outlet />` when changing layout.

**Project-specific conventions**
- **Route re-exports**: `app/routes/*` files are thin re-exports that point to `app/Pages/*`. Maintain that separation: routing files declare the route, Pages contain UI + navigation.
- **Types**: Some files import generated `Route` types (e.g., `import type { Route } from "./+types/root";`). Keep type usage when present; don’t remove type imports when editing route meta or error boundaries.
- **Loader overlay**: `app/root.tsx` includes an optional `Windows11Loader` overlay pattern — loader overlays the router tree rather than replacing it. Keep loader markup separate from routes.

**Dev / build / run commands**
- **Install**: `npm install`
- **Dev server**: `npm run dev` (runs `react-router dev` per `package.json`).
- **Build**: `npm run build` (runs `react-router build`).
- **Serve built app**: `npm run start` (uses `react-router-serve`).
- **Typegen + check**: `npm run typecheck` (runs `react-router typegen && tsc`).

**Common issues & fixes (explicit)**
- **404 on direct URL (like `/lockscreen`)**: Check `app/routes/lockscreen.tsx` has a default export pointing to the Page; ensure `app/root.tsx` still renders `<Outlet />`; confirm `react-router.config.ts` hasn't enabled SSR unexpectedly (`ssr: false` is correct for SPA).
- **Navigation works in-app but direct refresh 404s**: This is usually a hosting/static-server config issue — ensure server rewrites to the SPA entry on the hosting side. Locally, `npm run dev` via `react-router dev` handles this.
- **Case-sensitive import mismatches**: On Windows this rarely breaks, but CI may be Linux — keep file export names and import paths matching exact case for portability.

**Concrete examples to follow**
- Route file (thin re-export):

  `// app/routes/signin.tsx`
  `export { default } from "../Pages/WindowsSignIn";`

- Page component (navigation):

  `import { useNavigate } from 'react-router-dom';`
  `export default function WindowsSignIn(){ const navigate = useNavigate(); return <button onClick={() => navigate('/desktop')}>Sign in</button> }`

**Where to look when editing**
- `app/root.tsx` — layout, `Outlet`, `ErrorBoundary`, and `links`.
- `react-router.config.ts` — framework mode flags (e.g., `ssr: false`).
- `app/routes/*` — routing definitions (should be re-exports).
- `app/Pages/*` — page components that implement UI and navigation.
- `package.json` — CLI scripts: use `npm run dev`, `npm run build`, `npm run typecheck`.

If anything here looks incomplete or you want more examples (e.g., how to write a nested route, or how `typegen` shapes `+types`), tell me which area to expand and I will update this file.
