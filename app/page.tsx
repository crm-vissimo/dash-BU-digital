import Script from 'next/script';
import { auth, signOut } from '@/auth';

export const dynamic = 'force-dynamic';

// O painel é o HTML original (public/dash/page.html) movido pelo runtime em public/dash/runtime.js.
export default async function Page() {
  const session = await auth();
  return (
    <main className="wrap">
      <div className="userbar">
        <span>{session?.user?.email}</span>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button type="submit">Sair</button>
        </form>
      </div>
      <div id="dash-root" />
      <Script src="/dash/runtime.js" strategy="afterInteractive" />
    </main>
  );
}
