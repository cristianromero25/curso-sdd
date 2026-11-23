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

## Análisis (skill `gestionar-rechazo`)

| # | Punto | ¿Qué decía la spec? | Clasificación | Acción |
|---|---|---|---|---|
| 1 | «Vence al terminar su día» | «vencida cuando su fecha límite **se haya alcanzado**»: ambiguo, y **ningún scenario cubría el caso "fecha = hoy"**. Implementamos `fecha <= hoy` siguiendo un **[SUPUESTO]** que nunca se confirmó (REQ-002, hueco 4). | **Hueco de la spec** | Change `fix-vencida-mismo-dia`: delta MODIFIED que define el término y añade el scenario que faltaba. PATCH → v0.2.1 |
| 2 | «Las vencidas, arriba» | «Listar… **en orden de creación**». El sistema hace exactamente lo acordado. | **Cambio de requisito** (alcance nuevo) | Change `change-orden-vencidas-primero`: delta MODIFIED del listado. MINOR → v0.3.0. Se comunica al cliente que es una petición nueva. |

**Causa raíz del punto 1:** un supuesto sin validar se convirtió en requisito. El código era fiel a la spec: el fallo estaba en la spec.
**Lección para el proceso:** todo `[SUPUESTO]` de un requerimiento se confirma con el cliente **antes** de `/openspec-propose`, o se escribe como scenario explícito para que el cliente lo lea en la revisión.

## Plan
1. Change `fix-vencida-mismo-dia`: primero el delta con el scenario que faltaba (`[T-VENC-5]`, fecha límite = hoy).
2. Reproducir el rechazo con el test de `[T-VENC-5]` **en rojo** → arreglo → verde → archive → v0.2.1.
3. Change `change-orden-vencidas-primero` → apply → archive → v0.3.0.
4. Demo con el cliente sobre los mismos datos de la evidencia → acta `ACEPTACION-002.md`.
