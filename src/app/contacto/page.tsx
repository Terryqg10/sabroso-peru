import { Navigation } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { restaurante } from '@/config/restaurante';
import { resumenHorarios } from '@/lib/horarios';
import { urlComoLlegar, urlMapaIncrustado, urlOpenStreetMap } from '@/lib/mapa';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Horarios, dirección y formas de contactar con el restaurante.',
};

const claseEnlace = 'inline-flex min-h-11 items-center font-semibold text-accent-text transition-opacity hover:opacity-80';
const claseTitulo = 'text-label font-bold uppercase tracking-caps text-fg';
const claseBoton =
  'inline-flex min-h-11 items-center justify-center gap-2 px-6 text-label font-bold uppercase tracking-caps';

export default function ContactoPage() {
  const horarios = resumenHorarios(restaurante.horarios);

  return (
    <main className="mx-auto max-w-7xl px-gutter py-12 md:py-16">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-label font-semibold uppercase tracking-caps text-accent-text transition-opacity hover:opacity-80"
      >
        Volver al inicio
      </Link>
      <div className="mt-8 mb-12">
        <p className="text-label font-semibold uppercase tracking-caps text-accent-text">Contacto</p>
        <h1 className="mt-2 text-display font-extrabold">Ven a vernos</h1>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="contacto-direccion">
            <h2 id="contacto-direccion" className={claseTitulo}>
              Dirección
            </h2>
            <address className="mt-3 text-body not-italic text-fg-muted">
              <p>{restaurante.direccion}</p>
            </address>
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

          <section aria-labelledby="contacto-medios">
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
            </ul>
            <Link
              href="/reservas"
              className={`${claseBoton} mt-6 w-full bg-accent text-accent-fg hover:bg-accent-hover sm:w-auto`}
            >
              Reservar una mesa
            </Link>
          </section>
        </div>

        <section aria-labelledby="contacto-mapa" className="flex h-full min-h-96 flex-col">
          <h2 id="contacto-mapa" className="sr-only">
            Cómo llegar
          </h2>
          <div className="relative min-h-96 grow overflow-hidden border border-border bg-surface">
            <iframe
              title={`Mapa con la ubicación de ${restaurante.nombre}`}
              src={urlMapaIncrustado(restaurante.ubicacion)}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={urlComoLlegar(restaurante.ubicacion)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${claseBoton} w-full bg-accent text-accent-fg hover:bg-accent-hover sm:w-auto`}
            >
              <Navigation aria-hidden="true" className="size-4" />
              Cómo llegar
            </a>
            <a
              href={urlOpenStreetMap(restaurante.ubicacion)}
              target="_blank"
              rel="noopener noreferrer"
              className={claseEnlace}
            >
              Abrir en OpenStreetMap
            </a>
          </div>
          <p className="mt-3 text-label text-fg-muted">
            «Cómo llegar» abre tu aplicación de navegación con la ruta hasta el restaurante.
          </p>
        </section>
      </div>
    </main>
  );
}
