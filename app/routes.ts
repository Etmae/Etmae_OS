import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("signin", "routes/signin.tsx"),
  route("lockscreen", "routes/lockscreen.tsx"),
  route("desktop", "routes/desktop.tsx"),
  route("hero", "routes/hero.tsx"),
  route("apps/paint", "routes/paint.tsx"),
  route("fullcontact", "routes/fullcontact.tsx"),
  route("off", "routes/off.tsx"),
  route("terminal", "./apps/terminal/index.ts")
] satisfies RouteConfig;

