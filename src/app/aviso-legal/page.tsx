import type { Metadata } from 'next';
import { PaginaTexto, Seccion } from '@/components/PaginaTexto';
import { restaurante } from '@/config/restaurante';

export const metadata: Metadata = { title: 'Aviso legal' };

// VERIFICAR: texto pendiente de validación jurídica (ADR-002). Solo recoge hechos del sitio.
export default function AvisoLegalPage() {
  const { titular } = restaurante;
  return (
    <PaginaTexto
      etiqueta="Información legal"
      titulo="Aviso legal"
      aviso="Borrador pendiente de validación jurídica. Los datos del titular son provisionales."
    >
      <Seccion titulo="Titular del sitio">
        <p>Razón social: {titular.razonSocial}</p>
        <p>NIF: {titular.nif}</p>
        <p>Domicilio: {titular.domicilio}</p>
        <p>Correo electrónico: {restaurante.email}</p>
        <p>Teléfono: {restaurante.telefono}</p>
      </Seccion>
      <Seccion titulo="Objeto del sitio">
        <p>
          Este sitio presenta el restaurante, su carta y su información práctica, y permite preparar
          una solicitud de reserva que se envía por WhatsApp. No se venden productos ni se gestionan
          pagos en la web.
        </p>
      </Seccion>
      <Seccion titulo="Enlaces a terceros">
        <p>
          El sitio enlaza a servicios de terceros, como WhatsApp o mapas. Su uso se rige por las
          condiciones de cada servicio.
        </p>
      </Seccion>
      <Seccion titulo="Normativa aplicable">
        <p>VERIFICAR: referencias a la normativa española aplicable, pendientes de validación jurídica.</p>
      </Seccion>
    </PaginaTexto>
  );
}
