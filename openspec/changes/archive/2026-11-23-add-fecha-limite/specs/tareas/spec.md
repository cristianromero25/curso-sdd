# Spec Delta

## ADDED Requirements

### Requirement: Tarea vencida
El sistema SHALL indicar en cada tarea si está vencida.
Una tarea SHALL estar vencida cuando su fecha límite se haya alcanzado y su estado no sea `hecha`.
Una tarea sin fecha límite SHALL NOT estar vencida nunca.
«Hoy» SHALL calcularse en la zona horaria configurada para la oficina.

#### Scenario: [T-VENC-1] Fecha pasada y tarea pendiente
- **WHEN** hoy es 2026-03-10 y se consulta una tarea `pendiente` con fecha límite 2026-03-09
- **THEN** la tarea aparece como vencida

#### Scenario: [T-VENC-2] Fecha pasada pero tarea hecha
- **WHEN** hoy es 2026-03-10 y se consulta una tarea `hecha` con fecha límite 2026-03-09
- **THEN** la tarea no aparece como vencida

#### Scenario: [T-VENC-3] Sin fecha límite
- **WHEN** se consulta una tarea sin fecha límite
- **THEN** la tarea no aparece como vencida

#### Scenario: [T-VENC-4] Fecha futura
- **WHEN** hoy es 2026-03-10 y se consulta una tarea `pendiente` con fecha límite 2026-03-11
- **THEN** la tarea no aparece como vencida

## MODIFIED Requirements

### Requirement: Crear una tarea
El sistema SHALL permitir crear una tarea con un título y, opcionalmente, una descripción, un estado inicial y una fecha límite.
El título SHALL tener entre 1 y 120 caracteres sin contar los espacios de los extremos. La descripción SHALL tener como máximo 1000 caracteres.
El estado SHALL ser `pendiente`, `en_curso` o `hecha`; si no se indica, SHALL ser `pendiente`.
La fecha límite SHALL ser una fecha de calendario válida con formato AAAA-MM-DD; se admiten fechas pasadas.

#### Scenario: [T-CREAR-1] Título válido
- **WHEN** se crea una tarea con el título "Revisar incidencia 4521"
- **THEN** el sistema responde 201 con la tarea creada, un identificador nuevo y el estado `pendiente`

#### Scenario: [T-CREAR-2] Título vacío
- **WHEN** se crea una tarea con el título "   " (solo espacios)
- **THEN** el sistema responde 422 indicando que el campo `titulo` es obligatorio y no crea ninguna tarea

#### Scenario: [T-CREAR-3] Título demasiado largo
- **WHEN** se crea una tarea con un título de 121 caracteres
- **THEN** el sistema responde 422 indicando que `titulo` supera el máximo y no crea ninguna tarea

#### Scenario: [T-CREAR-4] Estado no válido
- **WHEN** se crea una tarea con el estado "terminada"
- **THEN** el sistema responde 422 indicando que `estado` no es un valor permitido

#### Scenario: [T-CREAR-5] Con fecha límite
- **WHEN** se crea una tarea con la fecha límite 2026-04-15
- **THEN** el sistema responde 201 con la tarea y su `fechaLimite` 2026-04-15

#### Scenario: [T-CREAR-6] Fecha límite no válida
- **WHEN** se crea una tarea con la fecha límite "2026-02-30"
- **THEN** el sistema responde 422 indicando que `fechaLimite` no es una fecha válida y no crea ninguna tarea

### Requirement: Modificar una tarea
El sistema SHALL permitir modificar el título, la descripción, el estado y la fecha límite de una tarea existente, con las mismas reglas que al crearla. Los campos que no se envían SHALL quedar como estaban. Enviar la fecha límite vacía (`null`) SHALL quitarla.

#### Scenario: [T-EDITAR-1] Cambio de estado
- **WHEN** se modifica el estado de una tarea `pendiente` a `en_curso`
- **THEN** el sistema responde 200 con la tarea en estado `en_curso` y el mismo título que tenía

#### Scenario: [T-EDITAR-2] Tarea inexistente
- **WHEN** se modifica una tarea que no existe
- **THEN** el sistema responde 404

#### Scenario: [T-EDITAR-3] Datos no válidos
- **WHEN** se modifica una tarea dejando el título vacío
- **THEN** el sistema responde 422 y la tarea no cambia

#### Scenario: [T-EDITAR-4] Quitar la fecha límite
- **WHEN** se modifica una tarea con fecha límite enviando la fecha límite vacía
- **THEN** el sistema responde 200 con la tarea sin fecha límite
