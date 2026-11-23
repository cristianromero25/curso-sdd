/**
 * Tests de contrato de la capability `tareas`.
 * Cada `it` lleva el id del Scenario que comprueba (ver openspec/specs/tareas/spec.md).
 * BD en memoria y reloj fijo: cada test empieza de cero y es determinista.
 */
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../src/app.js';
import { abrirBD } from '../src/db/conexion.js';

const HOY = '2026-03-10';
let api: ReturnType<typeof request>;

beforeEach(() => {
  api = request(crearApp({ bd: abrirBD(':memory:'), hoy: () => HOY }));
});

const crear = (datos: object) => api.post('/api/tareas').send(datos);

describe('Requirement: Crear una tarea', () => {
  it('[T-CREAR-1] título válido → 201 con id y estado pendiente', async () => {
    const res = await crear({ titulo: 'Revisar incidencia 4521' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ titulo: 'Revisar incidencia 4521', estado: 'pendiente' });
    expect(res.body.id).toEqual(expect.any(Number));
  });

  it('[T-CREAR-2] título vacío → 422 y no crea nada', async () => {
    const res = await crear({ titulo: '   ' });
    expect(res.status).toBe(422);
    expect(res.body.detalles).toContainEqual(expect.objectContaining({ campo: 'titulo' }));
    expect((await api.get('/api/tareas')).body).toEqual([]);
  });

  it('[T-CREAR-3] título de 121 caracteres → 422 y no crea nada', async () => {
    const res = await crear({ titulo: 'x'.repeat(121) });
    expect(res.status).toBe(422);
    expect(res.body.detalles).toContainEqual(expect.objectContaining({ campo: 'titulo' }));
    expect((await api.get('/api/tareas')).body).toEqual([]);
  });

  it('[T-CREAR-4] estado no permitido → 422', async () => {
    const res = await crear({ titulo: 'Llamar a proveedor', estado: 'terminada' });
    expect(res.status).toBe(422);
    expect(res.body.detalles).toContainEqual(expect.objectContaining({ campo: 'estado' }));
  });
});

describe('Requirement: Listar las tareas', () => {
  it('[T-LISTAR-1] devuelve las tareas en orden de creación', async () => {
    await crear({ titulo: 'A' });
    await crear({ titulo: 'B' });
    const res = await api.get('/api/tareas');
    expect(res.status).toBe(200);
    expect(res.body.map((t: { titulo: string }) => t.titulo)).toEqual(['A', 'B']);
  });

  it('[T-LISTAR-2] sin tareas → lista vacía', async () => {
    const res = await api.get('/api/tareas');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Requirement: Consultar una tarea', () => {
  it('[T-VER-1] tarea existente → 200 con sus datos', async () => {
    const { body: creada } = await crear({
      titulo: 'Actualizar FAQ',
      descripcion: 'Sección de envíos',
    });
    const res = await api.get(`/api/tareas/${creada.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: creada.id,
      titulo: 'Actualizar FAQ',
      descripcion: 'Sección de envíos',
    });
  });

  it('[T-VER-2] id inexistente o no numérico → 404 con mensaje', async () => {
    for (const id of ['999', 'abc']) {
      const res = await api.get(`/api/tareas/${id}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toEqual(expect.any(String));
    }
  });
});

describe('Requirement: Modificar una tarea', () => {
  it('[T-EDITAR-1] cambia el estado y conserva el resto', async () => {
    const { body: creada } = await crear({ titulo: 'Responder ticket 88' });
    const res = await api.patch(`/api/tareas/${creada.id}`).send({ estado: 'en_curso' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ estado: 'en_curso', titulo: 'Responder ticket 88' });
  });

  it('[T-EDITAR-2] tarea inexistente → 404', async () => {
    const res = await api.patch('/api/tareas/999').send({ estado: 'hecha' });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(expect.any(String));
  });

  it('[T-EDITAR-3] título vacío → 422 y la tarea no cambia', async () => {
    const { body: creada } = await crear({ titulo: 'Original' });
    const res = await api.patch(`/api/tareas/${creada.id}`).send({ titulo: '' });
    expect(res.status).toBe(422);
    expect((await api.get(`/api/tareas/${creada.id}`)).body.titulo).toBe('Original');
  });
});

describe('Requirement: Borrar una tarea', () => {
  it('[T-BORRAR-1] borra y después responde 404 al consultarla', async () => {
    const { body: creada } = await crear({ titulo: 'Temporal' });
    expect((await api.delete(`/api/tareas/${creada.id}`)).status).toBe(204);
    expect((await api.get(`/api/tareas/${creada.id}`)).status).toBe(404);
  });

  it('[T-BORRAR-2] tarea inexistente → 404', async () => {
    const res = await api.delete('/api/tareas/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(expect.any(String));
  });
});

describe('Requirement: Errores con formato común', () => {
  it('[T-ERROR-1] JSON mal formado → 400 con mensaje', async () => {
    const res = await api
      .post('/api/tareas')
      .set('Content-Type', 'application/json')
      .send('{"titulo": ');
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(expect.any(String));
  });
});
