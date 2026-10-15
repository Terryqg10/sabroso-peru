import type { Metadata } from 'next';
import Link from 'next/link';
import { restaurante } from '@/config/restaurante';
import { resumenHorarios } from '@/lib/horarios';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Horarios, dirección y formas de contactar con el restaurante.',
};

const claseEnlace = 'inline-flex min-h-11 items-center font-semibold text-accent-text underline';
const claseTitulo = 'text-label font-bold uppercase tracking-caps text-fg';

export default function ContactoPage() {
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
          Contacto
        </p>
        <h1 className="mt-2 text-display font-extrabold">Ven a vernos</h1>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          <section aria-labelledby="contacto-direccion">
            <h2 id="contacto-direccion" className={claseTitulo}>
              Dirección
            </h2>
            <address className="mt-3 text-body not-italic text-fg-muted">
              <p>{restaurante.direccion}</p>
            </address>
            {restaurante.mapaUrl && (
              <a href={restaurante.mapaUrl} target="_blank" rel="noopener noreferrer" className={claseEnlace}>
                Ver en el mapa
              </a>
            )}
          </section>

          <section aria-labelledby="contacto-horarios">
            <h2 id="contacto-horarios" className={claseTitulo}>
              Horarios
            </h2>
            <dl className="mt-3 grid gap-1 text-body text-fg-muted">
              {horarios.map((fila) => (
                <div key={fila.dias} className="flex flex-wrap gap-x-2">
                  <dt>{fila.dias}:</dt>
                  <dd>{fila.horario}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="contacto-medios" className="sm:col-span-2">
            <h2 id="contacto-medios" className={claseTitulo}>
              Cómo contactarnos
            </h2>
            <ul className="mt-3 grid gap-1 text-body">
              <li>
                <a href={`tel:${restaurante.telefono.replace(/\s/g, '')}`} className={claseEnlace}>
                  Llamar al {restaurante.telefono}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${restaurante.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={claseEnlace}
                >
                  Escribir por WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${restaurante.email}`} className={claseEnlace}>
                  {restaurante.email}
                </a>
              </li>
              <li>
                <Link href="/reservas" className={claseEnlace}>
                  Reservar una mesa
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
