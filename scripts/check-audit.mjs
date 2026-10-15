#!/usr/bin/env node
// check-audit.mjs — pnpm audit (alto y crítico) con excepciones documentadas en un ADR.
//
// Falla si hay vulnerabilidades altas o críticas que no estén en EXCEPCIONES, o si una
// excepción ha caducado. Así la caducidad de un ADR se aplica sola, sin silenciar nada.
// Uso: pnpm run audit:ci   (AUDIT_HOY=AAAA-MM-DD para simular otra fecha)

import { spawn } from 'node:child_process';
import process from 'node:process';

// Cada excepción debe tener un ADR aceptado y una fecha de caducidad.
const EXCEPCIONES = [
  { ghsa: 'GHSA-vfj7-8cjw-p6xm', adr: 'ADR-001', expira: '2026-11-15' },
];

const NIVELES = new Set(['high', 'critical']);

function log(m) { process.stdout.write(`[check-audit] ${m}\n`); }
function error(m) { process.stderr.write(`[check-audit] x ${m}\n`); }

function hoy() {
  const forzada = process.env.AUDIT_HOY;
  if (forzada) return forzada;
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function ejecutarAudit() {
  const pnpm = process.env.npm_execpath;
  if (!pnpm) {
    error('Ejecuta este script con: pnpm run audit:ci');
    process.exit(1);
  }
  // npm_execpath puede ser un script de Node (pnpm.cjs) o el ejecutable (pnpm.exe, pnpm).
  const esScript = /\.(c|m)?js$/i.test(pnpm);
  const [comando, args] = esScript
    ? [process.execPath, [pnpm, 'audit', '--json']]
    : [pnpm, ['audit', '--json']];
  return new Promise((resolve, reject) => {
    const child = spawn(comando, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });
    let salida = '';
    child.stdout.on('data', (d) => { salida += d.toString(); });
    child.on('error', reject);
    // pnpm audit devuelve código != 0 cuando hay hallazgos: se interpreta el JSON, no el código.
    child.on('close', () => resolve(salida));
  });
}

const salida = await ejecutarAudit();
let informe;
try {
  informe = JSON.parse(salida);
} catch {
  error('No se pudo leer la salida de pnpm audit (¿sin red?).');
  error(`Inicio de la salida: ${salida.slice(0, 200).replace(/\s+/g, ' ')}`);
  process.exit(1);
}

const fecha = hoy();
const pendientes = [];
const aceptados = [];
const caducados = [];

for (const aviso of Object.values(informe.advisories ?? {})) {
  if (!NIVELES.has(aviso.severity)) continue;
  const excepcion = EXCEPCIONES.find((e) => e.ghsa === aviso.github_advisory_id);
  const etiqueta = `${aviso.severity} ${aviso.module_name} ${aviso.github_advisory_id}`;
  if (!excepcion) pendientes.push(etiqueta);
  else if (fecha > excepcion.expira) caducados.push(`${etiqueta} (${excepcion.adr} caducó el ${excepcion.expira})`);
  else aceptados.push(`${etiqueta} (${excepcion.adr}, hasta ${excepcion.expira})`);
}

for (const a of aceptados) log(`excepción vigente: ${a}`);
for (const c of caducados) error(`excepción CADUCADA: ${c}`);
for (const p of pendientes) error(`vulnerabilidad sin excepción: ${p}`);

if (pendientes.length > 0 || caducados.length > 0) {
  error('Corrige la dependencia o renueva el ADR antes de continuar.');
  process.exit(1);
}
log('OK: sin vulnerabilidades altas o críticas fuera de las excepciones documentadas.');
