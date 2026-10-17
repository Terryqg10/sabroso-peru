'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Carta, Plato } from '@/content/carta';
import { filtrarCarta, secciones } from '@/lib/carta';
import { formatearPrecio, TEXTO_ALERGENO, TEXTO_ETIQUETA } from '@/lib/carta/textos';

const claseFiltro =
  'inline-flex min-h-11 items-center px-4 text-label font-semibold uppercase tracking-caps';

function TarjetaPlato({ plato }: { plato: Plato }) {
  return (
    <li className="group flex h-full flex-col border border-border bg-surface motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lift">
      {plato.foto && (
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={plato.foto.src}
            alt={plato.foto.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-body font-bold text-fg">{plato.nombre}</h3>
          <p className="shrink-0 text-body font-bold text-accent-text">{formatearPrecio(plato.precio)}</p>
        </div>
        <p className="mt-2 text-body text-fg-muted">{plato.descripcion}</p>

        {plato.etiquetas.length > 0 && (
          <ul aria-label="Etiquetas" className="mt-4 flex flex-wrap gap-2">
            {plato.etiquetas.map((etiqueta) => (
              <li
                key={etiqueta}
                className="border border-border-strong px-2 py-1 text-label uppercase tracking-caps text-fg"
              >
                {TEXTO_ETIQUETA[etiqueta]}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-label text-fg-muted">
          <span className="font-semibold text-fg">Alérgenos: </span>
          {plato.alergenos.length > 0
            ? plato.alergenos.map((a) => TEXTO_ALERGENO[a]).join(', ')
            : 'ninguno declarado'}
        </p>
      </div>
    </li>
  );
}

export function CartaInteractiva({ carta }: { carta: Carta }) {
  const [filtro, setFiltro] = useState<string | null>(null);

  const todas = secciones(carta);
  const visibles = filtro === null ? todas : todas.filter((s) => s.id === filtro);
  const cuantos = filtrarCarta(carta, filtro).length;
  const cartaVacia = carta.platos.length === 0;

  let estado: string;
  if (cartaVacia) {
    estado = 'Estamos preparando la carta online. Pronto verás aquí los platos.';
  } else if (cuantos === 0) {
    estado = 'No hay platos en esta categoría.';
  } else {
    estado = cuantos === 1 ? 'Mostrando 1 plato.' : `Mostrando ${cuantos} platos.`;
  }

  return (
    <div>
      <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={filtro === null}
          onClick={() => setFiltro(null)}
          className={`${claseFiltro} ${
            filtro === null
              ? 'bg-accent text-accent-fg'
              : 'border border-border-strong text-fg hover:bg-surface-muted'
          }`}
        >
          Todas
        </button>
        {carta.categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            aria-pressed={filtro === categoria.id}
            onClick={() => setFiltro(categoria.id)}
            className={`${claseFiltro} ${
              filtro === categoria.id
                ? 'bg-accent text-accent-fg'
                : 'border border-border-strong text-fg hover:bg-surface-muted'
            }`}
          >
            {categoria.titulo}
          </button>
        ))}
      </div>

      <p role="status" className="mt-6 text-body text-fg-muted">
        {estado}
      </p>

      <div className="mt-10 grid gap-12">
        {visibles.map((seccion) => (
          <section key={seccion.id} id={seccion.ancla} aria-labelledby={`${seccion.ancla}-titulo`}>
            <h2
              id={`${seccion.ancla}-titulo`}
              className="border-b border-border pb-3 text-label font-bold uppercase tracking-caps text-accent-text"
            >
              {seccion.titulo}
            </h2>
            {seccion.platos.length > 0 ? (
              <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {seccion.platos.map((plato) => (
                  <TarjetaPlato key={plato.id} plato={plato} />
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-body text-fg-muted">Sin platos por ahora.</p>
            )}
          </section>
        ))}
      </div>

      <p className="mt-12 max-w-prose-token border-l-2 border-border-strong pl-4 text-label text-fg-muted">
        Si tienes alguna alergia o intolerancia, avísanos al reservar o en la mesa. Los precios incluyen
        impuestos. VERIFICAR con el restaurante.
      </p>
    </div>
  );
}
