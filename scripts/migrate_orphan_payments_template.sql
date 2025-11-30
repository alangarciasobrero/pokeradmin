-- Template SQL to help remap orphan payments (manual step)
-- WARNING: This is a template. Review and adapt before running in production.
-- Strategy options (pick one):
-- 1) If orphan user_id correspond to players.id and players.user_id points to users.id, you can map payments.user_id -> players.user_id
-- 2) If you have an external mapping CSV, generate UPDATE statements and run them in a transaction.

-- Example (strategy 1): map payments.user_id from players.id -> users.id using players.user_id
-- Note: verify the mapping query below returns expected rows before executing the UPDATE.

SELECT p.id AS payment_id, p.user_id AS old_player_id, pl.user_id AS mapped_user_id
FROM payments p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN players pl ON p.user_id = pl.id
WHERE u.id IS NULL AND pl.user_id IS NOT NULL
LIMIT 100;

-- If the mapping looks correct, run the update in small batches (example):
-- START TRANSACTION;
-- UPDATE payments p
-- JOIN players pl ON p.user_id = pl.id
-- SET p.user_id = pl.user_id
-- WHERE p.user_id = pl.id
-- LIMIT 1000;
-- COMMIT;

-- Alternate: generate per-row UPDATE statements (safe, review each):
-- SELECT CONCAT('UPDATE payments SET user_id = ', pl.user_id, ' WHERE id = ', p.id, ';') AS stmt
-- FROM payments p
-- JOIN players pl ON p.user_id = pl.id
-- LEFT JOIN users u ON pl.user_id = u.id
-- WHERE u.id IS NOT NULL
-- LIMIT 1000;

-- After mapping orphans, re-run the migration that adds the FK.
