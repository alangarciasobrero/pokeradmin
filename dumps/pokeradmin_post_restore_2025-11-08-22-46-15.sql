-- pokeradmin SQL dump (programmatic)
-- generated: 2025-11-08T22:46:15.563Z
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `cash_games`;
CREATE TABLE `cash_games` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `small_blind` decimal(10,2) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `total_commission` decimal(10,2) DEFAULT '0.00',
  `dealer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_tips` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `cash_participants`;
CREATE TABLE `cash_participants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cash_game_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `seat_number` int DEFAULT NULL,
  `joined_at` datetime NOT NULL,
  `left_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cash_game_id` (`cash_game_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cash_participants_ibfk_1` FOREIGN KEY (`cash_game_id`) REFERENCES `cash_games` (`id`),
  CONSTRAINT `cash_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `historical_points`;
CREATE TABLE `historical_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `season_id` int unsigned NOT NULL,
  `tournament_id` int unsigned DEFAULT NULL,
  `result_id` int unsigned DEFAULT NULL,
  `action_type` enum('attendance','reentry','final_table','placement','bonus') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`user_id`),
  KEY `season_id` (`season_id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `result_id` (`result_id`),
  CONSTRAINT `historical_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historical_points_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historical_points_ibfk_3` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `historical_points_ibfk_4` FOREIGN KEY (`result_id`) REFERENCES `results` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `historical_points` (`id`,`record_date`,`user_id`,`season_id`,`tournament_id`,`result_id`,`action_type`,`description`,`points`) VALUES
