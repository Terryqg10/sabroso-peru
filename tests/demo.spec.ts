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

test.describe('proyecto de demostración', () => {
  for (const ruta of RUTAS) {
    test(`${ruta} muestra el aviso de demo y pide no ser indexada`, async ({ page }) => {
      await page.goto(ruta);
      const aviso = page.getByTestId('aviso-demo');
      await expect(aviso).toBeVisible();
      await expect(aviso).toContainText('Proyecto de demostración');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  }

  test('robots.txt bloquea todo el sitio', async ({ request }) => {
    const respuesta = await request.get('/robots.txt');
    expect(respuesta.status()).toBe(200);
    const texto = await respuesta.text();
    expect(texto).toMatch(/User-Agent: \*/i);
    expect(texto).toMatch(/Disallow: \//);
  });

  test('el aviso no rompe el diseño a 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    await expect(page.getByTestId('aviso-demo')).toBeVisible();
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });
});
