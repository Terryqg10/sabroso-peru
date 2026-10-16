import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { restaurante } from '../src/config/restaurante';

const imagenCargada = (page: Page, selector: string) =>
  page.locator(selector).evaluate((img) => {
    const el = img as HTMLImageElement;
    return el.complete && el.naturalWidth > 0;
  });

test.describe('marca', () => {
  test('la cabecera muestra el emblema (decorativo) y el enlace se llama como el restaurante', async ({ page }) => {
    for (const ancho of [320, 375, 430, 1280]) {
      await page.setViewportSize({ width: ancho, height: 800 });
      await page.goto('/');
      const enlace = page.locator('header').getByRole('link', { name: restaurante.nombre });
      await expect(enlace, `@${ancho}`).toHaveAttribute('href', '/');
      const emblema = enlace.locator('img');
      await expect(emblema).toBeVisible();
      await expect(emblema).toHaveAttribute('alt', '');
      expect(await imagenCargada(page, 'header img'), `@${ancho}: emblema cargado`).toBe(true);
    }
  });

  test('el nombre se ve junto al emblema desde 380 px y en pantallas más estrechas queda solo para lectores', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 430, height: 800 });
    await page.goto('/');
    const nombre = page.locator('header a[href="/"] span');
    await expect(nombre).toBeVisible();

    await page.setViewportSize({ width: 360, height: 800 });
    const caja = await nombre.boundingBox();
    expect(caja === null || caja.width <= 1, 'sin texto visible a 360 px').toBe(true);
    await expect(page.locator('header').getByRole('link', { name: restaurante.nombre })).toBeVisible();
  });

  test('el logotipo completo del pie tiene texto alternativo y se carga', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('footer img[src*="logo-vertical"]');
    await logo.scrollIntoViewIfNeeded(); // carga diferida: se pide al acercarse al pie
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('alt', `${restaurante.nombre}, cocina peruana`);
    expect(await imagenCargada(page, 'footer img[src*="logo-vertical"]')).toBe(true);
  });

  test('hay favicon, icono de pantalla de inicio e imagen para compartir', async ({ page, request }) => {
    await page.goto('/');
    const iconos = await page.locator('head link[rel~="icon"], head link[rel="apple-touch-icon"]').evaluateAll((ls) =>
      ls.map((l) => ({ rel: l.getAttribute('rel') ?? '', href: (l as HTMLLinkElement).href })),
    );
    expect(iconos.some((i) => i.rel.includes('icon') && i.href.includes('icon'))).toBe(true);
    expect(iconos.some((i) => i.rel === 'apple-touch-icon')).toBe(true);
    for (const icono of iconos) {
      const respuesta = await request.get(icono.href);
      expect(respuesta.status(), icono.href).toBe(200);
      expect(respuesta.headers()['content-type'], icono.href).toContain('image/png');
    }

    const og = await page.locator('head meta[property="og:image"]').getAttribute('content');
    expect(og, 'og:image').toBeTruthy();
    const respuesta = await request.get(new URL(og ?? '').pathname);
    expect(respuesta.status()).toBe(200);
    expect(respuesta.headers()['content-type']).toContain('image/png');
  });

  test('la imagen para compartir usa la URL pública del sitio', async ({ page }) => {
    await page.goto('/');
    const og = await page.locator('head meta[property="og:image"]').getAttribute('content');
    expect(og?.startsWith('https://sabroso-peru.vercel.app/')).toBe(true);
  });
});
