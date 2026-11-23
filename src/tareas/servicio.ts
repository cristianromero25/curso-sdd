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
  creadaEn: string;
  actualizadaEn: string;
}

/** Reglas de negocio de la capability `tareas`. `hoy` es el reloj inyectado (AAAA-MM-DD). */
export function servicioTareas(bd: BD, _hoy: () => string) {
  const repo = repositorioTareas(bd);

  const aTarea = (f: FilaTarea): Tarea => ({
    id: f.id,
    titulo: f.titulo,
    descripcion: f.descripcion,
    estado: f.estado,
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
