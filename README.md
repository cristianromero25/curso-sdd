# tareas-app — proyecto de práctica del curso «SDD en la práctica»

Una API REST de **tareas** (con una página web mínima) construida con **Spec-Driven Development**:
primero se escribe la especificación, después los tests que la comprueban y por último el código.

| | |
|---|---|
| Stack | Node.js 22 · TypeScript · Express · SQLite (better-sqlite3) · zod |
| Tests | Vitest + Supertest (tests de contrato HTTP contra una BD SQLite en memoria) |
| Specs | OpenSpec (`openspec/specs/` = spec viva; `openspec/changes/` = cambios en curso) |
| Agente | Claude Code (`CLAUDE.md`, hooks y skills en `.claude/`) |

## Ramas: una por punto de partida y de llegada de cada módulo

| Rama | Qué contiene |
|---|---|
| `modulo-1/inicio` | Solo el encargo del cliente (`docs/brief-cliente.md`) y el PRD mínimo (`docs/prd.md`) |
| `modulo-1/fin` | Harness SDD configurado + spec viva `tareas` + CRUD implementado con tests en verde |
| `modulo-2/inicio` | Llega un requerimiento nuevo: `docs/requerimientos/REQ-002-fecha-limite.md` |
| `modulo-2/fin` | Requerimiento implementado mediante el change `add-fecha-limite` (ya archivado) |
| `modulo-3/inicio` | El cliente rechaza la entrega: `docs/revisiones/REV-002-rechazo.md` |
| `modulo-3/fin` | Corrección con **dos** changes, uno por intención: `fix-vencida-mismo-dia` (v0.2.1) y `change-orden-vencidas-primero` (v0.3.0) + acta de aceptación |
| `main` | Estado final del curso (= `modulo-3/fin`) |

```bash
git fetch origin "refs/heads/*:refs/heads/*" --update-head-ok   # tras clonar: todas las ramas en local
git switch modulo-1/inicio      # empieza aquí
git log --oneline modulo-1/inicio..modulo-1/fin   # qué se hizo en el módulo 1, paso a paso
```

> **Simplificaciones didácticas.** Para que la historia se lea de un tirón, los commits de cada módulo van
> directos a su rama `modulo-N/…`. En un proyecto real, cada change va en su rama `feat/…` o `fix/…` con su
> pull request y la revisión del subagente `adversarial-reviewer` (ver «Reglas de proceso» en `CLAUDE.md`).
> Las carpetas de `openspec/changes/archive/` llevan la fecha en que se generó el repositorio, no la de la
> historia del cliente (marzo de 2026).

## Puesta en marcha (desde `modulo-1/fin`)

```bash
npm install
npm run dev            # http://localhost:3000  (API en /api/tareas)
npm test               # tests de contrato
npm run check          # typecheck + tests + trazabilidad spec↔tests + validación de specs
```
