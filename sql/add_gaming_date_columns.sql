-- Agregar columna gaming_date a las tablas principales
-- Gaming date: fecha de la jornada de juego (eventos antes de 12 PM pertenecen al día anterior)

-- Tabla tournaments
ALTER TABLE tournaments 
ADD COLUMN gaming_date DATE NULL AFTER start_date,
ADD INDEX idx_gaming_date (gaming_date);

-- Tabla cash_games
ALTER TABLE cash_games 
ADD COLUMN gaming_date DATE NULL AFTER start_datetime,
ADD INDEX idx_cash_gaming_date (gaming_date);

-- Tabla payments (útil para reportes diarios)
-- NOTA: Comentado - implementar cuando sea necesario
-- ALTER TABLE payments 
-- ADD COLUMN gaming_date DATE NULL AFTER payment_date,
-- ADD INDEX idx_payment_gaming_date (gaming_date);

-- Tabla commissions (para reportes de comisiones por jornada)
-- NOTA: La tabla es accumulated_commissions, implementar cuando sea necesario
-- ALTER TABLE accumulated_commissions 
-- ADD COLUMN gaming_date DATE NULL,
-- ADD INDEX idx_commission_gaming_date (gaming_date);

-- Actualizar gaming_date para registros existentes
-- Tournaments: si hora < 12, gaming_date = fecha - 1 día
UPDATE tournaments 
SET gaming_date = DATE(
  CASE 
    WHEN HOUR(start_date) < 12 THEN DATE_SUB(start_date, INTERVAL 1 DAY)
    ELSE start_date
  END
)
WHERE gaming_date IS NULL;

-- Cash games
UPDATE cash_games 
SET gaming_date = DATE(
  CASE 
    WHEN HOUR(start_datetime) < 12 THEN DATE_SUB(start_datetime, INTERVAL 1 DAY)
    ELSE start_datetime
  END
)
WHERE gaming_date IS NULL;

-- Payments
-- UPDATE payments 
-- SET gaming_date = DATE(
--   CASE 
--     WHEN HOUR(payment_date) < 12 THEN DATE_SUB(payment_date, INTERVAL 1 DAY)
--     ELSE payment_date
--   END
-- )
-- WHERE gaming_date IS NULL;

-- Commissions
-- UPDATE accumulated_commissions 
-- SET gaming_date = DATE(
--   CASE 
--     WHEN HOUR(commission_date) < 12 THEN DATE_SUB(commission_date, INTERVAL 1 DAY)
--     ELSE commission_date
--   END
-- )
-- WHERE gaming_date IS NULL;

-- Hacer NOT NULL después de popular los datos (opcional, comentado por seguridad)
-- ALTER TABLE tournaments MODIFY gaming_date DATE NOT NULL;
-- ALTER TABLE cash_games MODIFY gaming_date DATE NOT NULL;
-- ALTER TABLE payments MODIFY gaming_date DATE NOT NULL;
-- ALTER TABLE commissions MODIFY gaming_date DATE NOT NULL;
