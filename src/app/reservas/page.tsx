import type { Metadata } from 'next';
import Link from 'next/link';
import { ReservaForm } from '@/components/reservas/ReservaForm';

export const metadata: Metadata = {
  title: 'Reservar mesa',
  description: 'Reserva tu mesa: rellena el formulario y te preparamos el mensaje de WhatsApp.',
};

export default function ReservasPage() {
  return (
    <main className="px-gutter py-12">
      <div className="max-w-prose-token">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-label font-semibold uppercase tracking-caps text-accent-text underline"
        >
          Volver al inicio
        </Link>
        <p className="mt-8 text-label font-semibold uppercase tracking-caps text-accent-text">
          Reservas
        </p>
        <h1 className="mt-2 text-display font-extrabold">Reserva tu mesa</h1>
        <p className="mt-6 text-body text-fg-muted">
          Rellena el formulario y te abrimos WhatsApp con el mensaje preparado. La reserva queda
          confirmada cuando el restaurante te responda.
        </p>
        <div className="mt-10">
          <ReservaForm />
        </div>
      </div>
    </main>
  );
}
