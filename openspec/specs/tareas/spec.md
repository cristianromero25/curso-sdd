# tareas Specification

## Purpose

Gestionar el ciclo de vida de las tareas del equipo de soporte: alta, consulta, modificación de sus datos y de su estado, y baja; con fecha límite opcional y aviso de las tareas vencidas.

## Requirements

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

### Requirement: Listar las tareas
El sistema SHALL devolver todas las tareas en orden de creación, de la más antigua a la más reciente.

#### Scenario: [T-LISTAR-1] Varias tareas
- **WHEN** existen las tareas "A" y "B", creadas en ese orden, y se pide el listado
- **THEN** el sistema responde 200 con una lista que contiene "A" y después "B"

#### Scenario: [T-LISTAR-2] Sin tareas
- **WHEN** no existe ninguna tarea y se pide el listado
- **THEN** el sistema responde 200 con una lista vacía

### Requirement: Consultar una tarea
El sistema SHALL devolver una tarea a partir de su identificador.

#### Scenario: [T-VER-1] Tarea existente
- **WHEN** se pide una tarea que existe
- **THEN** el sistema responde 200 con sus datos

#### Scenario: [T-VER-2] Tarea inexistente
- **WHEN** se pide una tarea con un identificador que no existe o no es un número
- **THEN** el sistema responde 404

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

### Requirement: Borrar una tarea
El sistema SHALL permitir borrar una tarea existente de forma definitiva.

#### Scenario: [T-BORRAR-1] Borrado correcto
- **WHEN** se borra una tarea que existe
- **THEN** el sistema responde 204 y, al consultarla después, responde 404

#### Scenario: [T-BORRAR-2] Tarea inexistente
- **WHEN** se borra una tarea que no existe
- **THEN** el sistema responde 404

### Requirement: Errores con formato común
El sistema SHALL responder a los errores con un cuerpo JSON que incluya un mensaje `error` en español y, en los errores de validación, una lista `detalles` con el campo y el motivo.

#### Scenario: [T-ERROR-1] JSON mal formado
- **WHEN** se crea una tarea enviando un cuerpo que no es JSON válido
- **THEN** el sistema responde 400 con un mensaje `error`

### Requirement: Tarea vencida
El sistema SHALL indicar en cada tarea si está vencida.
Una tarea SHALL estar vencida cuando su fecha límite sea **anterior** a hoy y su estado no sea `hecha`: una tarea vence al terminar el día de su fecha límite, de modo que el mismo día de su fecha límite todavía está en plazo.
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

#### Scenario: [T-VENC-5] Fecha límite hoy (REV-002)
- **WHEN** hoy es 2026-03-10 y se consulta una tarea `pendiente` con fecha límite 2026-03-10
- **THEN** la tarea no aparece como vencida
