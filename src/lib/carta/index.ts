import type { Carta, Categoria, Plato } from '@/content/carta';

export type Seccion = {
  id: string;
  titulo: string;
  ancla: string;
  platos: Plato[];
};

export type EnlaceCategoria = { titulo: string; href: string };

export function anclaCategoria(categoria: Categoria): string {
  return `categoria-${categoria.id}`;
}

/**
 * Filtra por categoría. Sin filtro o con una categoría desconocida devuelve todos los
 * platos (SPEC-001 §6). Una categoría válida sin platos devuelve una lista vacía.
 */
export function filtrarCarta(carta: Carta, categoriaId: string | null): Plato[] {
  if (categoriaId === null || !carta.categorias.some((c) => c.id === categoriaId)) {
    return carta.platos;
  }
  return carta.platos.filter((p) => p.categoria === categoriaId);
}

export function secciones(carta: Carta): Seccion[] {
  return carta.categorias.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    ancla: anclaCategoria(c),
    platos: carta.platos.filter((p) => p.categoria === c.id),
  }));
}

/** Los enlaces se derivan de las mismas categorías que los títulos de sección. */
export function enlacesCategoria(carta: Carta): EnlaceCategoria[] {
  return carta.categorias.map((c) => ({ titulo: c.titulo, href: `#${anclaCategoria(c)}` }));
}
