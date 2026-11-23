# tareas Specification

## Purpose

Gestionar el ciclo de vida de las tareas del equipo de soporte: alta, consulta, modificación de sus datos y de su estado, y baja.

## Requirements

### Requirement: Crear una tarea
El sistema SHALL permitir crear una tarea con un título y, opcionalmente, una descripción y un estado inicial.
El título SHALL tener entre 1 y 120 caracteres sin contar los espacios de los extremos. La descripción SHALL tener como máximo 1000 caracteres.
El estado SHALL ser `pendiente`, `en_curso` o `hecha`; si no se indica, SHALL ser `pendiente`.

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
El sistema SHALL permitir modificar el título, la descripción y el estado de una tarea existente, con las mismas reglas que al crearla. Los campos que no se envían SHALL quedar como estaban.

#### Scenario: [T-EDITAR-1] Cambio de estado
- **WHEN** se modifica el estado de una tarea `pendiente` a `en_curso`
- **THEN** el sistema responde 200 con la tarea en estado `en_curso` y el mismo título que tenía

#### Scenario: [T-EDITAR-2] Tarea inexistente
- **WHEN** se modifica una tarea que no existe
- **THEN** el sistema responde 404

#### Scenario: [T-EDITAR-3] Datos no válidos
- **WHEN** se modifica una tarea dejando el título vacío
- **THEN** el sistema responde 422 y la tarea no cambia

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
