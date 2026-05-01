import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/libs/supabase/server';
import { getCorsHeaders, handleCors } from '@/libs/cors';

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return handleCors(origin);
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');

  const { data, error } = await supabaseAdmin.storage
    .from('CV')
    .download('Resume.pdf');

  
  if (error || !data) {
    console.error('Supabase download error:', error);
    return new NextResponse(JSON.stringify({ error: error?.message ?? 'No data returned' }), {
      status: 500,
      headers: getCorsHeaders(origin),
    });
  }

  return new NextResponse(data, {
    headers: {
      ...getCorsHeaders(origin),
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Elijah-Olujimi-CV.pdf"',
    },
  });
}