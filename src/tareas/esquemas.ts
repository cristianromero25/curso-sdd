import { z } from 'zod';

export const ESTADOS = ['pendiente', 'en_curso', 'hecha'] as const;
export type Estado = (typeof ESTADOS)[number];

const titulo = z
  .string({ required_error: 'El título es obligatorio' })
  .trim()
  .min(1, 'El título es obligatorio')
  .max(120, 'El título no puede superar 120 caracteres');

const descripcion = z.string().max(1000, 'La descripción no puede superar 1000 caracteres');

const estado = z.enum(ESTADOS, {
  errorMap: () => ({ message: `El estado debe ser uno de: ${ESTADOS.join(', ')}` }),
});

/** Fecha de calendario AAAA-MM-DD que existe de verdad (rechaza 2026-02-30). */
const fechaLimite = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha límite debe tener el formato AAAA-MM-DD')
  .refine((f) => {
    const d = new Date(`${f}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(f);
  }, 'La fecha límite no es una fecha válida');

export const esquemaCrear = z.object({
  titulo,
  descripcion: descripcion.optional(),
  estado: estado.optional(),
  fechaLimite: fechaLimite.optional(),
});

export const esquemaModificar = z.object({
  titulo: titulo.optional(),
  descripcion: descripcion.nullable().optional(),
  estado: estado.optional(),
  fechaLimite: fechaLimite.nullable().optional(),
});

export type DatosCrear = z.infer<typeof esquemaCrear>;
export type DatosModificar = z.infer<typeof esquemaModificar>;
