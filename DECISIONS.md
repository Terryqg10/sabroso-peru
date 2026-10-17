# DECISIONS

Una línea por decisión tomada en modo autónomo (2026-10-17). Las decisiones de arquitectura con alternativas reales van además en `sdd/adrs/`.

- Se trabaja con `sdd/specs`, `sdd/tasks` y `sdd/reviews` en vez de `spec.md`/`tasks.md` en la raíz: es el flujo SDD del proyecto y su constitución (I1, I9); duplicarlo crearía dos fuentes de verdad.
- Cada pendiente se convierte en tarea T-xx con review y commit atómico (T-014, T-015): la regla spec-first no se salta aunque haya autonomía.
- No se hace `git push`: la sesión no tiene esa autorización duradera y es una acción hacia fuera; los commits quedan locales para que el usuario decida.
- UI sin pregunta de estilo: se mantiene el estilo actual (v3-editorial-dark@0.1.0) y no se toca ningún componente.
- Los `alt` de las 7 fotos se reescribieron mirando cada imagen (T-014): un alt debe describir lo visible (WCAG 1.1.1).
- Solo se añade a `datos.ts` un alérgeno deducible de un ingrediente ya descrito (sulfitos por el oporto del suspiro, T-015); no se inventan más: el resto sigue como VERIFICAR con las recetas reales.
- No se aprueba el estilo v3 ni se pasa PLAN-001 de `borrador`: aprobar es una decisión de propiedad del usuario, y cambia la inmutabilidad del estilo.
- Los desajustes descripción/foto (ceviche, anticuchos, causa) no se corrigen: son contenido del restaurante; quedan anotados en `sdd/reviews/T-014.md`.
- Los e2e se lanzan con `E2E_PORT=3300` para no chocar con el `pnpm dev` del usuario en el 3200.
