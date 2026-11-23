# ACEPTACIÓN-002 — Entrega v0.3.0 (cierra REV-002)

| Campo | Valor |
|---|---|
| Entrega | v0.3.0 (incluye v0.2.1) |
| Rechazo que cierra | `docs/revisiones/REV-002-rechazo.md` |
| Demo | 2026-03-23, con Laura Gómez (cliente), sobre los mismos datos de la evidencia del rechazo |
| Resultado | **ACEPTADA** |

## Qué se corrigió

| Punto del rechazo | Change | Spec | Evidencia |
|---|---|---|---|
| 1. Una tarea que vence hoy salía como vencida | `fix-vencida-mismo-dia` (v0.2.1) | «Tarea vencida»: fecha límite **anterior** a hoy · nuevo scenario `[T-VENC-5]` | Test `[T-VENC-5]` en verde. En la demo, «Enviar informe mensual» con fecha de hoy aparece en plazo; al día siguiente, como vencida |
| 2. Las vencidas se perdían en la lista | `change-orden-vencidas-primero` (v0.3.0) | «Listar las tareas»: vencidas primero · nuevo scenario `[T-LISTAR-3]` | Test `[T-LISTAR-3]` en verde. En la demo, las 3 vencidas aparecen en las posiciones 1, 2 y 3 |

## Comprobaciones
- [x] `npm run check` en verde: 25 tests, 23 scenarios cubiertos, specs válidas.
- [x] El cliente leyó la definición nueva de «vencida» en la spec y la aprobó con sus palabras: *«vence cuando acaba su día»*.
- [x] Se avisó al equipo de sistemas del cliente del nuevo orden de `GET /api/tareas`.

## Aprobación del cliente
> «Ahora sí: lo que vence hoy no nos asusta y lo atrasado está arriba. Aprobado.» — Laura Gómez, 2026-03-23

## Mejora del proceso acordada
Todo **[SUPUESTO]** de un requerimiento se confirma con el cliente antes de `/openspec-propose`, o se convierte en un
scenario explícito que el cliente lee en la revisión de la propuesta.
