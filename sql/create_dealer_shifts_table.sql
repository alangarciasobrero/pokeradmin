CREATE TABLE IF NOT EXISTS `dealer_shifts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cash_game_id` INT NOT NULL,
  `outgoing_dealer` VARCHAR(100) NOT NULL COMMENT 'Dealer que termina el turno',
  `incoming_dealer` VARCHAR(100) NOT NULL COMMENT 'Dealer que comienza el turno',
  `shift_start` DATETIME NOT NULL COMMENT 'Inicio del turno',
  `shift_end` DATETIME NOT NULL COMMENT 'Fin del turno',
  `commission` DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Comisión generada en el turno',
  `tips` DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Propinas recibidas en el turno',
  `recorded_by` VARCHAR(50) NULL COMMENT 'Usuario que registró el cambio',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cash_game` (`cash_game_id`),
  KEY `idx_outgoing_dealer` (`outgoing_dealer`),
  KEY `idx_incoming_dealer` (`incoming_dealer`),
  CONSTRAINT `fk_dealer_shifts_cash_game` FOREIGN KEY (`cash_game_id`) REFERENCES `cash_games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historial de cambios de turno de dealers en mesas cash';
