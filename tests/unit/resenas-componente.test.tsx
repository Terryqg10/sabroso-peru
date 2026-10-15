import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Resenas } from '@/components/Resenas';
import type { Resena } from '@/content/resenas';

// Datos de prueba: no son reseñas reales.
const cita: Resena = {
  texto: 'Cita de prueba',
  autor: 'Persona de prueba',
  fuente: 'Google',
  fecha: '2026-09-20',
  url: 'https://example.com/resena',
};

describe('Resenas (RF-12)', () => {
  it('no muestra nada si no hay citas', () => {
    const { container } = render(<Resenas resenas={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra cada cita con autor, fuente, fecha y enlace al original', () => {
    render(<Resenas resenas={[cita]} />);
    expect(screen.getByRole('heading', { name: 'Lo que dicen' })).toBeInTheDocument();
    expect(screen.getByText('“Cita de prueba”')).toBeInTheDocument();
    expect(screen.getByText(/Persona de prueba · Google · 20\/09\/2026/)).toBeInTheDocument();
    const enlace = screen.getByRole('link', { name: 'Ver reseña de Persona de prueba en Google' });
    expect(enlace).toHaveAttribute('href', 'https://example.com/resena');
    expect(enlace).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
