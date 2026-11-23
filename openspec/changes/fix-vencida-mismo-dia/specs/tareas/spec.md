# Spec Delta

## MODIFIED Requirements

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
