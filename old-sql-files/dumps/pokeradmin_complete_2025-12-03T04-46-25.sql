-- MySQL dump of pokeradmin database
-- Generated at: 2025-12-03T04:46:25.473Z

SET FOREIGN_KEY_CHECKS=0;

-- Table: accumulated_commissions
DROP TABLE IF EXISTS `accumulated_commissions`;
CREATE TABLE `accumulated_commissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `destination_id` int unsigned NOT NULL,
  `tournament_id` int unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `percentage_applied` decimal(5,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_destination` (`destination_id`),
  KEY `idx_tournament` (`tournament_id`),
  CONSTRAINT `accumulated_commissions_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `commission_destinations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `accumulated_commissions_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cash_games
DROP TABLE IF EXISTS `cash_games`;
CREATE TABLE `cash_games` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `small_blind` decimal(10,2) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `total_commission` decimal(10,2) DEFAULT '0.00',
  `dealer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_tips` decimal(10,2) DEFAULT '0.00',
  `default_buyin` decimal(10,2) DEFAULT '0.00' COMMENT 'Monto mínimo requerido para sentarse',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: cash_games
INSERT INTO `cash_games` VALUES (22, '5.00', '2024-07-19T16:00:00.000Z', '2024-07-19T21:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (23, '5.00', '2024-07-26T16:00:00.000Z', '2024-07-26T19:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (24, '5.00', '2024-08-02T16:00:00.000Z', '2024-08-02T19:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (25, '5.00', '2024-08-06T16:00:00.000Z', '2024-08-06T21:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (26, '5.00', '2024-11-04T18:00:00.000Z', '2024-11-04T22:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (27, '5.00', '2024-12-17T18:00:00.000Z', '2024-12-18T00:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (28, '5.00', '2024-09-03T16:00:00.000Z', '2024-09-03T20:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (29, '5.00', '2024-12-26T18:00:00.000Z', '2024-12-27T00:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (30, '5.00', '2024-11-18T18:00:00.000Z', '2024-11-18T22:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (31, '5.00', '2024-10-11T16:00:00.000Z', '2024-10-11T21:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (32, '5.00', '2024-11-26T18:00:00.000Z', '2024-11-26T23:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (33, '5.00', '2024-12-21T18:00:00.000Z', '2024-12-21T21:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (34, '5.00', '2024-12-11T18:00:00.000Z', '2024-12-11T22:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (35, '5.00', '2024-08-31T16:00:00.000Z', '2024-08-31T19:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (36, '5.00', '2024-07-04T16:00:00.000Z', '2024-07-04T19:00:00.000Z', '0.00', 'Carlos Dealer', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (37, '1000.00', '2025-12-01T18:22:13.000Z', '2025-12-01T19:18:32.000Z', '123123.00', 'Gabilusky', '1111.00', '0.00');
INSERT INTO `cash_games` VALUES (38, '5.00', '2025-12-01T19:19:28.000Z', '2025-12-02T17:36:09.000Z', '1000.00', 'gabi', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (39, '2.00', '2025-12-02T17:39:31.000Z', '2025-12-02T18:28:17.000Z', '56678.00', 'alancito', '1123.00', '0.00');
INSERT INTO `cash_games` VALUES (40, '1.00', '2025-12-02T18:16:46.000Z', '2025-12-02T18:23:25.000Z', '7555.00', 'alan', '2555.00', '0.00');
INSERT INTO `cash_games` VALUES (41, '1.00', '2025-12-02T18:28:39.000Z', '2025-12-02T18:46:09.000Z', '0.00', 'Alan', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (42, '1.00', '2025-12-02T18:46:25.000Z', '2025-12-02T18:50:24.000Z', '0.00', 'Borra', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (43, '1.00', '2025-12-02T18:50:39.000Z', '2025-12-02T18:58:25.000Z', '0.00', 'Borra', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (44, '5.00', '2025-12-02T18:51:21.000Z', '2025-12-02T18:58:31.000Z', '0.00', 'Alan', '0.00', '0.00');
INSERT INTO `cash_games` VALUES (45, '9.00', '2025-12-02T18:53:29.000Z', '2025-12-02T19:29:14.000Z', '0.00', 'Gabilusky', '0.00', '9999.00');
INSERT INTO `cash_games` VALUES (46, '1.00', '2025-12-02T18:58:54.000Z', '2025-12-02T19:02:59.000Z', '0.00', 'Alan', '0.00', '10000.00');
INSERT INTO `cash_games` VALUES (47, '12.00', '2025-12-02T19:03:20.000Z', '2025-12-02T19:05:57.000Z', '0.00', 'Borra', '0.00', '12000.00');
INSERT INTO `cash_games` VALUES (48, '5.00', '2025-12-02T19:06:08.000Z', '2025-12-02T19:10:49.000Z', '0.00', 'Gabilusky', '0.00', '55555.00');
INSERT INTO `cash_games` VALUES (49, '4.00', '2025-12-02T19:11:00.000Z', '2025-12-02T19:15:50.000Z', '222.00', 'alan', '3421.00', '9999.00');
INSERT INTO `cash_games` VALUES (50, '3.00', '2025-12-02T19:17:07.000Z', '2025-12-02T19:19:51.000Z', '345.00', 'alan', '345.00', '33333.00');
INSERT INTO `cash_games` VALUES (51, '1.00', '2025-12-02T19:20:28.000Z', '2025-12-02T19:36:10.000Z', '182.00', 'alan', '182.00', '1000.00');
INSERT INTO `cash_games` VALUES (52, '1.00', '2025-12-02T19:36:20.000Z', NULL, '222.00', 'gabi', '222.00', '13123.00');

-- Table: cash_participants
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
) ENGINE=InnoDB AUTO_INCREMENT=344 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: cash_participants
INSERT INTO `cash_participants` VALUES (199, 22, 234, 1, '2024-07-19T16:13:00.000Z', '2024-07-19T20:51:00.000Z');
INSERT INTO `cash_participants` VALUES (200, 22, 222, 2, '2024-07-19T16:35:00.000Z', '2024-07-19T20:57:00.000Z');
INSERT INTO `cash_participants` VALUES (201, 22, 214, 3, '2024-07-19T16:36:00.000Z', '2024-07-19T20:31:00.000Z');
INSERT INTO `cash_participants` VALUES (202, 22, 247, 4, '2024-07-19T16:28:00.000Z', '2024-07-19T20:59:00.000Z');
INSERT INTO `cash_participants` VALUES (203, 22, 226, 5, '2024-07-19T16:51:00.000Z', '2024-07-19T20:34:00.000Z');
INSERT INTO `cash_participants` VALUES (204, 22, 248, 6, '2024-07-19T16:23:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (205, 22, 243, 7, '2024-07-19T16:59:00.000Z', '2024-07-19T20:34:00.000Z');
INSERT INTO `cash_participants` VALUES (206, 22, 225, 8, '2024-07-19T16:52:00.000Z', '2024-07-19T20:36:00.000Z');
INSERT INTO `cash_participants` VALUES (207, 22, 263, 9, '2024-07-19T16:04:00.000Z', '2024-07-19T20:38:00.000Z');
INSERT INTO `cash_participants` VALUES (208, 22, 261, 10, '2024-07-19T16:43:00.000Z', '2024-07-19T20:43:00.000Z');
INSERT INTO `cash_participants` VALUES (209, 23, 58, 1, '2024-07-26T16:07:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (210, 23, 217, 2, '2024-07-26T16:05:00.000Z', '2024-07-26T18:51:00.000Z');
INSERT INTO `cash_participants` VALUES (211, 23, 215, 3, '2024-07-26T16:45:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (212, 23, 257, 4, '2024-07-26T16:44:00.000Z', '2024-07-26T18:47:00.000Z');
INSERT INTO `cash_participants` VALUES (213, 23, 254, 5, '2024-07-26T16:03:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (214, 23, 242, 6, '2024-07-26T16:31:00.000Z', '2024-07-26T18:43:00.000Z');
INSERT INTO `cash_participants` VALUES (215, 23, 232, 7, '2024-07-26T16:29:00.000Z', '2024-07-26T18:42:00.000Z');
INSERT INTO `cash_participants` VALUES (216, 23, 227, 8, '2024-07-26T16:55:00.000Z', '2024-07-26T18:39:00.000Z');
INSERT INTO `cash_participants` VALUES (217, 24, 261, 1, '2024-08-02T16:10:00.000Z', '2024-08-02T18:41:00.000Z');
INSERT INTO `cash_participants` VALUES (218, 24, 224, 2, '2024-08-02T16:07:00.000Z', '2024-08-02T18:57:00.000Z');
INSERT INTO `cash_participants` VALUES (219, 24, 217, 3, '2024-08-02T16:07:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (220, 24, 245, 4, '2024-08-02T16:03:00.000Z', '2024-08-02T18:40:00.000Z');
INSERT INTO `cash_participants` VALUES (221, 24, 220, 5, '2024-08-02T16:57:00.000Z', '2024-08-02T18:46:00.000Z');
INSERT INTO `cash_participants` VALUES (222, 24, 226, 6, '2024-08-02T16:56:00.000Z', '2024-08-02T18:53:00.000Z');
INSERT INTO `cash_participants` VALUES (223, 24, 247, 7, '2024-08-02T16:17:00.000Z', '2024-08-02T18:36:00.000Z');
INSERT INTO `cash_participants` VALUES (224, 24, 255, 8, '2024-08-02T16:22:00.000Z', '2024-08-02T18:40:00.000Z');
INSERT INTO `cash_participants` VALUES (225, 24, 260, 9, '2024-08-02T16:19:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (226, 24, 58, 10, '2024-08-02T16:14:00.000Z', '2024-08-02T18:39:00.000Z');
INSERT INTO `cash_participants` VALUES (227, 25, 245, 1, '2024-08-06T16:13:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (228, 25, 258, 2, '2024-08-06T16:24:00.000Z', '2024-08-06T20:40:00.000Z');
INSERT INTO `cash_participants` VALUES (229, 25, 224, 3, '2024-08-06T16:10:00.000Z', '2024-08-06T20:35:00.000Z');
INSERT INTO `cash_participants` VALUES (230, 25, 1, 4, '2024-08-06T16:42:00.000Z', '2024-08-06T20:45:00.000Z');
INSERT INTO `cash_participants` VALUES (231, 25, 244, 5, '2024-08-06T16:48:00.000Z', '2024-08-06T20:54:00.000Z');
INSERT INTO `cash_participants` VALUES (232, 25, 252, 6, '2024-08-06T16:40:00.000Z', '2024-08-06T20:40:00.000Z');
INSERT INTO `cash_participants` VALUES (233, 25, 234, 7, '2024-08-06T16:34:00.000Z', '2024-08-06T20:53:00.000Z');
INSERT INTO `cash_participants` VALUES (234, 25, 214, 8, '2024-08-06T16:55:00.000Z', '2024-08-06T20:58:00.000Z');
INSERT INTO `cash_participants` VALUES (235, 25, 58, 9, '2024-08-06T16:37:00.000Z', '2024-08-06T20:41:00.000Z');
INSERT INTO `cash_participants` VALUES (236, 26, 240, 1, '2024-11-04T18:56:00.000Z', '2024-11-04T21:38:00.000Z');
INSERT INTO `cash_participants` VALUES (237, 26, 242, 2, '2024-11-04T18:32:00.000Z', '2024-11-04T21:51:00.000Z');
INSERT INTO `cash_participants` VALUES (238, 26, 263, 3, '2024-11-04T18:15:00.000Z', '2024-11-04T21:36:00.000Z');
INSERT INTO `cash_participants` VALUES (239, 26, 231, 4, '2024-11-04T18:16:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (240, 26, 219, 5, '2024-11-04T18:11:00.000Z', '2024-11-04T21:31:00.000Z');
INSERT INTO `cash_participants` VALUES (241, 26, 252, 6, '2024-11-04T18:54:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (242, 26, 250, 7, '2024-11-04T18:33:00.000Z', '2024-11-04T21:53:00.000Z');
INSERT INTO `cash_participants` VALUES (243, 27, 223, 1, '2024-12-17T18:56:00.000Z', '2024-12-17T23:47:00.000Z');
INSERT INTO `cash_participants` VALUES (244, 27, 246, 2, '2024-12-17T18:17:00.000Z', '2024-12-17T23:46:00.000Z');
INSERT INTO `cash_participants` VALUES (245, 27, 254, 3, '2024-12-17T18:28:00.000Z', '2024-12-17T23:58:00.000Z');
INSERT INTO `cash_participants` VALUES (246, 27, 232, 4, '2024-12-17T18:19:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (247, 27, 263, 5, '2024-12-17T18:22:00.000Z', '2024-12-17T23:59:00.000Z');
INSERT INTO `cash_participants` VALUES (248, 27, 238, 6, '2024-12-17T18:06:00.000Z', '2024-12-17T23:51:00.000Z');
INSERT INTO `cash_participants` VALUES (249, 27, 220, 7, '2024-12-17T18:56:00.000Z', '2024-12-17T23:40:00.000Z');
INSERT INTO `cash_participants` VALUES (250, 27, 225, 8, '2024-12-17T18:22:00.000Z', '2024-12-17T23:49:00.000Z');
INSERT INTO `cash_participants` VALUES (251, 28, 221, 1, '2024-09-03T16:11:00.000Z', '2024-09-03T19:50:00.000Z');
INSERT INTO `cash_participants` VALUES (252, 28, 215, 2, '2024-09-03T16:31:00.000Z', '2024-09-03T19:43:00.000Z');
INSERT INTO `cash_participants` VALUES (253, 28, 244, 3, '2024-09-03T16:43:00.000Z', '2024-09-03T19:40:00.000Z');
INSERT INTO `cash_participants` VALUES (254, 28, 217, 4, '2024-09-03T16:02:00.000Z', '2024-09-03T19:52:00.000Z');
INSERT INTO `cash_participants` VALUES (255, 28, 214, 5, '2024-09-03T16:04:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (256, 28, 247, 6, '2024-09-03T16:39:00.000Z', '2024-09-03T19:57:00.000Z');
INSERT INTO `cash_participants` VALUES (257, 28, 235, 7, '2024-09-03T16:19:00.000Z', '2024-09-03T19:53:00.000Z');
INSERT INTO `cash_participants` VALUES (258, 28, 231, 8, '2024-09-03T16:55:00.000Z', '2024-09-03T19:40:00.000Z');
INSERT INTO `cash_participants` VALUES (259, 28, 260, 9, '2024-09-03T16:08:00.000Z', '2024-09-03T19:42:00.000Z');
INSERT INTO `cash_participants` VALUES (260, 28, 1, 10, '2024-09-03T16:52:00.000Z', '2024-09-03T19:33:00.000Z');
INSERT INTO `cash_participants` VALUES (261, 29, 218, 1, '2024-12-26T18:25:00.000Z', '2024-12-26T23:40:00.000Z');
INSERT INTO `cash_participants` VALUES (262, 29, 214, 2, '2024-12-26T18:51:00.000Z', '2024-12-26T23:36:00.000Z');
INSERT INTO `cash_participants` VALUES (263, 29, 215, 3, '2024-12-26T18:55:00.000Z', '2024-12-26T23:34:00.000Z');
INSERT INTO `cash_participants` VALUES (264, 29, 231, 4, '2024-12-26T18:50:00.000Z', '2024-12-26T23:49:00.000Z');
INSERT INTO `cash_participants` VALUES (265, 29, 260, 5, '2024-12-26T18:38:00.000Z', '2024-12-26T23:51:00.000Z');
INSERT INTO `cash_participants` VALUES (266, 29, 235, 6, '2024-12-26T18:24:00.000Z', '2024-12-26T23:56:00.000Z');
INSERT INTO `cash_participants` VALUES (267, 30, 217, 1, '2024-11-18T18:50:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (268, 30, 242, 2, '2024-11-18T18:13:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (269, 30, 1, 3, '2024-11-18T18:36:00.000Z', '2024-11-18T21:55:00.000Z');
INSERT INTO `cash_participants` VALUES (270, 30, 229, 4, '2024-11-18T18:26:00.000Z', '2024-11-18T21:32:00.000Z');
INSERT INTO `cash_participants` VALUES (271, 30, 247, 5, '2024-11-18T18:59:00.000Z', '2024-11-18T21:33:00.000Z');
INSERT INTO `cash_participants` VALUES (272, 30, 215, 6, '2024-11-18T18:30:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (273, 30, 253, 7, '2024-11-18T18:23:00.000Z', '2024-11-18T21:35:00.000Z');
INSERT INTO `cash_participants` VALUES (274, 31, 218, 1, '2024-10-11T16:14:00.000Z', '2024-10-11T20:48:00.000Z');
INSERT INTO `cash_participants` VALUES (275, 31, 216, 2, '2024-10-11T16:24:00.000Z', '2024-10-11T20:38:00.000Z');
INSERT INTO `cash_participants` VALUES (276, 31, 224, 3, '2024-10-11T16:21:00.000Z', '2024-10-11T20:58:00.000Z');
INSERT INTO `cash_participants` VALUES (277, 31, 231, 4, '2024-10-11T16:22:00.000Z', '2024-10-11T20:50:00.000Z');
INSERT INTO `cash_participants` VALUES (278, 31, 240, 5, '2024-10-11T16:58:00.000Z', '2024-10-11T20:44:00.000Z');
INSERT INTO `cash_participants` VALUES (279, 31, 234, 6, '2024-10-11T16:00:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (280, 31, 256, 7, '2024-10-11T16:25:00.000Z', '2024-10-11T20:44:00.000Z');
INSERT INTO `cash_participants` VALUES (281, 31, 249, 8, '2024-10-11T16:16:00.000Z', '2024-10-11T20:45:00.000Z');
INSERT INTO `cash_participants` VALUES (282, 31, 217, 9, '2024-10-11T16:18:00.000Z', '2024-10-11T20:37:00.000Z');
INSERT INTO `cash_participants` VALUES (283, 32, 245, 1, '2024-11-26T18:39:00.000Z', '2024-11-26T22:41:00.000Z');
INSERT INTO `cash_participants` VALUES (284, 32, 228, 2, '2024-11-26T18:39:00.000Z', '2024-11-26T22:53:00.000Z');
INSERT INTO `cash_participants` VALUES (285, 32, 223, 3, '2024-11-26T18:23:00.000Z', '2024-11-26T22:40:00.000Z');
INSERT INTO `cash_participants` VALUES (286, 32, 239, 4, '2024-11-26T18:05:00.000Z', '2024-11-26T22:37:00.000Z');
INSERT INTO `cash_participants` VALUES (287, 32, 214, 5, '2024-11-26T18:02:00.000Z', '2024-11-26T22:43:00.000Z');
INSERT INTO `cash_participants` VALUES (288, 32, 217, 6, '2024-11-26T18:09:00.000Z', '2024-11-26T22:56:00.000Z');
INSERT INTO `cash_participants` VALUES (289, 32, 233, 7, '2024-11-26T18:14:00.000Z', '2024-11-26T22:36:00.000Z');
INSERT INTO `cash_participants` VALUES (290, 32, 244, 8, '2024-11-26T18:24:00.000Z', '2024-11-26T22:57:00.000Z');
INSERT INTO `cash_participants` VALUES (291, 32, 226, 9, '2024-11-26T18:53:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (292, 32, 58, 10, '2024-11-26T18:11:00.000Z', '2024-11-26T22:35:00.000Z');
INSERT INTO `cash_participants` VALUES (293, 33, 256, 1, '2024-12-21T18:28:00.000Z', '2024-12-21T20:31:00.000Z');
INSERT INTO `cash_participants` VALUES (294, 33, 263, 2, '2024-12-21T18:39:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (295, 33, 250, 3, '2024-12-21T18:08:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (296, 33, 233, 4, '2024-12-21T18:50:00.000Z', '2024-12-21T20:43:00.000Z');
INSERT INTO `cash_participants` VALUES (297, 33, 216, 5, '2024-12-21T18:50:00.000Z', '2024-12-21T20:35:00.000Z');
INSERT INTO `cash_participants` VALUES (298, 33, 253, 6, '2024-12-21T18:55:00.000Z', '2024-12-21T20:41:00.000Z');
INSERT INTO `cash_participants` VALUES (299, 33, 249, 7, '2024-12-21T18:07:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (300, 34, 224, 1, '2024-12-11T18:08:00.000Z', '2024-12-11T21:56:00.000Z');
INSERT INTO `cash_participants` VALUES (301, 34, 254, 2, '2024-12-11T18:14:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (302, 34, 230, 3, '2024-12-11T18:00:00.000Z', '2024-12-11T21:34:00.000Z');
INSERT INTO `cash_participants` VALUES (303, 34, 235, 4, '2024-12-11T18:40:00.000Z', '2024-12-11T21:39:00.000Z');
INSERT INTO `cash_participants` VALUES (304, 34, 252, 5, '2024-12-11T18:04:00.000Z', '2024-12-11T21:50:00.000Z');
INSERT INTO `cash_participants` VALUES (305, 34, 249, 6, '2024-12-11T18:17:00.000Z', '2024-12-11T21:40:00.000Z');
INSERT INTO `cash_participants` VALUES (306, 34, 223, 7, '2024-12-11T18:16:00.000Z', '2024-12-11T21:58:00.000Z');
INSERT INTO `cash_participants` VALUES (307, 34, 243, 8, '2024-12-11T18:35:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (308, 34, 222, 9, '2024-12-11T18:25:00.000Z', '2024-12-11T21:56:00.000Z');
INSERT INTO `cash_participants` VALUES (309, 35, 214, 1, '2024-08-31T16:34:00.000Z', '2024-08-31T18:51:00.000Z');
INSERT INTO `cash_participants` VALUES (310, 35, 220, 2, '2024-08-31T16:04:00.000Z', '2024-08-31T18:47:00.000Z');
INSERT INTO `cash_participants` VALUES (311, 35, 259, 3, '2024-08-31T16:06:00.000Z', '2024-08-31T18:53:00.000Z');
INSERT INTO `cash_participants` VALUES (312, 35, 246, 4, '2024-08-31T16:02:00.000Z', '2024-08-31T18:55:00.000Z');
INSERT INTO `cash_participants` VALUES (313, 35, 252, 5, '2024-08-31T16:45:00.000Z', '2024-08-31T18:35:00.000Z');
INSERT INTO `cash_participants` VALUES (314, 35, 229, 6, '2024-08-31T16:51:00.000Z', '2024-08-31T18:42:00.000Z');
INSERT INTO `cash_participants` VALUES (315, 35, 257, 7, '2024-08-31T16:46:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (316, 35, 227, 8, '2024-08-31T16:38:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (317, 35, 221, 9, '2024-08-31T16:42:00.000Z', '2024-08-31T18:36:00.000Z');
INSERT INTO `cash_participants` VALUES (318, 36, 241, 1, '2024-07-04T16:08:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (319, 36, 240, 2, '2024-07-04T16:27:00.000Z', '2024-07-04T18:46:00.000Z');
INSERT INTO `cash_participants` VALUES (320, 36, 229, 3, '2024-07-04T16:44:00.000Z', '2024-07-04T18:40:00.000Z');
INSERT INTO `cash_participants` VALUES (321, 36, 247, 4, '2024-07-04T16:11:00.000Z', '2024-07-04T18:40:00.000Z');
INSERT INTO `cash_participants` VALUES (322, 36, 219, 5, '2024-07-04T16:13:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (323, 36, 231, 6, '2024-07-04T16:02:00.000Z', NULL);
INSERT INTO `cash_participants` VALUES (324, 37, 58, 1, '2025-12-01T18:22:48.000Z', NULL);
INSERT INTO `cash_participants` VALUES (325, 37, 230, 2, '2025-12-01T18:23:25.000Z', NULL);
INSERT INTO `cash_participants` VALUES (326, 38, 227, NULL, '2025-12-01T19:19:41.000Z', NULL);
INSERT INTO `cash_participants` VALUES (327, 39, 264, NULL, '2025-12-02T17:40:04.000Z', NULL);
INSERT INTO `cash_participants` VALUES (328, 40, 220, NULL, '2025-12-02T18:17:23.000Z', NULL);
INSERT INTO `cash_participants` VALUES (329, 40, 228, NULL, '2025-12-02T18:23:39.000Z', NULL);
INSERT INTO `cash_participants` VALUES (330, 41, 216, NULL, '2025-12-02T18:29:04.000Z', NULL);
INSERT INTO `cash_participants` VALUES (331, 41, 225, 2, '2025-12-02T18:29:34.000Z', NULL);
INSERT INTO `cash_participants` VALUES (332, 42, 228, NULL, '2025-12-02T18:46:58.000Z', NULL);
INSERT INTO `cash_participants` VALUES (333, 42, 225, NULL, '2025-12-02T18:47:16.000Z', NULL);
INSERT INTO `cash_participants` VALUES (334, 46, 245, NULL, '2025-12-02T19:00:23.000Z', NULL);
INSERT INTO `cash_participants` VALUES (335, 46, 216, NULL, '2025-12-02T19:02:52.000Z', NULL);
INSERT INTO `cash_participants` VALUES (336, 47, 216, NULL, '2025-12-02T19:03:34.000Z', NULL);
INSERT INTO `cash_participants` VALUES (337, 48, 259, NULL, '2025-12-02T19:07:06.000Z', NULL);
INSERT INTO `cash_participants` VALUES (338, 49, 224, NULL, '2025-12-02T19:11:36.000Z', NULL);
INSERT INTO `cash_participants` VALUES (339, 50, 249, NULL, '2025-12-02T19:17:19.000Z', NULL);
INSERT INTO `cash_participants` VALUES (340, 50, 225, NULL, '2025-12-02T19:18:52.000Z', NULL);
INSERT INTO `cash_participants` VALUES (341, 51, 225, NULL, '2025-12-02T19:20:40.000Z', NULL);
INSERT INTO `cash_participants` VALUES (342, 51, 217, NULL, '2025-12-02T19:21:06.000Z', NULL);
INSERT INTO `cash_participants` VALUES (343, 52, 265, NULL, '2025-12-02T19:37:02.000Z', NULL);

-- Table: commission_config
DROP TABLE IF EXISTS `commission_config`;
CREATE TABLE `commission_config` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `destination_id` int unsigned NOT NULL,
  `percentage` decimal(5,2) NOT NULL COMMENT 'Porcentaje de comisión (0-100)',
  `priority` int DEFAULT '0' COMMENT 'Orden de aplicación',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_destination` (`destination_id`),
  CONSTRAINT `commission_config_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `commission_destinations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: commission_destinations
