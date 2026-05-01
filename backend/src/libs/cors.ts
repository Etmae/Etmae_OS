const ALLOWED_ORIGINS = [
  "https://localhost:5173",
  "https://your-production-domain.com",
  "https://www.your-production-domain.com",
];

export function getCorsHeaders(origin?: string | null) {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.includes(origin)
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