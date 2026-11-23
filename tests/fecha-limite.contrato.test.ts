/**
 * Tests de contrato de la fecha límite y de «vencida» (REQ-002).
 * El reloj está fijado: HOY = 2026-03-10.
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

describe('Requirement: Crear una tarea (fecha límite)', () => {
  it('[T-CREAR-5] con fecha límite → 201 y la guarda', async () => {
    const res = await crear({ titulo: 'Renovar certificado', fechaLimite: '2026-04-15' });
    expect(res.status).toBe(201);
    expect(res.body.fechaLimite).toBe('2026-04-15');
  });

  it('[T-CREAR-6] fecha imposible → 422 y no crea nada', async () => {
    const res = await crear({ titulo: 'Fecha mala', fechaLimite: '2026-02-30' });
    expect(res.status).toBe(422);
    expect(res.body.detalles).toContainEqual(expect.objectContaining({ campo: 'fechaLimite' }));
    expect((await api.get('/api/tareas')).body).toEqual([]);
  });
});

describe('Requirement: Modificar una tarea (fecha límite)', () => {
  it('[T-EDITAR-4] enviar fechaLimite null la quita', async () => {
    const { body: creada } = await crear({ titulo: 'Con fecha', fechaLimite: '2026-04-15' });
    const res = await api.patch(`/api/tareas/${creada.id}`).send({ fechaLimite: null });
    expect(res.status).toBe(200);
    expect(res.body.fechaLimite).toBeNull();
  });
});

describe('Requirement: Tarea vencida', () => {
  it('[T-VENC-1] fecha pasada y pendiente → vencida', async () => {
    const { body } = await crear({ titulo: 'Atrasada', fechaLimite: '2026-03-09' });
    expect(body.vencida).toBe(true);
  });

  it('[T-VENC-2] fecha pasada pero hecha → no vencida', async () => {
    const { body } = await crear({
      titulo: 'Hecha tarde',
      estado: 'hecha',
      fechaLimite: '2026-03-09',
    });
    expect(body.vencida).toBe(false);
  });

  it('[T-VENC-3] sin fecha límite → no vencida', async () => {
    const { body } = await crear({ titulo: 'Sin fecha' });
    expect(body.vencida).toBe(false);
  });

  it('[T-VENC-4] fecha futura → no vencida', async () => {
    const { body } = await crear({ titulo: 'A tiempo', fechaLimite: '2026-03-11' });
    expect(body.vencida).toBe(false);
  });
});
