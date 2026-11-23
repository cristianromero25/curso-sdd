# PRD mínimo — Gestor de tareas del equipo de soporte (MVP)

> Elaborado a partir de `docs/brief-cliente.md` con la IA como *product partner escéptico*
> (preguntas de discovery → respuestas del cliente → este documento). Dice **qué**, no **cómo**.
> Lo marcado como **[SUPUESTO]** no lo ha confirmado el cliente.

## 1. Problema
El equipo de soporte (6 personas) gestiona sus tareas en una hoja de cálculo compartida: se pierden tareas,
se sobrescriben filas y no se sabe en qué estado está cada una.

## 2. Usuarios
- **Agente de soporte**: crea, consulta y actualiza tareas.
- **Sistemas internos**: consumen la misma información por API.

## 3. Alcance del MVP
**Dentro**
- RF-01 Crear una tarea con título (obligatorio, máx. 120 caracteres) y descripción opcional.
- RF-02 Listar todas las tareas.
- RF-03 Consultar una tarea concreta.
- RF-04 Cambiar el estado de una tarea (`pendiente`, `en_curso`, `hecha`) y corregir sus datos.
- RF-05 Borrar una tarea.

**Fuera (de momento)**
- Usuarios, inicio de sesión y permisos **[SUPUESTO: red interna de la oficina]**.
- Fechas límite, avisos y notificaciones (el cliente los anuncia para más adelante).
- Asignar tareas a personas.

## 4. Requisitos no funcionales
- API REST con JSON; la web consume la misma API.
- Respuestas de error claras y consistentes (código HTTP + mensaje en español).
- Arranque en local con un solo comando; sin servidor de base de datos que instalar.

## 5. Métricas de éxito
- El equipo deja de usar la hoja de cálculo en 2 semanas.
- Cero tareas «perdidas» reportadas en el primer mes.

## 6. Puntos abiertos
- ¿Hace falta historial de cambios de cada tarea? → fuera del MVP, se revisará tras el primer mes.
