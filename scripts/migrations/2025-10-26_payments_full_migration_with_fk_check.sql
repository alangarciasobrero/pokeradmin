-- Full migration for `payments` table (idempotent/checks)
-- WARNING: Review and BACKUP your database before running on production.
-- This script will:
--  - add missing columns used by the application (only if they don't exist)
--  - add createdAt/updatedAt (only if missing)
--  - create an index on payment_date if missing
--  - check for orphan payments.user_id entries (payments with no matching users) and abort if any found
--  - drop the existing FK on payments.user_id (if any) and add a FK pointing to users(id)

-- Run in MySQL Workbench by pasting the whole file into the SQL editor and executing.

DELIMITER $$
CREATE PROCEDURE migrate_payments_table()
BEGIN
  DECLARE col_count INT DEFAULT 0;
  DECLARE orphan_count INT DEFAULT 0;
  DECLARE existing_fk VARCHAR(255) DEFAULT NULL;
  DECLARE fk_exists INT DEFAULT 0;

  -- 1) Add columns only if they don't exist
  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'source';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `source` VARCHAR(50) NULL AFTER `payment_date`;
  END IF;

  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'reference_id';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `reference_id` INT NULL AFTER `source`;
  END IF;

  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'paid';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `paid` TINYINT(1) NOT NULL DEFAULT 0 AFTER `reference_id`;
  END IF;

  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'paid_amount';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `paid_amount` DECIMAL(15,2) NULL DEFAULT 0 AFTER `paid`;
  END IF;

  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'method';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `method` VARCHAR(50) NULL AFTER `paid_amount`;
  END IF;

  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'personal_account';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `personal_account` TINYINT(1) NULL DEFAULT NULL AFTER `method`;
  END IF;

  -- timestamps
  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'createdAt';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER `personal_account`;
  END IF;

  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'updatedAt';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD COLUMN `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `createdAt`;
  END IF;

  -- 2) Create index on payment_date if not exists
  SELECT COUNT(*) INTO col_count FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_payments_payment_date';
  IF col_count = 0 THEN
    ALTER TABLE `payments` ADD INDEX `idx_payments_payment_date` (`payment_date`);
  END IF;

  -- 3) Check for orphan payments (payments.user_id not present in users.id)
  SELECT COUNT(*) INTO orphan_count
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE u.id IS NULL;

  IF orphan_count > 0 THEN
    -- Abort with a clear message so you can inspect/fix orphans first.
    SET @migration_msg = CONCAT('Aborting migration: found ', orphan_count, ' payments.user_id entries with no matching users. Fix or migrate these before changing FK.');
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @migration_msg;
  END IF;

  -- 4) Drop existing FK on payments.user_id if any
  SELECT CONSTRAINT_NAME INTO existing_fk
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'user_id' AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1;

  IF existing_fk IS NOT NULL THEN
    SET @drop_sql = CONCAT('ALTER TABLE `payments` DROP FOREIGN KEY `', existing_fk, '`');
    PREPARE stmt FROM @drop_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
  END IF;

  -- 5) Add FK to users if not already present
  SELECT COUNT(*) INTO fk_exists
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND CONSTRAINT_NAME = 'payments_users_fk' AND CONSTRAINT_TYPE = 'FOREIGN KEY';

  IF fk_exists = 0 THEN
    SET @add_sql = 'ALTER TABLE `payments` ADD CONSTRAINT `payments_users_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE';
    PREPARE stmt2 FROM @add_sql; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;
  END IF;

END$$
DELIMITER ;

-- Execute the procedure
CALL migrate_payments_table();

-- Cleanup
DROP PROCEDURE IF EXISTS migrate_payments_table;

--
-- ROLLBACK / notes:
-- The safest rollback is to restore from a backup.
-- If you only want to revert the FK change (and players table still exists), you can run:
-- ALTER TABLE `payments` DROP FOREIGN KEY `payments_users_fk`;
-- ALTER TABLE `payments` ADD CONSTRAINT `payments_players_fk` FOREIGN KEY (`user_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- If you need help migrating orphan user ids to actual users before re-running this script, tell me and I can generate mapping SQL.
