import { Router } from 'express';
import type { BD } from '../db/conexion.js';
import { esquemaCrear, esquemaModificar } from './esquemas.js';
import { servicioTareas } from './servicio.js';

/** Solo HTTP: valida la entrada con zod, llama al servicio y responde. Sin reglas de negocio. */
export function rutasTareas(bd: BD, hoy: () => string): Router {
  const servicio = servicioTareas(bd, hoy);
  const rutas = Router();

  rutas.get('/', (_req, res) => {
    res.json(servicio.listar());
  });

  rutas.post('/', (req, res) => {
    res.status(201).json(servicio.crear(esquemaCrear.parse(req.body ?? {})));
  });

  rutas.get('/:id', (req, res) => {
    res.json(servicio.obtener(Number(req.params.id)));
  });

  rutas.patch('/:id', (req, res) => {
    res.json(servicio.modificar(Number(req.params.id), esquemaModificar.parse(req.body ?? {})));
  });

  rutas.delete('/:id', (req, res) => {
    servicio.borrar(Number(req.params.id));
    res.status(204).end();
  });

  return rutas;
}
