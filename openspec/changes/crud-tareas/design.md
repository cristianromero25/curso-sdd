# Design

## Context

Proyecto nuevo (greenfield). Ver proposal.md. Restricciones del PRD: arranque con un solo comando y sin servidor de base de datos que instalar.

## Goals / Non-Goals

**Goals:**
- Capas separadas para que cada regla de negocio tenga un único sitio y se pueda probar.
- Tests de contrato HTTP rápidos y deterministas (BD en memoria, reloj inyectable).

**Non-Goals:**
- Autenticación, paginación y despliegue en la nube.

## Decisions

1. **SQLite con better-sqlite3.** Un archivo local, cero instalación, síncrono y rápido. *Alternativa descartada:* PostgreSQL, que obliga a levantar un servidor y no lo necesitamos para 6 usuarios.
2. **Capas `rutas → servicio → repositorio`.** Las rutas solo traducen HTTP; el servicio tiene las reglas; el repositorio, el SQL. *Alternativa descartada:* todo en el controlador, más rápido hoy pero mezcla reglas y SQL y complica los tests.
3. **Validación con zod en `esquemas.ts`.** Un esquema declarativo por operación, mensajes en español. *Alternativa descartada:* validar a mano en cada ruta (repetición y huecos).
4. **Migraciones SQL numeradas** (`src/db/migraciones/NNN_*.sql`) aplicadas al arrancar y registradas en la tabla `migraciones`. *Alternativa descartada:* un ORM con sincronización automática del esquema, que oculta los cambios.
5. **`crearApp({ bd, hoy })`**: la app recibe la BD y el reloj, de modo que los tests usan `:memory:` y una fecha fija. *Alternativa descartada:* singletons globales, imposibles de aislar en tests.
6. **Identificador inválido = 404**, igual que uno inexistente: para el cliente de la API ambos son «no existe esa tarea».

## Risks / Trade-offs

- [SQLite no escala a muchos escritores concurrentes] → Suficiente para 6 usuarios; la capa repositorio aísla el cambio si hiciera falta.
- [Borrado definitivo: no se puede deshacer] → Decisión del MVP; se revisará con el cliente.
