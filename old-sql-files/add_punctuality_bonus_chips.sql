-- Agregar campo de fichas extras por puntualidad a la tabla tournaments
-- Este campo permite configurar cuántas fichas extras se dan a los jugadores que llegan puntuales

ALTER TABLE tournaments
ADD COLUMN IF NOT EXISTS punctuality_bonus_chips INT DEFAULT 0 COMMENT 'Fichas extras otorgadas por llegar puntual';
