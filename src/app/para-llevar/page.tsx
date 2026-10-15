import type { Metadata } from 'next';
import Link from 'next/link';
import { restaurante } from '@/config/restaurante';
import { urlTelefono, urlWhatsApp } from '@/lib/contacto';
import { resumenHorarios } from '@/lib/horarios';

export const metadata: Metadata = {
  title: 'Para llevar',
  description: 'Cómo pedir comida para llevar: llama o escríbenos por WhatsApp y recógela en el local.',
};

const MENSAJE = 'Hola, quisiera hacer un pedido para llevar.';
const claseEnlace = 'inline-flex min-h-11 items-center font-semibold text-accent-text underline';
const claseBoton =
  'inline-flex min-h-11 items-center justify-center px-6 text-label font-bold uppercase tracking-caps';

const pasos = [
  'Mira la carta y elige tus platos.',
  'Llámanos o escríbenos por WhatsApp con tu pedido y la hora a la que quieres recogerlo.',
  'Te confirmamos el pedido y el tiempo de preparación.',
  'Recógelo en el local a la hora acordada.',
] as const;

export default function ParaLlevarPage() {
  const horarios = resumenHorarios(restaurante.horarios);

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
          Para llevar
        </p>
        <h1 className="mt-2 text-display font-extrabold">Llévate el sabor</h1>
        <p className="mt-6 text-body text-fg-muted">
          Pide por teléfono o por WhatsApp y recoge tu pedido en el local. Esta web no tiene carrito ni
          cobra online.
        </p>

        <section aria-labelledby="llevar-pasos" className="mt-10">
          <h2 id="llevar-pasos" className="text-label font-bold uppercase tracking-caps text-fg">
            Cómo pedir
          </h2>
          <ol className="mt-4 grid list-decimal gap-3 pl-6 text-body text-fg-muted">
            {pasos.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={urlWhatsApp(restaurante.whatsapp, MENSAJE)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${claseBoton} bg-accent text-accent-fg hover:bg-accent-hover`}
            >
              Pedir por WhatsApp
            </a>
            <a
              href={urlTelefono(restaurante.telefono)}
              className={`${claseBoton} border border-border-strong text-fg hover:bg-surface-muted`}
            >
              Llamar al {restaurante.telefono}
            </a>
          </div>
        </section>

        <section aria-labelledby="llevar-recogida" className="mt-12">
          <h2 id="llevar-recogida" className="text-label font-bold uppercase tracking-caps text-fg">
            Recogida
          </h2>
          <address className="mt-4 text-body not-italic text-fg-muted">
            <p>Recoge tu pedido en: {restaurante.direccion}</p>
          </address>
          <p className="mt-4 text-body text-fg-muted">
            Horario de atención (VERIFICAR si el horario de recogida es el mismo que el de sala):
          </p>
          <dl className="mt-2 grid gap-1 text-body text-fg-muted">
            {horarios.map((fila) => (
              <div key={fila.dias} className="flex flex-wrap gap-x-2">
                <dt>{fila.dias}:</dt>
                <dd>{fila.horario}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="llevar-pago" className="mt-12">
          <h2 id="llevar-pago" className="text-label font-bold uppercase tracking-caps text-fg">
            Pago y alergias
          </h2>
          <p className="mt-4 text-body text-fg-muted">
            El pago no se hace en la web: lo acuerdas directamente con el restaurante al pedir o al
            recoger. Si tienes alguna alergia o intolerancia, indícalo al hacer el pedido.
          </p>
          <p className="mt-4 text-body">
            <Link href="/carta" className={claseEnlace}>
              Ver la carta
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
