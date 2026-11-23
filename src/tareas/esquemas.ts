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

export const esquemaCrear = z.object({
  titulo,
  descripcion: descripcion.optional(),
  estado: estado.optional(),
});

export const esquemaModificar = z.object({
  titulo: titulo.optional(),
  descripcion: descripcion.nullable().optional(),
  estado: estado.optional(),
});

export type DatosCrear = z.infer<typeof esquemaCrear>;
export type DatosModificar = z.infer<typeof esquemaModificar>;
