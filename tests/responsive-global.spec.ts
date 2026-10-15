import { test, expect } from '@playwright/test';
import { restaurante } from '../src/config/restaurante';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
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
const ANCHOS = [
  { nombre: '360', ancho: 360, alto: 800 },
  { nombre: '768', ancho: 768, alto: 1024 },
  { nombre: '1280', ancho: 1280, alto: 800 },
];

// Palabras en inglés que no deben aparecer como texto visible en un sitio en español.
const INGLES = /\b(Home|Contact us|Book now|Learn more|Read more|Submit|Click here|Loading)\b/;

test.describe('CA-09 recorrido responsive', () => {
  for (const { nombre, ancho, alto } of ANCHOS) {
    test(`a ${nombre} px: sin scroll horizontal, en español y axe sin violaciones graves en todas las páginas`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: ancho, height: alto });

      for (const ruta of RUTAS) {
        await page.goto(ruta);

        const idioma = await page.locator('html').getAttribute('lang');
        expect(idioma, `${ruta}: lang`).toBe('es');

        const desborda = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(desborda, `${ruta} @${nombre}: scroll horizontal`).toBe(false);

        const texto = await page.locator('body').innerText();
        expect(INGLES.test(texto), `${ruta}: texto en inglés`).toBe(false);

        await expect(page.locator('h1'), `${ruta}: un único h1`).toHaveCount(1);

        const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const graves = resultados.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        expect(graves, `${ruta} @${nombre}: ${JSON.stringify(graves.map((v) => v.id))}`).toEqual([]);
      }
    });
  }

  test('cada página tiene título propio y descripción', async ({ page }) => {
    const titulos = new Set<string>();
    for (const ruta of RUTAS) {
      await page.goto(ruta);
      const titulo = await page.title();
      expect(titulo.length, `${ruta}: título`).toBeGreaterThan(0);
      titulos.add(titulo);
    }
    expect(titulos.size, 'títulos únicos por página').toBe(RUTAS.length);
  });

  test('en todas las páginas: texto >= 14 px, controles >= 44 px y foco visible', async ({ page }) => {
    for (const ruta of RUTAS) {
      await page.goto(ruta);

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
      expect(pequenos, `${ruta}: texto menor de 14 px`).toEqual([]);

      const controles = page.locator('a:not([href="#contenido"]), button, input, textarea');
      const total = await controles.count();
      for (let i = 0; i < total; i++) {
        const control = controles.nth(i);
        if (!(await control.isVisible())) continue;
        const caja = await control.boundingBox();
        if (caja) expect(caja.height, `${ruta}: control ${i}`).toBeGreaterThanOrEqual(44);
      }

      const primero = page.locator('header a').first();
      await primero.focus();
      const contorno = await primero.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(contorno, `${ruta}: foco visible`).not.toBe('none');
    }
  });

  test('prefers-reduced-motion: ninguna animación ni transición activa en ninguna página', async ({ browser }) => {
    const contexto = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await contexto.newPage();
    for (const ruta of RUTAS) {
      await page.goto(ruta);
      const animados = await page.evaluate(() => {
        const res: string[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const estilo = getComputedStyle(el);
          const duracionAnim = parseFloat(estilo.animationDuration);
          const duracionTrans = parseFloat(estilo.transitionDuration);
          if (estilo.animationName !== 'none' && duracionAnim > 0.001) res.push(`${el.tagName}:anim`);
          if (duracionTrans > 0.001) res.push(`${el.tagName}:trans`);
        });
        return res;
      });
      expect(animados, `${ruta}: movimiento con reduced-motion`).toEqual([]);
    }
    await contexto.close();
  });

  test('el 404 está en español, es accesible y ofrece volver al inicio', async ({ page }) => {
    const respuesta = await page.goto('/esta-pagina-no-existe');
    expect(respuesta?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página no existe');
    expect(await page.locator('body').innerText()).not.toMatch(/could not be found|Not Found/i);
    await expect(page.locator('main').getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
    const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const graves = resultados.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves, JSON.stringify(graves.map((v) => v.id))).toEqual([]);
    await expect(page.locator('header').getByRole('link', { name: restaurante.nombre })).toHaveAttribute('href', '/');
  });
});
