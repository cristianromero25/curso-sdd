# Design

## Context

Capability `tareas` en producción (v0.1.0) con datos reales: el cambio de esquema no puede romper las tareas existentes. Ver proposal.md.

## Goals / Non-Goals

**Goals:**
- Una única regla de «vencida», en el servicio, probada con un reloj fijo.

**Non-Goals:**
- Guardar «vencida» en la base de datos.

## Decisions

1. **`vencida` se calcula al leer, no se guarda.** Depende de «hoy», que cambia cada día. *Alternativa descartada:* columna persistida, que exigiría una tarea programada para actualizarla y se desincroniza.
2. **Fecha como texto AAAA-MM-DD** en SQLite. Se compara como texto sin conversiones y no arrastra zona horaria. *Alternativa descartada:* timestamp, que obliga a decidir la hora de vencimiento (fuera de alcance).
3. **Migración `002` con columna nullable.** Las tareas existentes quedan sin fecha límite, que es su significado real. *Alternativa descartada:* editar la migración `001` (ya aplicada en producción).
4. **«Hoy» en `APP_TZ`** mediante el reloj inyectado `hoy()`. *Alternativa descartada:* la hora UTC del servidor, que desplazaría el día para la oficina.

## Risks / Trade-offs

- [El significado de «se haya alcanzado» depende de un supuesto no confirmado: REQ-002, hueco 4] → Validarlo en la demo con el cliente antes de dar el requerimiento por cerrado.
