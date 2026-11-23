# Changelog

Una entrada por change de OpenSpec archivado. Versionado semántico:
**MAJOR** rompe el contrato de la API · **MINOR** añade comportamiento · **PATCH** corrige sin cambiar lo acordado.
Mientras la versión sea 0.x, este proyecto admite cambios incompatibles en una MINOR, con aviso a
integraciones (semver lo permite en el desarrollo inicial); desde 1.0.0 serán MAJOR.

## [0.2.1] — Corrección: «vencida» desde el día siguiente a la fecha límite
- Change: `openspec/changes/archive/*-fix-vencida-mismo-dia` · Origen: `docs/revisiones/REV-002-rechazo.md` (punto 1)
- Una tarea cuya fecha límite es hoy ya no aparece como vencida. Nuevo scenario de borde `[T-VENC-5]`.

## [0.2.0] — Fecha límite y tareas vencidas
- Change: `openspec/changes/archive/*-add-fecha-limite` · Origen: `docs/requerimientos/REQ-002-fecha-limite.md`
- Fecha límite opcional al crear y modificar; campo calculado `vencida`; la web marca las vencidas.
- Pendiente de validar con el cliente: el supuesto «vencida desde el mismo día de su fecha límite».

## [0.1.0] — CRUD de tareas
- Change: `openspec/changes/archive/*-crud-tareas` · Origen: `docs/prd.md` (RF-01 a RF-05)
- Crear, listar, consultar, modificar y borrar tareas por API y desde la web.
