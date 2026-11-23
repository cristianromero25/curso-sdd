---
name: gestionar-rechazo
description: Analiza un rechazo del cliente (docs/revisiones/REV-xxx.md), clasifica cada punto (bug, hueco de la spec, cambio de requisito o malentendido) y prepara la corrección por la spec, un change por intención. Usar cuando el cliente no acepta una entrega.
---
# Gestionar un rechazo del cliente

Entrada: la ruta del rechazo, p. ej. `docs/revisiones/REV-002-rechazo.md`.

1. **Lee** el rechazo, el requerimiento original que cita, la spec viva y los tests de esa capability.
2. **Clasifica cada punto del rechazo** y escríbelo en la sección `## Análisis` del REV:
   - **Bug**: la spec ya decía lo que el cliente pide y el código no lo cumple → solo cambio de código + test. Sin change.
   - **Hueco de la spec**: la spec era ambigua o le faltaba un scenario → change `fix-…` con delta **MODIFIED** que define el término y añade el scenario que faltaba.
   - **Cambio de requisito**: el cliente pide algo distinto de lo que aprobó → change nuevo (`change-…`); avisa de que es alcance nuevo (afecta a plazo o presupuesto).
   - **Malentendido**: el sistema hace lo acordado y el cliente lo interpretó de otra forma → no se toca código; se aclara con el cliente y, si hace falta, se mejora la documentación.
3. **Un change por intención**: propón un change por cada hueco o cambio de requisito (`/openspec-propose fix-<slug>` o `/openspec-propose change-<slug>` a partir del REV). Un bug no necesita change: ve directo al paso 4.
4. **Spec primero, después el rojo**: con el scenario nuevo ya en el delta, escribe el test de contrato con su id y comprueba que **falla hoy** por la razón que describe el cliente. Enséñale el rojo al usuario antes de arreglar nada.
5. Implementa, `npm run check`, archiva y anota la versión en el CHANGELOG (bug o hueco → PATCH; cambio de requisito → MINOR o MAJOR si rompe el contrato).
6. Tras la demo con el cliente, redacta `docs/revisiones/ACEPTACION-xxx.md` con: qué se corrigió, evidencia (tests y demo sobre los mismos datos del rechazo) y la aprobación del cliente.

No cierres el rechazo sin la aprobación explícita del cliente registrada en el acta.
