/**
 * Quita espacios, guiones, puntos y paréntesis, y el "+" inicial.
 * Un número nacional español de 9 dígitos (empieza por 6, 7, 8 o 9) recibe el prefijo 34.
 * Los números de otros países deben llevar su prefijo internacional (+51…).
 */
export function normalizarTelefono(entrada: string): string {
  const digitos = entrada.replace(/[\s\-.()]/g, '').replace(/^\+/, '');
  if (/^[6-9]\d{8}$/.test(digitos)) return `34${digitos}`;
  return digitos;
}

export const TELEFONO_VALIDO = /^\d{8,15}$/;
