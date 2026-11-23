# Tasks

## 1. Tests en rojo

- [x] 1.1 Tests de contrato de T-CREAR-5, T-CREAR-6, T-EDITAR-4 y T-VENC-1 a T-VENC-4 (verificación: fallan porque falta `fechaLimite`/`vencida`)

## 2. Datos y validación

- [ ] 2.1 Migración `002_fecha_limite.sql` (verificación: las tareas de v0.1.0 siguen leyéndose con `fechaLimite` null)
- [ ] 2.2 `fechaLimite` en los esquemas zod de crear y modificar (verificación: T-CREAR-6 en verde)

## 3. Regla y API

- [ ] 3.1 Repositorio: leer y guardar `fecha_limite` (verificación: T-CREAR-5 y T-EDITAR-4 en verde)
- [ ] 3.2 Servicio: regla `vencida` con el reloj inyectado (verificación: T-VENC-1 a T-VENC-4 en verde)
- [ ] 3.3 `openapi.yaml` con `fechaLimite` y `vencida` (verificación: revisión en el PR)

## 4. Web y cierre

- [ ] 4.1 Campo de fecha en el formulario y etiqueta «Vencida» en la lista (verificación: demo en el navegador)
- [ ] 4.2 `npm run check` en verde
