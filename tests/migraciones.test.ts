/**
 * Las migraciones no son comportamiento de la spec, pero romperlas pierde datos del cliente:
 * se prueban partiendo del esquema de la versión anterior con datos dentro.
 */
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { migrar } from '../src/db/conexion.js';

describe('Migraciones', () => {
  it('una BD de v0.1.0 (solo 001) se actualiza sin perder tareas', () => {
    const bd = new Database(':memory:');
    bd.exec(readFileSync('src/db/migraciones/001_crear_tareas.sql', 'utf8'));
    bd.exec(`CREATE TABLE migraciones (nombre TEXT PRIMARY KEY, aplicada_en TEXT NOT NULL);
             INSERT INTO migraciones VALUES ('001_crear_tareas.sql', '2026-01-01');
             INSERT INTO tareas (titulo, estado, creada_en, actualizada_en)
             VALUES ('Tarea antigua', 'pendiente', '2026-01-01', '2026-01-01');`);

    migrar(bd);

    expect(bd.prepare('SELECT titulo, fecha_limite FROM tareas').all()).toEqual([
      { titulo: 'Tarea antigua', fecha_limite: null },
    ]);
  });

  it('aplicar las migraciones dos veces no hace nada la segunda vez', () => {
    const bd = new Database(':memory:');
    migrar(bd);
    expect(() => migrar(bd)).not.toThrow();
  });
});
