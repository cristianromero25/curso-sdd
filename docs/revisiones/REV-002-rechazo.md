# REV-002 — Rechazo de la entrega v0.2.0 (REQ-002 fecha límite)

| Campo | Valor |
|---|---|
| Entrega revisada | v0.2.0 — change `add-fecha-limite` |
| Revisado por | Laura Gómez (cliente) en la demo del 2026-03-16 |
| Resultado | **RECHAZADA** |

## Lo que dijo el cliente

> 1. «Esta mañana a primera hora la tarea *Enviar informe mensual* ya salía en rojo como **Vencida**, y su fecha
>    límite es **hoy**. Para nosotros una tarea vence cuando **termina** su día, no cuando empieza. El equipo se asustó
>    y empezó a llamar a clientes por tareas que estaban en plazo.»
>
> 2. «Con 40 tareas en la lista, las vencidas se pierden. Necesito **verlas arriba del todo**, las más atrasadas primero.»

## Evidencia
- Tarea `Enviar informe mensual`, `fechaLimite: 2026-03-16`, estado `pendiente` → la API devolvía `vencida: true` el 2026-03-16 a las 08:05.
- Captura del listado: las 3 tareas vencidas aparecían en las posiciones 12, 27 y 38.
