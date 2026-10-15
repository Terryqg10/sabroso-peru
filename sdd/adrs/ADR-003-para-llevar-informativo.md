---
id: ADR-003
title: La comida para llevar se informa en la web pero no se gestiona
status: aceptada
date: 2026-10-15
os_version: 0.1.0
relates_to: [SPEC-001]
---

# ADR-003 — Comida para llevar: solo informativa

## Contexto

SPEC-001 deja fuera de alcance "pedidos y pago online (delivery, take-away, carrito, pasarela)". La investigación de competencia mostró que 3 de 4 webs ofrecen alguna vía de comida para llevar: Ceviche 103 con subdominio propio, Yakumanka con carta específica y Piscomar mediante Uber Eats. Osaka Nikkei no la ofrece. También se detectó la fricción de sacar al cliente a un tercero sin explicarle el proceso.

## Alternativas consideradas

1. **Solo informar** — texto en la web: cómo pedir para llevar (llamada o WhatsApp), horario y recogida. Sin carrito, sin pago, sin base de datos. Bajo coste.
2. **Seguir fuera de alcance** — no se menciona. Menor trabajo, pero deja sin cubrir una expectativa del rubro.
3. **Enlazar a una plataforma externa** (Uber Eats o similar) — rápido, pero saca al cliente del sitio, introduce comisión y dependencia, y obliga a revisar términos y privacidad.
4. **Sistema de pedidos propio** — exige carrito, pago, estados de pedido y probablemente base de datos (nivel L). Contradice el alcance aprobado.

## Decisión

Se adopta la opción 1: la web informa cómo pedir para llevar (llamar o escribir por WhatsApp), los horarios de recogida y cómo se confirma. No hay carrito, pago ni almacenamiento de pedidos. El resto del punto 1 de "Fuera de alcance" de SPEC-001 sigue vigente.

## Consecuencias

Positivas:
- Cubre la expectativa del rubro sin añadir infraestructura.
- No introduce terceros ni datos personales nuevos.

Negativas:
- No hay pedido autoservicio: depende de que el restaurante atienda llamadas y WhatsApp.
- Si se quiere pedido online, requiere un nuevo ADR y subir de nivel.
- Coste de revertir: bajo (se elimina una sección).

## Relación con la constitución

- I1: el cambio entra por enmienda.
- I9: queda trazado a RF-15 y CA-18.
- No toca datos: no cambia la sección de privacidad.
