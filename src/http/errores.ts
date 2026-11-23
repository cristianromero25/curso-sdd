import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export class TareaNoEncontrada extends Error {
  constructor() {
    super('Tarea no encontrada');
  }
}

/** Traduce los errores a respuestas HTTP con el formato común { error, detalles? }. */
export const manejarErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Datos no válidos',
      detalles: err.issues.map((i) => ({
        campo: i.path.join('.') || '(cuerpo)',
        mensaje: i.message,
      })),
    });
    return;
  }
  if (err instanceof TareaNoEncontrada) {
    res.status(404).json({ error: err.message });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
};
