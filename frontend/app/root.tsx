import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";

import * as React from "react";

import type { Route } from "./+types/root";
import "./app.css";

import Windows11Loader from "./components/common/Windows11Loader";
import { ThemeProvider } from "./components/common/ThemeProvider";
import { SystemShell } from "./components/layout/SystemShell";





export const links: Route.LinksFunction = () => [
  { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
  { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
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
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://etmae.pages.dev/#person",
              "name": "Etmae",
              "url": "https://etmae.pages.dev",
              "jobTitle": "Full Stack Developer",
              "description": "Full-stack developer specializing in React, TypeScript, FastAPI, and Django. Building interactive web experiences and scalable software solutions.",
              "image": "https://etmae.pages.dev/avatar.png",
              "sameAs": [
                "https://github.com/Etmae",
                "https://twitter.com/etmae",
                "https://linkedin.com/in/etmae"
              ],
              "knowsAbout": ["React", "TypeScript", "FastAPI", "Django", "Supabase", "Web Development"],
              "workLocation": {
                "@type": "Place",
                "name": "Remote"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "Etmae Portfolio",
                  "url": "https://etmae.pages.dev",
                  "description": "Interactive portfolio and SEO landing page for full-stack developer Etmae.",
                  "publisher": {
                    "@type": "Organization",
                    "name": "Etmae"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://etmae.pages.dev"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "About",
                      "item": "https://etmae.pages.dev/about"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "Interactive Portfolio",
                      "item": "https://etmae.pages.dev/hero"
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "name": "Contact",
                      "item": "https://etmae.pages.dev/fullcontact"
                    }
                  ]
                },
                {
                  "@type": "CreativeWork",
                  "name": "Looms & Aura",
                  "headline": "Luxury Fashion E-commerce",
                  "description": "A luxury fashion e-commerce platform blending editorial elegance with seamless shopping.",
                  "url": "https://etmae.pages.dev/hero",
                  "keywords": "fashion, ecommerce, branding, UI"
                },
                {
                  "@type": "CreativeWork",
                  "name": "Agrotech",
                  "headline": "Innovation in Farming",
                  "description": "An agricultural agency platform connecting farmers with innovative agrotech solutions.",
                  "url": "https://etmae.pages.dev/hero",
                  "keywords": "agriculture, farm management, sustainability"
                },
                {
                  "@type": "CreativeWork",
                  "name": "Etmae Virtual OS",
                  "headline": "Personal Portfolio",
                  "description": "A Windows-inspired portfolio experience with a fully immersive OS-like environment and interactive project showcase.",
                  "url": "https://etmae.pages.dev/hero",
                  "keywords": "interactive portfolio, desktop UI, React"
                },
                {
                  "@type": "CreativeWork",
                  "name": "SQUADRON",
                  "headline": "Kinetic Motion",
                  "description": "A high-performance dogfighting simulation with telemetry-driven visual design.",
                  "url": "https://etmae.pages.dev/hero",
                  "keywords": "webgl, simulation, motion design"
                },
                {
                  "@type": "CreativeWork",
                  "name": "GOC Agency",
                  "headline": "Online Store",
                  "description": "A modern ecommerce platform for computer hardware with a sleek configurator-driven UI.",
                  "url": "https://etmae.pages.dev/hero",
                  "keywords": "ecommerce, online store, hardware"
                }
              ]
            })
          }}
        />
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
  const navigate = useNavigate();
  const [bootKey, setBootKey] = React.useState(0); // Key to force re-mount on restart

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

  const handleShutdown = () => {
    // Simulate a full shutdown by clearing boot state and going to the off screen
    sessionStorage.removeItem("system_booted");
    sessionStorage.removeItem("desktopDisclaimerShown");
    navigate('/off');
  };

  const handleRestart = () => {
    // Clear the boot flag, show boot loader again, and force re-mount to restart
    sessionStorage.removeItem("system_booted");
    sessionStorage.removeItem("desktopDisclaimerShown");
    setIsLoading(true);
    setBootKey(prev => prev + 1);
  };

  const handleLock = () => {
    navigate('/lockscreen');
  };

  return (
    <ThemeProvider>
      <SystemShell
        key={bootKey} // Force re-mount on restart
        onLock={handleLock}
        onRestart={handleRestart}
        onShutdown={handleShutdown}
      >
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
