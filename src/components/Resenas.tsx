import type { Resena } from '@/content/resenas';

function formatearFecha(fecha: string): string {
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}

/** Citas reales con fuente y fecha (ADR-004). Sin citas, no se muestra la sección. */
export function Resenas({ resenas }: { resenas: readonly Resena[] }) {
  if (resenas.length === 0) return null;

  return (
    <section aria-labelledby="resenas-titulo" className="px-gutter py-16">
      <p className="text-label font-semibold uppercase tracking-caps text-accent-text">Opiniones</p>
      <h2 id="resenas-titulo" className="mt-2 text-display font-extrabold">
        Lo que dicen
      </h2>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {resenas.map((r) => (
          <li key={`${r.url}-${r.fecha}`}>
            <figure className="h-full border border-border bg-surface p-6">
              <blockquote className="text-body text-fg">“{r.texto}”</blockquote>
              <figcaption className="mt-4 text-label text-fg-muted">
                {r.autor} · {r.fuente} · {formatearFecha(r.fecha)}
                <br />
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-semibold text-accent-text underline"
                >
                  Ver reseña de {r.autor} en {r.fuente}
                </a>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
