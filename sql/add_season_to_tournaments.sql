-- Agregar campo season_id a torneos para vincular con temporadas
-- Las temporadas son: Pica, Diamante, Corazón, Trébol

ALTER TABLE tournaments
ADD COLUMN season_id INT UNSIGNED NULL COMMENT 'ID de la temporada (seasons table)';

ALTER TABLE tournaments
ADD CONSTRAINT fk_tournaments_season FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL;

-- Crear índice para búsquedas rápidas por temporada
CREATE INDEX idx_tournaments_season ON tournaments(season_id);
