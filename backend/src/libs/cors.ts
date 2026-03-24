export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // change to your frontend domain in production
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export function handleCors() {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }