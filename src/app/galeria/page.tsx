import type { Metadata } from 'next';
import Link from 'next/link';
import { GaleriaFotos } from '@/components/galeria/GaleriaFotos';
import { galeria } from '@/content/galeria';

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Fotos de los platos y del local.',
};

export default function GaleriaPage() {
  return (
    <main className="px-gutter py-12">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-label font-semibold uppercase tracking-caps text-accent-text transition-opacity hover:opacity-80"
      >
        Volver al inicio
      </Link>
      <p className="mt-8 text-label font-semibold uppercase tracking-caps text-accent-text">Galería</p>
      <h1 className="mt-2 text-display font-extrabold">Platos y rincones</h1>
      <div className="mt-10">
        <GaleriaFotos imagenes={galeria} />
      </div>
    </main>
  );
}
