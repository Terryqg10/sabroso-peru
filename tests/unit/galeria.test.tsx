import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GaleriaFotos } from '@/components/galeria/GaleriaFotos';
import { galeria, galeriaSchema, imagenSchema } from '@/content/galeria';

// Next/Image necesita el servidor de Next; en el test se sustituye por una imagen simple.
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

afterEach(cleanup);

// Datos de prueba: no son fotos reales del restaurante.
const foto = {
  src: '/galeria/prueba-1.jpg',
  alt: 'Plato de prueba servido en una fuente blanca',
  ancho: 1200,
  alto: 800,
  tipo: 'plato' as const,
};

describe('CA-12 galeriaSchema', () => {
  it('acepta una imagen completa', () => {
    expect(imagenSchema.safeParse(foto).success).toBe(true);
    expect(imagenSchema.safeParse({ ...foto, src: 'https://example.com/a.jpg' }).success).toBe(true);
  });

  it('rechaza una imagen sin texto alternativo o con texto vacío', () => {
    const { alt: _alt, ...sinAlt } = foto;
    expect(imagenSchema.safeParse(sinAlt).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, alt: '' }).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, alt: '   ' }).success).toBe(false);
  });

  it('rechaza dimensiones no válidas, rutas inseguras y tipos desconocidos', () => {
    expect(imagenSchema.safeParse({ ...foto, ancho: 0 }).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, alto: -5 }).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, ancho: 10.5 }).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, src: 'http://example.com/a.jpg' }).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, src: 'javascript:alert(1)' }).success).toBe(false);
    expect(imagenSchema.safeParse({ ...foto, tipo: 'otro' }).success).toBe(false);
  });

  it('valida una lista y la galería real del proyecto', () => {
    expect(galeriaSchema.safeParse([foto, { ...foto, src: '/galeria/prueba-2.jpg' }]).success).toBe(true);
    expect(galeriaSchema.safeParse([foto, { ...foto, alt: '' }]).success).toBe(false);
    expect(galeriaSchema.safeParse(galeria).success).toBe(true);
  });
});

describe('GaleriaFotos', () => {
  it('cada imagen se pinta con un texto alternativo no vacío', () => {
    render(
      <GaleriaFotos
        imagenes={[
          foto,
          { ...foto, src: '/galeria/prueba-2.jpg', alt: 'Comedor de prueba con mesas de madera', tipo: 'local' },
        ]}
      />,
    );
    const imagenes = screen.getAllByRole('img');
    expect(imagenes).toHaveLength(2);
    imagenes.forEach((img) => expect(img.getAttribute('alt') ?? '').not.toBe(''));
  });

  it('sin fotos avisa de que se está preparando', () => {
    render(<GaleriaFotos imagenes={[]} />);
    expect(screen.getByRole('status')).toHaveTextContent('Estamos preparando la galería');
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});
