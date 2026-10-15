import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

  test('sin fotos cargadas avisa de que se está preparando y no enlaza la galería', async ({ page }) => {
    await page.goto('/galeria');
    await expect(page.getByRole('status')).toContainText('Estamos preparando la galería');
    await expect(page.locator('header').getByRole('link', { name: 'Galería' })).toHaveCount(0);
    await expect(page.locator('footer').getByRole('link', { name: 'Galería' })).toHaveCount(0);
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
