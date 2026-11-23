import express from 'express';
import { join } from 'node:path';
import { abrirBD, type BD } from './db/conexion.js';
import { manejarErrores } from './http/errores.js';
import { rutasTareas } from './tareas/rutas.js';

/** Fecha de hoy (AAAA-MM-DD) en la zona horaria APP_TZ, o la del sistema si no está definida. */
export function hoyEnZona(zona = process.env.APP_TZ): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: zona }).format(new Date());
}

export interface Dependencias {
  bd?: BD;
  /** Reloj inyectable: en los tests se fija una fecha. */
  hoy?: () => string;
}

export function crearApp({ bd = abrirBD(), hoy = () => hoyEnZona() }: Dependencias = {}) {
  const app = express();
  app.use(express.json());
  app.use('/api/tareas', rutasTareas(bd, hoy));
  app.use(express.static(join(process.cwd(), 'public')));
  app.use(manejarErrores);
  return app;
}
