# Proposal

## Why

El cliente necesita poner una fecha límite a algunas tareas y ver de un vistazo cuáles se han pasado de fecha (origen: `docs/requerimientos/REQ-002-fecha-limite.md`).

## What Changes

- Las tareas admiten una **fecha límite** opcional (fecha de calendario AAAA-MM-DD; se permiten fechas pasadas).
- Al crear y al modificar se puede indicar la fecha límite; al modificar, `null` la quita.
- Cada tarea indica si está **vencida** (campo calculado, no se guarda).
- La web muestra la fecha límite y marca las tareas vencidas.
- **Fuera de alcance**: horas de vencimiento, avisos o notificaciones, ordenar o filtrar por fecha.

## Capabilities

### New Capabilities

### Modified Capabilities
- `tareas`: crear y modificar aceptan la fecha límite; nuevo requisito «Tarea vencida».

## Impact

- Migración nueva `002_fecha_limite.sql` (columna nullable: no afecta a las tareas existentes).
- API: nuevos campos `fechaLimite` y `vencida` en las respuestas; `fechaLimite` en las peticiones. Cambio compatible (MINOR → v0.2.0).
- `openapi.yaml` y `public/index.html` actualizados.
