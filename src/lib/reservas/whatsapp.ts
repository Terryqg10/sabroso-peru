import { TELEFONO_VALIDO } from './telefono';
import type { Reserva } from './schema';

function formatearFecha(fecha: string): string {
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}

export function construirMensaje(reserva: Reserva, nombreRestaurante: string): string {
  const lineas = [
    `Hola, quisiera reservar una mesa en ${nombreRestaurante}.`,
    `Nombre: ${reserva.nombre}`,
    `Teléfono: ${reserva.telefono}`,
    `Fecha: ${formatearFecha(reserva.fecha)}`,
    `Hora: ${reserva.hora}`,
    `Personas: ${reserva.personas}`,
  ];
  if (reserva.notas) lineas.push(`Notas: ${reserva.notas}`);
  return lineas.join('\n');
}

export function buildWhatsAppUrl(
  reserva: Reserva,
  numero: string,
  nombreRestaurante: string,
): string {
  if (!TELEFONO_VALIDO.test(numero)) {
    throw new Error('Número de WhatsApp del restaurante no válido');
  }
  const texto = encodeURIComponent(construirMensaje(reserva, nombreRestaurante));
  return `https://wa.me/${numero}?text=${texto}`;
}
