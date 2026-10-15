import { describe, expect, it } from 'vitest';
import { carta as cartaReal, cartaSchema } from '@/content/carta';
import { enlacesCategoria, filtrarCarta, secciones } from '@/lib/carta';

// Datos de prueba: no son platos reales del restaurante.
const platoA = {
  id: 'plato-a',
  nombre: 'Plato A',
  descripcion: 'Descripción A',
  precio: 12.5,
  categoria: 'frios',
  etiquetas: ['picante', 'sin-gluten'],
  alergenos: ['pescado'],
};

const platoB = {
  id: 'plato-b',
  nombre: 'Plato B',
  descripcion: 'Descripción B',
  precio: 9,
  categoria: 'calientes',
  etiquetas: [],
  alergenos: [],
  foto: { src: '/img/b.jpg', alt: 'Plato B servido' },
};

const base = {
  categorias: [
    { id: 'frios', titulo: 'Fríos' },
    { id: 'calientes', titulo: 'Calientes' },
    { id: 'vacia', titulo: 'Sin platos' },
  ],
  platos: [platoA, platoB],
};

const conPlato = (cambios: Record<string, unknown>) => ({
  ...base,
  platos: [{ ...platoA, ...cambios }, platoB],
});

describe('CA-13 cartaSchema', () => {
  it('acepta datos válidos, con foto opcional', () => {
    expect(cartaSchema.safeParse(base).success).toBe(true);
  });

  it('exige etiquetas y alérgenos declarados en cada plato', () => {
    const { etiquetas: _e, ...sinEtiquetas } = platoA;
    const { alergenos: _a, ...sinAlergenos } = platoA;
    expect(cartaSchema.safeParse({ ...base, platos: [sinEtiquetas] }).success).toBe(false);
    expect(cartaSchema.safeParse({ ...base, platos: [sinAlergenos] }).success).toBe(false);
  });

  it('exige nombre, descripción y precio válidos', () => {
    expect(cartaSchema.safeParse(conPlato({ nombre: '' })).success).toBe(false);
    expect(cartaSchema.safeParse(conPlato({ descripcion: '' })).success).toBe(false);
    expect(cartaSchema.safeParse(conPlato({ precio: 0 })).success).toBe(false);
    expect(cartaSchema.safeParse(conPlato({ precio: -3 })).success).toBe(false);
    expect(cartaSchema.safeParse(conPlato({ precio: 10.999 })).success).toBe(false);
  });

  it('rechaza etiquetas y alérgenos desconocidos', () => {
    expect(cartaSchema.safeParse(conPlato({ etiquetas: ['vegano'] })).success).toBe(false);
    expect(cartaSchema.safeParse(conPlato({ alergenos: ['polen'] })).success).toBe(false);
  });

  it('rechaza una foto sin texto alternativo', () => {
    expect(cartaSchema.safeParse(conPlato({ foto: { src: '/a.jpg', alt: '' } })).success).toBe(false);
  });

  it('rechaza categoría inexistente, plato duplicado y categoría duplicada', () => {
    expect(cartaSchema.safeParse(conPlato({ categoria: 'no-existe' })).success).toBe(false);
    expect(cartaSchema.safeParse({ ...base, platos: [platoA, platoA] }).success).toBe(false);
    expect(
      cartaSchema.safeParse({ ...base, categorias: [base.categorias[0], base.categorias[0]] }).success,
    ).toBe(false);
  });

  it('la carta real del proyecto cumple el esquema', () => {
    expect(cartaSchema.safeParse(cartaReal).success).toBe(true);
  });
});

describe('filtrarCarta (parte unitaria de CA-02)', () => {
  const carta = cartaSchema.parse(base);

  it('sin filtro devuelve todos los platos', () => {
    expect(filtrarCarta(carta, null)).toHaveLength(2);
  });

  it('filtra por categoría', () => {
    expect(filtrarCarta(carta, 'frios').map((p) => p.id)).toEqual(['plato-a']);
  });

  it('una categoría desconocida devuelve todos los platos', () => {
    expect(filtrarCarta(carta, 'no-existe')).toHaveLength(2);
  });

  it('una categoría válida sin platos devuelve una lista vacía', () => {
    expect(filtrarCarta(carta, 'vacia')).toEqual([]);
  });
});

describe('CA-14 categorias-coherentes', () => {
  const carta = cartaSchema.parse(base);

  it('los enlaces y las secciones coinciden uno a uno en orden, título y ancla', () => {
    const enlaces = enlacesCategoria(carta);
    const sec = secciones(carta);
    expect(enlaces).toHaveLength(sec.length);
    enlaces.forEach((e, i) => {
      expect(e.titulo).toBe(sec[i]?.titulo);
      expect(e.href).toBe(`#${sec[i]?.ancla}`);
    });
  });

  it('las anclas son únicas', () => {
    const anclas = secciones(carta).map((s) => s.ancla);
    expect(new Set(anclas).size).toBe(anclas.length);
  });

  it('también coinciden en la carta real', () => {
    const enlaces = enlacesCategoria(cartaReal);
    const sec = secciones(cartaReal);
    expect(enlaces.map((e) => e.titulo)).toEqual(sec.map((s) => s.titulo));
  });
});
