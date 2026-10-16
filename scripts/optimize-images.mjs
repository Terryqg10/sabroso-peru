#!/usr/bin/env node
// optimize-images.mjs
// Convierte las imágenes de public/images/raw/ a formatos optimizados
// (AVIF, WebP, JPG) en public/images/.
//
// Cross-platform. Lee los archivos de raw/, los redimensiona según el
// prefijo del nombre, y genera 3 versiones por cada uno.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'public', 'images', 'raw');
const OUT_DIR = path.join(ROOT, 'public', 'images');

const INPUT_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff']);

// Ancho máximo por tipo de imagen (según el prefijo del archivo).
function maxWidthFor(name) {
  if (name.startsWith('hero-')) return 1920;
  if (name.startsWith('galeria-')) return 1200;
  if (name.startsWith('plato-')) return 900;
  return 1600;
}

// Calidades por formato. Más alta = mejor calidad, más peso.
const QUALITY = {
  avif: 55,
  webp: 78,
  jpg: 82,
};

async function ensureDirs() {
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
}

async function listRawFiles() {
  const entries = await fs.readdir(RAW_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .filter((e) => INPUT_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name);
}

async function optimizeOne(filename) {
  const base = path.parse(filename).name;
  const inPath = path.join(RAW_DIR, filename);
  const maxW = maxWidthFor(base);

  const inputBuffer = await fs.readFile(inPath);
  const image = sharp(inputBuffer);
  const meta = await image.metadata();

  const resized = meta.width && meta.width > maxW
    ? image.resize({ width: maxW, withoutEnlargement: true })
    : image;

  // AVIF
  const avifPath = path.join(OUT_DIR, `${base}.avif`);
  await resized.clone().avif({ quality: QUALITY.avif }).toFile(avifPath);

  // WebP
  const webpPath = path.join(OUT_DIR, `${base}.webp`);
  await resized.clone().webp({ quality: QUALITY.webp }).toFile(webpPath);

  // JPG (fallback)
  const jpgPath = path.join(OUT_DIR, `${base}.jpg`);
  await resized.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toFile(jpgPath);

  const avifSize = (await fs.stat(avifPath)).size;
  const webpSize = (await fs.stat(webpPath)).size;
  const jpgSize = (await fs.stat(jpgPath)).size;
  const kb = (n) => (n / 1024).toFixed(0).padStart(4);

  process.stdout.write(
    `  ${base} (${meta.width || '?'}px) -> AVIF ${kb(avifSize)}KB · WebP ${kb(webpSize)}KB · JPG ${kb(jpgSize)}KB\n`,
  );
}

async function main() {
  await ensureDirs();
  const files = await listRawFiles();

  if (files.length === 0) {
    process.stdout.write(
      `[optimize-images] No hay imágenes en public/images/raw/.\n`,
    );
    process.exit(0);
  }

  process.stdout.write(
    `[optimize-images] Procesando ${files.length} archivos...\n`,
  );

  for (const file of files) {
    try {
      await optimizeOne(file);
    } catch (err) {
      process.stderr.write(`  ERROR en ${file}: ${err.message}\n`);
    }
  }

  process.stdout.write(`[optimize-images] Listo. Salida en public/images/\n`);
}

main().catch((err) => {
  process.stderr.write(`[optimize-images] Fallo: ${err.message}\n`);
  process.exit(1);
});
