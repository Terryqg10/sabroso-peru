export type Franja = { abre: string; cierra: string };

export type Titular = {
  razonSocial: string;
  nif: string;
  domicilio: string;
};

export type ConfigRestaurante = {
  /** Proyecto de demostración: muestra un aviso y bloquea la indexación en buscadores. */
  demo: boolean;
  nombre: string;
  /** Solo dígitos, con prefijo de país (ej. 34612345678). */
  whatsapp: string;
  /** Teléfono para mostrar y para el enlace tel: (formato internacional). */
  telefono: string;
  email: string;
  direccion: string;
  /** Enlace a un mapa (no se incrusta). Si falta, no se muestra el enlace. */
  mapaUrl?: string;
  /** Datos del titular del sitio para el aviso legal y la privacidad. */
  titular: Titular;
  /** Índice 0 = domingo … 6 = sábado. null = cerrado. */
  horarios: readonly [
    Franja | null,
    Franja | null,
    Franja | null,
    Franja | null,
    Franja | null,
    Franja | null,
    Franja | null,
  ];
  maxPersonas: number;
};

// VERIFICAR: todos los valores son provisionales hasta tener los datos reales.
export const restaurante: ConfigRestaurante = {
  demo: true,
  nombre: '[NOMBRE]',
  whatsapp: '34600000000',
  telefono: '+34 600 000 000',
  email: 'info@ejemplo.invalid',
  direccion: '[Dirección pendiente de confirmar]',
  titular: {
    razonSocial: '[Razón social pendiente]',
    nif: '[NIF pendiente]',
    domicilio: '[Domicilio pendiente]',
  },
  horarios: [
    { abre: '12:00', cierra: '17:00' },
    null,
    { abre: '12:00', cierra: '22:00' },
    { abre: '12:00', cierra: '22:00' },
    { abre: '12:00', cierra: '22:00' },
    { abre: '12:00', cierra: '23:00' },
    { abre: '12:00', cierra: '23:00' },
  ],
  maxPersonas: 12,
};
