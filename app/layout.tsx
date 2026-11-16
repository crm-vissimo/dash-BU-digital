import './globals.css';

export const metadata = { title: 'Super One Page · BU Digital', description: 'Receita e metas das seis BUs digitais (Evino e Grand Cru).' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
