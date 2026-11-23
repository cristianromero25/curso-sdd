---
name: nuevo-requerimiento
description: Convierte una petición del cliente (docs/requerimientos/REQ-xxx.md) en una historia con criterios de aceptación revisados y deja todo listo para /openspec-propose. Usar cuando llega un requerimiento nuevo.
---
# Nuevo requerimiento → historia → change

Entrada: la ruta del requerimiento, p. ej. `docs/requerimientos/REQ-002-fecha-limite.md`.

1. **Lee** el requerimiento, `docs/prd.md` y la spec viva afectada (`openspec list --specs`, `openspec show <capability>`).
2. **Clasifica**: ¿capacidad nueva, cambio de un requisito existente o solo implementación? Si no cambia ningún comportamiento observable, dilo y propón delegación directa (sin change).
3. **Escribe la historia** en el mismo archivo, sección `## Historia`: «Como … quiero … para …» y criterios **DADO / CUANDO / ENTONCES** en lenguaje de negocio (sin endpoints ni códigos HTTP).
4. **Busca huecos (poke-holes)**: lista casos límite, palabras ambiguas («hoy», «vencida», «reciente»…) y supuestos. Para cada palabra ambigua, propón una definición concreta.
5. **Para y pregunta**: enseña al usuario las preguntas abiertas para que las confirme con el cliente. No sigas hasta tener las respuestas.
6. Con las respuestas, completa la sección `## Decisiones confirmadas` del requerimiento y propón el nombre del change en kebab-case (`add-…`, `change-…`, `fix-…`).
7. Indica el siguiente paso: `/openspec-propose <nombre> a partir de docs/requerimientos/REQ-xxx.md`.

No escribas código ni artefactos de OpenSpec en esta skill.
