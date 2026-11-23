# Tasks

## 1. Base del proyecto

- [x] 1.1 Migración `001_crear_tareas.sql` y conexión con migrador (verificación: la tabla existe al arrancar con `:memory:`)
- [x] 1.2 `crearApp({ bd, hoy })` con manejo de errores 400/404/422 (verificación: `npm run typecheck` sin errores)

## 2. Tests de contrato en rojo

- [x] 2.1 Un test por scenario de la spec con su id en el nombre (verificación: `npm test` falla por rutas inexistentes, no por errores de sintaxis)
- [x] 2.2 `npm run trazabilidad` muestra los 14 scenarios cubiertos

## 3. Implementación

- [ ] 3.1 Esquemas zod de crear y modificar (verificación: T-CREAR-2, T-CREAR-3, T-CREAR-4 y T-EDITAR-3 en verde)
- [ ] 3.2 Repositorio SQL y servicio (verificación: T-LISTAR-*, T-VER-*, T-BORRAR-* en verde)
- [ ] 3.3 Rutas `/api/tareas` (verificación: todos los tests en verde)
- [ ] 3.4 Página web mínima en `public/index.html` (verificación: crear, cambiar estado y borrar desde el navegador)
- [ ] 3.5 Contrato `openapi.yaml` con los cinco endpoints

## 4. Cierre

- [ ] 4.1 `npm run check` en verde
