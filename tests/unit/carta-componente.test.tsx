import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartaInteractiva } from '@/components/carta/CartaInteractiva';
import { cartaSchema } from '@/content/carta';

// Next/Image necesita el servidor de Next; en el test se sustituye por una imagen simple.
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

afterEach(cleanup);

// Datos de prueba: no son platos reales del restaurante.
const carta = cartaSchema.parse({
  categorias: [
    { id: 'frios', titulo: 'Fríos' },
    { id: 'calientes', titulo: 'Calientes' },
    { id: 'vacia', titulo: 'Sin platos' },
  ],
  platos: [
    {
      id: 'plato-a',
      nombre: 'Plato A',
      descripcion: 'Descripción A',
      precio: 12.5,
      categoria: 'frios',
      etiquetas: ['picante', 'sin-gluten'],
      alergenos: ['pescado', 'moluscos'],
    },
    {
      id: 'plato-b',
      nombre: 'Plato B',
      descripcion: 'Descripción B',
      precio: 9,
      categoria: 'calientes',
      etiquetas: [],
      alergenos: [],
      foto: { src: '/img/b.jpg', alt: 'Plato B servido en una fuente' },
    },
  ],
});

const vacia = cartaSchema.parse({ categorias: carta.categorias, platos: [] });

function titulosDeSeccion(): string[] {
  return screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent ?? '');
}

describe('CA-02 filtro de la carta', () => {
  it('sin filtro muestra todas las secciones y todos los platos', () => {
    render(<CartaInteractiva carta={carta} />);
    expect(titulosDeSeccion()).toEqual(['Fríos', 'Calientes', 'Sin platos']);
    expect(screen.getByText('Plato A')).toBeInTheDocument();
    expect(screen.getByText('Plato B')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 2 platos.');
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('al elegir una categoría solo se muestran los platos de esa categoría', () => {
    render(<CartaInteractiva carta={carta} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fríos' }));
    expect(titulosDeSeccion()).toEqual(['Fríos']);
    expect(screen.getByText('Plato A')).toBeInTheDocument();
    expect(screen.queryByText('Plato B')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fríos' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 1 plato.');
  });

  it('una categoría sin platos muestra el estado vacío', () => {
    render(<CartaInteractiva carta={carta} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sin platos' }));
    expect(screen.getByRole('status')).toHaveTextContent('No hay platos en esta categoría.');
    expect(screen.getByText('Sin platos por ahora.')).toBeInTheDocument();
  });

  it('volver a "Todas" restablece la vista', () => {
    render(<CartaInteractiva carta={carta} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fríos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));
    expect(titulosDeSeccion()).toHaveLength(3);
  });

  it('cada plato muestra nombre, descripción, precio, etiquetas y alérgenos', () => {
    render(<CartaInteractiva carta={carta} />);
    const tarjeta = screen.getByText('Plato A').closest('li');
    expect(tarjeta).not.toBeNull();
    const dentro = within(tarjeta as HTMLElement);
    expect(dentro.getByText('Descripción A')).toBeInTheDocument();
    expect(dentro.getByText(/12,50/)).toBeInTheDocument();
    expect(dentro.getByText('Picante')).toBeInTheDocument();
    expect(dentro.getByText('Sin gluten')).toBeInTheDocument();
    expect(dentro.getByText(/Pescado, Moluscos/)).toBeInTheDocument();
  });

  it('un plato sin alérgenos lo indica y la foto lleva su texto alternativo', () => {
    render(<CartaInteractiva carta={carta} />);
    const tarjeta = screen.getByText('Plato B').closest('li') as HTMLElement;
    expect(within(tarjeta).getByText(/ninguno declarado/)).toBeInTheDocument();
    expect(within(tarjeta).getByRole('img', { name: 'Plato B servido en una fuente' })).toBeInTheDocument();
  });
});

describe('CA-14 coherencia entre filtros y secciones', () => {
  it('los botones de categoría y los títulos de sección coinciden uno a uno', () => {
    render(<CartaInteractiva carta={carta} />);
    const botones = screen
      .getAllByRole('button')
      .map((b) => b.textContent ?? '')
      .filter((t) => t !== 'Todas');
    expect(botones).toEqual(titulosDeSeccion());
  });

  it('cada sección tiene el ancla derivada del identificador de su categoría', () => {
    const { container } = render(<CartaInteractiva carta={carta} />);
    expect(container.querySelector('#categoria-frios')).not.toBeNull();
    expect(container.querySelector('#categoria-calientes')).not.toBeNull();
  });
});

describe('carta sin platos', () => {
  it('avisa de que la carta se está preparando y conserva los filtros', () => {
    render(<CartaInteractiva carta={vacia} />);
    expect(screen.getByRole('status')).toHaveTextContent('Estamos preparando la carta online');
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('muestra el estado vacío cuando no hay platos', () => {
    render(<CartaInteractiva carta={vacia} />);
    expect(screen.getByText(/estamos preparando la carta/i)).toBeInTheDocument();
  });

  it('muestra el mensaje sin platos al pulsar una categoría vacía', () => {
    render(<CartaInteractiva carta={vacia} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fríos' }));
    expect(screen.getByText(/sin platos por ahora/i)).toBeInTheDocument();
  });
});
