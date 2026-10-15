import Link from 'next/link';
import { Resenas } from '@/components/Resenas';
import { resenas } from '@/content/resenas';
import { restaurante } from '@/config/restaurante';
import { resumenHorarios } from '@/lib/horarios';

// VERIFICAR: textos de presentación provisionales hasta tener el relato real del restaurante.
const cultura = [
  {
    titulo: 'Ají amarillo',
    texto: 'El chile que da color y carácter a buena parte de la cocina peruana, en cremas, guisos y salsas.',
  },
  {
    titulo: 'Leche de tigre',
    texto: 'El jugo cítrico del ceviche: lima, cebolla y ají, que se bebe también como un pequeño brindis.',
  },
  {
    titulo: 'Mar, andes y selva',
    texto: 'Una despensa muy diversa: pescado fresco, papas, maíz y ajíes que se mezclan en cada plato.',
  },
] as const;

const claseBoton =
  'inline-flex min-h-11 w-full items-center justify-center px-6 sm:w-auto text-label font-bold uppercase tracking-caps';

export default function Inicio() {
  const horarios = resumenHorarios(restaurante.horarios);

  return (
    <main>
      <section aria-labelledby="inicio-titulo" className="grid min-h-hero lg:grid-cols-2">
        <div className="flex flex-col justify-center px-gutter py-16">
          <p className="text-label font-semibold uppercase tracking-caps text-accent-text">
            Cocina peruana
          </p>
          <h1 id="inicio-titulo" className="mt-4 text-display font-extrabold">
            Perú en la mesa
          </h1>
          <p className="mt-6 text-label font-semibold uppercase tracking-caps text-fg-muted">
            Ceviche, lomo saltado y más
          </p>
          <p className="mt-8 max-w-prose-token text-body text-fg-muted">
            Un restaurante para descubrir la cultura gastronómica del Perú: sabores auténticos,
            producto fresco y una carta pensada para compartir.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/reservas" className={`${claseBoton} bg-accent text-accent-fg hover:bg-accent-hover`}>
              Reservar mesa
            </Link>
            <Link
              href="/carta"
              className={`${claseBoton} border border-border-strong text-fg hover:bg-surface-muted`}
            >
              Ver la carta
            </Link>
            <Link
              href="/contacto"
              className={`${claseBoton} border border-border-strong text-fg hover:bg-surface-muted`}
            >
              Cómo llegar
            </Link>
          </div>
        </div>

        <aside
          aria-labelledby="inicio-horarios"
          className="flex flex-col justify-center border-t border-border bg-surface px-gutter py-16 lg:border-l lg:border-t-0"
        >
          <h2
            id="inicio-horarios"
            className="text-label font-bold uppercase tracking-caps text-fg"
          >
            Horarios
          </h2>
          <dl className="mt-4 grid gap-1 text-body text-fg-muted">
            {horarios.map((fila) => (
              <div key={fila.dias} className="flex flex-wrap gap-x-2">
                <dt>{fila.dias}:</dt>
                <dd>{fila.horario}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-body text-fg-muted">{restaurante.direccion}</p>
        </aside>
      </section>

      <section aria-labelledby="cultura-titulo" className="px-gutter py-16">
        <p className="text-label font-semibold uppercase tracking-caps text-accent-text">Cultura</p>
        <h2 id="cultura-titulo" className="mt-2 text-display font-extrabold">
          Sabores con historia
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {cultura.map((tema) => (
            <li key={tema.titulo} className="border border-border bg-surface p-6">
              <h3 className="text-label font-bold uppercase tracking-caps text-fg">{tema.titulo}</h3>
              <p className="mt-3 text-body text-fg-muted">{tema.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <Resenas resenas={resenas} />

      <section aria-labelledby="reserva-titulo" className="border-t border-border bg-surface px-gutter py-16">
        <h2 id="reserva-titulo" className="text-display font-extrabold">
          ¿Te guardamos una mesa?
        </h2>
        <p className="mt-4 max-w-prose-token text-body text-fg-muted">
          Reserva en un minuto: te preparamos el mensaje de WhatsApp y el restaurante confirma.
        </p>
        <Link
          href="/reservas"
          className={`${claseBoton} mt-8 bg-accent text-accent-fg hover:bg-accent-hover`}
        >
          Reservar mesa
        </Link>
      </section>
    </main>
  );
}
