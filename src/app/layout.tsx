import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { BotonLlamar } from '@/components/BotonLlamar';
import { Cabecera } from '@/components/Cabecera';
import { Footer } from '@/components/Footer';
import { restaurante } from '@/config/restaurante';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-brand' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sabroso-peru.vercel.app'),
  title: { default: restaurante.nombre, template: `%s | ${restaurante.nombre}` },
  description: 'Restaurante peruano: carta, reservas y cultura gastronómica.',
  robots: restaurante.demo ? { index: false, follow: false } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-body text-fg antialiased">
        <a
          href="#contenido"
          className="sr-only bg-accent px-4 py-3 text-label font-bold uppercase tracking-caps text-accent-fg focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-10"
        >
          Saltar al contenido
        </a>
        <Cabecera />
        <div id="contenido" className="flex-1">
          {children}
        </div>
        <Footer />
        <BotonLlamar />
      </body>
    </html>
  );
}
