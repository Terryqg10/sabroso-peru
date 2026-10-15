import Link from 'next/link';
import { restaurante } from '@/config/restaurante';
import { resumenHorarios } from '@/lib/horarios';
import { enlacesPie } from '@/lib/navegacion';

const claseEnlace =
  'inline-flex min-h-11 items-center text-body text-fg-muted underline hover:text-fg';
const claseTitulo = 'text-label font-semibold uppercase tracking-caps text-fg';

export function Footer() {
  const horarios = resumenHorarios(restaurante.horarios);

  return (
    <footer className="mt-16 border-t border-border bg-bg px-gutter py-12 text-fg-muted">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <section aria-labelledby="pie-contacto">
          <h2 id="pie-contacto" className={claseTitulo}>
            Contacto
          </h2>
          <address className="mt-4 text-body not-italic">
            <p>{restaurante.direccion}</p>
            <p>
              <a
                href={`tel:${restaurante.telefono.replace(/\s/g, '')}`}
                className="inline-flex min-h-11 items-center underline hover:text-fg"
              >
                {restaurante.telefono}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${restaurante.email}`}
                className="inline-flex min-h-11 items-center underline hover:text-fg"
              >
                {restaurante.email}
              </a>
            </p>
          </address>
        </section>

        <section aria-labelledby="pie-horarios">
          <h2 id="pie-horarios" className={claseTitulo}>
            Horarios
          </h2>
          <dl className="mt-4 grid gap-1 text-body">
            {horarios.map((fila) => (
              <div key={fila.dias} className="flex flex-wrap gap-x-2">
                <dt>{fila.dias}:</dt>
                <dd>{fila.horario}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-labelledby="pie-enlaces" className="sm:col-span-2">
          <h2 id="pie-enlaces" className={claseTitulo}>
            Enlaces
          </h2>
          <ul className="mt-4 grid gap-1 sm:grid-cols-2">
            {enlacesPie().map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className={claseEnlace}>
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mt-10 text-label">© {restaurante.nombre}</p>
    </footer>
  );
}
