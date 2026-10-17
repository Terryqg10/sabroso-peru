import Image from 'next/image';
import Link from 'next/link';
import { restaurante } from '@/config/restaurante';
import { resumenHorarios } from '@/lib/horarios';
import { enlacesPie } from '@/lib/navegacion';

// En v3 los enlaces no se subrayan: se distinguen por color y cambian al pasar el ratón.
const claseEnlace =
  'inline-flex min-h-11 items-center text-body text-fg-muted hover:text-accent-text motion-safe:transition-colors';
const claseTitulo = 'mb-4 text-label font-bold uppercase tracking-caps text-fg';

export function Footer() {
  const horarios = resumenHorarios(restaurante.horarios);

  return (
    <footer className="mt-16 border-t border-border bg-bg px-gutter pt-16 pb-28 text-fg-muted">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Image
              src="/brand/logo-vertical.png"
              alt={`${restaurante.nombre}, cocina peruana`}
              width={768}
              height={533}
              sizes="192px"
              className="h-auto w-48"
            />
            <p className="text-label">
              © {new Date().getFullYear()} {restaurante.nombre}.
              {restaurante.demo ? ' Proyecto de demostración.' : ''}
            </p>
          </div>

          <section aria-labelledby="pie-contacto">
            <h2 id="pie-contacto" className={claseTitulo}>
              Contacto
            </h2>
            <address className="text-body not-italic">
              <p>{restaurante.direccion}</p>
              <p>
                <a href={`tel:${restaurante.telefono.replace(/\s/g, '')}`} className={claseEnlace}>
                  {restaurante.telefono}
                </a>
              </p>
              <p>
                <a href={`mailto:${restaurante.email}`} className={claseEnlace}>
                  {restaurante.email}
                </a>
              </p>
            </address>
          </section>

          <section aria-labelledby="pie-horarios">
            <h2 id="pie-horarios" className={claseTitulo}>
              Horarios
            </h2>
            <dl className="grid gap-2 text-body">
              {horarios.map((fila) => (
                <div key={fila.dias} className="flex flex-wrap gap-x-2">
                  <dt>{fila.dias}:</dt>
                  <dd>{fila.horario}</dd>
                </div>
              ))}
            </dl>
          </section>

          <nav aria-labelledby="pie-enlaces">
            <h2 id="pie-enlaces" className={claseTitulo}>
              Enlaces
            </h2>
            <ul className="grid grid-cols-2 gap-x-4">
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
      </div>
    </footer>
  );
}
