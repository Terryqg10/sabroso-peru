import { test, expect } from '@playwright/test';
import { restaurante } from '../src/config/restaurante';
import AxeBuilder from '@axe-core/playwright';
import { abrirMenuSiHaceFalta } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const RUTAS = ['/', '/carta', '/para-llevar', '/reservas', '/contacto', '/aviso-legal', '/privacidad', '/accesibilidad'];

test.describe('inicio', () => {
  test('inicio-cta-reserva: presentación y un CTA de reserva a la vista sin hacer scroll', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Perú en la mesa');
    await expect(page.locator('main').getByText('Cocina peruana').first()).toBeVisible();

    // Con la foto a sangre, en móvil el botón del hero queda bajo la foto; el CTA de la cabecera
    // (Reservas) es el que debe verse sin desplazarse, y en escritorio también el del hero.
    const aLaVista = await page.evaluate(() =>
      [...document.querySelectorAll('a[href="/reservas"]')].filter((a) => {
        const r = a.getBoundingClientRect();
        return r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
      }).length,
    );
    expect(aLaVista, 'hay un enlace a Reservas en la primera pantalla').toBeGreaterThan(0);

    const cta = page.locator('main').getByRole('link', { name: 'Reservar mesa' }).first();
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/reservas');
    await cta.click();
    await expect(page).toHaveURL(/\/reservas$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reserva tu mesa');
  });

  test('el hero usa una foto con texto alternativo, AVIF y WebP, carga prioritaria y orientación según el ancho', async ({
    page,
  }) => {
    await page.goto('/');
    const foto = page.locator('main picture img').first();
    await expect(foto).toBeVisible();
    await expect(foto).toHaveAttribute('alt', /Ceviche peruano/);
    await expect(foto).toHaveAttribute('fetchpriority', 'high');
    await expect(foto).toHaveAttribute('loading', 'eager');
    const formatos = await page.locator('main picture source').evaluateAll((ss) => ss.map((s) => s.getAttribute('type')));
    expect(formatos).toEqual(['image/avif', 'image/webp', 'image/avif', 'image/webp']);
    expect(await foto.evaluate((img) => (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
  });

  test('en móvil el hero sirve la foto vertical y en escritorio la horizontal', async ({ page }) => {
    for (const [ancho, archivo] of [[390, 'hero-ceviche-tall'], [1280, 'hero-ceviche-wide']] as const) {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto('/');
      const foto = page.locator('main picture img').first();
      await expect(foto).toBeVisible();
      const actual = await foto.evaluate((img) => (img as HTMLImageElement).currentSrc);
      expect(actual.includes(archivo), `@${ancho}: ${actual}`).toBe(true);
    }
  });

  test('en móvil la foto ocupa el ancho completo en formato vertical 3:4, encima del texto', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const foto = await page.locator('main picture').first().boundingBox();
    const titulo = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(foto).not.toBeNull();
    expect(titulo).not.toBeNull();
    expect(foto?.width ?? 0).toBeGreaterThanOrEqual(389);
    expect(Math.abs((foto?.height ?? 0) / (foto?.width ?? 1) - 4 / 3)).toBeLessThan(0.02);
    expect((titulo?.y ?? 0), 'el texto va debajo de la foto').toBeGreaterThanOrEqual((foto?.y ?? 0) + (foto?.height ?? 0));
  });

  test('en escritorio la foto ocupa la columna izquierda y el texto la derecha', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const foto = await page.locator('main picture').first().boundingBox();
    const titulo = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(foto?.x ?? 1).toBe(0);
    expect(Math.round(foto?.width ?? 0)).toBe(640);
    expect((titulo?.x ?? 0), 'el titular está en la columna derecha').toBeGreaterThanOrEqual(640);
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

      await abrirMenuSiHaceFalta(page);
      const hrefs = await cabecera
        .getByRole('link')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
      // Con el diálogo móvil abierto, el logo y Reservas aparecen también dentro de él.
      expect([...new Set(hrefs)].sort()).toEqual(['/', '/carta', '/contacto', '/galeria', '/para-llevar', '/reservas']);
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
    const cabecera = page.locator('header');
    await abrirMenuSiHaceFalta(page);
    await cabecera.getByRole('link', { name: 'Contacto' }).click();
    await expect(page).toHaveURL(/\/contacto$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ven a vernos');
    await abrirMenuSiHaceFalta(page);
    await expect(cabecera.getByRole('link', { name: 'Contacto' })).toHaveAttribute('aria-current', 'page');
    await expect(cabecera.getByRole('link', { name: /^(Reservas|Reservar mesa)$/ }).last()).not.toHaveAttribute('aria-current', 'page');

    await cabecera.getByRole('link', { name: /^(Reservas|Reservar mesa)$/ }).last().click();
    await expect(page).toHaveURL(/\/reservas$/);
    await abrirMenuSiHaceFalta(page);
    await expect(cabecera.getByRole('link', { name: /^(Reservas|Reservar mesa)$/ }).last()).toHaveAttribute('aria-current', 'page');
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

  test('a 320 px la cabecera cabe en una fila, sus controles miden al menos 44 px y no hay scroll horizontal', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    const controles = page.locator('header a, header button');
    const total = await controles.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      if (!(await controles.nth(i).isVisible())) continue;
      const caja = await controles.nth(i).boundingBox();
      if (caja) {
        expect(caja.height, `control ${i} (alto)`).toBeGreaterThanOrEqual(44);
        expect(caja.width, `control ${i} (ancho)`).toBeGreaterThanOrEqual(44);
      }
    }
    const alto = await page.locator('header').evaluate((el) => el.getBoundingClientRect().height);
    expect(alto, 'la cabecera cerrada ocupa una sola fila').toBeLessThanOrEqual(80);
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });
});

test.describe('menú de la cabecera', () => {
  test('en pantallas estrechas: Reservas siempre a la vista y el resto tras el botón Menú', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const cabecera = page.locator('header');
    const boton = cabecera.getByRole('button', { name: 'Menú' });
    await expect(boton).toBeVisible();
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await expect(boton).toHaveAttribute('aria-controls', 'menu-movil');
    await expect(cabecera.getByRole('link', { name: 'Reservas' })).toBeVisible();
    await expect(cabecera.getByRole('link', { name: 'Carta' })).toBeHidden();
    await expect(page.locator('#menu-movil')).toBeHidden();

    await boton.click();
    await expect(boton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-movil')).toBeVisible();
    for (const texto of ['Carta', 'Para llevar', 'Contacto']) {
      await expect(cabecera.getByRole('link', { name: texto })).toBeVisible();
    }
    await page.getByRole('button', { name: 'Cerrar navegación' }).click();
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#menu-movil')).toBeHidden();
    await expect(boton).toBeFocused();
  });

  test('Esc cierra el menú y devuelve el foco al botón', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const boton = page.locator('header').getByRole('button', { name: 'Menú' });
    await boton.click();
    await expect(page.locator('#menu-movil')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-movil')).toBeHidden();
    await expect(boton).toBeFocused();
  });

  test('el menú es un diálogo a pantalla completa: foco dentro, Tab no sale y el fondo no hace scroll', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: 'Menú' }).click();
    const dialogo = page.getByRole('dialog', { name: 'Navegación principal' });
    await expect(dialogo).toBeVisible();
    await expect(dialogo).toHaveAttribute('aria-modal', 'true');
    const caja = await dialogo.boundingBox();
    expect(caja?.width).toBe(375);
    expect(caja?.height).toBe(800);
    await expect(page.getByRole('button', { name: 'Cerrar navegación' })).toBeFocused();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const dentro = await page.evaluate(() => !!document.activeElement?.closest('#menu-movil'));
      expect(dentro, `Tab ${i + 1}: el foco sigue dentro del diálogo`).toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#menu-movil'))).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  });

  test('a 320 px el diálogo del menú no desborda y sus controles miden al menos 44 px de alto', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: 'Menú' }).click();
    const dialogo = page.getByRole('dialog', { name: 'Navegación principal' });
    await expect(dialogo).toBeVisible();
    const desborda = await dialogo.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(desborda).toBe(false);
    const controles = dialogo.locator('a, button');
    const total = await controles.count();
    for (let i = 0; i < total; i++) {
      const caja = await controles.nth(i).boundingBox();
      if (caja) expect(caja.height, `control ${i}`).toBeGreaterThanOrEqual(44);
    }
  });

  test('la cabecera es fija y, con la página desplazada, el menú sigue ocupando toda la pantalla', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/carta');
    await page.evaluate(() => window.scrollTo(0, 1500));
    const cabecera = page.locator('header');
    expect(await cabecera.evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(0);
    await cabecera.getByRole('button', { name: 'Menú' }).click();
    const caja = await page.getByRole('dialog', { name: 'Navegación principal' }).boundingBox();
    expect(caja?.x).toBe(0);
    expect(caja?.y).toBe(0);
    expect(caja?.width).toBe(375);
    expect(caja?.height).toBe(800);
  });

  test('al pasar a escritorio con el menú abierto, el diálogo se cierra', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: 'Menú' }).click();
    await expect(page.locator('#menu-movil')).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('#menu-movil')).toBeHidden();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  });

  test('al elegir un enlace navega y el menú se cierra', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: 'Menú' }).click();
    await page.locator('header').getByRole('link', { name: 'Carta' }).click();
    await expect(page).toHaveURL(/\/carta$/);
    await expect(page.locator('#menu-movil')).toBeHidden();
  });

  test('la cabecera cabe en una fila entre 320 y 1440 px, con menú hasta 1023 px y enlaces en línea desde 1024', async ({ page }) => {
    for (const ancho of [320, 375, 600, 768, 800, 900, 1023, 1024, 1280, 1440]) {
      await page.setViewportSize({ width: ancho, height: 800 });
      await page.goto('/');
      const cabecera = page.locator('header');
      const alto = await cabecera.evaluate((el) => el.getBoundingClientRect().height);
      expect(alto, `@${ancho}: la cabecera cerrada ocupa una sola fila`).toBeLessThanOrEqual(80);
      const hayMenu = await cabecera.getByRole('button', { name: 'Menú' }).isVisible();
      expect(hayMenu, `@${ancho}: botón Menú ${ancho < 1024 ? 'visible' : 'oculto'}`).toBe(ancho < 1024);
      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(desborda, `@${ancho}: sin scroll horizontal`).toBe(false);
    }
  });

  test('en pantallas anchas no hay botón Menú y los enlaces van en línea', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');
    const cabecera = page.locator('header');
    await expect(cabecera.getByRole('button', { name: 'Menú' })).toBeHidden();
    const nav = cabecera.getByRole('navigation', { name: 'Principal' });
    await expect(nav.getByRole('link')).toHaveCount(5);
    const alto = await cabecera.evaluate((el) => el.getBoundingClientRect().height);
    expect(alto).toBeLessThanOrEqual(80);
  });
});
