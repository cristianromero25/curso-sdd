CREATE TABLE tareas (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo         TEXT    NOT NULL CHECK (length(titulo) BETWEEN 1 AND 120),
  descripcion    TEXT             CHECK (descripcion IS NULL OR length(descripcion) <= 1000),
  estado         TEXT    NOT NULL DEFAULT 'pendiente'
                         CHECK (estado IN ('pendiente', 'en_curso', 'hecha')),
  creada_en      TEXT    NOT NULL,
  actualizada_en TEXT    NOT NULL
);
