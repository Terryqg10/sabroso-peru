import Image from 'next/image';
import type { Imagen } from '@/content/galeria';

/** Una imagen es panorámica si su ancho supera al alto por un factor de 1.3. */
function esPanoramica(imagen: Imagen): boolean {
  return imagen.ancho / imagen.alto > 1.3;
}

/** Rejilla de fotos. Las verticales se fuerzan a 3:4. La panorámica ocupa el ancho completo. */
export function GaleriaFotos({ imagenes }: { imagenes: readonly Imagen[] }) {
  if (imagenes.length === 0) {
    return (
      <p role="status" className="text-body text-fg-muted">
        Estamos preparando la galería. Pronto verás aquí fotos de nuestros platos y del local.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {imagenes.map((imagen, indice) => {
        const panoramica = esPanoramica(imagen);
        return (
          <li
            key={`${imagen.src}-${indice}`}
            className={
              panoramica
                ? 'col-span-full border border-border bg-surface'
                : 'aspect-3/4 border border-border bg-surface'
            }
          >
            <Image
              src={imagen.src}
              alt={imagen.alt}
              width={imagen.ancho}
              height={imagen.alto}
              sizes={panoramica ? '100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
              loading={indice === 0 ? 'eager' : 'lazy'}
              className={panoramica ? 'h-auto w-full' : 'h-full w-full object-cover'}
            />
          </li>
        );
      })}
    </ul>
  );
}
