import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  // Construct production-safe origin dynamically using headers and request info
  let origin = '';
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (forwardedHost) {
    origin = `${forwardedProto.endsWith(':') ? forwardedProto.slice(0, -1) : forwardedProto}://${forwardedHost}`;
  } else {
    if (requestUrl.host.includes('localhost')) {
      origin = requestUrl.origin;
    } else {
      origin = requestUrl.origin.replace('http://', 'https://');
    }
  }

  // Fail-safe fallback in production environment
  if ((!origin || origin.includes('localhost')) && process.env.NODE_ENV === 'production') {
    origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://yuktify-v65g.vercel.app';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Authentication%20failed`);
}
