import type { Metadata } from 'next';
import { PaginaTexto, Seccion } from '@/components/PaginaTexto';
import { restaurante } from '@/config/restaurante';

export const metadata: Metadata = { title: 'Política de privacidad' };

// VERIFICAR: texto pendiente de validación jurídica (ADR-002). Describe lo que hace el sitio hoy
// (SPEC-001 §9); no cita artículos ni plazos legales.
export default function PrivacidadPage() {
  return (
    <PaginaTexto
      etiqueta="Información legal"
      titulo="Política de privacidad"
      aviso="Borrador pendiente de validación jurídica. Describe lo que hace el sitio hoy."
    >
      <Seccion titulo="Responsable">
        <p>
          {restaurante.titular.razonSocial}, con domicilio en {restaurante.titular.domicilio}. Contacto:{' '}
          {restaurante.email}.
        </p>
      </Seccion>
      <Seccion titulo="Qué datos se tratan">
        <p>
          Solo los que escribes en el formulario de reserva: nombre, teléfono, fecha, hora, número de
          personas y notas (opcionales, por ejemplo alergias).
        </p>
      </Seccion>
      <Seccion titulo="Para qué">
        <p>
          Para preparar el mensaje de WhatsApp con tu solicitud de reserva. La reserva no queda
          confirmada hasta que el restaurante te responda.
        </p>
      </Seccion>
      <Seccion titulo="Dónde se tratan">
        <p>
          Los datos se procesan en tu navegador para construir el mensaje. Esta web no los guarda ni
          los envía a ningún servidor propio. Al enviar el mensaje por WhatsApp, pasan a WhatsApp y al
          restaurante, que los usa para gestionar tu reserva.
        </p>
      </Seccion>
      <Seccion titulo="Mapa de la página de contacto">
        <p>
          La página de contacto muestra un mapa de OpenStreetMap. Al cargarla, tu navegador se conecta
          a openstreetmap.org, que recibe tu dirección IP y los datos técnicos habituales de tu
          navegador. Esta web no guarda esos datos. El botón «Cómo llegar» solo abre Google Maps si lo
          pulsas. VERIFICAR con asesoramiento jurídico la información que debe darse sobre estos
          terceros.
        </p>
      </Seccion>
      <Seccion titulo="Cookies y analítica">
        <p>
          Esta web no usa cookies propias ni herramientas de analítica. VERIFICAR antes de publicar y
          actualizar esta sección si se añaden.
        </p>
      </Seccion>
      <Seccion titulo="Tus derechos">
        <p>
          Puedes escribir a {restaurante.email} para consultar, corregir o pedir la eliminación de los
          datos que el restaurante haya recibido por WhatsApp. VERIFICAR base legal, plazos de
          conservación y derechos exactos con asesoramiento jurídico.
        </p>
      </Seccion>
    </PaginaTexto>
  );
}