(1,'2025-09-25 00:00:00',1,1,1,NULL,'attendance','Asistencia torneo 1',100),
(2,'2025-09-25 00:00:00',2,1,1,NULL,'attendance','Asistencia torneo 1',100),
(3,'2025-09-25 00:00:00',3,1,2,NULL,'reentry','Reentry torneo 2',100),
(4,'2025-09-25 00:00:00',4,1,2,NULL,'final_table','Mesa Final torneo 2',500),
(5,'2025-09-26 00:00:00',5,1,3,NULL,'bonus','Bonus Bronce',500);

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` int unsigned DEFAULT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `paid_amount` decimal(15,2) DEFAULT '0.00',
  `method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `personal_account` tinyint(1) DEFAULT '0',
  `recorded_by_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `payments` (`id`,`user_id`,`amount`,`payment_date`,`source`,`reference_id`,`paid`,`paid_amount`,`method`,`personal_account`,`recorded_by_name`,`createdAt`,`updatedAt`) VALUES
(1,2,'80.00','2025-11-08 21:59:04','tournament',1,0,'0.00','manual|by:dev-admin:1',0,'dev-admin','2025-11-08 21:59:04','2025-11-08 21:59:04'),
(2,3,'200.00','2025-11-08 21:59:04','tournament',2,0,'125.00','manual|by:dev-admin:1',0,'dev-admin','2025-11-08 21:59:04','2025-11-08 21:59:04'),
(3,3,'50.00','2025-11-08 21:59:04','settlement',2,1,'50.00','cash|by:dev-admin:1',0,'dev-admin','2025-11-08 21:59:04','2025-11-08 21:59:04'),
(4,3,'75.00','2025-11-08 21:59:04','settlement',2,1,'75.00','card|by:dev-admin:1',0,'dev-admin','2025-11-08 21:59:04','2025-11-08 21:59:04'),
(5,4,'100.00','2025-11-08 21:59:05','tournament',3,1,'100.00',NULL,0,NULL,'2025-11-08 21:59:05','2025-11-08 21:59:05'),
(6,4,'100.00','2025-11-08 21:59:05','tournament',4,1,'100.00',NULL,0,NULL,'2025-11-08 21:59:05','2025-11-08 21:59:05'),
(7,4,'150.00','2025-11-08 21:59:05','personal_debt',NULL,1,'150.00',NULL,1,NULL,'2025-11-08 21:59:05','2025-11-08 21:59:06'),
(8,4,'100.00','2025-11-08 21:59:05','settlement',5,1,'100.00','efectivo|idemp:test-1|by:admin',0,'admin','2025-11-08 21:59:05','2025-11-08 21:59:05'),
(9,4,'50.00','2025-11-08 21:59:05','settlement',6,1,'50.00','efectivo|idemp:test-1|by:admin',0,'admin','2025-11-08 21:59:05','2025-11-08 21:59:05'),
(10,4,'50.00','2025-11-08 21:59:05','settlement',6,1,'50.00','tarjeta|idemp:test-2|by:admin',0,'admin','2025-11-08 21:59:05','2025-11-08 21:59:05'),
(11,4,'150.00','2025-11-08 21:59:05','settlement_personal',7,1,'150.00','tarjeta|idemp:test-2|by:admin',1,'admin','2025-11-08 21:59:05','2025-11-08 21:59:05'),
(12,4,'1000.00','2025-11-08 21:59:06','credit',NULL,1,'1000.00','efectivo|idemp:test-3|by:admin',1,'admin','2025-11-08 21:59:06','2025-11-08 21:59:06'),
(13,5,'80.00','2025-11-08 21:59:08','tournament',6,1,'80.00','cash',0,NULL,'2025-11-08 21:59:08','2025-11-08 21:59:08'),
(14,6,'80.00','2025-11-08 21:59:08','tournament',7,0,'0.00',NULL,0,NULL,'2025-11-08 21:59:08','2025-11-08 21:59:08'),
(15,7,'80.00','2025-11-08 21:59:08','tournament',8,0,'30.00','card',0,NULL,'2025-11-08 21:59:08','2025-11-08 21:59:08'),
(16,1,'36.00','2025-11-08 21:59:08','commission',4,1,'36.00','commission',0,'admin','2025-11-08 21:59:08','2025-11-08 21:59:08'),
(17,5,'-324.00','2025-11-08 21:59:08','tournament_payout',NULL,1,'324.00','payout',0,'admin','2025-11-08 21:59:08','2025-11-08 21:59:08');

DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `current_points` int DEFAULT '0',
  `suspended` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `players` (`id`,`first_name`,`last_name`,`email`,`phone_number`,`nickname`,`created_at`,`current_points`,`suspended`,`is_deleted`) VALUES
(1,'Juan','Pérez','juan.perez@example.com','111111111','JuampiPoker','2025-09-27 00:25:14',100,0,0),
(2,'María','Gómez','maria.gomez@example.com','222222222','Maru','2025-09-27 00:25:14',200,0,0),
(3,'Carlos','López','carlos.lopez@example.com','333333333','Charly','2025-09-27 00:25:14',150,0,0),
(4,'Ana','Martínez','ana.martinez@example.com','444444444','Anita','2025-09-27 00:25:14',300,0,0),
(5,'Luis','Rodríguez','luis.rodriguez@example.com','555555555','Luigi','2025-09-27 00:25:14',250,0,0),
(6,'Sofía','Fernández','sofia.fernandez@example.com','666666666','Sofi','2025-09-27 00:25:14',180,0,0),
(7,'Pedro','Ramírez','pedro.ramirez@example.com','777777777','Pete','2025-09-27 00:25:14',120,0,0),
(8,'Lucía','Torres','lucia.torres@example.com','888888888','Lulu','2025-09-27 00:25:14',220,0,0),
(9,'Diego','Sánchez','diego.sanchez@example.com','999999999','Didi','2025-09-27 00:25:14',170,0,0),
(10,'Camila','Morales','camila.morales@example.com','101010101','Cami','2025-09-27 00:25:14',140,0,0),
(21,'alan','garcia','alan.garcia@example.com','234234234','elalan','2025-10-05 20:25:38',0,0,0),
(74,'','','',NULL,NULL,'2025-10-24 19:23:51',0,0,0);

DROP TABLE IF EXISTS `ranking_history`;
CREATE TABLE `ranking_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `user_id` int NOT NULL,
  `season_id` int unsigned NOT NULL,
  `posicion` int NOT NULL,
  `puntos_acumulados` int NOT NULL,
  `torneos_jugados` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `jugador_id` (`user_id`),
  KEY `season_id` (`season_id`),
  CONSTRAINT `ranking_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `players` (`id`),
  CONSTRAINT `ranking_history_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ranking_history` (`id`,`fecha`,`user_id`,`season_id`,`posicion`,`puntos_acumulados`,`torneos_jugados`) VALUES
(1,'2025-09-25',1,1,1,1200,3),
(2,'2025-09-25',2,1,2,1000,3),
(3,'2025-09-25',3,1,3,800,2),
(4,'2025-09-25',4,1,4,700,2),
(5,'2025-09-25',5,1,5,600,1);

DROP TABLE IF EXISTS `registrations`;
CREATE TABLE `registrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `tournament_id` int unsigned NOT NULL,
  `registration_date` datetime NOT NULL,
  `punctuality` tinyint(1) NOT NULL,
  `position` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `tournament_id` (`tournament_id`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `registrations` (`id`,`user_id`,`tournament_id`,`registration_date`,`punctuality`,`position`) VALUES
(1,2,1,'2025-11-08 21:59:04',1,NULL),
(2,3,2,'2025-11-08 21:59:04',0,NULL),
(3,4,3,'2025-11-08 21:59:05',1,NULL),
(4,4,3,'2025-11-08 21:59:05',1,NULL),
(5,1,1,'2025-11-08 21:59:07',1,NULL),
(6,5,4,'2025-11-08 21:59:08',1,NULL),
(7,6,4,'2025-11-08 21:59:08',1,NULL),
(8,7,4,'2025-11-08 21:59:08',1,NULL);

DROP TABLE IF EXISTS `results`;
CREATE TABLE `results` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `position` int NOT NULL,
  `final_table` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`),
  CONSTRAINT `results_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `seasons`;
CREATE TABLE `seasons` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `torneos_totales` int unsigned NOT NULL DEFAULT '0',
  `torneos_jugados` int unsigned NOT NULL DEFAULT '0',
  `estado` enum('planificada','activa','finalizada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planificada',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `tournament_points`;
CREATE TABLE `tournament_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int unsigned NOT NULL,
  `position` int NOT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tournament_id` (`tournament_id`,`position`),
  CONSTRAINT `tournament_points_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `tournament_points` (`id`,`tournament_id`,`position`,`points`) VALUES
(1,1,1,1000),
(2,1,2,800),
(3,2,1,1200),
(4,2,2,900),
(5,3,1,1500);

DROP TABLE IF EXISTS `tournaments`;
CREATE TABLE `tournaments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tournament_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `buy_in` decimal(15,2) NOT NULL,
  `re_entry` int NOT NULL DEFAULT '0',
  `knockout_bounty` decimal(15,2) NOT NULL DEFAULT '0.00',
  `starting_stack` int NOT NULL DEFAULT '1000',
  `count_to_ranking` tinyint(1) NOT NULL DEFAULT '0',
  `double_points` tinyint(1) NOT NULL DEFAULT '0',
  `blind_levels` int NOT NULL DEFAULT '10',
  `small_blind` int NOT NULL DEFAULT '10',
  `punctuality_discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `registration_open` tinyint(1) NOT NULL DEFAULT '1',
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tournaments` (`id`,`tournament_name`,`start_date`,`buy_in`,`re_entry`,`knockout_bounty`,`starting_stack`,`count_to_ranking`,`double_points`,`blind_levels`,`small_blind`,`punctuality_discount`,`registration_open`,`end_date`) VALUES
(1,'T1','2025-11-08 22:59:04','100.00',0,'0.00',1000,0,0,10,10,'20.00',1,NULL),
(2,'T2','2025-11-08 20:59:04','200.00',0,'0.00',1000,0,0,10,10,'0.00',1,NULL),
(3,'QP Test','2025-11-08 21:59:05','100.00',0,'0.00',1000,0,0,10,10,'0.00',1,NULL),
(4,'Demo Torneo','2025-11-08 22:59:08','100.00',0,'0.00',1000,0,0,10,10,'20.00',0,'2025-11-08 21:59:08');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_points` int DEFAULT '0',
  `suspended` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL o path del avatar',
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_player` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`,`username`,`password_hash`,`full_name`,`first_name`,`last_name`,`email`,`phone_number`,`nickname`,`current_points`,`suspended`,`is_deleted`,`avatar`,`role`,`is_player`,`createdAt`,`updatedAt`) VALUES
(1,'admin','x',NULL,'','',NULL,NULL,NULL,0,0,0,NULL,'admin',0,'2025-11-08 21:59:04','2025-11-08 21:59:04'),
(2,'player1','x',NULL,'','',NULL,NULL,NULL,0,0,0,NULL,'user',1,'2025-11-08 21:59:04','2025-11-08 21:59:04'),
(3,'player2','x',NULL,'','',NULL,NULL,NULL,0,0,0,NULL,'user',1,'2025-11-08 21:59:04','2025-11-08 21:59:04'),
(4,'qp_user','x',NULL,'','',NULL,NULL,NULL,0,0,0,NULL,'user',1,'2025-11-08 21:59:05','2025-11-08 21:59:05'),
(5,'demo_p1','x','Jugador 1','','',NULL,NULL,NULL,0,0,0,NULL,'user',1,'2025-11-08 21:59:08','2025-11-08 21:59:08'),
(6,'demo_p2','x','Jugador 2','','',NULL,NULL,NULL,0,0,0,NULL,'user',1,'2025-11-08 21:59:08','2025-11-08 21:59:08'),
(7,'demo_p3','x','Jugador 3','','',NULL,NULL,NULL,0,0,0,NULL,'user',1,'2025-11-08 21:59:08','2025-11-08 21:59:08');

SET FOREIGN_KEY_CHECKS=1;
