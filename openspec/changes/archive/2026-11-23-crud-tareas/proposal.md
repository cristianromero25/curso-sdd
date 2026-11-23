# Proposal

## Why

El equipo de soporte pierde tareas en una hoja de cálculo compartida (ver `docs/brief-cliente.md` y `docs/prd.md`, RF-01 a RF-05). Necesitan un gestor sencillo con web y API para dejar la hoja de cálculo cuanto antes.

## What Changes

- Nueva API REST `/api/tareas` para crear, listar, consultar, modificar y borrar tareas.
- Una tarea tiene título (obligatorio, máx. 120 caracteres), descripción opcional (máx. 1000) y estado (`pendiente`, `en_curso`, `hecha`; por defecto `pendiente`).
- Errores consistentes: `422` datos no válidos, `404` tarea inexistente, `400` JSON mal formado.
- Página web mínima que usa la misma API.
- **Fuera de alcance**: usuarios y permisos, fechas límite, asignación de tareas, historial de cambios.

## Capabilities

### New Capabilities
- `tareas`: gestión del ciclo de vida de las tareas del equipo (alta, consulta, modificación de datos y estado, baja).

### Modified Capabilities

## Impact

- Código nuevo: `src/` (API), `public/` (web), migración `001_crear_tareas.sql`.
- Contrato público nuevo: `openapi.yaml`.
- Dependencias: express, better-sqlite3, zod.
