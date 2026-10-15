import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// Fecha futura que no sea lunes (cerrado en la configuración provisional). Se usa 13:00,
// que cae dentro del horario de todos los días abiertos.
function fechaValida(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  while (d.getDay() === 1) d.setDate(d.getDate() + 1);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

async function rellenar(page: Page) {
  await page.locator('main').getByLabel('Nombre', { exact: true }).fill('Ana Quispe');
  await page.locator('main').getByLabel('Teléfono', { exact: true }).fill('612 345 678');
  await page.locator('main').getByLabel('Fecha', { exact: true }).fill(fechaValida());
  await page.locator('main').getByLabel('Hora', { exact: true }).fill('13:00');
  await page.locator('main').getByLabel('Personas', { exact: true }).fill('4');
  await page.locator('main').getByLabel('Notas (opcional)', { exact: true }).fill('Sin ají, por favor');
}

test.describe('reservas', () => {
  test.beforeEach(async ({ context }) => {
    // El enlace de WhatsApp no sale a internet en los tests.
    await context.route('https://wa.me/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>wa.me</body></html>' }),
    );
  });

  test('reserva-campos: existen los campos con su etiqueta', async ({ page }) => {
    await page.goto('/reservas');
    for (const etiqueta of ['Nombre', 'Teléfono', 'Fecha', 'Hora', 'Personas', 'Notas (opcional)']) {
      await expect(page.locator('main').getByLabel(etiqueta)).toBeVisible();
    }
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('reserva-aviso-privacidad: el aviso se ve antes de enviar', async ({ page }) => {
    await page.goto('/reservas');
    const aviso = page.locator('#aviso-privacidad');
    await expect(aviso).toBeVisible();
    await expect(aviso).toContainText('No los guardamos');
    const enviar = page.getByRole('button', { name: 'Reservar por WhatsApp' });
    await expect(enviar).toHaveAttribute('aria-describedby', 'aviso-privacidad');
  });

  test('un formulario vacío muestra errores por campo y no abre WhatsApp', async ({ page, context }) => {
    await page.goto('/reservas');
    let popups = 0;
    context.on('page', () => (popups += 1));
    await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();
    await expect(page.locator('form [role="alert"]')).toContainText('Revisa');
    await expect(page.locator('main').getByLabel('Nombre', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('main').getByLabel('Nombre', { exact: true })).toBeFocused();
    await expect(page.locator('#nombre-error')).toBeVisible();
    expect(popups).toBe(0);
  });

  test('reserva-flujo-principal: un envío válido abre wa.me con el mensaje', async ({ page }) => {
    await page.goto('/reservas');
    await rellenar(page);
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();
    const popup = await popupPromise;
    const url = new URL(popup.url());
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/34600000000');
    const texto = url.searchParams.get('text') ?? '';
    expect(texto).toContain('Ana Quispe');
    expect(texto).toContain('34612345678');
    expect(texto).toContain('13:00');
    expect(texto).toContain('Personas: 4');
    expect(texto).toContain('Sin ají, por favor');
  });

  test('reserva-confirmacion: tras enviar se avisa de que no está confirmada', async ({ page }) => {
    await page.goto('/reservas');
    await rellenar(page);
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();
    await popupPromise;
    await expect(page.getByText('Tu reserva todavía no está confirmada.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Abrir WhatsApp' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/34600000000\?text=/,
    );
    const llamar = page.locator('main').getByRole('link', { name: /\+34 600 000 000/ });
    await expect(llamar).toHaveAttribute('href', 'tel:+34600000000');
    await expect(page.getByRole('button', { name: 'Copiar mensaje' })).toBeVisible();
  });

  test('sin peticiones de red propias al enviar (CA-07)', async ({ page }) => {
    await page.goto('/reservas');
    await rellenar(page);
    const propias: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.origin === new URL(page.url()).origin && r.method() !== 'GET') propias.push(r.url());
    });
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();
    await popupPromise;
    expect(propias).toEqual([]);
  });

  test('un lunes (cerrado) se rechaza con error en la fecha', async ({ page }) => {
    await page.goto('/reservas');
    await rellenar(page);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    await page.locator('main').getByLabel('Fecha', { exact: true }).fill(`${d.getFullYear()}-${mes}-${dia}`);
    await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();
    await expect(page.locator('#fecha-error')).toContainText('cerrado');
  });

  test('accesibilidad: /reservas sin violaciones graves, también tras un error', async ({ page }) => {
    await page.goto('/reservas');
    await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();
    await expect(page.locator('form [role="alert"]')).toBeVisible();
    const resultados = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const graves = resultados.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves, JSON.stringify(graves.map((v) => v.id))).toEqual([]);
  });

  test('objetivos táctiles de al menos 44x44 px y texto de al menos 14 px', async ({ page }) => {
    await page.goto('/reservas');
    const controles = page.locator('input, textarea, button, a:not([href="#contenido"])');
    const total = await controles.count();
    for (let i = 0; i < total; i++) {
      const caja = await controles.nth(i).boundingBox();
      if (!caja) continue;
      expect(caja.height, `control ${i}`).toBeGreaterThanOrEqual(44);
    }
    const pequenos = await page.evaluate(() => {
      const malos: string[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        const tieneTexto = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0,
        );
        if (!tieneTexto) return;
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px < 14) malos.push(`${el.tagName}:${px}`);
      });
      return malos;
    });
    expect(pequenos).toEqual([]);
  });

  test('sin scroll horizontal a 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/reservas');
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });

  test('el enlace de vuelta lleva a /', async ({ page }) => {
    await page.goto('/reservas');
    await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  });
});
