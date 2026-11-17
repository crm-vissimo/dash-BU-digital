import { signIn } from '@/auth';
import { ALLOWED_DOMAINS } from '@/auth.config';

export const dynamic = 'force-dynamic';

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6.1C12.2 13.3 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16Z" />
      <path fill="#FBBC05" d="M10.3 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6l-7.8-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.8-6.1Z" />
      <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.1-5.5c-2 1.3-4.5 2.1-7.9 2.1-6.4 0-11.8-3.8-13.7-9.1l-7.8 6.1C6.4 42.6 14.6 48 24 48Z" />
    </svg>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; callbackUrl?: string }> }) {
  const sp = await searchParams;
  const denied = sp.error === 'AccessDenied';
  const failed = !!sp.error && !denied;
  const to = sp.callbackUrl && sp.callbackUrl.startsWith('/') && !sp.callbackUrl.startsWith('//') ? sp.callbackUrl : '/';
  const domains = ALLOWED_DOMAINS.map((d) => `@${d}`).join(', ');
  return (
    <main className="login-wrap">
      <div className="login-card">
        <h1 className="login-title">Super One Page · BU Digital</h1>
        <p className="login-text">
          Entre com sua conta Google corporativa: <b>{domains}</b>.
        </p>
        {denied && <div className="login-error">Esta conta não é de um domínio permitido ({domains}). Use seu e-mail corporativo.</div>}
        {failed && <div className="login-error">Não foi possível entrar ({sp.error}). Tente de novo.</div>}
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: to });
          }}
        >
          <button type="submit" className="google-btn">
            <GoogleG />
            Entrar com Google
          </button>
        </form>
      </div>
      <div className="login-foot">Uso interno · Víssimo, Evino e Grand Cru</div>
    </main>
  );
}
