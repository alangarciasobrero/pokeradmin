-- Migration: rename legacy player_id / jugador_id columns to user_id
-- Date: 2025-10-26
-- IMPORTANT: run a DB backup before applying. Example:
-- mysqldump -u <user> -p --databases pokeradmin > pokeradmin-before-rename.sql

-- This script is conservative: it disables foreign key checks to perform the renames,
-- then re-enables them. Adding FK constraints to `users(id)` is optional and should be
-- performed only after you verify the mapped user_ids are correct.

SET FOREIGN_KEY_CHECKS=0;

-- Rename columns in tables that use player_id
ALTER TABLE results CHANGE COLUMN player_id user_id INT NULL;
ALTER TABLE registrations CHANGE COLUMN player_id user_id INT NULL;
ALTER TABLE historical_points CHANGE COLUMN player_id user_id INT NULL;
ALTER TABLE payments CHANGE COLUMN player_id user_id INT NULL;

-- ranking_history uses column named jugador_id (spanish) -> rename to user_id
ALTER TABLE ranking_history CHANGE COLUMN jugador_id user_id INT NULL;

-- If you also want to drop the players table (optional, do after verifying no data needed):
-- DROP TABLE IF EXISTS players;

SET FOREIGN_KEY_CHECKS=1;

-- Optional: after verifying that user_id values point to real users (or after remapping),
-- add FK constraints (run only when safe):
-- ALTER TABLE results ADD INDEX idx_results_user_id (user_id);
-- ALTER TABLE results ADD CONSTRAINT fk_results_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE registrations ADD INDEX idx_registrations_user_id (user_id);
-- ALTER TABLE registrations ADD CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE historical_points ADD INDEX idx_historical_user_id (user_id);
-- ALTER TABLE payments ADD INDEX idx_payments_user_id (user_id);
-- ALTER TABLE ranking_history ADD INDEX idx_ranking_user_id (user_id);

-- NOTE: If you later want to make user_id NOT NULL, ensure you have migrated/created users rows for any existing values.
