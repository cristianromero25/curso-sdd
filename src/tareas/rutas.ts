import { Router } from 'express';
import type { BD } from '../db/conexion.js';

/** Esqueleto: las rutas se implementan en la tarea 3.3 del change crud-tareas. */
export function rutasTareas(_bd: BD, _hoy: () => string): Router {
  return Router();
}
