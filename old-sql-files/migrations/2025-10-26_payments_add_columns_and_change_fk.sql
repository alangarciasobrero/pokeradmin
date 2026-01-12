-- Migration: Extend payments table with payment metadata and optionally re-point FK to `users`
-- WARNING: review before running on production. Run on a backup first.

-- 1) Add new columns to record payment metadata and partial payments
ALTER TABLE `payments`
  ADD COLUMN `source` VARCHAR(50) NULL AFTER `payment_date`,
  ADD COLUMN `reference_id` INT NULL AFTER `source`,
  ADD COLUMN `paid` TINYINT(1) NOT NULL DEFAULT 0 AFTER `reference_id`,
  ADD COLUMN `paid_amount` DECIMAL(15,2) NULL DEFAULT 0 AFTER `paid`,
  ADD COLUMN `method` VARCHAR(50) NULL AFTER `paid_amount`,
  ADD COLUMN `personal_account` TINYINT(1) NULL DEFAULT NULL AFTER `method`;

-- 2) Optional: add created_at / updated_at if you want Sequelize timestamps
ALTER TABLE `payments`
  ADD COLUMN `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER `personal_account`,
  ADD COLUMN `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `createdAt`;

-- 3) Add index on payment_date for faster daily queries
-- `CREATE INDEX IF NOT EXISTS` is supported on MySQL 8+, but not on older servers (5.7).
-- Use a small conditional procedure to create the index only when it doesn't exist
-- This approach works on MySQL 5.7 and up.
DELIMITER $$
CREATE PROCEDURE create_index_if_not_exists()
BEGIN
  IF (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'payments'
        AND INDEX_NAME = 'idx_payments_payment_date') = 0 THEN
    ALTER TABLE `payments` ADD INDEX `idx_payments_payment_date` (`payment_date`);
  END IF;
END$$
DELIMITER ;

CALL create_index_if_not_exists();
DROP PROCEDURE IF EXISTS create_index_if_not_exists();

-- 4) If you have migrated players -> users and want `payments.user_id` to reference `users.id` instead of `players.id`:
-- Drop old FK (name may differ; adapt if needed) and add new one
-- Note: ensure `users` table contains the matching ids or migrate accordingly before adding FK.
-- ALTER TABLE `payments` DROP FOREIGN KEY `payments_ibfk_1`;
-- ALTER TABLE `payments` ADD CONSTRAINT `payments_users_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- End of migration
