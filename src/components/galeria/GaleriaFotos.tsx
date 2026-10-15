import Image from 'next/image';
import type { Imagen } from '@/content/galeria';

/** Rejilla de fotos con dimensiones declaradas. Sin fotos, avisa de que se está preparando. */
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
      {imagenes.map((imagen, indice) => (
        <li key={`${imagen.src}-${indice}`} className="border border-border bg-surface">
          <Image
            src={imagen.src}
            alt={imagen.alt}
            width={imagen.ancho}
            height={imagen.alto}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={indice === 0 ? 'eager' : 'lazy'}
            className="h-auto w-full"
          />
        </li>
      ))}
    </ul>
  );
}
