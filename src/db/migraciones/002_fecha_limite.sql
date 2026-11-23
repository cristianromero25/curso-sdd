-- REQ-002: fecha límite opcional. Nullable: las tareas existentes quedan sin fecha límite.
ALTER TABLE tareas ADD COLUMN fecha_limite TEXT
  CHECK (fecha_limite IS NULL OR fecha_limite GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]');
