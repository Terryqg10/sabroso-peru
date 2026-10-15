import type { Page } from '@playwright/test';

/**
 * En pantallas estrechas los enlaces de la cabecera están dentro del botón "Menú".
 * Abre el menú si hace falta; en pantallas anchas no hace nada.
 */
export async function abrirMenuSiHaceFalta(page: Page): Promise<void> {
  const boton = page.locator('header').getByRole('button', { name: 'Menú' });
  if ((await boton.isVisible()) && (await boton.getAttribute('aria-expanded')) === 'false') {
    await boton.click();
  }
}
