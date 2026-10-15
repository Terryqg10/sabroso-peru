import type { Metadata } from 'next';
import { PaginaTexto, Seccion } from '@/components/PaginaTexto';
import { restaurante } from '@/config/restaurante';

export const metadata: Metadata = { title: 'Declaración de accesibilidad' };

export default function AccesibilidadPage() {
  return (
    <PaginaTexto
      etiqueta="Información"
      titulo="Declaración de accesibilidad"
      aviso="Declaración voluntaria, en revisión. No es una auditoría externa."
    >
      <Seccion titulo="Compromiso">
        <p>
          Este sitio se diseña para cumplir el nivel AA de las pautas WCAG 2.1: contraste suficiente,
          navegación con teclado, foco visible, controles de al menos 44 × 44 píxeles, texto de al menos
          14 píxeles y respeto de la preferencia de movimiento reducido.
        </p>
      </Seccion>
      <Seccion titulo="Cómo se comprueba">
        <p>
          Con pruebas automáticas (axe) en cada página nueva y con revisión manual del teclado y del
          reflujo a 320 píxeles. Estas pruebas no sustituyen una auditoría externa y pueden no detectar
          todos los problemas.
        </p>
      </Seccion>
      <Seccion titulo="Limitaciones conocidas">
        <p>
          Los selectores de fecha y hora usan los controles propios de cada navegador, cuyo aspecto y
          accesibilidad pueden variar.
        </p>
      </Seccion>
      <Seccion titulo="Comunicar un problema">
        <p>
          Si encuentras una barrera de accesibilidad, escribe a {restaurante.email} o llama al{' '}
          {restaurante.telefono}. Te responderemos lo antes posible.
        </p>
      </Seccion>
      <Seccion titulo="Fecha">
        <p>Última revisión: 15 de octubre de 2026.</p>
      </Seccion>
    </PaginaTexto>
  );
}
