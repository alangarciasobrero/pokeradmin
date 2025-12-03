-- Tabla para configurar destinos de comisiones
CREATE TABLE IF NOT EXISTS commission_destinations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Nombre del destino (Casa, Copa Don Humberto, etc)',
    type ENUM('house', 'season_ranking', 'special_tournament') NOT NULL COMMENT 'Tipo de destino',
    season_id INT UNSIGNED NULL COMMENT 'ID de temporada si type=season_ranking',
    tournament_id INT UNSIGNED NULL COMMENT 'ID de torneo especial si type=special_tournament',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para configurar porcentajes de comisión por destino
CREATE TABLE IF NOT EXISTS commission_config (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    destination_id INT UNSIGNED NOT NULL,
    percentage DECIMAL(5,2) NOT NULL COMMENT 'Porcentaje de comisión (0-100)',
    priority INT DEFAULT 0 COMMENT 'Orden de aplicación',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES commission_destinations(id) ON DELETE CASCADE,
    INDEX idx_destination (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para registrar comisiones acumuladas
CREATE TABLE IF NOT EXISTS accumulated_commissions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    destination_id INT UNSIGNED NOT NULL,
    tournament_id INT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    percentage_applied DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES commission_destinations(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    INDEX idx_destination (destination_id),
    INDEX idx_tournament (tournament_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar destinos por defecto
INSERT INTO commission_destinations (name, type) VALUES 
('Casa', 'house'),
('Ranking General', 'season_ranking'),
('Copa Don Humberto', 'special_tournament');
