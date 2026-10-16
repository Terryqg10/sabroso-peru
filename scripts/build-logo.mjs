#!/usr/bin/env node
// build-logo.mjs — Deriva los recursos de marca a partir del logotipo original.
//
// Entrada:  docs/brand/logo-original.webp (emblema + nombre sobre fondo casi negro)
// Salidas:  public/brand/emblema.png         emblema solo, fondo transparente (cabecera)
//           public/brand/logo-vertical.png   emblema + nombre + lema, fondo transparente
//           src/app/icon.png                 favicon 512×512
//           src/app/apple-icon.png           icono de pantalla de inicio 180×180
//           src/app/opengraph-image.png      imagen para compartir 1200×630
//
// El fondo oscuro se convierte en transparencia con una máscara por luminosidad y los
// colores se reasignan a los dos de la marca (ámbar y crema), de modo que los bordes quedan
// limpios sobre cualquier fondo. Uso: pnpm run build-logo

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINAL = path.join(ROOT, 'docs', 'brand', 'logo-original.webp');

function log(m) { process.stdout.write(`[build-logo] ${m}\n`); }

/** Color de fondo de la web, leído de palette.css (el script puede usar valores; los componentes no). */
async function colorDeFondo() {
  const css = await fs.readFile(path.join(ROOT, 'palette.css'), 'utf8');
  const m = css.match(/--color-bg:\s*#([0-9a-fA-F]{6})/);
  if (!m) throw new Error('No se encontró --color-bg en palette.css');
  const hex = m[1];
  return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
}

/** Convierte el original en un RGBA con el fondo transparente y los dos colores de marca. */
async function recortarFondo() {
  const { data, info } = await sharp(ORIGINAL).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const fondo = Math.max(data[0] ?? 0, data[1] ?? 0, data[2] ?? 0); // esquina superior izquierda

  // Colores de marca: el ámbar es el más saturado; el crema, el claro poco saturado.
  const saturacion = (r, g, b) => {
    const max = Math.max(r, g, b);
    return max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
  };
  let ambar = [0, 0, 0], nAmbar = 0, crema = [0, 0, 0], nCrema = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.min(r, g, b) > 215) { crema[0] += r; crema[1] += g; crema[2] += b; nCrema += 1; }
    else if (r > 225 && saturacion(r, g, b) > 0.6) { ambar[0] += r; ambar[1] += g; ambar[2] += b; nAmbar += 1; }
  }
  if (!nAmbar || !nCrema) throw new Error('No se pudieron detectar los colores de marca');
  ambar = ambar.map((v) => Math.round(v / nAmbar));
  crema = crema.map((v) => Math.round(v / nCrema));
  log(`ámbar rgb(${ambar.join(', ')}), crema rgb(${crema.join(', ')}), fondo ${fondo}`);

  const out = Buffer.alloc(width * height * 4);
  for (let p = 0, o = 0; p < data.length; p += 3, o += 4) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const max = Math.max(r, g, b);
    const esAmbar = saturacion(r, g, b) > 0.4;
    const color = esAmbar ? ambar : crema;
    const tope = Math.max(...color);
    const alfa = Math.min(1, Math.max(0, (max - fondo - 3) / (tope - fondo - 3)));
    out[o] = color[0]; out[o + 1] = color[1]; out[o + 2] = color[2];
    out[o + 3] = Math.round(alfa * 255);
  }
  return { rgba: out, width, height };
}

/** Caja que encierra los píxeles visibles dentro de unas filas dadas. */
function caja({ rgba, width, height }, y0 = 0, y1 = height - 1) {
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < width; x++) {
      if ((rgba[(y * width + x) * 4 + 3] ?? 0) > 20) {
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Altura (fila) donde termina el emblema: la primera franja vacía tras el bloque superior. */
function finEmblema({ rgba, width, height }) {
  let enContenido = false;
  for (let y = 0; y < height; y++) {
    let hay = false;
    for (let x = 0; x < width; x += 2) {
      if ((rgba[(y * width + x) * 4 + 3] ?? 0) > 60) { hay = true; break; }
    }
    if (hay) enContenido = true;
    else if (enContenido) return y - 1;
  }
  return height - 1;
}

async function recorte(img, region, pad) {
  const w = Math.min(img.width - region.left, region.width + pad * 2);
  const h = Math.min(img.height - region.top, region.height + pad * 2);
  return sharp(img.rgba, { raw: { width: img.width, height: img.height, channels: 4 } }).extract({
    left: Math.max(0, region.left - pad),
    top: Math.max(0, region.top - pad),
    width: w,
    height: h,
  });
}

const png = { compressionLevel: 9, palette: false };

async function sobreFondo(buffer, ancho, alto, fondo, ocupa) {
  const meta = await sharp(buffer).metadata();
  const factor = Math.min((ancho * ocupa) / (meta.width ?? 1), (alto * ocupa) / (meta.height ?? 1));
  const interior = await sharp(buffer)
    .resize(Math.round((meta.width ?? 1) * factor), Math.round((meta.height ?? 1) * factor), { kernel: 'lanczos3' })
    .toBuffer();
  return sharp({ create: { width: ancho, height: alto, channels: 4, background: { ...fondo, alpha: 1 } } })
    .composite([{ input: interior, gravity: 'center' }])
    .png(png);
}

async function main() {
  const fondo = await colorDeFondo();
  const img = await recortarFondo();

  const filaEmblema = finEmblema(img);
  const cajaEmblema = caja(img, 0, filaEmblema);
  const cajaTodo = caja(img);
  log(`emblema ${cajaEmblema.width}×${cajaEmblema.height}, logo completo ${cajaTodo.width}×${cajaTodo.height}`);

  const emblema = await (await recorte(img, cajaEmblema, 6)).png(png).toBuffer();
  const vertical = await (await recorte(img, cajaTodo, 10)).png(png).toBuffer();

  await fs.mkdir(path.join(ROOT, 'public', 'brand'), { recursive: true });

  // Emblema para la cabecera: 3× la altura mostrada (40 px) para pantallas de alta densidad.
  await sharp(emblema)
    .resize({ height: 120, kernel: 'lanczos3' })
    .png(png)
    .toFile(path.join(ROOT, 'public', 'brand', 'emblema.png'));
  // Logo completo para la portada (se muestra a ~256 px de ancho).
  await sharp(vertical)
    .resize({ width: 768, kernel: 'lanczos3' })
    .png(png)
    .toFile(path.join(ROOT, 'public', 'brand', 'logo-vertical.png'));

  await (await sobreFondo(emblema, 512, 512, fondo, 0.78)).toFile(path.join(ROOT, 'src', 'app', 'icon.png'));
  await (await sobreFondo(emblema, 180, 180, fondo, 0.8)).toFile(path.join(ROOT, 'src', 'app', 'apple-icon.png'));
  await (await sobreFondo(vertical, 1200, 630, fondo, 0.78)).toFile(path.join(ROOT, 'src', 'app', 'opengraph-image.png'));

  for (const f of ['public/brand/emblema.png', 'public/brand/logo-vertical.png', 'src/app/icon.png', 'src/app/apple-icon.png', 'src/app/opengraph-image.png']) {
    const meta = await sharp(path.join(ROOT, f)).metadata();
    const { size } = await fs.stat(path.join(ROOT, f));
    log(`${f}: ${meta.width}×${meta.height}, ${Math.round(size / 1024)} KB`);
  }
}

main().catch((err) => {
  process.stderr.write(`[build-logo] x ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
});
