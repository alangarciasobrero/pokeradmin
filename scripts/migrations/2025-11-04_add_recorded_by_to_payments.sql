-- Add structured recorded_by columns to payments and backfill from existing method audit tags
-- Safe, idempotent migration: adds nullable columns and attempts a best-effort backfill from method text
-- Review before running on production and run on a backup first.

ALTER TABLE `payments`
  ADD COLUMN IF NOT EXISTS `recorded_by_name` VARCHAR(150) NULL AFTER `personal_account`;

-- Backfill recorded_by_name from method if present in the format: "...|by:username:id"
-- recorded_by_name will get the username portion; recorded_by_id will get the trailing numeric id when available.
UPDATE `payments`
SET recorded_by_name = (
  CASE
    WHEN method LIKE '%|by:%' THEN SUBSTRING_INDEX(SUBSTRING_INDEX(method, '|by:', -1), ':', 1)
    ELSE recorded_by_name
  END
)
WHERE method LIKE '%|by:%';

-- Note: we intentionally do not attempt to extract a numeric recorded_by_id; only record the username as recorded_by_name

-- Notes:
--  - This migration only adds a nullable `recorded_by_name`; no FK is created to avoid failing on orphaned user ids.
--  - After validating backfill, you can add an index: CREATE INDEX idx_payments_recorded_by_name ON payments(recorded_by_name);
--  - If you later want to reconcile recorded_by_name to actual users, do a separate mapping/backfill step and then consider adding an id FK.

-- End of migration
