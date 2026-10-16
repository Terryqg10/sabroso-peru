// Lanza Playwright con E2E_DEV=1, que hace que el webServer use
// `pnpm run dev` en lugar de `pnpm run build && pnpm run start`.
// Cross-platform (I8). Sin dependencias nuevas ni shell: se invoca el CLI de
// Playwright con el propio Node, porque los .bin de Windows son .cmd.

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');

const child = spawn(process.execPath, [cli, 'test', ...process.argv.slice(2)], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, E2E_DEV: '1' },
});

child.on('exit', (code) => process.exit(code ?? 1));
