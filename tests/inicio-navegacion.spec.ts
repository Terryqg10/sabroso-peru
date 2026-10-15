import { test, expect } from '@playwright/test';
import { restaurante } from '../src/config/restaurante';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const RUTAS = ['/', '/carta', '/para-llevar', '/reservas', '/contacto', '/aviso-legal', '/privacidad', '/accesibilidad'];

test.describe('inicio', () => {
  test('inicio-cta-reserva: presentación y CTA visible sin hacer scroll', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Perú en la mesa');
    await expect(page.locator('main').getByText('Cocina peruana').first()).toBeVisible();

    const cta = page.locator('main').getByRole('link', { name: 'Reservar mesa' }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/reservas');
    const caja = await cta.boundingBox();
    const altoVentana = page.viewportSize()?.height ?? 0;
    expect(caja).not.toBeNull();
    expect((caja?.y ?? 0) + (caja?.height ?? 0), 'el CTA cabe en la primera pantalla').toBeLessThanOrEqual(altoVentana);

    await cta.click();
    await expect(page).toHaveURL(/\/reservas$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reserva tu mesa');
  });

  test('la portada muestra horarios y la sección de cultura', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main').getByText('Martes a jueves:')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sabores con historia' })).toBeVisible();
  });

  test('sin reseñas cargadas no se muestra la sección de opiniones', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Lo que dicen' })).toHaveCount(0);
  });

  test('la portada pasa axe, texto >= 14 px y sin scroll horizontal', async ({ page }) => {
    await page.goto('/');
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
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });
});

test.describe('navegacion', () => {
  for (const ruta of RUTAS) {
    test(`navegacion: en ${ruta} el logo enlaza a / y los enlaces de la cabecera existen`, async ({ page, request }) => {
      await page.goto(ruta);
      const cabecera = page.locator('header');
      await expect(cabecera).toBeVisible();
      await expect(cabecera.getByRole('link', { name: restaurante.nombre })).toHaveAttribute('href', '/');

      const nav = cabecera.getByRole('navigation', { name: 'Principal' });
      const hrefs = await nav.getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
      expect(hrefs).toEqual(['/carta', '/para-llevar', '/contacto', '/reservas']);
      for (const href of hrefs) {
        expect((await request.get(href)).status(), href).toBe(200);
      }
    });
  }

  test('pulsar el logo desde otra página lleva a la portada', async ({ page }) => {
    await page.goto('/contacto');
    await page.locator('header').getByRole('link', { name: restaurante.nombre }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Perú en la mesa');
  });

  test('los enlaces de la cabecera llevan a su página y marcan la actual', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header').getByRole('navigation', { name: 'Principal' });
    await nav.getByRole('link', { name: 'Contacto' }).click();
    await expect(page).toHaveURL(/\/contacto$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ven a vernos');
    await expect(nav.getByRole('link', { name: 'Contacto' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Reservas' })).not.toHaveAttribute('aria-current', 'page');

    await nav.getByRole('link', { name: 'Reservas' }).click();
    await expect(page).toHaveURL(/\/reservas$/);
    await expect(nav.getByRole('link', { name: 'Reservas' })).toHaveAttribute('aria-current', 'page');
  });

  test('hay un enlace para saltar al contenido que se muestra al recibir el foco', async ({ page }) => {
    await page.goto('/');
    const salto = page.getByRole('link', { name: 'Saltar al contenido' });
    await salto.focus();
    await expect(salto).toBeFocused();
    await expect(salto).toBeVisible();
    await expect(salto).toHaveAttribute('href', '#contenido');
    await expect(page.locator('#contenido')).toHaveCount(1);
  });

  test('los controles de la cabecera miden al menos 44 px y no hay scroll horizontal a 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    const enlaces = page.locator('header a');
    const total = await enlaces.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      const caja = await enlaces.nth(i).boundingBox();
      if (caja) expect(caja.height, `enlace ${i}`).toBeGreaterThanOrEqual(44);
    }
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });
});
