import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  // Construct production-safe origin dynamically using request headers
  const protocol = request.headers.get('x-forwarded-proto') ?? 'http';
  // Use host from headers (e.g. localhost:3001, yuktify-y65g.vercel.app) or fallback to request URL host
  const host = request.headers.get('x-forwarded-host') ?? requestUrl.host;
  const origin = `${protocol.endsWith(':') ? protocol.slice(0, -1) : protocol}://${host}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Authentication%20failed`);
}
