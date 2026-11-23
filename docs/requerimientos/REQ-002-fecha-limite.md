# REQ-002 — Fecha límite y tareas vencidas

| Campo | Valor |
|---|---|
| Solicitante | Laura Gómez (coordinadora de soporte, Distribuciones Norte) |
| Fecha de entrada | 2026-03-02 |
| Estado | Entregado en v0.2.0 (change `add-fecha-limite`) · pendiente de aceptación del cliente |

## Petición original

> Hola,
>
> El gestor nos está funcionando muy bien, ya no usamos la hoja de cálculo. Ahora necesitamos lo que os comenté:
> poder poner **una fecha límite** a las tareas que la tengan (no todas la tienen) y **ver de un vistazo cuáles se
> nos han pasado de fecha**. Las que ya están hechas no nos preocupan aunque se hayan pasado.
>
> Laura

## Clasificación
Capacidad nueva (fecha límite y estado «vencida») que **modifica** requisitos existentes de la capability `tareas`
(crear y modificar aceptan un dato nuevo). Afecta a la API, a la base de datos y a la web → va por OpenSpec.

## Historia
**Como** coordinadora de soporte **quiero** poner una fecha límite opcional a las tareas y ver cuáles se han pasado de fecha
**para** atender primero lo que ya llega tarde.

### Criterios de aceptación
1. **DADO** una tarea nueva **CUANDO** la creo con una fecha límite **ENTONCES** la tarea guarda esa fecha.
2. **DADO** una tarea con fecha límite **CUANDO** la quito **ENTONCES** la tarea queda sin fecha límite.
3. **DADO** una tarea pendiente o en curso cuya fecha límite ya pasó **CUANDO** la consulto **ENTONCES** aparece como vencida.
4. **DADO** una tarea hecha cuya fecha límite ya pasó **CUANDO** la consulto **ENTONCES** no aparece como vencida.
5. **DADO** una tarea sin fecha límite **CUANDO** la consulto **ENTONCES** nunca aparece como vencida.

## Huecos detectados (poke-holes) y preguntas al cliente
| # | Hueco | Pregunta | Respuesta |
|---|---|---|---|
| 1 | ¿Fecha o fecha y hora? | ¿Necesitáis hora de vencimiento o basta con el día? | **Basta con el día** (Laura, 2026-03-03) |
| 2 | ¿Qué zona horaria cuenta como «hoy»? | ¿Trabajáis todos en la misma zona horaria? | **Sí, todos en la oficina** (Laura, 2026-03-03) |
| 3 | Fechas imposibles o en el pasado | ¿Se puede poner una fecha límite ya pasada? | **Sí, a veces registramos tareas atrasadas** (Laura, 2026-03-03) |
| 4 | ¿Cuándo empieza a estar vencida? ¿El mismo día de su fecha? | — *No se preguntó: el equipo lo dio por obvio* | **[SUPUESTO]** una tarea cuya fecha límite es hoy ya cuenta como vencida |

## Decisiones confirmadas
- La fecha límite es una fecha de calendario (AAAA-MM-DD), opcional, y admite fechas pasadas.
- «Hoy» se calcula en la zona horaria de la oficina (`APP_TZ`).
- Una tarea `hecha` nunca está vencida; una tarea sin fecha límite tampoco.

## Supuestos no confirmados
- **[SUPUESTO]** «Vencida» = la fecha límite **se ha alcanzado** (hoy incluido). *Pendiente de validar en la demo.*

**Siguiente paso:** `/openspec-propose add-fecha-limite a partir de docs/requerimientos/REQ-002-fecha-limite.md`
