const ALLOWED_ORIGINS = [
  "https://localhost:5173",
  "https://etmae-os.pages.dev",
  "https://etmae.pages.dev",
  "https://etmae.vercel.app",
];

export function getCorsHeaders(origin?: string | null) {
  const isAllowedPreviewOrigin =
    origin?.endsWith(".pages.dev") || origin?.endsWith(".vercel.app");

  const allowOrigin =
    origin && (ALLOWED_ORIGINS.includes(origin) || isAllowedPreviewOrigin)
      ? origin
      : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    Vary: "Origin",
  };
}

export const corsHeaders = getCorsHeaders();

export function handleCors(origin?: string | null) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}