const ALLOWED_ORIGINS = [
  "https://localhost:5173",   
  "http://localhost:8788",   
  "http://127.0.0.1:8788",
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
      : "";  // ← block unknown origins, not silently pass them through

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