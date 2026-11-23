# Proposal

## Why

Con muchas tareas, las vencidas se pierden en el listado (origen: `docs/revisiones/REV-002-rechazo.md`, punto 2). Es un **cambio de requisito**: lo acordado era el orden de creación y el sistema lo cumple. El cliente ha aceptado tratarlo como una petición nueva.

## What Changes

- El listado muestra **primero las tareas vencidas**, de la fecha límite más antigua a la más reciente; después, el resto en orden de creación.
- La web no cambia: pinta la lista en el orden que devuelve la API.
- **Fuera de alcance**: ordenar por otros criterios a elección del usuario y paginación.

## Capabilities

### New Capabilities

### Modified Capabilities
- `tareas`: el requisito «Listar las tareas» cambia su orden.

## Impact

- Servicio: orden del listado. Sin cambios de esquema.
- Cambio de comportamiento visible de `GET /api/tareas` → MINOR (v0.3.0). Cualquier integración que dependiera del orden de creación debe revisarse (avisar al equipo de sistemas del cliente).
