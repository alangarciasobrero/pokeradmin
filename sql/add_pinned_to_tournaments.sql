-- Agregar campo pinned a torneos para marcar torneos destacados en dashboard
ALTER TABLE tournaments
ADD COLUMN pinned TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Torneo destacado en dashboard principal';

-- Crear índice para búsquedas rápidas de torneos pinneados
CREATE INDEX idx_tournaments_pinned ON tournaments(pinned);
