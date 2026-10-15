/** Enlace de WhatsApp al número del restaurante, con mensaje opcional ya codificado. */
export function urlWhatsApp(numero: string, mensaje?: string): string {
  if (!/^\d{8,15}$/.test(numero)) {
    throw new Error('Número de WhatsApp del restaurante no válido');
  }
  const base = `https://wa.me/${numero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** Enlace tel: a partir de un teléfono con espacios. */
export function urlTelefono(telefono: string): string {
  return `tel:${telefono.replace(/[\s\-.()]/g, '')}`;
}
