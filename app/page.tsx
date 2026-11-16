import Script from 'next/script';

// O painel é o HTML original (public/dash/page.html) movido pelo runtime em public/dash/runtime.js.
export default function Page() {
  return (
    <main className="wrap">
      <div id="dash-root" />
      <Script src="/dash/runtime.js" strategy="afterInteractive" />
    </main>
  );
}
