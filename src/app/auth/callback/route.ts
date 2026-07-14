import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Build origin: prefer x-forwarded headers set by Vercel/proxies, fall back to nextUrl
  const proto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');
  const host = request.headers.get('x-forwarded-host') ?? request.nextUrl.host;
  const origin = `${proto}://${host}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Successfully exchanged — redirect to app
      return NextResponse.redirect(`${origin}${next}`);
    }
    // Code exchange failed — redirect to auth with error message
    console.error('[auth/callback] exchangeCodeForSession failed');
    return NextResponse.redirect(`${origin}/auth?error=oauth_exchange_failed`);
  }

  // No code present — redirect to auth
  return NextResponse.redirect(`${origin}/auth?error=no_code`);
}
