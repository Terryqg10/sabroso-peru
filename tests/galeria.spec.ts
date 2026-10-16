import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { abrirMenuSiHaceFalta } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('galeria', () => {
  test('galeria-alt: ninguna imagen de la galería carece de texto alternativo', async ({ page }) => {
    await page.goto('/galeria');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platos y rincones');
    const sinAlt = await page.locator('main img').evaluateAll((imgs) =>
      imgs.filter((img) => !(img.getAttribute('alt') ?? '').trim()).map((img) => img.getAttribute('src')),
    );
    expect(sinAlt).toEqual([]);
  });

  test('la galería muestra las 5 imágenes', async ({ page }) => {
    await page.goto('/galeria');
    const imagenes = page.locator('main img');
    await expect(imagenes).toHaveCount(5);
  });

  test('todas las imágenes de la galería tienen alt descriptivo', async ({ page }) => {
    await page.goto('/galeria');
    const imagenes = page.locator('main img');
    const count = await imagenes.count();
    for (let i = 0; i < count; i++) {
      const alt = await imagenes.nth(i).getAttribute('alt');
      expect(alt, `imagen ${i} sin alt`).toBeTruthy();
      expect((alt ?? '').length).toBeGreaterThan(10);
    }
  });

  test('con fotos cargadas, Galería aparece en la cabecera y en el pie y ya no se avisa de que se prepara', async ({ page }) => {
    await page.goto('/galeria');
    await expect(page.getByRole('status')).toHaveCount(0);
    await abrirMenuSiHaceFalta(page);
    await expect(page.locator('header').getByRole('link', { name: 'Galería' })).toHaveAttribute('href', '/galeria');
    await expect(page.locator('footer').getByRole('link', { name: 'Galería' })).toHaveAttribute('href', '/galeria');
  });

  test('accesibilidad: sin violaciones graves, texto >= 14 px y sin scroll horizontal', async ({ page }) => {
    await page.goto('/galeria');
    const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const graves = resultados.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves, JSON.stringify(graves.map((v) => v.id))).toEqual([]);
    const pequenos = await page.evaluate(() => {
      const malos: string[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        const tieneTexto = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0,
        );
        if (tieneTexto && parseFloat(getComputedStyle(el).fontSize) < 14) malos.push(el.tagName);
      });
      return malos;
    });
    expect(pequenos).toEqual([]);
    const controles = page.locator('main a');
    const total = await controles.count();
    for (let i = 0; i < total; i++) {
      const caja = await controles.nth(i).boundingBox();
      if (caja) expect(caja.height, `enlace ${i}`).toBeGreaterThanOrEqual(44);
    }
  });

  test('sin scroll horizontal a 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/galeria');
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });
});
