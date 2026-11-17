import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/** Só contas Google destes domínios entram. Pode ser trocado pela variável ALLOWED_DOMAINS (separados por vírgula). */
export const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || 'vissimo.com.br,evino.com.br,grandcru.com.br')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    // Sem `hd`: ele só aceita um domínio. A checagem de verdade é no callback signIn.
    Google({ authorization: { params: { prompt: 'select_account' } } }),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 3600 },
  callbacks: {
    signIn({ profile }) {
      const email = String(profile?.email || '').toLowerCase();
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified !== false;
      return verified && ALLOWED_DOMAINS.some((d) => email.endsWith(`@${d}`));
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
};
