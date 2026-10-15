import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('para-llevar', () => {
  test('para-llevar: explica cómo pedir, recogida y horario, sin carrito ni pago online', async ({ page }) => {
    await page.goto('/para-llevar');
    const principal = page.locator('main');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Llévate el sabor');

    await expect(principal.getByRole('heading', { name: 'Cómo pedir' })).toBeVisible();
    await expect(principal.locator('ol li')).toHaveCount(4);

    const whatsapp = principal.getByRole('link', { name: 'Pedir por WhatsApp' });
    const href = (await whatsapp.getAttribute('href')) ?? '';
    const url = new URL(href);
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/34600000000');
    expect(url.searchParams.get('text')).toContain('pedido para llevar');
    await expect(principal.getByRole('link', { name: /Llamar al/ })).toHaveAttribute('href', 'tel:+34600000000');

    await expect(principal.getByRole('heading', { name: 'Recogida' })).toBeVisible();
    await expect(principal.getByText('Martes a jueves:')).toBeVisible();
    await expect(principal.getByText('no tiene carrito ni cobra online', { exact: false })).toBeVisible();

    // Sin carrito ni pasarela de pago: no hay formularios ni botones de compra.
    await expect(principal.locator('form')).toHaveCount(0);
    await expect(principal.getByRole('button')).toHaveCount(0);
    await expect(principal.getByText(/añadir al carrito|pagar ahora/i)).toHaveCount(0);
  });

  test('se llega desde la cabecera y el pie', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: 'Para llevar' }).click();
    await expect(page).toHaveURL(/\/para-llevar$/);
    await expect(page.locator('header').getByRole('link', { name: 'Para llevar' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.locator('footer').getByRole('link', { name: 'Para llevar' })).toHaveAttribute(
      'href',
      '/para-llevar',
    );
  });

  test('accesibilidad: sin violaciones graves, texto >= 14 px, controles >= 44 px y sin scroll horizontal', async ({
    page,
  }) => {
    await page.goto('/para-llevar');
    const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const graves = resultados.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves, JSON.stringify(graves.map((v) => v.id))).toEqual([]);

    const controles = page.locator('main a');
    const total = await controles.count();
    for (let i = 0; i < total; i++) {
      const caja = await controles.nth(i).boundingBox();
      if (caja) expect(caja.height, `enlace ${i}`).toBeGreaterThanOrEqual(44);
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
    await page.goto('/para-llevar');
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });
});
