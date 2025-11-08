-- Add registration_open and end_date columns to tournaments
-- Safe idempotent migration: add nullable end_date and registration_open default true
ALTER TABLE `tournaments`
  ADD COLUMN IF NOT EXISTS `registration_open` TINYINT(1) NOT NULL DEFAULT 1 AFTER `punctuality_discount`,
  ADD COLUMN IF NOT EXISTS `end_date` DATETIME NULL AFTER `registration_open`;

-- End of migration
