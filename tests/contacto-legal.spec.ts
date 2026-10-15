import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const RUTAS = ['/', '/reservas', '/contacto', '/aviso-legal', '/privacidad', '/accesibilidad'];
const LEGALES = [
  { texto: 'Aviso legal', href: '/aviso-legal', h1: 'Aviso legal' },
  { texto: 'Política de privacidad', href: '/privacidad', h1: 'Política de privacidad' },
  { texto: 'Declaración de accesibilidad', href: '/accesibilidad', h1: 'Declaración de accesibilidad' },
];

test.describe('pie-legal', () => {
  for (const ruta of RUTAS) {
    test(`el pie de ${ruta} muestra dirección, teléfono, horarios y enlaces legales`, async ({ page }) => {
      await page.goto(ruta);
      const pie = page.locator('footer');
      await expect(pie).toBeVisible();
      await expect(pie.locator('address')).toContainText('Dirección');
      await expect(pie.getByRole('link', { name: '+34 600 000 000' })).toHaveAttribute('href', 'tel:+34600000000');
      await expect(pie.getByText('Martes a jueves:')).toBeVisible();
      await expect(pie.getByText('Lunes:')).toBeVisible();
      for (const l of LEGALES) {
        await expect(pie.getByRole('link', { name: l.texto })).toHaveAttribute('href', l.href);
      }
    });
  }

  test('los enlaces legales del pie llevan a páginas que existen', async ({ page }) => {
    for (const l of LEGALES) {
      await page.goto('/');
      await page.locator('footer').getByRole('link', { name: l.texto }).click();
      await expect(page).toHaveURL(new RegExp(`${l.href}$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(l.h1);
    }
  });

  test('ningún enlace del pie ni de las páginas nuevas está muerto', async ({ page, request }) => {
    for (const ruta of RUTAS) {
      await page.goto(ruta);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
      for (const href of new Set(hrefs)) {
        const respuesta = await request.get(href);
        expect(respuesta.status(), `${ruta} → ${href}`).toBe(200);
      }
    }
  });
});

test.describe('contacto', () => {
  test('muestra horarios, dirección y formas de contacto', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main').getByRole('heading', { name: 'Dirección', exact: true })).toBeVisible();
    await expect(page.locator('main').getByRole('heading', { name: 'Horarios', exact: true })).toBeVisible();
    await expect(page.locator('main').getByRole('heading', { name: 'Cómo contactarnos', exact: true })).toBeVisible();
    const principal = page.locator('main');
    await expect(principal.getByText('Martes a jueves:')).toBeVisible();
    await expect(principal.getByRole('link', { name: /Llamar al/ })).toHaveAttribute('href', 'tel:+34600000000');
    await expect(principal.getByRole('link', { name: 'Escribir por WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/34600000000',
    );
    await expect(principal.getByRole('link', { name: 'Reservar una mesa' })).toHaveAttribute('href', '/reservas');
  });
});

test.describe('accesibilidad de las páginas nuevas', () => {
  for (const ruta of ['/contacto', '/aviso-legal', '/privacidad', '/accesibilidad']) {
    test(`${ruta} sin violaciones graves, texto >= 14 px y controles >= 44 px`, async ({ page }) => {
      await page.goto(ruta);
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

      const enlaces = page.locator('a:not([href="#contenido"])');
      const total = await enlaces.count();
      for (let i = 0; i < total; i++) {
        const caja = await enlaces.nth(i).boundingBox();
        if (caja) expect(caja.height, `enlace ${i}`).toBeGreaterThanOrEqual(44);
      }

      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(desborda).toBe(false);
    });
  }
});
