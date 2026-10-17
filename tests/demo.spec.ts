import { test, expect } from '@playwright/test';

const RUTAS = [
  '/',
  '/carta',
  '/para-llevar',
  '/galeria',
  '/contacto',
  '/reservas',
  '/aviso-legal',
  '/privacidad',
  '/accesibilidad',
];

test.describe('proyecto de demostración (sin franja de aviso; ver ADR-007)', () => {
  for (const ruta of RUTAS) {
    test(`${ruta} pide no ser indexada y no muestra franja de aviso`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.getByTestId('aviso-demo')).toHaveCount(0);
    });
  }

  test('robots.txt bloquea todo el sitio', async ({ request }) => {
    const respuesta = await request.get('/robots.txt');
    expect(respuesta.status()).toBe(200);
    const texto = await respuesta.text();
    expect(texto).toMatch(/User-Agent: \*/i);
    expect(texto).toMatch(/Disallow: \//);
  });
});
