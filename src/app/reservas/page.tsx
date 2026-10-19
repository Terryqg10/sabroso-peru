import type { Metadata } from 'next';
import Link from 'next/link';
import { ReservaForm } from '@/components/reservas/ReservaForm';
import { restaurante } from '@/config/restaurante';
import { urlTelefono } from '@/lib/contacto';
import { resumenHorarios } from '@/lib/horarios';

export const metadata: Metadata = {
  title: 'Reservar mesa',
  description: 'Reserva tu mesa: rellena el formulario y te preparamos el mensaje de WhatsApp.',
};

export default function ReservasPage() {
  const horarios = resumenHorarios(restaurante.horarios);

  return (
    <main className="mx-auto max-w-7xl px-gutter py-12 md:py-16">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-label font-semibold uppercase tracking-caps text-accent-text transition-opacity hover:opacity-80"
      >
        Volver al inicio
      </Link>
      <p className="mt-8 text-label font-semibold uppercase tracking-caps text-accent-text">Reservas</p>
      <h1 className="mt-2 text-display font-extrabold">Reserva tu mesa</h1>
      <p className="mt-6 max-w-prose-token text-body text-fg-muted">
        Rellena el formulario y te abrimos WhatsApp con el mensaje preparado. La reserva queda
        confirmada cuando el restaurante te responda.
      </p>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReservaForm />
        </div>

        <aside aria-labelledby="reservas-horario" className="md:sticky md:top-24 md:self-start">
          <div className="border border-border bg-surface p-6">
            <h2 id="reservas-horario" className="text-label font-bold uppercase tracking-caps text-fg">
              Cuándo abrimos
            </h2>
            <dl className="mt-4 grid gap-1 text-body text-fg-muted">
              {horarios.map((fila) => (
                <div key={fila.dias} className="flex flex-wrap gap-x-2">
                  <dt>{fila.dias}:</dt>
                  <dd>{fila.horario}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-label font-bold uppercase tracking-caps text-fg">¿Prefieres llamar?</h3>
              <p className="mt-2 text-body text-fg-muted">También puedes reservar por teléfono.</p>
              <a
                href={urlTelefono(restaurante.telefono)}
                className="mt-2 inline-flex min-h-11 items-center font-semibold text-accent-text hover:text-fg motion-safe:transition-colors"
              >
                Llamar para reservar
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
