# CLAUDE.md — tareas-app

## Overview
API REST de tareas (Express + SQLite) con una página web mínima en `public/`. Specs en `openspec/`.
Producto y alcance: `docs/prd.md`. Los requerimientos nuevos se registran en `docs/requerimientos/REQ-xxx.md`; los rechazos y aceptaciones del cliente, en `docs/revisiones/`.

## Arquitectura (respétala)
- `src/tareas/rutas.ts` → solo HTTP: lee la petición, llama al servicio, responde. Sin reglas de negocio.
- `src/tareas/servicio.ts` → reglas de negocio y conversión a la forma pública de la API. Recibe el reloj (`hoy`) inyectado.
- `src/tareas/repositorio.ts` → SQL. Nada de SQL fuera de aquí.
- `src/tareas/esquemas.ts` → validación de entrada con zod. No validar a mano en las rutas.
- `src/db/migraciones/NNN_*.sql` → el esquema solo cambia con una migración NUEVA. Nunca edites una migración ya commiteada.

## Comandos
- `npm run dev` — arranca en http://localhost:3000
- `npm test` — tests de contrato (BD en memoria, reloj fijo)
- `npm run check` — typecheck + tests + trazabilidad spec↔tests + validación de specs. **Debe pasar antes de abrir un PR.**

## Convenciones
- JSON en camelCase; columnas SQL en snake_case.
- Errores: `422` datos no válidos (`{ error, detalles: [{ campo, mensaje }] }`), `404` tarea inexistente, `400` JSON mal formado.
- Cada test de contrato lleva en su nombre el id del scenario que comprueba: `it('[T-CREAR-1] …')`.
- Datos de prueba inventados; correos solo `@example.com`.

## Gotchas
- `hoy` depende de la zona horaria `APP_TZ`; en los tests se fija con `crearApp({ hoy: () => 'AAAA-MM-DD' })`.
- `DB_PATH` elige el archivo SQLite (por defecto `data/tareas.db`); los tests usan `:memory:`.
- Hooks: `datos-que-no-salen` bloquea commits con claves, correos reales o `.env` y lo anota en `docs/seguridad/registro-de-bloqueos.md` (sin el dato); `tests-antes-de-commit` bloquea commits de código con tests en rojo (los commits de solo tests/specs pasan, para poder commitear la fase roja de TDD).
- `better-sqlite3` es síncrono: no hace falta `await` en el repositorio.

## Reglas de proceso (SDD)
- Un cambio de comportamiento empieza por OpenSpec: `/openspec-propose` → **revisión humana** → `/openspec-apply-change` → `npm run check` → `/openspec-archive-change`. Un bug con la spec intacta es solo un cambio de código.
- Requerimiento nuevo del cliente: skill `/nuevo-requerimiento` antes de proponer. Rechazo del cliente: skill `/gestionar-rechazo`.
- Un change por intención: no mezcles una corrección con una funcionalidad nueva.
- Antes de tocar código: rama nueva `feat/<slug>` o `fix/<slug>`. Nunca commitear en `main`.
- Tests primero: escribe el test del scenario, míralo fallar, después implementa.
- Si cambias un endpoint, actualiza `openapi.yaml` en el mismo commit.
- Commits con la skill `/commit`. Al terminar: `gh pr create` y pasa el subagente `adversarial-reviewer` sobre el cambio.
