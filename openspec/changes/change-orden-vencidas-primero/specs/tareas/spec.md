# Spec Delta

## MODIFIED Requirements

### Requirement: Listar las tareas
El sistema SHALL devolver todas las tareas. Primero SHALL devolver las tareas vencidas, de la fecha límite más antigua a la más reciente (a igual fecha límite, en orden de creación). Después SHALL devolver el resto de tareas en orden de creación, de la más antigua a la más reciente.

#### Scenario: [T-LISTAR-1] Varias tareas
- **WHEN** existen las tareas "A" y "B", creadas en ese orden y sin vencer, y se pide el listado
- **THEN** el sistema responde 200 con una lista que contiene "A" y después "B"

#### Scenario: [T-LISTAR-2] Sin tareas
- **WHEN** no existe ninguna tarea y se pide el listado
- **THEN** el sistema responde 200 con una lista vacía

#### Scenario: [T-LISTAR-3] Vencidas primero (REV-002)
- **WHEN** hoy es 2026-03-10 y existen, creadas en este orden, "A" sin fecha límite, "B" vencida el 2026-03-08, "C" vencida el 2026-03-05 y "D" con fecha límite 2026-03-20, y se pide el listado
- **THEN** el sistema responde 200 con la lista en el orden "C", "B", "A", "D"
