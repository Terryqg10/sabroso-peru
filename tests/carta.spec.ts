import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { abrirMenuSiHaceFalta } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const CATEGORIAS = ['Ceviches', 'Tiraditos', 'Causas', 'Tradicionales', 'Postres'];

test.describe('carta', () => {
  test('carta-anclas: los botones de categoría coinciden con los títulos de sección', async ({ page }) => {
    await page.goto('/carta');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('La carta');
    const grupo = page.getByRole('group', { name: 'Filtrar por categoría' });
    const botones = await grupo.getByRole('button').allTextContents();
    expect(botones).toEqual(['Todas', ...CATEGORIAS]);
    const titulos = await page.locator('main h2').allTextContents();
    expect(titulos).toEqual(CATEGORIAS);
    for (const id of ['ceviches', 'tiraditos', 'causas', 'tradicionales', 'postres']) {
      await expect(page.locator(`#categoria-${id}`)).toHaveCount(1);
    }
  });

  test('carta-filtro: elegir una categoría muestra solo esa sección y "Todas" la restablece', async ({ page }) => {
    await page.goto('/carta');
    const grupo = page.getByRole('group', { name: 'Filtrar por categoría' });
    await expect(grupo.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'true');

    await grupo.getByRole('button', { name: 'Ceviches' }).click();
    await expect(grupo.getByRole('button', { name: 'Ceviches' })).toHaveAttribute('aria-pressed', 'true');
    await expect(grupo.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false');
    expect(await page.locator('main h2').allTextContents()).toEqual(['Ceviches']);
    await expect(page.getByRole('status')).toBeVisible();

    await grupo.getByRole('button', { name: 'Todas' }).click();
    expect(await page.locator('main h2').allTextContents()).toEqual(CATEGORIAS);
  });

  test('la carta se puede alcanzar desde la cabecera y el pie', async ({ page }) => {
    await page.goto('/');
    await abrirMenuSiHaceFalta(page);
    await page.locator('header').getByRole('link', { name: 'Carta' }).click();
    await expect(page).toHaveURL(/\/carta$/);
    await abrirMenuSiHaceFalta(page);
    await expect(page.locator('header').getByRole('link', { name: 'Carta' })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('footer').getByRole('link', { name: 'Carta' })).toHaveAttribute('href', '/carta');
  });

  test('accesibilidad: sin violaciones graves, texto >= 14 px, controles >= 44 px y sin scroll horizontal', async ({
    page,
  }) => {
    await page.goto('/carta');
    await page.getByRole('button', { name: 'Tiraditos' }).click();
    const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const graves = resultados.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves, JSON.stringify(graves.map((v) => v.id))).toEqual([]);

    const controles = page.locator('main button, main a');
    const total = await controles.count();
    for (let i = 0; i < total; i++) {
      const caja = await controles.nth(i).boundingBox();
      if (caja) expect(caja.height, `control ${i}`).toBeGreaterThanOrEqual(44);
    }
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
  });

  test('sin scroll horizontal a 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/carta');
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });

  test('la carta muestra platos en todas las categorías', async ({ page }) => {
    await page.goto('/carta');

    // Sin filtro: cada tarjeta de plato tiene un h3.
    await expect(page.locator('main h3')).toHaveCount(22);

    // Filtro Ceviches: solo ceviches.
    await page.getByRole('button', { name: 'Ceviches' }).click();
    await expect(page.getByRole('heading', { level: 3, name: 'Ceviche clásico' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Lomo saltado' })).toHaveCount(0);
    await expect(page.locator('main h3')).toHaveCount(4);
  });
});
