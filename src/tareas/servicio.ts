import type { BD } from '../db/conexion.js';
import { TareaNoEncontrada } from '../http/errores.js';
import type { DatosCrear, DatosModificar, Estado } from './esquemas.js';
import { repositorioTareas, type FilaTarea } from './repositorio.js';

/** Representación pública de una tarea (camelCase), la que devuelve la API. */
export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: Estado;
  fechaLimite: string | null;
  vencida: boolean;
  creadaEn: string;
  actualizadaEn: string;
}

/**
 * Regla «Tarea vencida» (spec tareas): la fecha límite es ANTERIOR a hoy y no está hecha.
 * Una tarea vence al terminar el día de su fecha límite (REV-002). Fechas AAAA-MM-DD comparadas como texto.
 */
export function estaVencida(
  fila: Pick<FilaTarea, 'fecha_limite' | 'estado'>,
  hoy: string,
): boolean {
  return fila.fecha_limite !== null && fila.fecha_limite < hoy && fila.estado !== 'hecha';
}

/** Reglas de negocio de la capability `tareas`. `hoy` es el reloj inyectado (AAAA-MM-DD). */
export function servicioTareas(bd: BD, hoy: () => string) {
  const repo = repositorioTareas(bd);

  const aTarea = (f: FilaTarea): Tarea => ({
    id: f.id,
    titulo: f.titulo,
    descripcion: f.descripcion,
    estado: f.estado,
    fechaLimite: f.fecha_limite,
    vencida: estaVencida(f, hoy()),
    creadaEn: f.creada_en,
    actualizadaEn: f.actualizada_en,
  });

  const obtenerFila = (id: number): FilaTarea => {
    const fila = Number.isInteger(id) ? repo.buscar(id) : undefined;
    if (!fila) throw new TareaNoEncontrada();
    return fila;
  };

  return {
    listar: (): Tarea[] => repo.listar().map(aTarea),
    obtener: (id: number): Tarea => aTarea(obtenerFila(id)),
    crear: (datos: DatosCrear): Tarea => aTarea(repo.crear(datos)),
    modificar(id: number, cambios: DatosModificar): Tarea {
      obtenerFila(id);
      return aTarea(repo.modificar(id, cambios)!);
    },
    borrar(id: number): void {
      obtenerFila(id);
      repo.borrar(id);
    },
  };
}
