import type { BD } from '../db/conexion.js';
import type { DatosCrear, DatosModificar, Estado } from './esquemas.js';

/** Fila tal y como está en SQLite (snake_case). */
export interface FilaTarea {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: Estado;
  creada_en: string;
  actualizada_en: string;
}

/** Todo el SQL de la capability `tareas` vive aquí. */
export function repositorioTareas(bd: BD) {
  return {
    listar(): FilaTarea[] {
      return bd.prepare('SELECT * FROM tareas ORDER BY id').all() as FilaTarea[];
    },

    buscar(id: number): FilaTarea | undefined {
      return bd.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as FilaTarea | undefined;
    },

    crear(datos: DatosCrear): FilaTarea {
      const ahora = new Date().toISOString();
      const { lastInsertRowid } = bd
        .prepare(
          `INSERT INTO tareas (titulo, descripcion, estado, creada_en, actualizada_en)
           VALUES (@titulo, @descripcion, @estado, @ahora, @ahora)`,
        )
        .run({
          titulo: datos.titulo,
          descripcion: datos.descripcion ?? null,
          estado: datos.estado ?? 'pendiente',
          ahora,
        });
      return this.buscar(Number(lastInsertRowid))!;
    },

    modificar(id: number, cambios: DatosModificar): FilaTarea | undefined {
      const actual = this.buscar(id);
      if (!actual) return undefined;
      bd.prepare(
        `UPDATE tareas SET titulo = @titulo, descripcion = @descripcion, estado = @estado,
                actualizada_en = @ahora WHERE id = @id`,
      ).run({
        id,
        titulo: cambios.titulo ?? actual.titulo,
        descripcion: cambios.descripcion === undefined ? actual.descripcion : cambios.descripcion,
        estado: cambios.estado ?? actual.estado,
        ahora: new Date().toISOString(),
      });
      return this.buscar(id);
    },

    borrar(id: number): boolean {
      return bd.prepare('DELETE FROM tareas WHERE id = ?').run(id).changes > 0;
    },
  };
}
