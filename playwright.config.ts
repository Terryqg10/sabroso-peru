import { defineConfig, devices } from '@playwright/test';

// Puerto propio de los e2e (3200) para no chocar con otros proyectos que usen el 3000. Se cambia con E2E_PORT.
const PORT = Number(process.env.E2E_PORT ?? 3200);
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;
// Por defecto los e2e corren contra el build de producción. `pnpm test:e2e:dev` (E2E_DEV=1) usa `next dev`.
const usaProd = !process.env.E2E_DEV;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: usaProd
      ? `pnpm run build && pnpm run start -p ${PORT}`
      : `pnpm run dev -p ${PORT}`,
    url: BASE_URL,
    // En producción nunca se reutiliza: evita coger un `next dev` abierto por error.
    reuseExistingServer: !usaProd && !isCI,
    timeout: usaProd ? 180_000 : 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