DROP TABLE IF EXISTS `commission_destinations`;
CREATE TABLE `commission_destinations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del destino (Casa, Copa Don Humberto, etc)',
  `type` enum('house','season_ranking','special_tournament') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tipo de destino',
  `season_id` int unsigned DEFAULT NULL COMMENT 'ID de temporada si type=season_ranking',
  `tournament_id` int unsigned DEFAULT NULL COMMENT 'ID de torneo especial si type=special_tournament',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `season_id` (`season_id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `idx_type` (`type`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `commission_destinations_ibfk_1` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `commission_destinations_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: commission_destinations
INSERT INTO `commission_destinations` VALUES (1, 'Casa', 'house', NULL, NULL, 1, '2025-12-03T04:38:35.000Z', '2025-12-03T04:38:35.000Z');
INSERT INTO `commission_destinations` VALUES (2, 'Ranking General', 'season_ranking', NULL, NULL, 1, '2025-12-03T04:38:35.000Z', '2025-12-03T04:38:35.000Z');
INSERT INTO `commission_destinations` VALUES (3, 'Copa Don Humberto', 'special_tournament', NULL, NULL, 1, '2025-12-03T04:38:35.000Z', '2025-12-03T04:38:35.000Z');

-- Table: commission_pools
DROP TABLE IF EXISTS `commission_pools`;
CREATE TABLE `commission_pools` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pool_type` enum('monthly','quarterly','copa_don_humberto','house') COLLATE utf8mb4_unicode_ci NOT NULL,
  `period_identifier` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accumulated_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('active','closed','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `closed_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: commission_pools
INSERT INTO `commission_pools` VALUES (1, 'monthly', '2025-11', '19.91', 'active', NULL, NULL, NULL, '2025-11-22T20:26:20.000Z', '2025-11-25T19:22:54.000Z');
INSERT INTO `commission_pools` VALUES (2, 'quarterly', '2025-Q4', '19.91', 'active', NULL, NULL, NULL, '2025-11-22T20:26:20.000Z', '2025-11-25T19:22:54.000Z');
INSERT INTO `commission_pools` VALUES (3, 'copa_don_humberto', '2025', '19.91', 'active', NULL, NULL, NULL, '2025-11-22T20:26:20.000Z', '2025-11-25T19:22:54.000Z');
INSERT INTO `commission_pools` VALUES (4, 'house', '2025-11', '338.47', 'active', NULL, NULL, NULL, '2025-11-22T20:26:20.000Z', '2025-11-25T19:22:54.000Z');

-- Table: dealer_shifts
DROP TABLE IF EXISTS `dealer_shifts`;
CREATE TABLE `dealer_shifts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cash_game_id` int unsigned NOT NULL,
  `outgoing_dealer` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Dealer que termina el turno',
  `incoming_dealer` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Dealer que comienza el turno',
  `shift_start` datetime NOT NULL COMMENT 'Inicio del turno',
  `shift_end` datetime NOT NULL COMMENT 'Fin del turno',
  `commission` decimal(10,2) DEFAULT '0.00' COMMENT 'Comisión generada en el turno',
  `tips` decimal(10,2) DEFAULT '0.00' COMMENT 'Propinas recibidas en el turno',
  `recorded_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Usuario que registró el cambio',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cash_game` (`cash_game_id`),
  KEY `idx_outgoing_dealer` (`outgoing_dealer`),
  KEY `idx_incoming_dealer` (`incoming_dealer`),
  CONSTRAINT `fk_dealer_shifts_cash_game` FOREIGN KEY (`cash_game_id`) REFERENCES `cash_games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historial de cambios de turno de dealers en mesas cash';

-- Data for table: dealer_shifts
INSERT INTO `dealer_shifts` VALUES (1, 40, 'Borra', 'Gabi', '2025-12-02T18:16:46.000Z', '2025-12-02T18:17:49.000Z', '2222.00', '2222.00', 'admin', '2025-12-02T18:17:49.000Z');
INSERT INTO `dealer_shifts` VALUES (2, 40, 'Gabi', 'alan', '2025-12-02T18:16:46.000Z', '2025-12-02T18:21:31.000Z', '333.00', '333.00', 'admin', '2025-12-02T18:21:31.000Z');
INSERT INTO `dealer_shifts` VALUES (3, 49, 'Alan', 'Gabi', '2025-12-02T19:11:00.000Z', '2025-12-02T19:12:11.000Z', '123.00', '3333.00', 'admin', '2025-12-02T19:12:11.000Z');
INSERT INTO `dealer_shifts` VALUES (4, 49, 'Gabi', 'alan', '2025-12-02T19:11:00.000Z', '2025-12-02T19:13:26.000Z', '99.00', '88.00', 'admin', '2025-12-02T19:13:26.000Z');
INSERT INTO `dealer_shifts` VALUES (5, 50, 'Alan', 'Gabi', '2025-12-02T19:17:07.000Z', '2025-12-02T19:18:30.000Z', '12.00', '12.00', 'admin', '2025-12-02T19:18:30.000Z');
INSERT INTO `dealer_shifts` VALUES (6, 50, 'Gabi', 'alan', '2025-12-02T19:18:30.000Z', '2025-12-02T19:19:21.000Z', '333.00', '333.00', 'admin', '2025-12-02T19:19:21.000Z');
INSERT INTO `dealer_shifts` VALUES (7, 51, 'Borra', 'Gabi', '2025-12-02T19:20:28.000Z', '2025-12-02T19:20:52.000Z', '4.00', '4.00', 'admin', '2025-12-02T19:20:52.000Z');
INSERT INTO `dealer_shifts` VALUES (8, 51, 'Gabi', 'alan', '2025-12-02T19:20:52.000Z', '2025-12-02T19:21:52.000Z', '55.00', '55.00', 'admin', '2025-12-02T19:21:52.000Z');
INSERT INTO `dealer_shifts` VALUES (9, 51, 'alan', 'alan', '2025-12-02T19:21:52.000Z', '2025-12-02T19:35:09.000Z', '123.00', '123.00', 'admin', '2025-12-02T19:35:09.000Z');
INSERT INTO `dealer_shifts` VALUES (10, 52, 'gabi', 'gabi', '2025-12-02T19:36:20.000Z', '2025-12-02T19:39:54.000Z', '222.00', '222.00', 'admin', '2025-12-02T19:39:54.000Z');

-- Table: historical_points
DROP TABLE IF EXISTS `historical_points`;
CREATE TABLE `historical_points` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `record_date` datetime NOT NULL,
  `user_id` int unsigned NOT NULL,
  `season_id` int unsigned NOT NULL,
  `tournament_id` int unsigned DEFAULT NULL,
  `result_id` int unsigned DEFAULT NULL,
  `action_type` enum('attendance','reentry','final_table','placement','bonus') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: historical_points
INSERT INTO `historical_points` VALUES (1, '2025-11-22T16:16:28.000Z', 8, 1, NULL, NULL, 'attendance', 'Seed attendance', 19);
INSERT INTO `historical_points` VALUES (2, '2025-11-22T16:16:28.000Z', 9, 1, NULL, NULL, 'attendance', 'Seed attendance', 37);
INSERT INTO `historical_points` VALUES (3, '2025-11-22T16:16:28.000Z', 9, 1, NULL, NULL, 'attendance', 'Seed attendance', 79);
INSERT INTO `historical_points` VALUES (4, '2025-11-22T16:16:28.000Z', 9, 1, NULL, NULL, 'attendance', 'Seed attendance', 96);
INSERT INTO `historical_points` VALUES (5, '2025-11-22T16:16:28.000Z', 10, 1, NULL, NULL, 'attendance', 'Seed attendance', 30);
INSERT INTO `historical_points` VALUES (6, '2025-11-22T16:16:28.000Z', 11, 1, NULL, NULL, 'attendance', 'Seed attendance', 37);
INSERT INTO `historical_points` VALUES (7, '2025-11-22T16:16:28.000Z', 11, 1, NULL, NULL, 'attendance', 'Seed attendance', 28);
INSERT INTO `historical_points` VALUES (8, '2025-11-22T16:16:28.000Z', 11, 1, NULL, NULL, 'attendance', 'Seed attendance', 78);
INSERT INTO `historical_points` VALUES (9, '2025-11-22T16:16:28.000Z', 12, 1, NULL, NULL, 'attendance', 'Seed attendance', 74);
INSERT INTO `historical_points` VALUES (10, '2025-11-22T16:16:28.000Z', 12, 1, NULL, NULL, 'attendance', 'Seed attendance', 92);
INSERT INTO `historical_points` VALUES (11, '2025-11-22T16:16:28.000Z', 12, 1, NULL, NULL, 'attendance', 'Seed attendance', 10);
INSERT INTO `historical_points` VALUES (12, '2025-11-22T16:16:28.000Z', 13, 1, NULL, NULL, 'attendance', 'Seed attendance', 19);
INSERT INTO `historical_points` VALUES (13, '2025-11-22T16:16:28.000Z', 13, 1, NULL, NULL, 'attendance', 'Seed attendance', 23);
INSERT INTO `historical_points` VALUES (14, '2025-11-22T16:16:28.000Z', 13, 1, NULL, NULL, 'attendance', 'Seed attendance', 0);
INSERT INTO `historical_points` VALUES (15, '2025-11-22T16:16:28.000Z', 14, 1, NULL, NULL, 'attendance', 'Seed attendance', 74);
INSERT INTO `historical_points` VALUES (16, '2025-11-22T16:16:28.000Z', 15, 1, NULL, NULL, 'attendance', 'Seed attendance', 7);
INSERT INTO `historical_points` VALUES (17, '2025-11-22T16:16:28.000Z', 15, 1, NULL, NULL, 'attendance', 'Seed attendance', 56);
INSERT INTO `historical_points` VALUES (18, '2025-11-22T16:16:28.000Z', 16, 1, NULL, NULL, 'attendance', 'Seed attendance', 10);
INSERT INTO `historical_points` VALUES (19, '2025-11-22T16:16:28.000Z', 16, 1, NULL, NULL, 'attendance', 'Seed attendance', 63);
INSERT INTO `historical_points` VALUES (20, '2025-11-22T16:16:28.000Z', 16, 1, NULL, NULL, 'attendance', 'Seed attendance', 87);
INSERT INTO `historical_points` VALUES (21, '2025-11-22T16:16:28.000Z', 17, 1, NULL, NULL, 'attendance', 'Seed attendance', 46);
INSERT INTO `historical_points` VALUES (22, '2025-11-22T16:16:28.000Z', 18, 1, NULL, NULL, 'attendance', 'Seed attendance', 64);
INSERT INTO `historical_points` VALUES (23, '2025-11-22T16:16:28.000Z', 18, 1, NULL, NULL, 'attendance', 'Seed attendance', 93);
INSERT INTO `historical_points` VALUES (24, '2025-11-22T16:16:28.000Z', 20, 1, NULL, NULL, 'attendance', 'Seed attendance', 48);
INSERT INTO `historical_points` VALUES (25, '2025-11-22T16:16:28.000Z', 21, 1, NULL, NULL, 'attendance', 'Seed attendance', 0);
INSERT INTO `historical_points` VALUES (26, '2025-11-22T16:16:28.000Z', 21, 1, NULL, NULL, 'attendance', 'Seed attendance', 77);
INSERT INTO `historical_points` VALUES (27, '2025-11-22T16:16:28.000Z', 22, 1, NULL, NULL, 'attendance', 'Seed attendance', 77);
INSERT INTO `historical_points` VALUES (28, '2025-11-22T16:16:28.000Z', 22, 1, NULL, NULL, 'attendance', 'Seed attendance', 68);
INSERT INTO `historical_points` VALUES (29, '2025-11-22T16:16:28.000Z', 22, 1, NULL, NULL, 'attendance', 'Seed attendance', 75);
INSERT INTO `historical_points` VALUES (30, '2025-11-22T16:16:28.000Z', 26, 1, NULL, NULL, 'attendance', 'Seed attendance', 81);
INSERT INTO `historical_points` VALUES (31, '2025-11-22T16:16:28.000Z', 26, 1, NULL, NULL, 'attendance', 'Seed attendance', 56);
INSERT INTO `historical_points` VALUES (32, '2025-11-22T16:16:28.000Z', 26, 1, NULL, NULL, 'attendance', 'Seed attendance', 41);
INSERT INTO `historical_points` VALUES (33, '2025-11-22T16:16:28.000Z', 27, 1, NULL, NULL, 'attendance', 'Seed attendance', 22);
INSERT INTO `historical_points` VALUES (34, '2025-11-22T16:16:28.000Z', 27, 1, NULL, NULL, 'attendance', 'Seed attendance', 3);
INSERT INTO `historical_points` VALUES (35, '2025-11-22T16:16:28.000Z', 28, 1, NULL, NULL, 'attendance', 'Seed attendance', 53);
INSERT INTO `historical_points` VALUES (36, '2025-11-22T16:16:28.000Z', 28, 1, NULL, NULL, 'attendance', 'Seed attendance', 14);
INSERT INTO `historical_points` VALUES (37, '2025-11-22T16:16:28.000Z', 28, 1, NULL, NULL, 'attendance', 'Seed attendance', 6);
INSERT INTO `historical_points` VALUES (38, '2025-11-22T16:16:28.000Z', 29, 1, NULL, NULL, 'attendance', 'Seed attendance', 65);
INSERT INTO `historical_points` VALUES (39, '2025-11-22T16:16:28.000Z', 30, 1, NULL, NULL, 'attendance', 'Seed attendance', 51);
INSERT INTO `historical_points` VALUES (40, '2025-11-22T16:16:28.000Z', 30, 1, NULL, NULL, 'attendance', 'Seed attendance', 12);
INSERT INTO `historical_points` VALUES (41, '2025-11-22T16:16:28.000Z', 30, 1, NULL, NULL, 'attendance', 'Seed attendance', 17);
INSERT INTO `historical_points` VALUES (42, '2025-11-22T16:16:28.000Z', 31, 1, NULL, NULL, 'attendance', 'Seed attendance', 94);
INSERT INTO `historical_points` VALUES (43, '2025-11-22T16:16:28.000Z', 32, 1, NULL, NULL, 'attendance', 'Seed attendance', 65);
INSERT INTO `historical_points` VALUES (44, '2025-11-22T16:16:28.000Z', 32, 1, NULL, NULL, 'attendance', 'Seed attendance', 18);
INSERT INTO `historical_points` VALUES (45, '2025-11-22T16:16:28.000Z', 33, 1, NULL, NULL, 'attendance', 'Seed attendance', 41);
INSERT INTO `historical_points` VALUES (46, '2025-11-22T16:16:28.000Z', 34, 1, NULL, NULL, 'attendance', 'Seed attendance', 82);
INSERT INTO `historical_points` VALUES (47, '2025-11-22T16:16:28.000Z', 34, 1, NULL, NULL, 'attendance', 'Seed attendance', 89);
INSERT INTO `historical_points` VALUES (48, '2025-11-22T16:16:28.000Z', 35, 1, NULL, NULL, 'attendance', 'Seed attendance', 43);
INSERT INTO `historical_points` VALUES (49, '2025-11-22T16:16:28.000Z', 35, 1, NULL, NULL, 'attendance', 'Seed attendance', 17);
INSERT INTO `historical_points` VALUES (50, '2025-11-22T16:16:28.000Z', 35, 1, NULL, NULL, 'attendance', 'Seed attendance', 30);
INSERT INTO `historical_points` VALUES (51, '2025-11-22T16:16:28.000Z', 36, 1, NULL, NULL, 'attendance', 'Seed attendance', 56);
INSERT INTO `historical_points` VALUES (52, '2025-11-22T16:16:28.000Z', 36, 1, NULL, NULL, 'attendance', 'Seed attendance', 20);
INSERT INTO `historical_points` VALUES (53, '2025-11-22T16:16:28.000Z', 36, 1, NULL, NULL, 'attendance', 'Seed attendance', 38);
INSERT INTO `historical_points` VALUES (54, '2025-11-22T16:16:28.000Z', 38, 1, NULL, NULL, 'attendance', 'Seed attendance', 25);
INSERT INTO `historical_points` VALUES (55, '2025-11-22T16:16:28.000Z', 40, 1, NULL, NULL, 'attendance', 'Seed attendance', 22);
INSERT INTO `historical_points` VALUES (56, '2025-11-22T16:16:28.000Z', 40, 1, NULL, NULL, 'attendance', 'Seed attendance', 65);
INSERT INTO `historical_points` VALUES (57, '2025-11-22T16:16:28.000Z', 41, 1, NULL, NULL, 'attendance', 'Seed attendance', 43);
INSERT INTO `historical_points` VALUES (58, '2025-11-22T16:16:28.000Z', 41, 1, NULL, NULL, 'attendance', 'Seed attendance', 49);
INSERT INTO `historical_points` VALUES (59, '2025-11-22T16:16:28.000Z', 43, 1, NULL, NULL, 'attendance', 'Seed attendance', 89);
INSERT INTO `historical_points` VALUES (60, '2025-11-22T16:16:28.000Z', 43, 1, NULL, NULL, 'attendance', 'Seed attendance', 20);
INSERT INTO `historical_points` VALUES (61, '2025-11-22T16:16:28.000Z', 44, 1, NULL, NULL, 'attendance', 'Seed attendance', 47);
INSERT INTO `historical_points` VALUES (62, '2025-11-22T16:16:28.000Z', 45, 1, NULL, NULL, 'attendance', 'Seed attendance', 64);
INSERT INTO `historical_points` VALUES (63, '2025-11-22T16:16:28.000Z', 45, 1, NULL, NULL, 'attendance', 'Seed attendance', 96);
INSERT INTO `historical_points` VALUES (64, '2025-11-22T16:16:28.000Z', 45, 1, NULL, NULL, 'attendance', 'Seed attendance', 0);
INSERT INTO `historical_points` VALUES (65, '2025-11-22T16:16:28.000Z', 46, 1, NULL, NULL, 'attendance', 'Seed attendance', 52);
INSERT INTO `historical_points` VALUES (66, '2025-11-22T16:16:28.000Z', 46, 1, NULL, NULL, 'attendance', 'Seed attendance', 43);
INSERT INTO `historical_points` VALUES (67, '2025-11-22T16:16:28.000Z', 46, 1, NULL, NULL, 'attendance', 'Seed attendance', 61);
INSERT INTO `historical_points` VALUES (68, '2025-11-22T16:16:28.000Z', 47, 1, NULL, NULL, 'attendance', 'Seed attendance', 44);
INSERT INTO `historical_points` VALUES (69, '2025-11-22T16:16:28.000Z', 47, 1, NULL, NULL, 'attendance', 'Seed attendance', 34);
INSERT INTO `historical_points` VALUES (70, '2025-11-22T16:16:28.000Z', 48, 1, NULL, NULL, 'attendance', 'Seed attendance', 47);
INSERT INTO `historical_points` VALUES (71, '2025-11-22T16:16:28.000Z', 48, 1, NULL, NULL, 'attendance', 'Seed attendance', 40);
INSERT INTO `historical_points` VALUES (72, '2025-11-22T16:16:28.000Z', 49, 1, NULL, NULL, 'attendance', 'Seed attendance', 62);
INSERT INTO `historical_points` VALUES (73, '2025-11-22T16:16:28.000Z', 50, 1, NULL, NULL, 'attendance', 'Seed attendance', 43);
INSERT INTO `historical_points` VALUES (74, '2025-11-22T16:16:28.000Z', 50, 1, NULL, NULL, 'attendance', 'Seed attendance', 39);
INSERT INTO `historical_points` VALUES (75, '2025-11-22T16:16:28.000Z', 50, 1, NULL, NULL, 'attendance', 'Seed attendance', 72);
INSERT INTO `historical_points` VALUES (76, '2025-11-22T16:16:28.000Z', 51, 1, NULL, NULL, 'attendance', 'Seed attendance', 95);
INSERT INTO `historical_points` VALUES (77, '2025-11-22T16:16:28.000Z', 51, 1, NULL, NULL, 'attendance', 'Seed attendance', 97);
INSERT INTO `historical_points` VALUES (78, '2025-11-22T16:16:28.000Z', 54, 1, NULL, NULL, 'attendance', 'Seed attendance', 81);
INSERT INTO `historical_points` VALUES (79, '2025-11-22T16:16:28.000Z', 55, 1, NULL, NULL, 'attendance', 'Seed attendance', 28);
INSERT INTO `historical_points` VALUES (80, '2025-11-22T19:14:55.000Z', 2, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (81, '2025-11-22T19:14:55.000Z', 3, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (82, '2025-11-22T19:14:55.000Z', 4, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (83, '2025-11-22T19:14:56.000Z', 5, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (84, '2025-11-22T19:14:56.000Z', 7, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (85, '2025-11-22T19:14:56.000Z', 10, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (86, '2025-11-22T19:14:56.000Z', 11, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (87, '2025-11-22T19:14:56.000Z', 12, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (88, '2025-11-22T19:14:56.000Z', 14, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (89, '2025-11-22T19:14:56.000Z', 15, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (90, '2025-11-22T19:14:56.000Z', 16, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (91, '2025-11-22T19:14:56.000Z', 17, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (92, '2025-11-22T19:14:56.000Z', 19, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (93, '2025-11-22T19:14:56.000Z', 20, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (94, '2025-11-22T19:14:56.000Z', 23, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (95, '2025-11-22T19:14:56.000Z', 24, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (96, '2025-11-22T19:14:56.000Z', 26, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (97, '2025-11-22T19:14:56.000Z', 30, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (98, '2025-11-22T19:14:56.000Z', 32, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (99, '2025-11-22T19:14:56.000Z', 35, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (100, '2025-11-22T19:14:56.000Z', 36, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (101, '2025-11-22T19:14:56.000Z', 37, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (102, '2025-11-22T19:14:56.000Z', 40, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (103, '2025-11-22T19:14:56.000Z', 44, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (104, '2025-11-22T19:14:56.000Z', 45, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (105, '2025-11-22T19:14:56.000Z', 47, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (106, '2025-11-22T19:14:56.000Z', 49, 1, 6, NULL, 'attendance', 'Asistencia - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (107, '2025-11-22T19:14:56.000Z', 2, 1, 6, 1, 'placement', 'Posición 1 - Torneo Demo Completo - 22/11/2025', 1000);
INSERT INTO `historical_points` VALUES (108, '2025-11-22T19:14:56.000Z', 2, 1, 6, 1, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (109, '2025-11-22T19:14:56.000Z', 3, 1, 6, 2, 'placement', 'Posición 2 - Torneo Demo Completo - 22/11/2025', 800);
INSERT INTO `historical_points` VALUES (110, '2025-11-22T19:14:56.000Z', 3, 1, 6, 2, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (111, '2025-11-22T19:14:56.000Z', 4, 1, 6, 3, 'placement', 'Posición 3 - Torneo Demo Completo - 22/11/2025', 650);
INSERT INTO `historical_points` VALUES (112, '2025-11-22T19:14:56.000Z', 4, 1, 6, 3, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (113, '2025-11-22T19:14:56.000Z', 5, 1, 6, 4, 'placement', 'Posición 4 - Torneo Demo Completo - 22/11/2025', 500);
INSERT INTO `historical_points` VALUES (114, '2025-11-22T19:14:56.000Z', 5, 1, 6, 4, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (115, '2025-11-22T19:14:56.000Z', 6, 1, 6, 5, 'placement', 'Posición 5 - Torneo Demo Completo - 22/11/2025', 400);
INSERT INTO `historical_points` VALUES (116, '2025-11-22T19:14:56.000Z', 6, 1, 6, 5, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (117, '2025-11-22T19:14:56.000Z', 7, 1, 6, 6, 'placement', 'Posición 6 - Torneo Demo Completo - 22/11/2025', 350);
INSERT INTO `historical_points` VALUES (118, '2025-11-22T19:14:56.000Z', 7, 1, 6, 6, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (119, '2025-11-22T19:14:56.000Z', 8, 1, 6, 7, 'placement', 'Posición 7 - Torneo Demo Completo - 22/11/2025', 300);
INSERT INTO `historical_points` VALUES (120, '2025-11-22T19:14:56.000Z', 8, 1, 6, 7, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (121, '2025-11-22T19:14:56.000Z', 9, 1, 6, 8, 'placement', 'Posición 8 - Torneo Demo Completo - 22/11/2025', 250);
INSERT INTO `historical_points` VALUES (122, '2025-11-22T19:14:56.000Z', 9, 1, 6, 8, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (123, '2025-11-22T19:14:56.000Z', 10, 1, 6, 9, 'placement', 'Posición 9 - Torneo Demo Completo - 22/11/2025', 200);
INSERT INTO `historical_points` VALUES (124, '2025-11-22T19:14:56.000Z', 10, 1, 6, 9, 'final_table', 'Mesa final - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (125, '2025-11-22T19:14:56.000Z', 11, 1, 6, 10, 'placement', 'Posición 10 - Torneo Demo Completo - 22/11/2025', 180);
INSERT INTO `historical_points` VALUES (126, '2025-11-22T19:14:56.000Z', 12, 1, 6, 11, 'placement', 'Posición 11 - Torneo Demo Completo - 22/11/2025', 160);
INSERT INTO `historical_points` VALUES (127, '2025-11-22T19:14:56.000Z', 13, 1, 6, 12, 'placement', 'Posición 12 - Torneo Demo Completo - 22/11/2025', 140);
INSERT INTO `historical_points` VALUES (128, '2025-11-22T19:14:56.000Z', 14, 1, 6, 13, 'placement', 'Posición 13 - Torneo Demo Completo - 22/11/2025', 120);
INSERT INTO `historical_points` VALUES (129, '2025-11-22T19:14:56.000Z', 15, 1, 6, 14, 'placement', 'Posición 14 - Torneo Demo Completo - 22/11/2025', 100);
INSERT INTO `historical_points` VALUES (130, '2025-11-22T19:14:56.000Z', 16, 1, 6, 15, 'placement', 'Posición 15 - Torneo Demo Completo - 22/11/2025', 90);
INSERT INTO `historical_points` VALUES (131, '2025-11-22T19:14:56.000Z', 17, 1, 6, 16, 'placement', 'Posición 16 - Torneo Demo Completo - 22/11/2025', 80);
INSERT INTO `historical_points` VALUES (132, '2025-11-22T19:14:56.000Z', 18, 1, 6, 17, 'placement', 'Posición 17 - Torneo Demo Completo - 22/11/2025', 70);
INSERT INTO `historical_points` VALUES (133, '2025-11-22T19:14:57.000Z', 19, 1, 6, 18, 'placement', 'Posición 18 - Torneo Demo Completo - 22/11/2025', 60);
INSERT INTO `historical_points` VALUES (134, '2025-11-22T19:14:57.000Z', 20, 1, 6, 19, 'placement', 'Posición 19 - Torneo Demo Completo - 22/11/2025', 50);
INSERT INTO `historical_points` VALUES (135, '2025-11-22T19:14:57.000Z', 21, 1, 6, 20, 'placement', 'Posición 20 - Torneo Demo Completo - 22/11/2025', 40);
INSERT INTO `historical_points` VALUES (136, '2025-11-23T18:53:18.000Z', 2, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 1 (20.0%)', 450);
INSERT INTO `historical_points` VALUES (137, '2025-11-23T18:53:18.000Z', 1, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 2 (18.0%)', 405);
INSERT INTO `historical_points` VALUES (138, '2025-11-23T18:53:18.000Z', 3, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 3 (16.0%)', 360);
INSERT INTO `historical_points` VALUES (139, '2025-11-23T18:53:18.000Z', 4, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 4 (14.0%)', 315);
INSERT INTO `historical_points` VALUES (140, '2025-11-23T18:53:18.000Z', 5, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 5 (12.0%)', 270);
INSERT INTO `historical_points` VALUES (141, '2025-11-23T18:53:22.000Z', 2, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 1 (20.0%)', 450);
INSERT INTO `historical_points` VALUES (142, '2025-11-23T18:53:22.000Z', 1, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 2 (18.0%)', 405);
INSERT INTO `historical_points` VALUES (143, '2025-11-23T18:53:22.000Z', 3, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 3 (16.0%)', 360);
INSERT INTO `historical_points` VALUES (144, '2025-11-23T18:53:22.000Z', 4, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 4 (14.0%)', 315);
INSERT INTO `historical_points` VALUES (145, '2025-11-23T18:53:22.000Z', 5, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 5 (12.0%)', 270);
INSERT INTO `historical_points` VALUES (146, '2025-11-23T18:54:17.000Z', 2, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 1 (20.0%)', 450);
INSERT INTO `historical_points` VALUES (147, '2025-11-23T18:54:17.000Z', 1, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 2 (18.0%)', 405);
INSERT INTO `historical_points` VALUES (148, '2025-11-23T18:54:17.000Z', 3, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 3 (16.0%)', 360);
INSERT INTO `historical_points` VALUES (149, '2025-11-23T18:54:17.000Z', 4, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 4 (14.0%)', 315);
INSERT INTO `historical_points` VALUES (150, '2025-11-23T18:54:17.000Z', 5, 1, 9, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 5 (12.0%)', 270);
INSERT INTO `historical_points` VALUES (151, '2025-11-25T19:22:54.000Z', 4, 1, 11, NULL, 'bonus', 'Puntos por cajas - Mesa final posición 1 (20.0%)', 450);

-- Table: payments
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
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: payments
INSERT INTO `payments` VALUES (200, 58, '5.00', '2025-12-01T18:22:48.000Z', 'cash_request', 324, 0, '0.00', NULL, 0, 'admin', '2025-12-01T18:22:48.000Z', '2025-12-01T18:22:48.000Z');
INSERT INTO `payments` VALUES (201, 58, '0.00', '2025-12-01T18:22:48.000Z', 'cash', 324, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T18:22:48.000Z', '2025-12-01T18:22:48.000Z');
INSERT INTO `payments` VALUES (202, 230, '123.00', '2025-12-01T18:23:25.000Z', 'cash_request', 325, 0, '0.00', NULL, 0, 'admin', '2025-12-01T18:23:25.000Z', '2025-12-01T18:23:25.000Z');
INSERT INTO `payments` VALUES (203, 230, '0.00', '2025-12-01T18:23:25.000Z', 'cash', 325, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T18:23:25.000Z', '2025-12-01T18:23:25.000Z');
INSERT INTO `payments` VALUES (204, 216, '123.00', '2025-12-01T18:30:21.000Z', 'tournament', 2133, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T18:30:21.000Z', '2025-12-01T18:30:21.000Z');
INSERT INTO `payments` VALUES (205, 1, '123123.00', '2025-12-01T19:18:33.000Z', 'cash_commission', 37, 1, '123123.00', 'commission|by:admin:1', 0, 'admin', '2025-12-01T19:18:33.000Z', '2025-12-01T19:18:33.000Z');
INSERT INTO `payments` VALUES (207, 227, '0.00', '2025-12-01T19:19:41.000Z', 'cash', 326, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T19:19:41.000Z', '2025-12-01T19:19:41.000Z');
INSERT INTO `payments` VALUES (208, 250, '5.00', '2025-12-01T19:44:32.000Z', 'tournament', 2134, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T19:44:32.000Z', '2025-12-01T19:44:32.000Z');
INSERT INTO `payments` VALUES (209, 250, '5.00', '2025-12-01T19:44:59.000Z', 'tournament', 2135, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T19:44:59.000Z', '2025-12-01T19:44:59.000Z');
INSERT INTO `payments` VALUES (210, 235, '5.00', '2025-12-01T19:48:01.000Z', 'tournament', 2136, 1, '5.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T19:48:01.000Z', '2025-12-01T19:48:01.000Z');
INSERT INTO `payments` VALUES (211, 225, '5.00', '2025-12-01T19:53:49.000Z', 'tournament', 2137, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T19:53:49.000Z', '2025-12-01T19:53:49.000Z');
INSERT INTO `payments` VALUES (212, 217, '8.00', '2025-12-01T19:59:51.000Z', 'tournament', 2138, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-01T19:59:51.000Z', '2025-12-01T19:59:51.000Z');
INSERT INTO `payments` VALUES (213, 1, '1000.00', '2025-12-02T17:36:09.000Z', 'cash_commission', 38, 1, '1000.00', 'commission|by:admin:1', 0, 'admin', '2025-12-02T17:36:09.000Z', '2025-12-02T17:36:09.000Z');
INSERT INTO `payments` VALUES (214, 264, '0.00', '2025-12-02T17:40:04.000Z', 'cash', 327, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T17:40:04.000Z', '2025-12-02T17:40:04.000Z');
INSERT INTO `payments` VALUES (215, 1, '1000.00', '2025-12-02T17:49:35.000Z', 'cash_commission', 39, 1, '1000.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T17:49:35.000Z', '2025-12-02T17:49:35.000Z');
INSERT INTO `payments` VALUES (216, 1, '123.00', '2025-12-02T17:50:17.000Z', 'cash_commission', 39, 1, '123.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T17:50:17.000Z', '2025-12-02T17:50:17.000Z');
INSERT INTO `payments` VALUES (217, 220, '1231123123.00', '2025-12-02T18:17:23.000Z', 'cash_request', 328, 0, '0.00', NULL, 0, 'admin', '2025-12-02T18:17:23.000Z', '2025-12-02T18:17:23.000Z');
INSERT INTO `payments` VALUES (218, 220, '0.00', '2025-12-02T18:17:23.000Z', 'cash', 328, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T18:17:23.000Z', '2025-12-02T18:17:23.000Z');
INSERT INTO `payments` VALUES (219, 1, '2222.00', '2025-12-02T18:17:49.000Z', 'cash_commission', 40, 1, '2222.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T18:17:49.000Z', '2025-12-02T18:17:49.000Z');
INSERT INTO `payments` VALUES (220, 1, '333.00', '2025-12-02T18:21:31.000Z', 'cash_commission', 40, 1, '333.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T18:21:31.000Z', '2025-12-02T18:21:31.000Z');
INSERT INTO `payments` VALUES (221, 1, '7555.00', '2025-12-02T18:23:25.000Z', 'cash_commission', 40, 1, '7555.00', 'commission|by:admin:1', 0, 'admin', '2025-12-02T18:23:25.000Z', '2025-12-02T18:23:25.000Z');
INSERT INTO `payments` VALUES (222, 228, '0.00', '2025-12-02T18:23:39.000Z', 'cash', 329, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T18:23:39.000Z', '2025-12-02T18:23:39.000Z');
INSERT INTO `payments` VALUES (223, 1, '56678.00', '2025-12-02T18:28:17.000Z', 'cash_commission', 39, 1, '56678.00', 'commission|by:admin:1', 0, 'admin', '2025-12-02T18:28:17.000Z', '2025-12-02T18:28:17.000Z');
INSERT INTO `payments` VALUES (224, 216, '0.00', '2025-12-02T18:29:04.000Z', 'cash', 330, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T18:29:04.000Z', '2025-12-02T18:29:04.000Z');
INSERT INTO `payments` VALUES (225, 225, '1.00', '2025-12-02T18:29:34.000Z', 'cash_request', 331, 0, '0.00', NULL, 0, 'admin', '2025-12-02T18:29:34.000Z', '2025-12-02T18:29:34.000Z');
INSERT INTO `payments` VALUES (226, 225, '0.00', '2025-12-02T18:29:34.000Z', 'cash', 331, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T18:29:34.000Z', '2025-12-02T18:29:34.000Z');
INSERT INTO `payments` VALUES (227, 225, '1.00', '2025-12-02T18:47:16.000Z', 'cash_request', 333, 0, '0.00', NULL, 0, 'admin', '2025-12-02T18:47:16.000Z', '2025-12-02T18:47:16.000Z');
INSERT INTO `payments` VALUES (228, 225, '0.00', '2025-12-02T18:47:16.000Z', 'cash', 333, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T18:47:16.000Z', '2025-12-02T18:47:16.000Z');
INSERT INTO `payments` VALUES (229, 245, '10000.00', '2025-12-02T19:00:23.000Z', 'cash_request', 334, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:00:23.000Z', '2025-12-02T19:00:23.000Z');
INSERT INTO `payments` VALUES (230, 245, '0.00', '2025-12-02T19:00:23.000Z', 'cash', 334, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T19:00:23.000Z', '2025-12-02T19:00:23.000Z');
INSERT INTO `payments` VALUES (231, 216, '10000.00', '2025-12-02T19:02:52.000Z', 'cash_request', 335, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:02:52.000Z', '2025-12-02T19:02:52.000Z');
INSERT INTO `payments` VALUES (232, 216, '0.00', '2025-12-02T19:02:52.000Z', 'cash', 335, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T19:02:52.000Z', '2025-12-02T19:02:52.000Z');
INSERT INTO `payments` VALUES (233, 216, '12000.00', '2025-12-02T19:03:34.000Z', 'cash_request', 336, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:03:34.000Z', '2025-12-02T19:03:34.000Z');
INSERT INTO `payments` VALUES (234, 216, '0.00', '2025-12-02T19:03:34.000Z', 'cash', 336, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T19:03:34.000Z', '2025-12-02T19:03:34.000Z');
INSERT INTO `payments` VALUES (235, 259, '55555.00', '2025-12-02T19:07:06.000Z', 'cash_request', 337, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:07:06.000Z', '2025-12-02T19:07:06.000Z');
INSERT INTO `payments` VALUES (236, 259, '0.00', '2025-12-02T19:07:06.000Z', 'cash', 337, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T19:07:06.000Z', '2025-12-02T19:07:06.000Z');
INSERT INTO `payments` VALUES (237, 224, '9999.00', '2025-12-02T19:11:36.000Z', 'cash_request', 338, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:11:36.000Z', '2025-12-02T19:11:36.000Z');
INSERT INTO `payments` VALUES (238, 224, '0.00', '2025-12-02T19:11:36.000Z', 'cash', 338, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:11:36.000Z', '2025-12-02T19:11:36.000Z');
INSERT INTO `payments` VALUES (239, 1, '123.00', '2025-12-02T19:12:11.000Z', 'cash_commission', 49, 1, '123.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:12:11.000Z', '2025-12-02T19:12:11.000Z');
INSERT INTO `payments` VALUES (240, 1, '99.00', '2025-12-02T19:13:26.000Z', 'cash_commission', 49, 1, '99.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:13:26.000Z', '2025-12-02T19:13:26.000Z');
INSERT INTO `payments` VALUES (241, 1, '222.00', '2025-12-02T19:15:50.000Z', 'cash_commission', 49, 1, '222.00', 'commission|by:admin:1', 0, 'admin', '2025-12-02T19:15:50.000Z', '2025-12-02T19:15:50.000Z');
INSERT INTO `payments` VALUES (242, 249, '33333.00', '2025-12-02T19:17:19.000Z', 'cash_request', 339, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:17:19.000Z', '2025-12-02T19:17:19.000Z');
INSERT INTO `payments` VALUES (243, 249, '0.00', '2025-12-02T19:17:19.000Z', 'cash', 339, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:17:19.000Z', '2025-12-02T19:17:19.000Z');
INSERT INTO `payments` VALUES (244, 1, '12.00', '2025-12-02T19:18:31.000Z', 'cash_commission', 50, 1, '12.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:18:31.000Z', '2025-12-02T19:18:31.000Z');
INSERT INTO `payments` VALUES (245, 225, '33333.00', '2025-12-02T19:18:52.000Z', 'cash_request', 340, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:18:52.000Z', '2025-12-02T19:18:52.000Z');
INSERT INTO `payments` VALUES (246, 225, '0.00', '2025-12-02T19:18:52.000Z', 'cash', 340, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:18:52.000Z', '2025-12-02T19:18:52.000Z');
INSERT INTO `payments` VALUES (247, 1, '333.00', '2025-12-02T19:19:21.000Z', 'cash_commission', 50, 1, '333.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:19:21.000Z', '2025-12-02T19:19:21.000Z');
INSERT INTO `payments` VALUES (248, 1, '345.00', '2025-12-02T19:19:51.000Z', 'cash_commission', 50, 1, '345.00', 'commission|by:admin:1', 0, 'admin', '2025-12-02T19:19:51.000Z', '2025-12-02T19:19:51.000Z');
INSERT INTO `payments` VALUES (249, 225, '1000.00', '2025-12-02T19:20:40.000Z', 'cash_request', 341, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:20:40.000Z', '2025-12-02T19:20:40.000Z');
INSERT INTO `payments` VALUES (250, 225, '0.00', '2025-12-02T19:20:40.000Z', 'cash', 341, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:20:40.000Z', '2025-12-02T19:20:40.000Z');
INSERT INTO `payments` VALUES (251, 1, '4.00', '2025-12-02T19:20:52.000Z', 'cash_commission', 51, 1, '4.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:20:52.000Z', '2025-12-02T19:20:52.000Z');
INSERT INTO `payments` VALUES (252, 217, '4.00', '2025-12-02T19:21:06.000Z', 'cash_request', 342, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:21:06.000Z', '2025-12-02T19:21:06.000Z');
INSERT INTO `payments` VALUES (253, 217, '0.00', '2025-12-02T19:21:06.000Z', 'cash', 342, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:21:06.000Z', '2025-12-02T19:21:06.000Z');
INSERT INTO `payments` VALUES (254, 1, '55.00', '2025-12-02T19:21:52.000Z', 'cash_commission', 51, 1, '55.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:21:52.000Z', '2025-12-02T19:21:52.000Z');
INSERT INTO `payments` VALUES (255, 225, '100.00', '2025-12-02T19:27:06.000Z', 'tournament', 2139, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T19:27:06.000Z', '2025-12-02T19:27:06.000Z');
INSERT INTO `payments` VALUES (256, 254, '100.00', '2025-12-02T19:27:15.000Z', 'tournament', 2140, 0, '0.00', 'cash|by:admin:1', 0, 'admin', '2025-12-02T19:27:15.000Z', '2025-12-02T19:27:15.000Z');
INSERT INTO `payments` VALUES (257, 1, '123.00', '2025-12-02T19:35:09.000Z', 'cash_commission', 51, 1, '123.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:35:09.000Z', '2025-12-02T19:35:09.000Z');
INSERT INTO `payments` VALUES (258, 1, '182.00', '2025-12-02T19:36:10.000Z', 'cash_commission', 51, 1, '182.00', 'commission|by:admin:1', 0, 'admin', '2025-12-02T19:36:10.000Z', '2025-12-02T19:36:10.000Z');
INSERT INTO `payments` VALUES (259, 265, '13123.00', '2025-12-02T19:37:02.000Z', 'cash_request', 343, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:37:02.000Z', '2025-12-02T19:37:02.000Z');
INSERT INTO `payments` VALUES (260, 265, '0.00', '2025-12-02T19:37:02.000Z', 'cash', 343, 0, '0.00', NULL, 0, 'admin', '2025-12-02T19:37:02.000Z', '2025-12-02T19:37:02.000Z');
INSERT INTO `payments` VALUES (261, 1, '222.00', '2025-12-02T19:39:54.000Z', 'cash_commission', 52, 1, '222.00', 'shift_commission|by:admin', 0, 'admin', '2025-12-02T19:39:54.000Z', '2025-12-02T19:39:54.000Z');

-- Table: players
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `current_points` int DEFAULT '0',
  `suspended` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ranking_history
DROP TABLE IF EXISTS `ranking_history`;
CREATE TABLE `ranking_history` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `user_id` int unsigned NOT NULL,
  `season_id` int unsigned NOT NULL,
  `posicion` int NOT NULL,
  `puntos_acumulados` int NOT NULL,
  `torneos_jugados` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: registrations
DROP TABLE IF EXISTS `registrations`;
CREATE TABLE `registrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `tournament_id` int unsigned NOT NULL,
  `registration_date` datetime NOT NULL,
  `punctuality` tinyint(1) NOT NULL,
  `position` int unsigned DEFAULT NULL,
  `action_type` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `tournament_id` (`tournament_id`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: registrations
INSERT INTO `registrations` VALUES (1174, 224, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1175, 256, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1176, 220, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1177, 252, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1178, 252, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1179, 249, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1180, 262, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1181, 262, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1182, 258, 57, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1183, 250, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1184, 250, 57, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1185, 245, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1186, 238, 57, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1187, 234, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1188, 58, 57, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1189, 214, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1190, 251, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1191, 251, 57, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1192, 231, 57, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1193, 247, 57, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1194, 261, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1195, 261, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1196, 225, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1197, 225, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1198, 224, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1199, 224, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1200, 257, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1201, 257, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1202, 257, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1203, 237, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1204, 235, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1205, 235, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1206, 226, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1207, 226, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1208, 214, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1209, 248, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1210, 219, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1211, 242, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1212, 252, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1213, 252, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1214, 259, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1215, 251, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1216, 251, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1217, 251, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1218, 217, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1219, 217, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1220, 239, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1221, 239, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1222, 215, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1223, 250, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1224, 250, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1225, 250, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1226, 245, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1227, 245, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1228, 249, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1229, 1, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1230, 255, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1231, 222, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1232, 222, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1233, 230, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1234, 216, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1235, 216, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1236, 234, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1237, 234, 58, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1238, 232, 58, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1239, 218, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1240, 218, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1241, 262, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1242, 230, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1243, 249, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1244, 246, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1245, 223, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1246, 223, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1247, 261, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1248, 261, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1249, 239, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1250, 214, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1251, 235, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1252, 237, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1253, 237, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1254, 259, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1255, 259, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1256, 224, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1257, 215, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1258, 215, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1259, 226, 59, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1260, 226, 59, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1261, 230, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1262, 230, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1263, 243, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1264, 243, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1265, 236, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1266, 236, 60, '2025-12-01T04:10:07.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1267, 242, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1268, 242, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1269, 225, 60, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1270, 247, 60, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1271, 219, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1272, 219, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1273, 238, 60, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1274, 216, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1275, 241, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1276, 240, 60, '2025-12-01T04:10:07.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1277, 1, 60, '2025-12-01T04:10:07.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1278, 1, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1279, 220, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1280, 250, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1281, 250, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1282, 217, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1283, 217, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1284, 252, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1285, 218, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1286, 246, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1287, 246, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1288, 245, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1289, 245, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1290, 263, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1291, 251, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1292, 226, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1293, 254, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1294, 255, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1295, 255, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1296, 224, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1297, 224, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1298, 260, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1299, 260, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1300, 237, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1301, 237, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1302, 258, 60, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1303, 228, 60, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1304, 223, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1305, 252, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1306, 227, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1307, 251, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1308, 251, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1309, 259, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1310, 257, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1311, 257, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1312, 222, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1313, 225, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1314, 225, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1315, 228, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1316, 228, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1317, 228, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1318, 1, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1319, 260, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1320, 260, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1321, 247, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1322, 247, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1323, 219, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1324, 241, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1325, 229, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1326, 229, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1327, 242, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1328, 242, 61, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1329, 263, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1330, 234, 61, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1331, 219, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1332, 231, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1333, 231, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1334, 254, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1335, 233, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1336, 233, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1337, 225, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1338, 225, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1339, 225, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1340, 221, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1341, 236, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1342, 249, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1343, 249, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1344, 259, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1345, 259, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1346, 224, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1347, 245, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1348, 245, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1349, 245, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1350, 227, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1351, 58, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1352, 262, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1353, 261, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1354, 1, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1355, 241, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1356, 241, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1357, 218, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1358, 218, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1359, 218, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1360, 258, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1361, 258, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1362, 229, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1363, 247, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1364, 228, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1365, 222, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1366, 222, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1367, 238, 62, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1368, 238, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1369, 239, 62, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1370, 257, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1371, 253, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1372, 253, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1373, 1, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1374, 1, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1375, 261, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1376, 256, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1377, 239, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1378, 239, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1379, 240, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1380, 247, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1381, 221, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1382, 219, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1383, 263, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1384, 263, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1385, 252, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1386, 252, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1387, 259, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1388, 232, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1389, 232, 63, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1390, 232, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1391, 241, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1392, 217, 63, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1393, 58, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1394, 58, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1395, 263, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1396, 263, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1397, 235, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1398, 235, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1399, 256, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1400, 236, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1401, 219, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1402, 258, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1403, 258, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1404, 259, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1405, 246, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1406, 246, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1407, 216, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1408, 230, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1409, 230, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1410, 233, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1411, 225, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1412, 257, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1413, 1, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1414, 231, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1415, 255, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1416, 255, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1417, 238, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1418, 237, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1419, 237, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1420, 226, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1421, 226, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1422, 243, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1423, 243, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1424, 251, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1425, 248, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1426, 248, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1427, 260, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1428, 214, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1429, 234, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1430, 234, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1431, 241, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1432, 241, 64, '2025-12-01T04:10:08.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1433, 229, 64, '2025-12-01T04:10:08.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1434, 242, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1435, 242, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1436, 254, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1437, 254, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1438, 217, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1439, 217, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1440, 253, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1441, 244, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1442, 259, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1443, 233, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1444, 233, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1445, 229, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1446, 263, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1447, 214, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1448, 219, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1449, 260, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1450, 251, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1451, 58, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1452, 215, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1453, 240, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1454, 230, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1455, 235, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1456, 235, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1457, 235, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1458, 255, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1459, 255, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1460, 255, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1461, 261, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1462, 223, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1463, 223, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1464, 248, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1465, 248, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1466, 221, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1467, 232, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1468, 237, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1469, 227, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1470, 227, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1471, 238, 65, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1472, 226, 65, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1473, 254, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1474, 254, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1475, 219, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1476, 233, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1477, 233, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1478, 233, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1479, 253, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1480, 218, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1481, 259, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1482, 255, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1483, 260, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1484, 232, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1485, 223, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1486, 223, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1487, 58, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1488, 230, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1489, 230, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1490, 244, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1491, 244, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1492, 244, 66, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1493, 262, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1494, 226, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1495, 239, 66, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1496, 221, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1497, 221, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1498, 1, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1499, 1, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1500, 226, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1501, 256, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1502, 256, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1503, 237, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1504, 237, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1505, 250, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1506, 225, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1507, 214, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1508, 239, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1509, 239, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1510, 248, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1511, 248, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1512, 259, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1513, 215, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1514, 216, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1515, 216, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1516, 229, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1517, 229, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1518, 220, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1519, 220, 67, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1520, 220, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1521, 257, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1522, 255, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1523, 255, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1524, 238, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1525, 238, 67, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1526, 234, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1527, 257, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1528, 257, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1529, 252, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1530, 239, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1531, 247, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1532, 216, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1533, 216, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1534, 216, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1535, 260, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1536, 221, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1537, 237, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1538, 226, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1539, 255, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1540, 259, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1541, 259, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1542, 258, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1543, 243, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1544, 218, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1545, 262, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1546, 223, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1547, 223, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1548, 263, 68, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1549, 263, 68, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1550, 258, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1551, 238, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1552, 217, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1553, 217, 69, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1554, 214, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1555, 214, 69, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1556, 244, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1557, 259, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1558, 243, 69, '2025-12-01T04:10:09.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1559, 243, 69, '2025-12-01T04:10:09.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1560, 254, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1561, 251, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1562, 253, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1563, 225, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1564, 215, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1565, 215, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1566, 256, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1567, 222, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1568, 260, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1569, 219, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1570, 226, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1571, 228, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1572, 228, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1573, 235, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1574, 235, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1575, 235, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1576, 263, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1577, 263, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1578, 58, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1579, 58, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1580, 250, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1581, 224, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1582, 229, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1583, 255, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1584, 255, 69, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1585, 249, 69, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1586, 260, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1587, 217, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1588, 236, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1589, 222, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1590, 222, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1591, 215, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1592, 246, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1593, 263, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1594, 263, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1595, 241, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1596, 241, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1597, 1, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1598, 245, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1599, 232, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1600, 232, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1601, 223, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1602, 254, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1603, 254, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1604, 240, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1605, 234, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1606, 234, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1607, 250, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1608, 229, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1609, 229, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1610, 230, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1611, 251, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1612, 252, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1613, 252, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1614, 252, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1615, 242, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1616, 220, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1617, 220, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1618, 220, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1619, 239, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1620, 233, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1621, 233, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1622, 243, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1623, 243, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1624, 226, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1625, 247, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1626, 253, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1627, 253, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1628, 249, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1629, 249, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1630, 248, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1631, 248, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1632, 216, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1633, 216, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1634, 216, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1635, 218, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1636, 58, 70, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1637, 58, 70, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1638, 216, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1639, 216, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1640, 232, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1641, 232, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1642, 252, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1643, 252, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1644, 253, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1645, 253, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1646, 234, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1647, 221, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1648, 221, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1649, 215, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1650, 215, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1651, 222, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1652, 231, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1653, 217, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1654, 217, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1655, 230, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1656, 250, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1657, 250, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1658, 235, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1659, 235, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1660, 249, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1661, 249, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1662, 257, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1663, 257, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1664, 224, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1665, 224, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1666, 238, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1667, 238, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1668, 238, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1669, 233, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1670, 255, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1671, 58, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1672, 214, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1673, 259, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1674, 226, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1675, 236, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1676, 219, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1677, 219, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1678, 242, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1679, 218, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1680, 218, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1681, 260, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1682, 228, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1683, 239, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1684, 262, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1685, 262, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1686, 262, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1687, 229, 71, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1688, 251, 71, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1689, 216, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1690, 216, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1691, 238, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1692, 241, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1693, 241, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1694, 244, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1695, 244, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1696, 243, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1697, 243, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1698, 235, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1699, 235, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1700, 252, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1701, 252, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1702, 239, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1703, 245, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1704, 234, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1705, 219, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1706, 232, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1707, 232, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1708, 232, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1709, 256, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1710, 215, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1711, 250, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1712, 249, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1713, 249, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1714, 225, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1715, 231, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1716, 222, 72, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1717, 253, 72, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1718, 238, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1719, 258, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1720, 258, 73, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1721, 225, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1722, 252, 73, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1723, 249, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1724, 221, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1725, 221, 73, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1726, 262, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1727, 262, 73, '2025-12-01T04:10:10.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1728, 262, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1729, 250, 73, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1730, 58, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1731, 229, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1732, 233, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1733, 239, 73, '2025-12-01T04:10:10.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1734, 236, 73, '2025-12-01T04:10:10.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1735, 219, 73, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1736, 219, 73, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1737, 224, 73, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1738, 224, 73, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1739, 224, 73, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1740, 240, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1741, 255, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1742, 214, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1743, 214, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1744, 221, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1745, 259, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1746, 260, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1747, 241, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1748, 241, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1749, 246, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1750, 237, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1751, 237, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1752, 58, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1753, 248, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1754, 236, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1755, 243, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1756, 242, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1757, 215, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1758, 231, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1759, 231, 74, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1760, 263, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1761, 217, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1762, 217, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1763, 258, 74, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1764, 237, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1765, 237, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1766, 237, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1767, 254, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1768, 239, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1769, 239, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1770, 239, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1771, 218, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1772, 218, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1773, 1, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1774, 241, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1775, 241, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1776, 244, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1777, 247, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1778, 236, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1779, 217, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1780, 224, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1781, 215, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1782, 219, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1783, 227, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1784, 262, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1785, 260, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1786, 235, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1787, 235, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1788, 242, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1789, 242, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1790, 229, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1791, 225, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1792, 251, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1793, 245, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1794, 245, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1795, 226, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1796, 226, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1797, 222, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1798, 221, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1799, 216, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1800, 257, 75, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1801, 257, 75, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1802, 258, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1803, 240, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1804, 240, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1805, 227, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1806, 234, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1807, 230, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1808, 219, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1809, 225, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1810, 225, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1811, 218, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1812, 244, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1813, 220, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1814, 220, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1815, 236, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1816, 236, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1817, 247, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1818, 235, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1819, 235, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1820, 214, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1821, 231, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1822, 217, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1823, 222, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1824, 58, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1825, 58, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1826, 257, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1827, 250, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1828, 253, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1829, 253, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1830, 1, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1831, 1, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1832, 216, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1833, 237, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1834, 249, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1835, 249, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1836, 228, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1837, 243, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1838, 248, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1839, 248, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1840, 224, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1841, 233, 76, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1842, 233, 76, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1843, 216, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1844, 216, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1845, 1, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1846, 1, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1847, 229, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1848, 261, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1849, 261, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1850, 234, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1851, 235, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1852, 223, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1853, 223, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1854, 246, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1855, 246, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1856, 246, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1857, 218, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1858, 218, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1859, 228, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1860, 215, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1861, 215, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1862, 243, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1863, 243, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1864, 231, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1865, 231, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1866, 255, 77, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1867, 255, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1868, 225, 77, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1869, 217, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1870, 225, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1871, 253, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1872, 240, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1873, 58, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1874, 233, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1875, 237, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1876, 226, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1877, 218, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1878, 218, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1879, 230, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1880, 246, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1881, 238, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1882, 242, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1883, 219, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1884, 257, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1885, 257, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1886, 247, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1887, 258, 78, '2025-12-01T04:10:11.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1888, 231, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1889, 254, 78, '2025-12-01T04:10:11.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1890, 227, 78, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1891, 234, 78, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1892, 251, 78, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1893, 259, 78, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1894, 252, 78, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1895, 262, 78, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1896, 262, 78, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1897, 263, 78, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1898, 263, 78, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1899, 243, 78, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1900, 229, 78, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1901, 220, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1902, 220, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1903, 224, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1904, 58, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1905, 58, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1906, 262, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1907, 256, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1908, 255, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1909, 241, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1910, 241, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1911, 226, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1912, 233, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1913, 233, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1914, 214, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1915, 223, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1916, 246, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1917, 239, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1918, 259, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1919, 215, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1920, 215, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1921, 243, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1922, 216, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1923, 257, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1924, 258, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1925, 258, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1926, 225, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1927, 225, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1928, 248, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1929, 250, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1930, 261, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1931, 236, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1932, 229, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1933, 244, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1934, 244, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1935, 245, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1936, 245, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1937, 252, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1938, 221, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1939, 221, 79, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1940, 230, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1941, 230, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1942, 219, 79, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1943, 221, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1944, 214, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1945, 214, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1946, 214, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1947, 259, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1948, 256, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1949, 241, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1950, 245, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1951, 247, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1952, 247, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1953, 224, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1954, 224, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1955, 240, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1956, 240, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1957, 215, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1958, 242, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1959, 260, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1960, 260, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1961, 235, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1962, 244, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1963, 257, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1964, 229, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1965, 234, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1966, 234, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1967, 225, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1968, 263, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1969, 1, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1970, 227, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1971, 255, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1972, 243, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1973, 262, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1974, 219, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1975, 222, 80, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1976, 251, 80, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1977, 214, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1978, 238, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1979, 233, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1980, 233, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1981, 257, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1982, 250, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1983, 222, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1984, 222, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1985, 225, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1986, 225, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1987, 225, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1988, 259, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1989, 263, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1990, 263, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1991, 253, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1992, 253, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1993, 253, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (1994, 232, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1995, 248, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1996, 258, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (1997, 239, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (1998, 239, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (1999, 221, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2000, 246, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2001, 246, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2002, 246, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2003, 261, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2004, 261, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2005, 58, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2006, 230, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2007, 230, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2008, 241, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2009, 241, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2010, 262, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2011, 262, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2012, 262, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2013, 256, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2014, 256, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2015, 235, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2016, 235, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2017, 240, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2018, 245, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2019, 220, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2020, 215, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2021, 226, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2022, 226, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2023, 219, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2024, 219, 81, '2025-12-01T04:10:12.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2025, 234, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2026, 218, 81, '2025-12-01T04:10:12.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2027, 257, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2028, 257, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2029, 251, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2030, 222, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2031, 222, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2032, 217, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2033, 228, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2034, 247, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2035, 247, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2036, 247, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2037, 243, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2038, 243, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2039, 234, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2040, 216, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2041, 216, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2042, 260, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2043, 223, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2044, 239, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2045, 237, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2046, 237, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2047, 227, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2048, 229, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2049, 236, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2050, 236, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2051, 252, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2052, 241, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2053, 241, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2054, 226, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2055, 1, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2056, 232, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2057, 254, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2058, 58, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2059, 263, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2060, 235, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2061, 253, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2062, 233, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2063, 233, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2064, 219, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2065, 219, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2066, 240, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2067, 240, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2068, 224, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2069, 224, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2070, 245, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2071, 256, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2072, 259, 82, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2073, 244, 82, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2074, 214, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2075, 249, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2076, 219, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2077, 243, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2078, 243, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2079, 227, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2080, 234, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2081, 248, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2082, 233, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2083, 233, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2084, 220, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2085, 221, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2086, 253, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2087, 215, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2088, 215, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2089, 247, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2090, 239, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2091, 261, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2092, 261, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2093, 225, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2094, 225, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2095, 254, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2096, 238, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2097, 222, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2098, 1, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2099, 241, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2100, 241, 83, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2101, 241, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2102, 218, 83, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2103, 225, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2104, 225, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2105, 225, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2106, 254, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2107, 254, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2108, 245, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2109, 221, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2110, 240, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2111, 240, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 3);
INSERT INTO `registrations` VALUES (2112, 235, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2113, 235, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2114, 231, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2115, 231, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2116, 250, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2117, 249, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2118, 223, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2119, 223, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2120, 241, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2121, 218, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2122, 218, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2123, 262, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2124, 262, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2125, 228, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2126, 263, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2127, 215, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2128, 237, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2129, 255, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2130, 247, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2131, 247, 84, '2025-12-01T04:10:13.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2132, 220, 84, '2025-12-01T04:10:13.000Z', 1, NULL, 1);
INSERT INTO `registrations` VALUES (2133, 216, 85, '2025-12-01T18:30:21.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2134, 250, 89, '2025-12-01T19:44:32.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2135, 250, 89, '2025-12-01T19:44:59.000Z', 0, NULL, 2);
INSERT INTO `registrations` VALUES (2136, 235, 89, '2025-12-01T19:48:01.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2137, 225, 89, '2025-12-01T19:53:49.000Z', 0, NULL, 3);
INSERT INTO `registrations` VALUES (2138, 217, 89, '2025-12-01T19:59:51.000Z', 0, NULL, 3);
INSERT INTO `registrations` VALUES (2139, 225, 90, '2025-12-02T19:27:06.000Z', 0, NULL, 1);
INSERT INTO `registrations` VALUES (2140, 254, 90, '2025-12-02T19:27:15.000Z', 0, NULL, 1);

-- Table: results
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
) ENGINE=InnoDB AUTO_INCREMENT=1391 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: results
INSERT INTO `results` VALUES (726, 57, 224, 3, 0);
INSERT INTO `results` VALUES (727, 57, 256, 12, 0);
INSERT INTO `results` VALUES (728, 57, 220, 14, 0);
INSERT INTO `results` VALUES (729, 57, 252, 7, 0);
INSERT INTO `results` VALUES (730, 57, 249, 2, 0);
INSERT INTO `results` VALUES (731, 57, 262, 8, 0);
INSERT INTO `results` VALUES (732, 57, 258, 5, 0);
INSERT INTO `results` VALUES (733, 57, 250, 10, 0);
INSERT INTO `results` VALUES (734, 57, 245, 7, 0);
INSERT INTO `results` VALUES (735, 57, 238, 2, 0);
INSERT INTO `results` VALUES (736, 57, 234, 1, 0);
INSERT INTO `results` VALUES (737, 57, 58, 11, 0);
INSERT INTO `results` VALUES (738, 57, 214, 4, 0);
INSERT INTO `results` VALUES (739, 57, 251, 9, 0);
INSERT INTO `results` VALUES (740, 57, 231, 6, 0);
INSERT INTO `results` VALUES (741, 57, 247, 13, 0);
INSERT INTO `results` VALUES (742, 58, 261, 4, 0);
INSERT INTO `results` VALUES (743, 58, 225, 7, 0);
INSERT INTO `results` VALUES (744, 58, 224, 2, 0);
INSERT INTO `results` VALUES (745, 58, 257, 25, 0);
INSERT INTO `results` VALUES (746, 58, 237, 15, 0);
INSERT INTO `results` VALUES (747, 58, 235, 1, 0);
INSERT INTO `results` VALUES (748, 58, 226, 16, 0);
INSERT INTO `results` VALUES (749, 58, 214, 9, 0);
INSERT INTO `results` VALUES (750, 58, 248, 17, 0);
INSERT INTO `results` VALUES (751, 58, 219, 11, 0);
INSERT INTO `results` VALUES (752, 58, 242, 22, 0);
INSERT INTO `results` VALUES (753, 58, 252, 8, 0);
INSERT INTO `results` VALUES (754, 58, 259, 23, 0);
INSERT INTO `results` VALUES (755, 58, 251, 18, 0);
INSERT INTO `results` VALUES (756, 58, 217, 3, 0);
INSERT INTO `results` VALUES (757, 58, 239, 24, 0);
INSERT INTO `results` VALUES (758, 58, 215, 10, 0);
INSERT INTO `results` VALUES (759, 58, 250, 19, 0);
INSERT INTO `results` VALUES (760, 58, 245, 13, 0);
INSERT INTO `results` VALUES (761, 58, 249, 26, 0);
INSERT INTO `results` VALUES (762, 58, 1, 20, 0);
INSERT INTO `results` VALUES (763, 58, 255, 5, 0);
INSERT INTO `results` VALUES (764, 58, 222, 6, 0);
INSERT INTO `results` VALUES (765, 58, 230, 12, 0);
INSERT INTO `results` VALUES (766, 58, 216, 21, 0);
INSERT INTO `results` VALUES (767, 58, 234, 14, 0);
INSERT INTO `results` VALUES (768, 58, 232, 27, 0);
INSERT INTO `results` VALUES (769, 59, 218, 3, 0);
INSERT INTO `results` VALUES (770, 59, 262, 5, 0);
INSERT INTO `results` VALUES (771, 59, 230, 1, 0);
INSERT INTO `results` VALUES (772, 59, 249, 6, 0);
INSERT INTO `results` VALUES (773, 59, 246, 12, 0);
INSERT INTO `results` VALUES (774, 59, 223, 13, 0);
INSERT INTO `results` VALUES (775, 59, 261, 7, 0);
INSERT INTO `results` VALUES (776, 59, 239, 15, 0);
INSERT INTO `results` VALUES (777, 59, 214, 4, 0);
INSERT INTO `results` VALUES (778, 59, 235, 8, 0);
INSERT INTO `results` VALUES (779, 59, 237, 11, 0);
INSERT INTO `results` VALUES (780, 59, 259, 2, 0);
INSERT INTO `results` VALUES (781, 59, 224, 9, 0);
INSERT INTO `results` VALUES (782, 59, 215, 10, 0);
INSERT INTO `results` VALUES (783, 59, 226, 14, 0);
INSERT INTO `results` VALUES (784, 60, 230, 26, 0);
INSERT INTO `results` VALUES (785, 60, 243, 3, 0);
INSERT INTO `results` VALUES (786, 60, 236, 27, 0);
INSERT INTO `results` VALUES (787, 60, 242, 9, 0);
INSERT INTO `results` VALUES (788, 60, 225, 2, 0);
INSERT INTO `results` VALUES (789, 60, 247, 19, 0);
INSERT INTO `results` VALUES (790, 60, 219, 4, 0);
INSERT INTO `results` VALUES (791, 60, 238, 17, 0);
INSERT INTO `results` VALUES (792, 60, 216, 24, 0);
INSERT INTO `results` VALUES (793, 60, 241, 6, 0);
INSERT INTO `results` VALUES (794, 60, 240, 1, 0);
INSERT INTO `results` VALUES (795, 60, 1, 12, 0);
INSERT INTO `results` VALUES (796, 60, 220, 23, 0);
INSERT INTO `results` VALUES (797, 60, 250, 13, 0);
INSERT INTO `results` VALUES (798, 60, 217, 21, 0);
INSERT INTO `results` VALUES (799, 60, 252, 28, 0);
INSERT INTO `results` VALUES (800, 60, 218, 10, 0);
INSERT INTO `results` VALUES (801, 60, 246, 5, 0);
INSERT INTO `results` VALUES (802, 60, 245, 16, 0);
INSERT INTO `results` VALUES (803, 60, 263, 7, 0);
INSERT INTO `results` VALUES (804, 60, 251, 15, 0);
INSERT INTO `results` VALUES (805, 60, 226, 14, 0);
INSERT INTO `results` VALUES (806, 60, 254, 8, 0);
INSERT INTO `results` VALUES (807, 60, 255, 11, 0);
INSERT INTO `results` VALUES (808, 60, 224, 18, 0);
INSERT INTO `results` VALUES (809, 60, 260, 29, 0);
INSERT INTO `results` VALUES (810, 60, 237, 22, 0);
INSERT INTO `results` VALUES (811, 60, 258, 20, 0);
INSERT INTO `results` VALUES (812, 60, 228, 25, 0);
INSERT INTO `results` VALUES (813, 61, 223, 6, 0);
INSERT INTO `results` VALUES (814, 61, 252, 5, 0);
INSERT INTO `results` VALUES (815, 61, 227, 1, 0);
INSERT INTO `results` VALUES (816, 61, 251, 8, 0);
INSERT INTO `results` VALUES (817, 61, 259, 8, 0);
INSERT INTO `results` VALUES (818, 61, 257, 3, 0);
INSERT INTO `results` VALUES (819, 61, 222, 9, 0);
INSERT INTO `results` VALUES (820, 61, 225, 7, 0);
INSERT INTO `results` VALUES (821, 61, 228, 5, 0);
INSERT INTO `results` VALUES (822, 61, 1, 2, 0);
INSERT INTO `results` VALUES (823, 61, 260, 3, 0);
INSERT INTO `results` VALUES (824, 61, 247, 4, 0);
INSERT INTO `results` VALUES (825, 61, 219, 14, 0);
INSERT INTO `results` VALUES (826, 61, 241, 15, 0);
INSERT INTO `results` VALUES (827, 61, 229, 12, 0);
INSERT INTO `results` VALUES (828, 61, 242, 13, 0);
INSERT INTO `results` VALUES (829, 61, 263, 10, 0);
INSERT INTO `results` VALUES (830, 61, 234, 11, 0);
INSERT INTO `results` VALUES (831, 62, 219, 8, 0);
INSERT INTO `results` VALUES (832, 62, 231, 18, 0);
INSERT INTO `results` VALUES (833, 62, 254, 22, 0);
INSERT INTO `results` VALUES (834, 62, 233, 11, 0);
INSERT INTO `results` VALUES (835, 62, 225, 20, 0);
INSERT INTO `results` VALUES (836, 62, 221, 16, 0);
INSERT INTO `results` VALUES (837, 62, 236, 15, 0);
INSERT INTO `results` VALUES (838, 62, 249, 1, 0);
INSERT INTO `results` VALUES (839, 62, 259, 6, 0);
INSERT INTO `results` VALUES (840, 62, 224, 2, 0);
INSERT INTO `results` VALUES (841, 62, 245, 13, 0);
INSERT INTO `results` VALUES (842, 62, 227, 5, 0);
INSERT INTO `results` VALUES (843, 62, 58, 9, 0);
INSERT INTO `results` VALUES (844, 62, 262, 8, 0);
INSERT INTO `results` VALUES (845, 62, 261, 10, 0);
INSERT INTO `results` VALUES (846, 62, 1, 12, 0);
INSERT INTO `results` VALUES (847, 62, 241, 4, 0);
INSERT INTO `results` VALUES (848, 62, 218, 17, 0);
INSERT INTO `results` VALUES (849, 62, 258, 24, 0);
INSERT INTO `results` VALUES (850, 62, 229, 3, 0);
INSERT INTO `results` VALUES (851, 62, 247, 7, 0);
INSERT INTO `results` VALUES (852, 62, 228, 19, 0);
INSERT INTO `results` VALUES (853, 62, 222, 23, 0);
INSERT INTO `results` VALUES (854, 62, 238, 21, 0);
INSERT INTO `results` VALUES (855, 62, 239, 14, 0);
INSERT INTO `results` VALUES (856, 63, 257, 1, 0);
INSERT INTO `results` VALUES (857, 63, 253, 14, 0);
INSERT INTO `results` VALUES (858, 63, 1, 2, 0);
INSERT INTO `results` VALUES (859, 63, 261, 10, 0);
INSERT INTO `results` VALUES (860, 63, 256, 3, 0);
INSERT INTO `results` VALUES (861, 63, 239, 4, 0);
INSERT INTO `results` VALUES (862, 63, 240, 9, 0);
INSERT INTO `results` VALUES (863, 63, 247, 7, 0);
INSERT INTO `results` VALUES (864, 63, 221, 8, 0);
INSERT INTO `results` VALUES (865, 63, 219, 6, 0);
INSERT INTO `results` VALUES (866, 63, 263, 5, 0);
INSERT INTO `results` VALUES (867, 63, 252, 15, 0);
INSERT INTO `results` VALUES (868, 63, 259, 13, 0);
INSERT INTO `results` VALUES (869, 63, 232, 5, 0);
INSERT INTO `results` VALUES (870, 63, 241, 11, 0);
INSERT INTO `results` VALUES (871, 63, 217, 12, 0);
INSERT INTO `results` VALUES (872, 64, 58, 18, 0);
INSERT INTO `results` VALUES (873, 64, 263, 4, 0);
INSERT INTO `results` VALUES (874, 64, 235, 5, 0);
INSERT INTO `results` VALUES (875, 64, 256, 8, 0);
INSERT INTO `results` VALUES (876, 64, 236, 3, 0);
INSERT INTO `results` VALUES (877, 64, 219, 25, 0);
INSERT INTO `results` VALUES (878, 64, 258, 13, 0);
INSERT INTO `results` VALUES (879, 64, 259, 1, 0);
INSERT INTO `results` VALUES (880, 64, 246, 14, 0);
INSERT INTO `results` VALUES (881, 64, 216, 27, 0);
INSERT INTO `results` VALUES (882, 64, 230, 16, 0);
INSERT INTO `results` VALUES (883, 64, 233, 28, 0);
INSERT INTO `results` VALUES (884, 64, 225, 6, 0);
INSERT INTO `results` VALUES (885, 64, 257, 15, 0);
INSERT INTO `results` VALUES (886, 64, 1, 2, 0);
INSERT INTO `results` VALUES (887, 64, 231, 20, 0);
INSERT INTO `results` VALUES (888, 64, 255, 24, 0);
INSERT INTO `results` VALUES (889, 64, 238, 21, 0);
INSERT INTO `results` VALUES (890, 64, 237, 9, 0);
INSERT INTO `results` VALUES (891, 64, 226, 7, 0);
INSERT INTO `results` VALUES (892, 64, 243, 23, 0);
INSERT INTO `results` VALUES (893, 64, 251, 22, 0);
INSERT INTO `results` VALUES (894, 64, 248, 10, 0);
INSERT INTO `results` VALUES (895, 64, 260, 19, 0);
INSERT INTO `results` VALUES (896, 64, 214, 17, 0);
INSERT INTO `results` VALUES (897, 64, 234, 11, 0);
INSERT INTO `results` VALUES (898, 64, 241, 12, 0);
INSERT INTO `results` VALUES (899, 64, 229, 26, 0);
INSERT INTO `results` VALUES (900, 65, 242, 16, 0);
INSERT INTO `results` VALUES (901, 65, 254, 21, 0);
INSERT INTO `results` VALUES (902, 65, 217, 12, 0);
INSERT INTO `results` VALUES (903, 65, 253, 3, 0);
INSERT INTO `results` VALUES (904, 65, 244, 4, 0);
INSERT INTO `results` VALUES (905, 65, 259, 22, 0);
INSERT INTO `results` VALUES (906, 65, 233, 14, 0);
INSERT INTO `results` VALUES (907, 65, 229, 8, 0);
INSERT INTO `results` VALUES (908, 65, 263, 13, 0);
INSERT INTO `results` VALUES (909, 65, 214, 28, 0);
INSERT INTO `results` VALUES (910, 65, 219, 5, 0);
INSERT INTO `results` VALUES (911, 65, 260, 26, 0);
INSERT INTO `results` VALUES (912, 65, 251, 15, 0);
INSERT INTO `results` VALUES (913, 65, 58, 20, 0);
INSERT INTO `results` VALUES (914, 65, 215, 17, 0);
INSERT INTO `results` VALUES (915, 65, 240, 19, 0);
INSERT INTO `results` VALUES (916, 65, 230, 10, 0);
INSERT INTO `results` VALUES (917, 65, 235, 7, 0);
INSERT INTO `results` VALUES (918, 65, 255, 18, 0);
INSERT INTO `results` VALUES (919, 65, 261, 23, 0);
INSERT INTO `results` VALUES (920, 65, 223, 6, 0);
INSERT INTO `results` VALUES (921, 65, 248, 2, 0);
INSERT INTO `results` VALUES (922, 65, 221, 11, 0);
INSERT INTO `results` VALUES (923, 65, 232, 24, 0);
INSERT INTO `results` VALUES (924, 65, 237, 9, 0);
INSERT INTO `results` VALUES (925, 65, 227, 1, 0);
INSERT INTO `results` VALUES (926, 65, 238, 27, 0);
INSERT INTO `results` VALUES (927, 65, 226, 25, 0);
INSERT INTO `results` VALUES (928, 66, 254, 8, 0);
INSERT INTO `results` VALUES (929, 66, 219, 16, 0);
INSERT INTO `results` VALUES (930, 66, 233, 11, 0);
INSERT INTO `results` VALUES (931, 66, 253, 1, 0);
INSERT INTO `results` VALUES (932, 66, 218, 10, 0);
INSERT INTO `results` VALUES (933, 66, 259, 4, 0);
INSERT INTO `results` VALUES (934, 66, 255, 6, 0);
INSERT INTO `results` VALUES (935, 66, 260, 7, 0);
INSERT INTO `results` VALUES (936, 66, 232, 14, 0);
INSERT INTO `results` VALUES (937, 66, 223, 2, 0);
INSERT INTO `results` VALUES (938, 66, 58, 5, 0);
INSERT INTO `results` VALUES (939, 66, 230, 3, 0);
INSERT INTO `results` VALUES (940, 66, 244, 13, 0);
INSERT INTO `results` VALUES (941, 66, 262, 9, 0);
INSERT INTO `results` VALUES (942, 66, 226, 12, 0);
INSERT INTO `results` VALUES (943, 66, 239, 15, 0);
INSERT INTO `results` VALUES (944, 67, 221, 1, 0);
INSERT INTO `results` VALUES (945, 67, 1, 14, 0);
INSERT INTO `results` VALUES (946, 67, 226, 11, 0);
INSERT INTO `results` VALUES (947, 67, 256, 8, 0);
INSERT INTO `results` VALUES (948, 67, 237, 13, 0);
INSERT INTO `results` VALUES (949, 67, 250, 18, 0);
INSERT INTO `results` VALUES (950, 67, 225, 2, 0);
INSERT INTO `results` VALUES (951, 67, 214, 12, 0);
INSERT INTO `results` VALUES (952, 67, 239, 9, 0);
INSERT INTO `results` VALUES (953, 67, 248, 15, 0);
INSERT INTO `results` VALUES (954, 67, 259, 3, 0);
INSERT INTO `results` VALUES (955, 67, 215, 5, 0);
INSERT INTO `results` VALUES (956, 67, 216, 4, 0);
INSERT INTO `results` VALUES (957, 67, 229, 6, 0);
INSERT INTO `results` VALUES (958, 67, 220, 7, 0);
INSERT INTO `results` VALUES (959, 67, 257, 16, 0);
INSERT INTO `results` VALUES (960, 67, 255, 10, 0);
INSERT INTO `results` VALUES (961, 67, 238, 17, 0);
INSERT INTO `results` VALUES (962, 68, 234, 12, 0);
INSERT INTO `results` VALUES (963, 68, 257, 9, 0);
INSERT INTO `results` VALUES (964, 68, 252, 4, 0);
INSERT INTO `results` VALUES (965, 68, 239, 11, 0);
INSERT INTO `results` VALUES (966, 68, 247, 2, 0);
INSERT INTO `results` VALUES (967, 68, 216, 10, 0);
INSERT INTO `results` VALUES (968, 68, 260, 16, 0);
INSERT INTO `results` VALUES (969, 68, 221, 4, 0);
INSERT INTO `results` VALUES (970, 68, 237, 8, 0);
INSERT INTO `results` VALUES (971, 68, 226, 17, 0);
INSERT INTO `results` VALUES (972, 68, 255, 5, 0);
INSERT INTO `results` VALUES (973, 68, 259, 1, 0);
INSERT INTO `results` VALUES (974, 68, 258, 14, 0);
INSERT INTO `results` VALUES (975, 68, 243, 13, 0);
INSERT INTO `results` VALUES (976, 68, 218, 7, 0);
INSERT INTO `results` VALUES (977, 68, 262, 3, 0);
INSERT INTO `results` VALUES (978, 68, 223, 6, 0);
INSERT INTO `results` VALUES (979, 68, 263, 15, 0);
INSERT INTO `results` VALUES (980, 69, 258, 3, 0);
INSERT INTO `results` VALUES (981, 69, 238, 8, 0);
INSERT INTO `results` VALUES (982, 69, 217, 18, 0);
INSERT INTO `results` VALUES (983, 69, 214, 17, 0);
INSERT INTO `results` VALUES (984, 69, 244, 13, 0);
INSERT INTO `results` VALUES (985, 69, 259, 4, 0);
INSERT INTO `results` VALUES (986, 69, 243, 22, 0);
INSERT INTO `results` VALUES (987, 69, 254, 10, 0);
INSERT INTO `results` VALUES (988, 69, 251, 2, 0);
INSERT INTO `results` VALUES (989, 69, 253, 8, 0);
INSERT INTO `results` VALUES (990, 69, 225, 21, 0);
INSERT INTO `results` VALUES (991, 69, 215, 20, 0);
INSERT INTO `results` VALUES (992, 69, 256, 19, 0);
INSERT INTO `results` VALUES (993, 69, 222, 24, 0);
INSERT INTO `results` VALUES (994, 69, 260, 7, 0);
INSERT INTO `results` VALUES (995, 69, 219, 25, 0);
INSERT INTO `results` VALUES (996, 69, 226, 16, 0);
INSERT INTO `results` VALUES (997, 69, 228, 5, 0);
INSERT INTO `results` VALUES (998, 69, 235, 12, 0);
INSERT INTO `results` VALUES (999, 69, 263, 23, 0);
INSERT INTO `results` VALUES (1000, 69, 58, 11, 0);
INSERT INTO `results` VALUES (1001, 69, 250, 1, 0);
INSERT INTO `results` VALUES (1002, 69, 224, 15, 0);
INSERT INTO `results` VALUES (1003, 69, 229, 6, 0);
INSERT INTO `results` VALUES (1004, 69, 255, 9, 0);
INSERT INTO `results` VALUES (1005, 69, 249, 14, 0);
INSERT INTO `results` VALUES (1006, 70, 260, 9, 0);
INSERT INTO `results` VALUES (1007, 70, 217, 8, 0);
INSERT INTO `results` VALUES (1008, 70, 236, 29, 0);
INSERT INTO `results` VALUES (1009, 70, 222, 24, 0);
INSERT INTO `results` VALUES (1010, 70, 215, 10, 0);
INSERT INTO `results` VALUES (1011, 70, 246, 26, 0);
INSERT INTO `results` VALUES (1012, 70, 263, 32, 0);
INSERT INTO `results` VALUES (1013, 70, 241, 1, 0);
INSERT INTO `results` VALUES (1014, 70, 1, 11, 0);
INSERT INTO `results` VALUES (1015, 70, 245, 33, 0);
INSERT INTO `results` VALUES (1016, 70, 232, 21, 0);
INSERT INTO `results` VALUES (1017, 70, 223, 7, 0);
INSERT INTO `results` VALUES (1018, 70, 254, 16, 0);
INSERT INTO `results` VALUES (1019, 70, 240, 20, 0);
INSERT INTO `results` VALUES (1020, 70, 234, 18, 0);
INSERT INTO `results` VALUES (1021, 70, 250, 23, 0);
INSERT INTO `results` VALUES (1022, 70, 229, 28, 0);
INSERT INTO `results` VALUES (1023, 70, 230, 31, 0);
INSERT INTO `results` VALUES (1024, 70, 251, 12, 0);
INSERT INTO `results` VALUES (1025, 70, 252, 4, 0);
INSERT INTO `results` VALUES (1026, 70, 242, 2, 0);
INSERT INTO `results` VALUES (1027, 70, 220, 22, 0);
INSERT INTO `results` VALUES (1028, 70, 239, 3, 0);
INSERT INTO `results` VALUES (1029, 70, 233, 6, 0);
INSERT INTO `results` VALUES (1030, 70, 243, 5, 0);
INSERT INTO `results` VALUES (1031, 70, 226, 13, 0);
INSERT INTO `results` VALUES (1032, 70, 247, 15, 0);
INSERT INTO `results` VALUES (1033, 70, 253, 25, 0);
INSERT INTO `results` VALUES (1034, 70, 249, 19, 0);
INSERT INTO `results` VALUES (1035, 70, 248, 27, 0);
INSERT INTO `results` VALUES (1036, 70, 216, 17, 0);
INSERT INTO `results` VALUES (1037, 70, 218, 14, 0);
INSERT INTO `results` VALUES (1038, 70, 58, 30, 0);
INSERT INTO `results` VALUES (1039, 71, 216, 7, 0);
INSERT INTO `results` VALUES (1040, 71, 232, 19, 0);
INSERT INTO `results` VALUES (1041, 71, 252, 8, 0);
INSERT INTO `results` VALUES (1042, 71, 253, 9, 0);
INSERT INTO `results` VALUES (1043, 71, 234, 26, 0);
INSERT INTO `results` VALUES (1044, 71, 221, 31, 0);
INSERT INTO `results` VALUES (1045, 71, 215, 27, 0);
INSERT INTO `results` VALUES (1046, 71, 222, 15, 0);
INSERT INTO `results` VALUES (1047, 71, 231, 10, 0);
INSERT INTO `results` VALUES (1048, 71, 217, 30, 0);
INSERT INTO `results` VALUES (1049, 71, 230, 3, 0);
INSERT INTO `results` VALUES (1050, 71, 250, 23, 0);
INSERT INTO `results` VALUES (1051, 71, 235, 2, 0);
INSERT INTO `results` VALUES (1052, 71, 249, 32, 0);
INSERT INTO `results` VALUES (1053, 71, 257, 11, 0);
INSERT INTO `results` VALUES (1054, 71, 224, 17, 0);
INSERT INTO `results` VALUES (1055, 71, 238, 16, 0);
INSERT INTO `results` VALUES (1056, 71, 233, 14, 0);
INSERT INTO `results` VALUES (1057, 71, 255, 6, 0);
INSERT INTO `results` VALUES (1058, 71, 58, 21, 0);
INSERT INTO `results` VALUES (1059, 71, 214, 1, 0);
INSERT INTO `results` VALUES (1060, 71, 259, 20, 0);
INSERT INTO `results` VALUES (1061, 71, 226, 25, 0);
INSERT INTO `results` VALUES (1062, 71, 236, 22, 0);
INSERT INTO `results` VALUES (1063, 71, 219, 5, 0);
INSERT INTO `results` VALUES (1064, 71, 242, 29, 0);
INSERT INTO `results` VALUES (1065, 71, 218, 18, 0);
INSERT INTO `results` VALUES (1066, 71, 260, 4, 0);
INSERT INTO `results` VALUES (1067, 71, 228, 33, 0);
INSERT INTO `results` VALUES (1068, 71, 239, 24, 0);
INSERT INTO `results` VALUES (1069, 71, 262, 13, 0);
INSERT INTO `results` VALUES (1070, 71, 229, 28, 0);
INSERT INTO `results` VALUES (1071, 71, 251, 12, 0);
INSERT INTO `results` VALUES (1072, 72, 216, 18, 0);
INSERT INTO `results` VALUES (1073, 72, 238, 17, 0);
INSERT INTO `results` VALUES (1074, 72, 241, 4, 0);
INSERT INTO `results` VALUES (1075, 72, 244, 2, 0);
INSERT INTO `results` VALUES (1076, 72, 243, 12, 0);
INSERT INTO `results` VALUES (1077, 72, 235, 6, 0);
INSERT INTO `results` VALUES (1078, 72, 252, 5, 0);
INSERT INTO `results` VALUES (1079, 72, 239, 15, 0);
INSERT INTO `results` VALUES (1080, 72, 245, 19, 0);
INSERT INTO `results` VALUES (1081, 72, 234, 3, 0);
INSERT INTO `results` VALUES (1082, 72, 219, 20, 0);
INSERT INTO `results` VALUES (1083, 72, 232, 10, 0);
INSERT INTO `results` VALUES (1084, 72, 256, 13, 0);
INSERT INTO `results` VALUES (1085, 72, 215, 1, 0);
INSERT INTO `results` VALUES (1086, 72, 250, 14, 0);
INSERT INTO `results` VALUES (1087, 72, 249, 8, 0);
INSERT INTO `results` VALUES (1088, 72, 225, 16, 0);
INSERT INTO `results` VALUES (1089, 72, 231, 7, 0);
INSERT INTO `results` VALUES (1090, 72, 222, 11, 0);
INSERT INTO `results` VALUES (1091, 72, 253, 9, 0);
INSERT INTO `results` VALUES (1092, 73, 238, 2, 0);
INSERT INTO `results` VALUES (1093, 73, 258, 9, 0);
INSERT INTO `results` VALUES (1094, 73, 225, 2, 0);
INSERT INTO `results` VALUES (1095, 73, 252, 1, 0);
INSERT INTO `results` VALUES (1096, 73, 249, 7, 0);
INSERT INTO `results` VALUES (1097, 73, 221, 4, 0);
INSERT INTO `results` VALUES (1098, 73, 262, 8, 0);
INSERT INTO `results` VALUES (1099, 73, 250, 13, 0);
INSERT INTO `results` VALUES (1100, 73, 58, 8, 0);
INSERT INTO `results` VALUES (1101, 73, 229, 6, 0);
INSERT INTO `results` VALUES (1102, 73, 233, 10, 0);
INSERT INTO `results` VALUES (1103, 73, 239, 5, 0);
INSERT INTO `results` VALUES (1104, 73, 236, 12, 0);
INSERT INTO `results` VALUES (1105, 73, 219, 3, 0);
INSERT INTO `results` VALUES (1106, 73, 224, 11, 0);
INSERT INTO `results` VALUES (1107, 74, 240, 2, 0);
INSERT INTO `results` VALUES (1108, 74, 255, 2, 0);
INSERT INTO `results` VALUES (1109, 74, 214, 3, 0);
INSERT INTO `results` VALUES (1110, 74, 221, 13, 0);
INSERT INTO `results` VALUES (1111, 74, 259, 14, 0);
INSERT INTO `results` VALUES (1112, 74, 260, 17, 0);
INSERT INTO `results` VALUES (1113, 74, 241, 8, 0);
INSERT INTO `results` VALUES (1114, 74, 246, 11, 0);
INSERT INTO `results` VALUES (1115, 74, 237, 1, 0);
INSERT INTO `results` VALUES (1116, 74, 58, 18, 0);
INSERT INTO `results` VALUES (1117, 74, 248, 4, 0);
INSERT INTO `results` VALUES (1118, 74, 236, 15, 0);
INSERT INTO `results` VALUES (1119, 74, 243, 9, 0);
INSERT INTO `results` VALUES (1120, 74, 242, 12, 0);
INSERT INTO `results` VALUES (1121, 74, 215, 7, 0);
INSERT INTO `results` VALUES (1122, 74, 231, 5, 0);
INSERT INTO `results` VALUES (1123, 74, 263, 10, 0);
INSERT INTO `results` VALUES (1124, 74, 217, 6, 0);
INSERT INTO `results` VALUES (1125, 74, 258, 16, 0);
INSERT INTO `results` VALUES (1126, 75, 237, 7, 0);
INSERT INTO `results` VALUES (1127, 75, 254, 6, 0);
INSERT INTO `results` VALUES (1128, 75, 239, 4, 0);
INSERT INTO `results` VALUES (1129, 75, 218, 3, 0);
INSERT INTO `results` VALUES (1130, 75, 1, 10, 0);
INSERT INTO `results` VALUES (1131, 75, 241, 22, 0);
INSERT INTO `results` VALUES (1132, 75, 244, 12, 0);
INSERT INTO `results` VALUES (1133, 75, 247, 23, 0);
INSERT INTO `results` VALUES (1134, 75, 236, 2, 0);
INSERT INTO `results` VALUES (1135, 75, 217, 25, 0);
INSERT INTO `results` VALUES (1136, 75, 224, 24, 0);
INSERT INTO `results` VALUES (1137, 75, 215, 9, 0);
INSERT INTO `results` VALUES (1138, 75, 219, 13, 0);
INSERT INTO `results` VALUES (1139, 75, 227, 1, 0);
INSERT INTO `results` VALUES (1140, 75, 262, 19, 0);
INSERT INTO `results` VALUES (1141, 75, 260, 11, 0);
INSERT INTO `results` VALUES (1142, 75, 235, 16, 0);
INSERT INTO `results` VALUES (1143, 75, 242, 17, 0);
INSERT INTO `results` VALUES (1144, 75, 229, 5, 0);
INSERT INTO `results` VALUES (1145, 75, 225, 20, 0);
INSERT INTO `results` VALUES (1146, 75, 251, 21, 0);
INSERT INTO `results` VALUES (1147, 75, 245, 18, 0);
INSERT INTO `results` VALUES (1148, 75, 226, 8, 0);
INSERT INTO `results` VALUES (1149, 75, 222, 5, 0);
INSERT INTO `results` VALUES (1150, 75, 221, 15, 0);
INSERT INTO `results` VALUES (1151, 75, 216, 14, 0);
INSERT INTO `results` VALUES (1152, 75, 257, 26, 0);
INSERT INTO `results` VALUES (1153, 76, 258, 8, 0);
INSERT INTO `results` VALUES (1154, 76, 240, 27, 0);
INSERT INTO `results` VALUES (1155, 76, 227, 1, 0);
INSERT INTO `results` VALUES (1156, 76, 234, 20, 0);
INSERT INTO `results` VALUES (1157, 76, 230, 24, 0);
INSERT INTO `results` VALUES (1158, 76, 219, 22, 0);
INSERT INTO `results` VALUES (1159, 76, 225, 2, 0);
INSERT INTO `results` VALUES (1160, 76, 218, 6, 0);
INSERT INTO `results` VALUES (1161, 76, 244, 10, 0);
INSERT INTO `results` VALUES (1162, 76, 220, 14, 0);
INSERT INTO `results` VALUES (1163, 76, 236, 29, 0);
INSERT INTO `results` VALUES (1164, 76, 247, 3, 0);
INSERT INTO `results` VALUES (1165, 76, 235, 16, 0);
INSERT INTO `results` VALUES (1166, 76, 214, 19, 0);
INSERT INTO `results` VALUES (1167, 76, 231, 4, 0);
INSERT INTO `results` VALUES (1168, 76, 217, 9, 0);
INSERT INTO `results` VALUES (1169, 76, 222, 28, 0);
INSERT INTO `results` VALUES (1170, 76, 58, 25, 0);
INSERT INTO `results` VALUES (1171, 76, 257, 5, 0);
INSERT INTO `results` VALUES (1172, 76, 250, 21, 0);
INSERT INTO `results` VALUES (1173, 76, 253, 11, 0);
INSERT INTO `results` VALUES (1174, 76, 1, 26, 0);
INSERT INTO `results` VALUES (1175, 76, 216, 15, 0);
INSERT INTO `results` VALUES (1176, 76, 237, 18, 0);
INSERT INTO `results` VALUES (1177, 76, 249, 12, 0);
INSERT INTO `results` VALUES (1178, 76, 228, 6, 0);
INSERT INTO `results` VALUES (1179, 76, 243, 7, 0);
INSERT INTO `results` VALUES (1180, 76, 248, 17, 0);
INSERT INTO `results` VALUES (1181, 76, 224, 23, 0);
INSERT INTO `results` VALUES (1182, 76, 233, 13, 0);
INSERT INTO `results` VALUES (1183, 77, 216, 1, 0);
INSERT INTO `results` VALUES (1184, 77, 1, 2, 0);
INSERT INTO `results` VALUES (1185, 77, 229, 9, 0);
INSERT INTO `results` VALUES (1186, 77, 261, 4, 0);
INSERT INTO `results` VALUES (1187, 77, 234, 13, 0);
INSERT INTO `results` VALUES (1188, 77, 235, 8, 0);
INSERT INTO `results` VALUES (1189, 77, 223, 7, 0);
INSERT INTO `results` VALUES (1190, 77, 246, 3, 0);
INSERT INTO `results` VALUES (1191, 77, 218, 4, 0);
INSERT INTO `results` VALUES (1192, 77, 228, 6, 0);
INSERT INTO `results` VALUES (1193, 77, 215, 5, 0);
INSERT INTO `results` VALUES (1194, 77, 243, 5, 0);
INSERT INTO `results` VALUES (1195, 77, 231, 10, 0);
INSERT INTO `results` VALUES (1196, 77, 255, 12, 0);
INSERT INTO `results` VALUES (1197, 77, 225, 11, 0);
INSERT INTO `results` VALUES (1198, 78, 217, 21, 0);
INSERT INTO `results` VALUES (1199, 78, 225, 1, 0);
INSERT INTO `results` VALUES (1200, 78, 253, 9, 0);
INSERT INTO `results` VALUES (1201, 78, 240, 3, 0);
INSERT INTO `results` VALUES (1202, 78, 58, 17, 0);
INSERT INTO `results` VALUES (1203, 78, 233, 7, 0);
INSERT INTO `results` VALUES (1204, 78, 237, 24, 0);
INSERT INTO `results` VALUES (1205, 78, 226, 8, 0);
INSERT INTO `results` VALUES (1206, 78, 218, 5, 0);
INSERT INTO `results` VALUES (1207, 78, 230, 4, 0);
INSERT INTO `results` VALUES (1208, 78, 246, 2, 0);
INSERT INTO `results` VALUES (1209, 78, 238, 20, 0);
INSERT INTO `results` VALUES (1210, 78, 242, 4, 0);
INSERT INTO `results` VALUES (1211, 78, 219, 14, 0);
INSERT INTO `results` VALUES (1212, 78, 257, 26, 0);
INSERT INTO `results` VALUES (1213, 78, 247, 13, 0);
INSERT INTO `results` VALUES (1214, 78, 258, 22, 0);
INSERT INTO `results` VALUES (1215, 78, 231, 11, 0);
INSERT INTO `results` VALUES (1216, 78, 254, 15, 0);
INSERT INTO `results` VALUES (1217, 78, 227, 19, 0);
INSERT INTO `results` VALUES (1218, 78, 234, 6, 0);
INSERT INTO `results` VALUES (1219, 78, 251, 16, 0);
INSERT INTO `results` VALUES (1220, 78, 259, 25, 0);
INSERT INTO `results` VALUES (1221, 78, 252, 23, 0);
INSERT INTO `results` VALUES (1222, 78, 262, 10, 0);
INSERT INTO `results` VALUES (1223, 78, 263, 18, 0);
INSERT INTO `results` VALUES (1224, 78, 243, 27, 0);
INSERT INTO `results` VALUES (1225, 78, 229, 12, 0);
INSERT INTO `results` VALUES (1226, 79, 220, 15, 0);
INSERT INTO `results` VALUES (1227, 79, 224, 8, 0);
INSERT INTO `results` VALUES (1228, 79, 58, 1, 0);
INSERT INTO `results` VALUES (1229, 79, 262, 28, 0);
INSERT INTO `results` VALUES (1230, 79, 256, 13, 0);
INSERT INTO `results` VALUES (1231, 79, 255, 11, 0);
INSERT INTO `results` VALUES (1232, 79, 241, 7, 0);
INSERT INTO `results` VALUES (1233, 79, 226, 10, 0);
INSERT INTO `results` VALUES (1234, 79, 233, 31, 0);
INSERT INTO `results` VALUES (1235, 79, 214, 26, 0);
INSERT INTO `results` VALUES (1236, 79, 223, 14, 0);
INSERT INTO `results` VALUES (1237, 79, 246, 4, 0);
INSERT INTO `results` VALUES (1238, 79, 239, 22, 0);
INSERT INTO `results` VALUES (1239, 79, 259, 20, 0);
INSERT INTO `results` VALUES (1240, 79, 215, 17, 0);
INSERT INTO `results` VALUES (1241, 79, 243, 9, 0);
INSERT INTO `results` VALUES (1242, 79, 216, 18, 0);
INSERT INTO `results` VALUES (1243, 79, 257, 6, 0);
INSERT INTO `results` VALUES (1244, 79, 258, 25, 0);
INSERT INTO `results` VALUES (1245, 79, 225, 16, 0);
INSERT INTO `results` VALUES (1246, 79, 248, 5, 0);
INSERT INTO `results` VALUES (1247, 79, 250, 2, 0);
INSERT INTO `results` VALUES (1248, 79, 261, 19, 0);
INSERT INTO `results` VALUES (1249, 79, 236, 3, 0);
INSERT INTO `results` VALUES (1250, 79, 229, 12, 0);
INSERT INTO `results` VALUES (1251, 79, 244, 27, 0);
INSERT INTO `results` VALUES (1252, 79, 245, 29, 0);
INSERT INTO `results` VALUES (1253, 79, 252, 30, 0);
INSERT INTO `results` VALUES (1254, 79, 221, 21, 0);
INSERT INTO `results` VALUES (1255, 79, 230, 23, 0);
INSERT INTO `results` VALUES (1256, 79, 219, 24, 0);
INSERT INTO `results` VALUES (1257, 80, 221, 8, 0);
INSERT INTO `results` VALUES (1258, 80, 214, 7, 0);
INSERT INTO `results` VALUES (1259, 80, 259, 23, 0);
INSERT INTO `results` VALUES (1260, 80, 256, 15, 0);
INSERT INTO `results` VALUES (1261, 80, 241, 27, 0);
INSERT INTO `results` VALUES (1262, 80, 245, 5, 0);
INSERT INTO `results` VALUES (1263, 80, 247, 17, 0);
INSERT INTO `results` VALUES (1264, 80, 224, 13, 0);
INSERT INTO `results` VALUES (1265, 80, 240, 6, 0);
INSERT INTO `results` VALUES (1266, 80, 215, 18, 0);
INSERT INTO `results` VALUES (1267, 80, 242, 20, 0);
INSERT INTO `results` VALUES (1268, 80, 260, 1, 0);
INSERT INTO `results` VALUES (1269, 80, 235, 14, 0);
INSERT INTO `results` VALUES (1270, 80, 244, 12, 0);
INSERT INTO `results` VALUES (1271, 80, 257, 9, 0);
INSERT INTO `results` VALUES (1272, 80, 229, 2, 0);
INSERT INTO `results` VALUES (1273, 80, 234, 24, 0);
INSERT INTO `results` VALUES (1274, 80, 225, 21, 0);
INSERT INTO `results` VALUES (1275, 80, 263, 10, 0);
INSERT INTO `results` VALUES (1276, 80, 1, 19, 0);
INSERT INTO `results` VALUES (1277, 80, 227, 3, 0);
INSERT INTO `results` VALUES (1278, 80, 255, 25, 0);
INSERT INTO `results` VALUES (1279, 80, 243, 11, 0);
INSERT INTO `results` VALUES (1280, 80, 262, 22, 0);
INSERT INTO `results` VALUES (1281, 80, 219, 26, 0);
INSERT INTO `results` VALUES (1282, 80, 222, 4, 0);
INSERT INTO `results` VALUES (1283, 80, 251, 16, 0);
INSERT INTO `results` VALUES (1284, 81, 214, 8, 0);
INSERT INTO `results` VALUES (1285, 81, 238, 30, 0);
INSERT INTO `results` VALUES (1286, 81, 233, 1, 0);
INSERT INTO `results` VALUES (1287, 81, 257, 24, 0);
INSERT INTO `results` VALUES (1288, 81, 250, 7, 0);
INSERT INTO `results` VALUES (1289, 81, 222, 13, 0);
INSERT INTO `results` VALUES (1290, 81, 225, 5, 0);
INSERT INTO `results` VALUES (1291, 81, 259, 17, 0);
INSERT INTO `results` VALUES (1292, 81, 263, 2, 0);
INSERT INTO `results` VALUES (1293, 81, 253, 19, 0);
INSERT INTO `results` VALUES (1294, 81, 232, 12, 0);
INSERT INTO `results` VALUES (1295, 81, 248, 20, 0);
INSERT INTO `results` VALUES (1296, 81, 258, 21, 0);
INSERT INTO `results` VALUES (1297, 81, 239, 4, 0);
INSERT INTO `results` VALUES (1298, 81, 221, 28, 0);
INSERT INTO `results` VALUES (1299, 81, 246, 29, 0);
INSERT INTO `results` VALUES (1300, 81, 261, 3, 0);
INSERT INTO `results` VALUES (1301, 81, 58, 15, 0);
INSERT INTO `results` VALUES (1302, 81, 230, 25, 0);
INSERT INTO `results` VALUES (1303, 81, 241, 27, 0);
INSERT INTO `results` VALUES (1304, 81, 262, 23, 0);
INSERT INTO `results` VALUES (1305, 81, 256, 31, 0);
INSERT INTO `results` VALUES (1306, 81, 235, 16, 0);
INSERT INTO `results` VALUES (1307, 81, 240, 9, 0);
INSERT INTO `results` VALUES (1308, 81, 245, 14, 0);
INSERT INTO `results` VALUES (1309, 81, 220, 11, 0);
INSERT INTO `results` VALUES (1310, 81, 215, 10, 0);
INSERT INTO `results` VALUES (1311, 81, 226, 6, 0);
INSERT INTO `results` VALUES (1312, 81, 219, 22, 0);
INSERT INTO `results` VALUES (1313, 81, 234, 26, 0);
INSERT INTO `results` VALUES (1314, 81, 218, 18, 0);
INSERT INTO `results` VALUES (1315, 82, 257, 30, 0);
INSERT INTO `results` VALUES (1316, 82, 251, 4, 0);
INSERT INTO `results` VALUES (1317, 82, 222, 14, 0);
INSERT INTO `results` VALUES (1318, 82, 217, 28, 0);
INSERT INTO `results` VALUES (1319, 82, 228, 17, 0);
INSERT INTO `results` VALUES (1320, 82, 247, 16, 0);
INSERT INTO `results` VALUES (1321, 82, 243, 18, 0);
INSERT INTO `results` VALUES (1322, 82, 234, 23, 0);
INSERT INTO `results` VALUES (1323, 82, 216, 6, 0);
INSERT INTO `results` VALUES (1324, 82, 260, 11, 0);
INSERT INTO `results` VALUES (1325, 82, 223, 26, 0);
INSERT INTO `results` VALUES (1326, 82, 239, 32, 0);
INSERT INTO `results` VALUES (1327, 82, 237, 31, 0);
INSERT INTO `results` VALUES (1328, 82, 227, 7, 0);
INSERT INTO `results` VALUES (1329, 82, 229, 25, 0);
INSERT INTO `results` VALUES (1330, 82, 236, 3, 0);
INSERT INTO `results` VALUES (1331, 82, 252, 24, 0);
INSERT INTO `results` VALUES (1332, 82, 241, 15, 0);
INSERT INTO `results` VALUES (1333, 82, 226, 29, 0);
INSERT INTO `results` VALUES (1334, 82, 1, 6, 0);
INSERT INTO `results` VALUES (1335, 82, 232, 8, 0);
INSERT INTO `results` VALUES (1336, 82, 254, 10, 0);
INSERT INTO `results` VALUES (1337, 82, 58, 2, 0);
INSERT INTO `results` VALUES (1338, 82, 263, 9, 0);
INSERT INTO `results` VALUES (1339, 82, 235, 33, 0);
INSERT INTO `results` VALUES (1340, 82, 253, 22, 0);
INSERT INTO `results` VALUES (1341, 82, 233, 5, 0);
INSERT INTO `results` VALUES (1342, 82, 219, 13, 0);
INSERT INTO `results` VALUES (1343, 82, 240, 1, 0);
INSERT INTO `results` VALUES (1344, 82, 224, 19, 0);
INSERT INTO `results` VALUES (1345, 82, 245, 12, 0);
INSERT INTO `results` VALUES (1346, 82, 256, 21, 0);
INSERT INTO `results` VALUES (1347, 82, 259, 27, 0);
INSERT INTO `results` VALUES (1348, 82, 244, 20, 0);
INSERT INTO `results` VALUES (1349, 83, 214, 22, 0);
INSERT INTO `results` VALUES (1350, 83, 249, 1, 0);
INSERT INTO `results` VALUES (1351, 83, 219, 19, 0);
INSERT INTO `results` VALUES (1352, 83, 243, 7, 0);
INSERT INTO `results` VALUES (1353, 83, 227, 18, 0);
INSERT INTO `results` VALUES (1354, 83, 234, 16, 0);
INSERT INTO `results` VALUES (1355, 83, 248, 13, 0);
INSERT INTO `results` VALUES (1356, 83, 233, 10, 0);
INSERT INTO `results` VALUES (1357, 83, 220, 12, 0);
INSERT INTO `results` VALUES (1358, 83, 221, 9, 0);
INSERT INTO `results` VALUES (1359, 83, 253, 2, 0);
INSERT INTO `results` VALUES (1360, 83, 215, 21, 0);
INSERT INTO `results` VALUES (1361, 83, 247, 14, 0);
INSERT INTO `results` VALUES (1362, 83, 239, 5, 0);
INSERT INTO `results` VALUES (1363, 83, 261, 11, 0);
INSERT INTO `results` VALUES (1364, 83, 225, 15, 0);
INSERT INTO `results` VALUES (1365, 83, 254, 17, 0);
INSERT INTO `results` VALUES (1366, 83, 238, 3, 0);
INSERT INTO `results` VALUES (1367, 83, 222, 8, 0);
INSERT INTO `results` VALUES (1368, 83, 1, 4, 0);
INSERT INTO `results` VALUES (1369, 83, 241, 20, 0);
INSERT INTO `results` VALUES (1370, 83, 218, 6, 0);
INSERT INTO `results` VALUES (1371, 84, 225, 5, 0);
INSERT INTO `results` VALUES (1372, 84, 254, 6, 0);
INSERT INTO `results` VALUES (1373, 84, 245, 13, 0);
INSERT INTO `results` VALUES (1374, 84, 221, 1, 0);
INSERT INTO `results` VALUES (1375, 84, 240, 4, 0);
INSERT INTO `results` VALUES (1376, 84, 235, 8, 0);
INSERT INTO `results` VALUES (1377, 84, 231, 4, 0);
INSERT INTO `results` VALUES (1378, 84, 250, 18, 0);
INSERT INTO `results` VALUES (1379, 84, 249, 10, 0);
INSERT INTO `results` VALUES (1380, 84, 223, 16, 0);
INSERT INTO `results` VALUES (1381, 84, 241, 12, 0);
INSERT INTO `results` VALUES (1382, 84, 218, 11, 0);
INSERT INTO `results` VALUES (1383, 84, 262, 9, 0);
INSERT INTO `results` VALUES (1384, 84, 228, 14, 0);
INSERT INTO `results` VALUES (1385, 84, 263, 2, 0);
INSERT INTO `results` VALUES (1386, 84, 215, 7, 0);
INSERT INTO `results` VALUES (1387, 84, 237, 15, 0);
INSERT INTO `results` VALUES (1388, 84, 255, 17, 0);
INSERT INTO `results` VALUES (1389, 84, 247, 3, 0);
INSERT INTO `results` VALUES (1390, 84, 220, 4, 0);

-- Table: seasons
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: seasons
INSERT INTO `seasons` VALUES (10, 'SuperTest 2024', 'Temporada de prueba completa con 50 jugadores', '2025-06-30T22:00:00.000Z', '2025-12-30T23:00:00.000Z', 28, 0, 'activa', '2025-12-01T04:10:06.000Z', '2025-12-01T19:17:36.000Z');

-- Table: settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  UNIQUE KEY `key_2` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: settings
INSERT INTO `settings` VALUES (1, 'commission_total_pct', '20', 'Porcentaje total de comisión sobre el pozo', '2025-11-22T20:26:20.000Z');
INSERT INTO `settings` VALUES (2, 'commission_quarterly_pct', '1', 'Porcentaje para ranking trimestral', '2025-11-22T20:26:20.000Z');
INSERT INTO `settings` VALUES (3, 'commission_monthly_pct', '1', 'Porcentaje para especial del mes', '2025-11-22T20:26:20.000Z');
INSERT INTO `settings` VALUES (4, 'commission_copa_pct', '1', 'Porcentaje para Copa Don Humberto', '2025-11-22T20:26:20.000Z');
INSERT INTO `settings` VALUES (5, 'commission_house_pct', '17', 'Porcentaje para la casa', '2025-11-22T20:26:20.000Z');
INSERT INTO `settings` VALUES (6, 'language', 'es', 'Idioma de la aplicación', '2025-12-02T17:44:33.000Z');

-- Table: tournament_points
DROP TABLE IF EXISTS `tournament_points`;
CREATE TABLE `tournament_points` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` int unsigned NOT NULL,
  `position` int NOT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tournaments
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
  `pinned` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Torneo destacado en dashboard principal',
  `season_id` int unsigned DEFAULT NULL COMMENT 'ID de la temporada (seasons table)',
  PRIMARY KEY (`id`),
  KEY `idx_tournaments_pinned` (`pinned`),
  KEY `idx_tournaments_season` (`season_id`),
  CONSTRAINT `fk_tournaments_season` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: tournaments
INSERT INTO `tournaments` VALUES (57, 'Torneo Nocturno de Ases', '2024-06-30T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (58, 'Championship Monday', '2024-07-02T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (59, 'Poker de Media Semana', '2024-07-04T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (60, 'Friday Night Showdown', '2024-07-07T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (61, 'Torneo del Rey', '2024-07-09T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (62, 'High Stakes Challenge', '2024-07-11T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (63, 'Monday Madness', '2024-07-14T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (64, 'Midweek Grind', '2024-07-16T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (65, 'Viernes de Gloria', '2024-07-18T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (66, 'Torneo Relámpago', '2024-07-21T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (67, 'Battle Royale', '2024-07-23T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (68, 'Wednesday Warriors', '2024-07-25T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (69, 'Lunes de Campeones', '2024-07-28T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (70, 'Poker Night Elite', '2024-07-30T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (71, 'Viernes de Fuego', '2024-08-01T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (72, 'Thunder Monday', '2024-08-04T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (73, 'Miércoles Estelar', '2024-08-06T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (74, 'Friday Fever', '2024-08-08T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (75, 'Torneo Imperial', '2024-08-11T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (76, 'Monday Masters', '2024-08-13T22:00:00.000Z', '22.00', 22, '5.00', 10000, 1, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (77, 'Domingo de Leyendas', '2024-07-06T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (78, 'Sunday Special', '2024-07-13T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (79, 'Torneo Familiar Dominical', '2024-07-20T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (80, 'Weekend Warrior', '2024-07-27T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (81, 'Domingo Grande', '2024-08-03T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (82, 'Sunday Showdown', '2024-08-10T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (83, 'Torneo del Domingo', '2024-08-17T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (84, 'Weekend Poker Fest', '2024-08-24T22:00:00.000Z', '22.00', 22, '5.00', 10000, 0, 0, 3, 10, '0.00', 0, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (85, 'EL CLASICO DEL DOMINGO', '2025-01-11T22:00:00.000Z', '123.00', 123, '123.00', 123, 0, 0, 3, 10, '0.00', 1, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (86, 'qwe', '2025-01-11T22:00:00.000Z', '123.00', 123, '333.00', 333, 0, 0, 2, 10, '0.00', 1, NULL, 0, 10);
INSERT INTO `tournaments` VALUES (87, '1wer', '2025-01-11T22:00:00.000Z', '11.00', 4, '55.00', 6, 0, 0, 4, 10, '0.00', 1, NULL, 0, NULL);
INSERT INTO `tournaments` VALUES (88, 'hoyhoy', '2025-01-11T22:00:00.000Z', '5.00', 5, '5.00', 5, 0, 0, 5, 10, '0.00', 1, NULL, 0, NULL);
INSERT INTO `tournaments` VALUES (89, 'unamas', '2025-11-30T22:00:00.000Z', '5.00', 6, '7.00', 9, 0, 0, 9, 10, '0.00', 1, NULL, 0, NULL);
INSERT INTO `tournaments` VALUES (90, 'hoyhoy', '2025-12-01T22:00:00.000Z', '100.00', 100, '50.00', 5000, 0, 1, 5, 10, '0.00', 1, NULL, 0, 10);

-- Table: users
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
) ENGINE=InnoDB AUTO_INCREMENT=266 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table: users
INSERT INTO `users` VALUES (1, 'admin', '$2b$10$R/1ej7oS0CBEX7hc/zwtjOsoTflWA0kqrKDtWJTLuMre8Rm9QA.jS', NULL, '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'admin', 0, '2025-11-15T23:45:54.000Z', '2025-11-16T13:26:33.000Z');
INSERT INTO `users` VALUES (58, 'jugador1', '$2b$10$I0mhIShPjOWCKGY9r4VDDu6zrRsdJAhXl0Y9tD2IxHZ2UveQNkeiS', 'Juan Pérez', '', '', NULL, NULL, NULL, 850, 0, 0, NULL, 'user', 1, '2025-11-27T19:34:34.000Z', '2025-11-30T08:41:49.000Z');
INSERT INTO `users` VALUES (214, 'mrodriguez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'María Rodríguez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (215, 'jgomez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Juan Gómez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (216, 'alopez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Ana López', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (217, 'cmartinez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Carlos Martínez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (218, 'lgarcia', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Laura García', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (219, 'pmoreno', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Pedro Moreno', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (220, 'sfernandez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Sofía Fernández', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (221, 'ddiaz', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Diego Díaz', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (222, 'vromero', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Valentina Romero', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (223, 'msuarez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Mateo Suárez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (224, 'jruiz', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Julia Ruiz', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (225, 'falvarez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Franco Álvarez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (226, 'mramirez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Martina Ramírez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (227, 'ltorres', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Lucas Torres', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (228, 'ccastillo', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Catalina Castillo', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (229, 'spereyra', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Santiago Pereyra', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (230, 'iflores', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Isabella Flores', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (231, 'nrivas', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Nicolás Rivas', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (232, 'eortiz', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Emma Ortiz', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (233, 'bsoto', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Bruno Soto', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (234, 'lmendez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Luna Méndez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (235, 'agreco', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Agustín Greco', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (236, 'vherrera', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Victoria Herrera', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (237, 'ivargas', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Ignacio Vargas', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (238, 'msanchez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Micaela Sánchez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (239, 'tmolina', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Tomás Molina', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (240, 'amelnik', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Abril Melnik', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (241, 'gsilva', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Gaspar Silva', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (242, 'rcardenas', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Renata Cárdenas', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (243, 'orivera', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Octavio Rivera', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (244, 'vbenitez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Valentino Benítez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (245, 'mcabrera', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Malena Cabrera', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (246, 'eacosta', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Emilio Acosta', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (247, 'dmendoza', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Delfina Mendoza', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (248, 'lnavarro', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Lautaro Navarro', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (249, 'aguerra', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Agustina Guerra', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (250, 'jpaz', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Joaquín Paz', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (251, 'bramos', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Bianca Ramos', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (252, 'fvega', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Federico Vega', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (253, 'mrojas', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Milagros Rojas', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (254, 'bmedina', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Bautista Medina', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (255, 'sgimenez', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Simona Giménez', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (256, 'amartin', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Axel Martín', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (257, 'jcorrea', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Jazmín Correa', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (258, 'mibarra', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Matías Ibarra', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (259, 'lcontreras', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Luciana Contreras', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (260, 'druiz', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Dante Ruiz', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (261, 'vcampos', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Violeta Campos', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (262, 'tcordoba', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Thiago Córdoba', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (263, 'nparedes', '$2b$10$dSbwcZuO2SwQrwL.XEvxGuc68nAB29cyTX7F9I9H.v/X3pcy7NR7O', 'Nina Paredes', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-01T04:10:07.000Z', '2025-12-01T04:10:07.000Z');
INSERT INTO `users` VALUES (264, 'alan1', '$2b$10$od1YmRP9/clRKyanYBd36..bz2lgTYuariG8FugaU9PBG88pl7ayq', 'alan garcia sobrero', '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-02T17:39:57.000Z', '2025-12-02T17:39:57.000Z');
INSERT INTO `users` VALUES (265, 'alan.garcia', 'imported', NULL, '', '', NULL, NULL, NULL, 0, 0, 0, NULL, 'user', 1, '2025-12-02T19:37:02.000Z', '2025-12-02T19:37:02.000Z');

SET FOREIGN_KEY_CHECKS=1;
