import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import * as React from "react";

import type { Route } from "./+types/root";
import "./app.css";

import Windows11Loader from "./components/common/Windows11Loader";
import { ThemeProvider } from "./components/common/ThemeProvider";
import { SystemShell } from "./components/layout/SystemShell";


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(() => {
    // Check if system is already "on" in this session
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("system_booted");
    }
    return true;
  });

  const handleBootComplete = () => {
    sessionStorage.setItem("system_booted", "true");
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <SystemShell>
        <Outlet />
      </SystemShell>

      {isLoading && (
        <div className="fixed inset-0 z-9999">
          <Windows11Loader
            duration={3500} 
            onComplete={handleBootComplete}
          />
        </div>
      )}
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
