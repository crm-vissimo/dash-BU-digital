import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';

// Protege tudo: página, arquivos do painel e /api/dataset. Sem sessão, páginas vão para /login e a API responde 401.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (req.auth?.user) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/api/'))
    return NextResponse.json({ ok: false, error: 'não autenticado' }, { status: 401 });
  const url = new URL('/login', req.nextUrl.origin);
  if (req.nextUrl.pathname !== '/') url.searchParams.set('callbackUrl', req.nextUrl.pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)'],
};
