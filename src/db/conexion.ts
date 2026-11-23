import Database from 'better-sqlite3';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type BD = Database.Database;

const CARPETA_MIGRACIONES = join(dirname(fileURLToPath(import.meta.url)), 'migraciones');

/** Abre la base de datos y aplica las migraciones pendientes. `:memory:` para los tests. */
export function abrirBD(ruta = process.env.DB_PATH ?? 'data/tareas.db'): BD {
  if (ruta !== ':memory:') mkdirSync(dirname(ruta), { recursive: true });
  const bd = new Database(ruta);
  migrar(bd);
  return bd;
}

/** Aplica, en orden y una sola vez, cada archivo NNN_*.sql de src/db/migraciones. */
export function migrar(bd: BD): void {
  bd.exec(
    'CREATE TABLE IF NOT EXISTS migraciones (nombre TEXT PRIMARY KEY, aplicada_en TEXT NOT NULL)',
  );
  const aplicadas = new Set(
    (bd.prepare('SELECT nombre FROM migraciones').all() as { nombre: string }[]).map(
      (m) => m.nombre,
    ),
  );
  const pendientes = readdirSync(CARPETA_MIGRACIONES)
    .filter((f) => f.endsWith('.sql') && !aplicadas.has(f))
    .sort();
  for (const archivo of pendientes) {
    bd.transaction(() => {
      bd.exec(readFileSync(join(CARPETA_MIGRACIONES, archivo), 'utf8'));
      bd.prepare('INSERT INTO migraciones (nombre, aplicada_en) VALUES (?, ?)').run(
        archivo,
        new Date().toISOString(),
      );
    })();
  }
}
