# Proposal

## Why

El cliente rechazó la v0.2.0 porque una tarea cuya fecha límite es hoy ya aparece como vencida (origen: `docs/revisiones/REV-002-rechazo.md`, punto 1). La spec decía «se haya alcanzado», una expresión ambigua, y no tenía ningún scenario para «fecha límite = hoy».

## What Changes

- Se define «vencida» sin ambigüedad: la fecha límite es **anterior** a hoy. Una tarea vence al terminar el día de su fecha límite.
- Nuevo scenario de borde: fecha límite = hoy → no vencida.
- **Fuera de alcance**: horas de vencimiento; el orden del listado (va en otro change, `change-orden-vencidas-primero`).

## Capabilities

### New Capabilities

### Modified Capabilities
- `tareas`: el requisito «Tarea vencida» cambia su definición y añade un scenario.

## Impact

- Servicio: regla `estaVencida`. Sin cambios en la API, la base de datos ni la web.
- Corrección sin romper el contrato → PATCH (v0.2.1).
