-- Combined dump generated on 2025-11-08T20:04:30.1589586+01:00
SET FOREIGN_KEY_CHECKS=0; START TRANSACTION;


-- ===== File: pokeradmin_cash_games.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cash_games`
--

DROP TABLE IF EXISTS `cash_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `small_blind` decimal(10,2) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `total_commission` decimal(10,2) DEFAULT '0.00',
  `dealer` varchar(100) DEFAULT NULL,
  `total_tips` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_games`
--

LOCK TABLES `cash_games` WRITE;
/*!40000 ALTER TABLE `cash_games` DISABLE KEYS */;
INSERT INTO `cash_games` VALUES (1,50.00,'2025-09-25 20:00:00','2025-09-25 23:00:00',5000.00,'Pedro',2000.00),(2,100.00,'2025-09-26 22:00:00','2025-09-27 02:00:00',8000.00,'Luis',3500.00);
/*!40000 ALTER TABLE `cash_games` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:08


-- ===== File: pokeradmin_cash_participants.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cash_participants`
--

DROP TABLE IF EXISTS `cash_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_participants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cash_game_id` int NOT NULL,
  `user_id` int NOT NULL,
  `seat_number` int DEFAULT NULL,
  `joined_at` datetime NOT NULL,
  `left_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cash_game_id` (`cash_game_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cash_participants_ibfk_1` FOREIGN KEY (`cash_game_id`) REFERENCES `cash_games` (`id`),
  CONSTRAINT `cash_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_participants`
--

LOCK TABLES `cash_participants` WRITE;
/*!40000 ALTER TABLE `cash_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `cash_participants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


-- ===== File: pokeradmin_combined.sql =====


-- ===== File: pokeradmin_historical_points.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `historical_points`
--

DROP TABLE IF EXISTS `historical_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historical_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `season_id` int NOT NULL,
  `tournament_id` int DEFAULT NULL,
  `result_id` int DEFAULT NULL,
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historical_points`
--

LOCK TABLES `historical_points` WRITE;
/*!40000 ALTER TABLE `historical_points` DISABLE KEYS */;
INSERT INTO `historical_points` VALUES (1,'2025-09-25 00:00:00',1,1,1,NULL,'attendance','Asistencia torneo 1',100),(2,'2025-09-25 00:00:00',2,1,1,NULL,'attendance','Asistencia torneo 1',100),(3,'2025-09-25 00:00:00',3,1,2,NULL,'reentry','Reentry torneo 2',100),(4,'2025-09-25 00:00:00',4,1,2,NULL,'final_table','Mesa Final torneo 2',500),(5,'2025-09-26 00:00:00',5,1,3,NULL,'bonus','Bonus Bronce',500);
/*!40000 ALTER TABLE `historical_points` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


-- ===== File: pokeradmin_payments.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `source` varchar(50) DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `paid_amount` decimal(15,2) DEFAULT '0.00',
  `method` varchar(50) DEFAULT NULL,
  `personal_account` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`user_id`),
  KEY `idx_payments_payment_date` (`payment_date`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,100000.00,'2025-09-29 22:53:11',NULL,NULL,0,0.00,NULL,NULL,'2025-10-26 20:29:15','2025-10-26 20:29:15',1),(2,70000.00,'2025-09-29 22:53:11',NULL,NULL,0,0.00,NULL,NULL,'2025-10-26 20:29:15','2025-10-26 20:29:15',2),(3,70000.00,'2025-09-29 22:53:11',NULL,NULL,0,0.00,NULL,NULL,'2025-10-26 20:29:15','2025-10-26 20:29:15',3),(4,200000.00,'2025-09-29 22:53:11',NULL,NULL,0,0.00,NULL,NULL,'2025-10-26 20:29:15','2025-10-26 20:29:15',4),(5,50000.00,'2025-09-29 22:53:11',NULL,NULL,0,0.00,NULL,NULL,'2025-10-26 20:29:15','2025-10-26 20:29:15',5);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


-- ===== File: pokeradmin_players.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (1,'Juan','PÃ©rez','juan.perez@example.com','111111111','JuampiPoker','2025-09-27 00:25:14',100,0,0),(2,'MarÃ­a','GÃ³mez','maria.gomez@example.com','222222222','Maru','2025-09-27 00:25:14',200,0,0),(3,'Carlos','LÃ³pez','carlos.lopez@example.com','333333333','Charly','2025-09-27 00:25:14',150,0,0),(4,'Ana','MartÃ­nez','ana.martinez@example.com','444444444','Anita','2025-09-27 00:25:14',300,0,0),(5,'Luis','RodrÃ­guez','luis.rodriguez@example.com','555555555','Luigi','2025-09-27 00:25:14',250,0,0),(6,'SofÃ­a','FernÃ¡ndez','sofia.fernandez@example.com','666666666','Sofi','2025-09-27 00:25:14',180,0,0),(7,'Pedro','RamÃ­rez','pedro.ramirez@example.com','777777777','Pete','2025-09-27 00:25:14',120,0,0),(8,'LucÃ­a','Torres','lucia.torres@example.com','888888888','Lulu','2025-09-27 00:25:14',220,0,0),(9,'Diego','SÃ¡nchez','diego.sanchez@example.com','999999999','Didi','2025-09-27 00:25:14',170,0,0),(10,'Camila','Morales','camila.morales@example.com','101010101','Cami','2025-09-27 00:25:14',140,0,0),(21,'alan','garcia','alan.garcia@example.com','234234234','elalan','2025-10-05 20:25:38',0,0,0),(74,'','','',NULL,NULL,'2025-10-24 19:23:51',0,0,0);
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:08


-- ===== File: pokeradmin_ranking_history.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ranking_history`
--

DROP TABLE IF EXISTS `ranking_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `user_id` int NOT NULL,
  `season_id` int NOT NULL,
  `posicion` int NOT NULL,
  `puntos_acumulados` int NOT NULL,
  `torneos_jugados` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `jugador_id` (`user_id`),
  KEY `season_id` (`season_id`),
  CONSTRAINT `ranking_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `players` (`id`),
  CONSTRAINT `ranking_history_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking_history`
--

LOCK TABLES `ranking_history` WRITE;
/*!40000 ALTER TABLE `ranking_history` DISABLE KEYS */;
INSERT INTO `ranking_history` VALUES (1,'2025-09-25',1,1,1,1200,3),(2,'2025-09-25',2,1,2,1000,3),(3,'2025-09-25',3,1,3,800,2),(4,'2025-09-25',4,1,4,700,2),(5,'2025-09-25',5,1,5,600,1);
/*!40000 ALTER TABLE `ranking_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:08


-- ===== File: pokeradmin_registrations.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tournament_id` int NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `punctuality` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `registrations_fk_user` (`user_id`),
  CONSTRAINT `registrations_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,1,1,'2025-09-27 00:25:14',1),(2,2,1,'2025-09-27 00:25:14',0),(3,3,2,'2025-09-27 00:25:14',1),(4,4,2,'2025-09-27 00:25:14',1),(5,5,3,'2025-09-27 00:25:14',0),(6,6,3,'2025-09-27 00:25:14',1),(7,7,4,'2025-09-27 00:25:14',0),(8,8,4,'2025-09-27 00:25:14',1),(9,9,5,'2025-09-27 00:25:14',1),(10,10,5,'2025-09-27 00:25:14',0),(11,1,1,'2025-09-29 22:52:59',1),(12,2,1,'2025-09-29 22:52:59',0),(13,3,2,'2025-09-29 22:52:59',1),(14,4,2,'2025-09-29 22:52:59',1),(15,5,3,'2025-09-29 22:52:59',0),(16,1,2,'2025-09-29 22:06:23',1),(17,1,2,'2025-10-05 20:15:22',1),(18,1,2,'2025-10-09 18:07:07',1),(19,1,2,'2025-10-09 18:07:41',1),(20,1,2,'2025-10-09 18:07:52',1),(21,1,2,'2025-10-09 18:07:54',1),(22,1,7,'2025-10-21 22:03:20',1),(83,74,23,'2025-10-24 21:23:51',1),(103,86,27,'2025-10-24 21:30:02',1),(107,87,27,'2025-10-24 21:30:02',1),(111,88,27,'2025-10-24 21:30:02',1),(115,89,28,'2025-10-24 21:33:45',1),(119,90,28,'2025-10-24 21:33:45',1),(123,91,28,'2025-10-24 21:33:45',1),(127,92,29,'2025-10-24 21:35:12',1),(131,93,29,'2025-10-24 21:35:13',1),(135,94,29,'2025-10-24 21:35:13',1),(139,95,30,'2025-10-24 21:37:30',1),(143,96,30,'2025-10-24 21:37:30',1),(147,97,30,'2025-10-24 21:37:30',1),(151,98,31,'2025-10-24 21:38:45',1),(155,99,31,'2025-10-24 21:38:45',1),(159,100,31,'2025-10-24 21:38:45',1),(163,101,32,'2025-10-24 21:50:07',1),(167,102,32,'2025-10-24 21:50:07',1),(171,103,32,'2025-10-24 21:50:07',1),(175,104,33,'2025-10-24 21:53:13',1),(179,105,33,'2025-10-24 21:53:13',1),(183,106,33,'2025-10-24 21:53:13',1),(187,107,34,'2025-10-24 21:54:40',1),(191,108,34,'2025-10-24 21:54:40',1),(195,109,34,'2025-10-24 21:54:40',1),(199,110,35,'2025-10-24 23:03:56',1),(203,111,35,'2025-10-24 23:03:56',1),(207,112,35,'2025-10-24 23:03:56',1),(211,113,36,'2025-10-24 23:07:29',1),(215,114,36,'2025-10-24 23:07:29',1),(219,115,36,'2025-10-24 23:07:29',1),(222,122,39,'2025-10-26 14:38:42',1),(223,123,39,'2025-10-26 14:38:42',1),(224,124,39,'2025-10-26 14:38:43',1),(225,125,40,'2025-10-26 14:40:11',1),(226,126,40,'2025-10-26 14:40:11',1),(227,127,40,'2025-10-26 14:40:11',1),(228,128,41,'2025-10-26 14:50:14',1),(229,129,41,'2025-10-26 14:50:14',1),(230,130,41,'2025-10-26 14:50:14',1),(231,131,42,'2025-10-26 14:54:03',1),(232,132,42,'2025-10-26 14:54:03',1),(233,133,42,'2025-10-26 14:54:03',1),(234,134,43,'2025-10-26 14:55:15',1),(235,135,43,'2025-10-26 14:55:15',1),(236,136,43,'2025-10-26 14:55:15',1),(237,137,44,'2025-10-26 14:56:57',1),(238,138,44,'2025-10-26 14:56:57',1),(239,139,44,'2025-10-26 14:56:57',1),(240,140,45,'2025-10-26 14:57:36',1),(241,141,45,'2025-10-26 14:57:36',1),(242,142,45,'2025-10-26 14:57:36',1),(243,143,46,'2025-10-26 14:59:34',1),(244,144,46,'2025-10-26 14:59:34',1),(245,145,46,'2025-10-26 14:59:34',1),(246,146,47,'2025-10-26 15:00:52',1),(247,147,47,'2025-10-26 15:00:52',1),(248,148,47,'2025-10-26 15:00:52',1),(249,149,48,'2025-10-26 15:02:17',1),(250,150,48,'2025-10-26 15:02:17',1),(251,151,48,'2025-10-26 15:02:18',1),(252,152,49,'2025-10-26 15:19:06',1),(253,153,49,'2025-10-26 15:19:06',1),(254,154,49,'2025-10-26 15:19:06',1);
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:08


-- ===== File: pokeradmin_results.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `user_id` int NOT NULL,
  `position` int NOT NULL,
  `final_table` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `results_fk_user` (`user_id`),
  CONSTRAINT `results_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,1,1,1,0),(2,1,2,2,0),(3,2,3,1,0),(4,2,4,2,0),(5,3,5,1,0),(6,1,1,1,0),(7,1,2,2,0),(8,2,3,1,0),(9,2,4,2,0),(10,3,5,1,0),(23,40,125,1,1),(24,40,126,2,1),(25,40,127,3,1),(26,41,128,1,1),(27,41,129,2,1),(28,41,130,3,1),(29,42,131,1,1),(30,42,132,2,1),(31,42,133,3,1),(32,43,134,1,1),(33,43,135,2,1),(34,43,136,3,1),(35,44,137,1,1),(36,44,138,2,1),(37,44,139,3,1),(38,45,140,1,1),(39,45,141,2,1),(40,45,142,3,1),(41,46,143,1,1),(42,46,144,2,1),(43,46,145,3,1),(44,47,146,1,1),(45,47,147,2,1),(46,47,148,3,1),(47,48,149,1,1),(48,48,150,2,1),(49,48,151,3,1),(50,49,152,1,1),(51,49,153,2,1),(52,49,154,3,1);
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:08


-- ===== File: pokeradmin_seasons.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `seasons`
--

DROP TABLE IF EXISTS `seasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seasons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `torneos_totales` int DEFAULT '0',
  `torneos_jugados` int DEFAULT '0',
  `estado` enum('planificada','activa','cerrada') DEFAULT 'planificada',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seasons`
--

LOCK TABLES `seasons` WRITE;
/*!40000 ALTER TABLE `seasons` DISABLE KEYS */;
INSERT INTO `seasons` VALUES (1,'Diamante','Ranking principal Diamante','2025-09-01','2025-12-31',35,5,'activa'),(2,'Picas','Ranking alternativo Picas','2025-09-01','2025-12-31',35,3,'planificada');
/*!40000 ALTER TABLE `seasons` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


-- ===== File: pokeradmin_tournament_points.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tournament_points`
--

DROP TABLE IF EXISTS `tournament_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `position` int NOT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tournament_id` (`tournament_id`,`position`),
  CONSTRAINT `tournament_points_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament_points`
--

LOCK TABLES `tournament_points` WRITE;
/*!40000 ALTER TABLE `tournament_points` DISABLE KEYS */;
INSERT INTO `tournament_points` VALUES (1,1,1,1000),(2,1,2,800),(3,2,1,1200),(4,2,2,900),(5,3,1,1500);
/*!40000 ALTER TABLE `tournament_points` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


-- ===== File: pokeradmin_tournaments.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `buy_in` decimal(10,2) NOT NULL,
  `re_entry` int DEFAULT '0',
  `knockout_bounty` decimal(10,2) DEFAULT '0.00',
  `starting_stack` int NOT NULL,
  `count_to_ranking` tinyint(1) DEFAULT '1',
  `double_points` tinyint(1) DEFAULT '0',
  `blind_levels` int DEFAULT NULL,
  `small_blind` int DEFAULT NULL,
  `punctuality_discount` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournaments`
--

LOCK TABLES `tournaments` WRITE;
/*!40000 ALTER TABLE `tournaments` DISABLE KEYS */;
INSERT INTO `tournaments` VALUES (1,'Sunday Major','2025-10-05',100000.00,1,0.00,50000,1,0,12,500,20.00),(2,'Midweek Madness','2025-10-08',70000.00,2,0.00,40000,1,0,10,200,15.00),(3,'High Roller KO','2025-10-12',200000.00,1,50000.00,60000,1,0,15,1000,10.00),(4,'Daily Turbo','2025-10-03',50000.00,3,0.00,30000,0,0,8,100,25.00),(5,'Double Points Special','2025-10-10',80000.00,1,0.00,45000,1,1,12,300,20.00),(6,'Prueba API','2025-12-02',12345.00,0,0.00,10000,1,0,8,50,0.00),(7,'Prueba SSR Updated Now','2025-12-03',99999.00,0,0.00,5000,0,0,6,25,0.00),(8,'EL CLASICO DEL DOMINGO','2025-10-22',123123.00,123123,122.00,123123,0,0,8,233,20.00),(9,'qwe','2025-10-24',1111.00,111,111.00,111,0,0,11,12,23.00),(10,'E2E Full 223312','2025-10-22',50.00,0,0.00,5000,1,0,8,50,0.00),(11,'E2E Full 2 223745','2025-10-22',30.00,0,0.00,5000,1,0,8,25,0.00),(12,'E2E Test Tournament 20251024093200','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(13,'E2E Test Tournament 20251024100715','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(14,'E2E Test Tournament 20251024101431','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(15,'E2E Test Tournament 20251024185846','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(16,'E2E Test Tournament 20251024190036','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(17,'E2E Test Tournament 20251024190159','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(18,'E2E Test Tournament 20251024190258','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(19,'E2E Test Tournament 20251024190427','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(20,'E2E Test Tournament 20251024190525','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(21,'E2E Test Tournament 20251024190722','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(22,'E2E Test Tournament 20251024190832','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(23,'E2E Test Tournament 20251024192350','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(24,'E2E Test Tournament 20251024192508','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(25,'E2E Test Tournament 20251024192741','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(26,'E2E Test Tournament 20251024192859','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(27,'E2E Test Tournament 20251024193001','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(28,'E2E Test Tournament 20251024193344','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(29,'E2E Test Tournament 20251024193512','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(30,'E2E Test Tournament 20251024193729','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(31,'E2E Test Tournament 20251024193844','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(32,'E2E Test Tournament 20251024195006','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(33,'E2E Test Tournament 20251024195312','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(34,'E2E Test Tournament 20251024195439','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(35,'E2E Test Tournament 20251024210355','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(36,'E2E Test Tournament 20251024210728','2025-10-24',100.00,0,0.00,10000,1,0,10,50,0.00),(37,'E2E Test Tournament 20251026143607','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(38,'E2E Test Tournament 20251026143744','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(39,'E2E Test Tournament 20251026143842','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(40,'E2E Test Tournament 20251026144011','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(41,'E2E Test Tournament 20251026145013','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(42,'E2E Test Tournament 20251026145403','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(43,'E2E Test Tournament 20251026145515','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(44,'E2E Test Tournament 20251026145657','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(45,'E2E Test Tournament 20251026145735','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(46,'E2E Test Tournament 20251026145934','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(47,'E2E Test Tournament 20251026150051','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(48,'E2E Test Tournament 20251026150217','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00),(49,'E2E Test Tournament 20251026151906','2025-10-26',100.00,0,0.00,10000,1,0,10,50,0.00);
/*!40000 ALTER TABLE `tournaments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


-- ===== File: pokeradmin_users.sql =====

CREATE DATABASE  IF NOT EXISTS `pokeradmin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokeradmin`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pokeradmin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('admin','user','player') NOT NULL DEFAULT 'player',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `current_points` int DEFAULT '0',
  `suspended` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `is_player` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$j.kgqXBmEPa5LEjaJli7HuUgJ/09zcJGWP5oBySjMdWqUaxJy5cBm','Administrador Principal',NULL,'admin','2025-10-13 21:02:12','2025-10-13 21:02:12','','',NULL,NULL,NULL,0,0,0,0),(2,'test1','$2b$10$TI427bI76l54C0.theArseTDKZX5RNJrvx5CW1.ho04j5PxHYD0QC','Usuario de Prueba 1',NULL,'user','2025-10-13 21:02:12','2025-10-21 18:55:55','','',NULL,NULL,NULL,0,0,0,0),(3,'test2','$2b$10$NCC7bFOp.vQvWeHo2Yx3F.ryo.Lz3Y5k9VDliMPYwbEs2g2cPyRXq','Usuario de Prueba 2',NULL,'user','2025-10-13 21:02:12','2025-10-13 21:02:12','','',NULL,NULL,NULL,0,0,0,0),(4,'test3','$2b$10$JanI67EUWuaEwtptdPvL6.JPsDQsJhiK5iaga4GWnDxly73atn5Pu','Usuario de Prueba 3',NULL,'user','2025-10-13 21:02:13','2025-10-13 21:02:13','','',NULL,NULL,NULL,0,0,0,0),(5,'JuampiPoker','','Juan PÃ©rez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Juan','PÃ©rez','juan.perez@example.com','111111111','JuampiPoker',100,0,0,1),(6,'Maru','','MarÃ­a GÃ³mez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','MarÃ­a','GÃ³mez','maria.gomez@example.com','222222222','Maru',200,0,0,1),(7,'Charly','','Carlos LÃ³pez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Carlos','LÃ³pez','carlos.lopez@example.com','333333333','Charly',150,0,0,1),(8,'Anita','','Ana MartÃ­nez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Ana','MartÃ­nez','ana.martinez@example.com','444444444','Anita',300,0,0,1),(9,'Luigi','','Luis RodrÃ­guez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Luis','RodrÃ­guez','luis.rodriguez@example.com','555555555','Luigi',250,0,0,1),(10,'Sofi','','SofÃ­a FernÃ¡ndez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','SofÃ­a','FernÃ¡ndez','sofia.fernandez@example.com','666666666','Sofi',180,0,0,1),(11,'Pete','','Pedro RamÃ­rez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Pedro','RamÃ­rez','pedro.ramirez@example.com','777777777','Pete',120,0,0,1),(12,'Lulu','','LucÃ­a Torres',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','LucÃ­a','Torres','lucia.torres@example.com','888888888','Lulu',220,0,0,1),(13,'Didi','','Diego SÃ¡nchez',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Diego','SÃ¡nchez','diego.sanchez@example.com','999999999','Didi',170,0,0,1),(14,'Cami','','Camila Morales',NULL,'player','2025-09-27 00:25:14','2025-10-18 20:40:00','Camila','Morales','camila.morales@example.com','101010101','Cami',140,0,0,1),(15,'elalan','','alan garcia',NULL,'user','2025-10-05 20:25:38','2025-10-21 03:34:23','alan','garcia','alan.garcia@example.com','234234234','elalan',0,0,0,1),(20,'testuser3','$2b$10$QOBVBonHoi8.m5usKZqpOu7f6bBBk9rFZTSInQ3QgSjAnZffaFik.','Test User 3',NULL,'user','2025-10-18 20:28:49','2025-10-18 20:28:49','','','',NULL,NULL,0,0,0,0),(22,'smoke_test_user_20251018224145','$2b$10$MdUJV8j/DKJRRyFu/Bjs3Or1JdIfr9m5prDY4tCQyUrLuEBDAW0eG',NULL,NULL,'user','2025-10-18 20:41:46','2025-10-18 21:49:09','','',NULL,NULL,NULL,0,0,1,0),(23,'smoketest_user','$2b$10$fIvvK0Gi1/YStXW8GNZj6.exhhVVgirJsa3DZI1CiFK3JUeH12Imu','Smoke Test',NULL,'user','2025-10-18 21:23:48','2025-10-18 21:49:09','','',NULL,NULL,NULL,0,0,1,0),(24,'smoketest','$2b$10$oJO/uAmj5uiurBcg7fz.xODzCgP6x382t0kvqQbMY2lUq09o3s.ai','Smoke Tester',NULL,'user','2025-10-18 21:27:12','2025-10-18 21:49:09','','',NULL,NULL,NULL,0,0,1,0),(25,'smoketest2','$2b$10$KVjhB3y8w8/PFUOq7qItney1ntHlGrIMgDB2YMET.ly4ptAPGssye','Smoke Tester 2',NULL,'user','2025-10-18 21:30:57','2025-10-18 21:49:09','','',NULL,NULL,NULL,0,0,1,0),(27,'import_user1','$2b$10$/gcaDOn50zh8kkvvpQTSFO91vZ3icwyhmkniX.jB.zWd5l0LEX8ae',NULL,NULL,'user','2025-10-18 21:35:45','2025-10-18 21:49:09','Import','One',NULL,NULL,NULL,0,0,1,0),(28,'import_user2','$2b$10$VoWRuplKXavKUzfwg3//we.qpEhEhqh/M2t4EsTMe.OU6Ahex4ieq',NULL,NULL,'user','2025-10-18 21:35:45','2025-10-18 21:49:09','Import','Two',NULL,NULL,NULL,0,0,1,0),(29,'e2euser1','$2b$10$Uym2GpgrH25psFc1rTdmw.HMwHQegDTcjGsoH4.iNyJXqACey9GHy','E2E User 1',NULL,'player','2025-10-22 20:33:12','2025-10-22 20:33:12','','',NULL,NULL,NULL,0,0,0,0),(30,'e2euser2','$2b$10$INTOaRmr7g45afH2QgevIeSZKsGZ20nA7da8nTmL8G3cZbrsuQknW','E2E User 2',NULL,'player','2025-10-22 20:33:12','2025-10-22 20:33:12','','',NULL,NULL,NULL,0,0,0,0),(31,'e2euser3','$2b$10$2XGr.dZsELsQwwg4CF8U0.Dd49deWci1VkvT4KzYp3T5WyEr3InAy','E2E User 3',NULL,'player','2025-10-22 20:33:13','2025-10-22 20:33:13','','',NULL,NULL,NULL,0,0,0,0),(35,'e2e_user_2906','$2b$10$ANJlsFlSehIWwncbL8f0k.qtCHu0sWIAzx0UUxGb2HgJT1NITVQi6','E2E User 1',NULL,'player','2025-10-22 20:37:45','2025-10-22 20:37:45','','',NULL,NULL,NULL,0,0,0,0),(36,'e2e_user_5130','$2b$10$8k835JlmjsvNVo2tKA0sXuMoxEQHgeLqQ9uWFp.elgIyC2ocgpFea','E2E User 2',NULL,'player','2025-10-22 20:37:45','2025-10-22 20:37:45','','',NULL,NULL,NULL,0,0,0,0),(37,'e2e_user_5855','$2b$10$hjF0oqw3SDhXz1vV7aFlH.LQa706NJ3C5.jGyoMUmtYNoJB7dtELK','E2E User 3',NULL,'player','2025-10-22 20:37:45','2025-10-22 20:37:45','','',NULL,NULL,NULL,0,0,0,0),(38,'e2e_manual_20251022224140','$2b$10$1OeF8PFWhq6DMRpo1OqPguf1QTgBx04mqnsCD7AHhdAPflZs9VxOe','E2E Manual',NULL,'player','2025-10-22 20:41:40','2025-10-22 20:41:40','','',NULL,NULL,NULL,0,0,0,0),(39,'e2e_retry_460','$2b$10$H1MXeORB/PeqcDIjRA89IOSKc2ZY8cp4UAQwmkoaO6z6wuYlGmL/y','Retry',NULL,'player','2025-10-22 20:45:53','2025-10-22 20:45:53','','',NULL,NULL,NULL,0,0,0,0),(40,'e2e_retry_913','$2b$10$lVr0RSUL/oB86jvZgCD7eO5Bj4APV5A1uBlw/qLF0lKfm/WmitRO.','Retry',NULL,'player','2025-10-22 21:10:38','2025-10-22 21:10:38','','',NULL,NULL,NULL,0,0,0,0),(41,'e2e_user_1_093201','$2b$10$qmen7CjJfeJI7koFZZCDAOQtIKL5QiaH6vUYaF.am6alqM//fHvo6','E2E User 1',NULL,'user','2025-10-24 09:32:01','2025-10-24 09:32:01','','',NULL,NULL,NULL,0,0,0,0),(42,'e2e_user_2_093201','$2b$10$DSUL3gXHruiZM4H90RTofejAs2oadZOsRoJSriTpDtw64ggFzHk.K','E2E User 2',NULL,'user','2025-10-24 09:32:01','2025-10-24 09:32:01','','',NULL,NULL,NULL,0,0,0,0),(43,'e2e_user_3_093201','$2b$10$MzvelVTj0tB3js4OpQPFsegmc8D3x76WcubDMnc5pCPjfYzwU4s72','E2E User 3',NULL,'user','2025-10-24 09:32:01','2025-10-24 09:32:01','','',NULL,NULL,NULL,0,0,0,0),(44,'e2e_user_1_100715','$2b$10$fEZTuGImMqt17S5g.L.ldeU/F.HX0ILSiPwTBwZhwKMVUirxsUGgS','E2E User 1',NULL,'user','2025-10-24 10:07:16','2025-10-24 10:07:16','','',NULL,NULL,NULL,0,0,0,0),(45,'e2e_user_2_100716','$2b$10$97p/nHtdIpw.Iz058kk/K.9QOZ6NPM4LnktPfiMxKrddFOMmyBD7a','E2E User 2',NULL,'user','2025-10-24 10:07:16','2025-10-24 10:07:16','','',NULL,NULL,NULL,0,0,0,0),(46,'e2e_user_3_100716','$2b$10$Tr/oIobLF7fv87k3M9vFauo9ruaart5UdDwuQZfndOB/Frs7Zen9e','E2E User 3',NULL,'user','2025-10-24 10:07:16','2025-10-24 10:07:16','','',NULL,NULL,NULL,0,0,0,0),(47,'e2e_user_1_101432','$2b$10$CFpFnTF2wExHVi2lqfbkFeKzBZMCZP8bQGnnzDRXDBy2R.SLCnCpK','E2E User 1',NULL,'user','2025-10-24 10:14:32','2025-10-24 10:14:32','','',NULL,NULL,NULL,0,0,0,0),(48,'e2e_user_2_101432','$2b$10$M/aQxK4SP7mSc/lsbVPDx.da7/w5aIikXecyAdazCChOSXlv2m.k6','E2E User 2',NULL,'user','2025-10-24 10:14:32','2025-10-24 10:14:32','','',NULL,NULL,NULL,0,0,0,0),(49,'e2e_user_3_101432','$2b$10$f5pgr0ERAawrGGYodJSF7ubF6zYRfDowN2NtBP85Jo1uRvzbLL/wu','E2E User 3',NULL,'user','2025-10-24 10:14:32','2025-10-24 10:14:32','','',NULL,NULL,NULL,0,0,0,0),(50,'e2e_user_1_185846','$2b$10$/3lPAv2pft8G7O115kFWauGN/g9yMnpF/iTPmcCbhX2eRZyHp9h5e','E2E User 1',NULL,'user','2025-10-24 18:58:46','2025-10-24 18:58:46','','',NULL,NULL,NULL,0,0,0,0),(51,'e2e_user_2_185846','$2b$10$N20Za57qgVBjNfGCVBi.yuZcvFIPIrA9.w3/Qvvo6jd0dv3ZcEmce','E2E User 2',NULL,'user','2025-10-24 18:58:46','2025-10-24 18:58:46','','',NULL,NULL,NULL,0,0,0,0),(52,'e2e_user_3_185846','$2b$10$NI8.xOFA0GmBGBXjamoKre2UNVo806ggr6jpd9eOUEm0tOuqJt1PO','E2E User 3',NULL,'user','2025-10-24 18:58:46','2025-10-24 18:58:46','','',NULL,NULL,NULL,0,0,0,0),(53,'e2e_user_1_190036','$2b$10$5FWJgRugtAkAmmVP/4428OAY6UK3zavkGPy.iaLqoQDlzLWn3zLfS','E2E User 1',NULL,'user','2025-10-24 19:00:36','2025-10-24 19:00:36','','',NULL,NULL,NULL,0,0,0,0),(54,'e2e_user_2_190036','$2b$10$i.fjpdL0q6tvvP4XYMyo6uwOrVKHrXSOJcJ/d26LXDcXfpW7yBWce','E2E User 2',NULL,'user','2025-10-24 19:00:36','2025-10-24 19:00:36','','',NULL,NULL,NULL,0,0,0,0),(55,'e2e_user_3_190036','$2b$10$pNuu3sIiRykILBXKu0k8xOO4yyCCbItT1SaiLbfWzsMgZdiHtpqNC','E2E User 3',NULL,'user','2025-10-24 19:00:36','2025-10-24 19:00:36','','',NULL,NULL,NULL,0,0,0,0),(56,'e2e_user_1_190159','$2b$10$begvDhGXSmcB4B17ubUEnOH2cOHV0dQW92k/yeZdOgM3jC1H/peM2','E2E User 1',NULL,'user','2025-10-24 19:01:59','2025-10-24 19:01:59','','',NULL,NULL,NULL,0,0,0,0),(57,'e2e_user_2_190159','$2b$10$VGwYDMR2wblbNdm.bz7PuOJrA5lSk2l6Uxxs40YlG3S7f2301sVDm','E2E User 2',NULL,'user','2025-10-24 19:01:59','2025-10-24 19:01:59','','',NULL,NULL,NULL,0,0,0,0),(58,'e2e_user_3_190159','$2b$10$a6ldTaXJ2JVmvPw5OGQMku72Oij7PUB7GKiZYt9dEjhlZJnHU4D8K','E2E User 3',NULL,'user','2025-10-24 19:01:59','2025-10-24 19:01:59','','',NULL,NULL,NULL,0,0,0,0),(59,'e2e_user_1_190258','$2b$10$akXPRuC/AzT0nQX.Cq4.1.UWLWUhe1qaMqElmITu.fxG9foBpRu5q','E2E User 1',NULL,'user','2025-10-24 19:02:58','2025-10-24 19:02:58','','',NULL,NULL,NULL,0,0,0,0),(60,'e2e_user_2_190258','$2b$10$7p.fJLULd0apZ9Ne28daceMsO85S0kLyK5dPfq4YiveLPn5lftE0u','E2E User 2',NULL,'user','2025-10-24 19:02:58','2025-10-24 19:02:58','','',NULL,NULL,NULL,0,0,0,0),(61,'e2e_user_3_190258','$2b$10$ZjCy4.Ih0BVFIyHmWHNWeOjEswg.oFn.7wjBzXooU7o/a5jLUVA5i','E2E User 3',NULL,'user','2025-10-24 19:02:58','2025-10-24 19:02:58','','',NULL,NULL,NULL,0,0,0,0),(62,'e2e_user_1_190428','$2b$10$s5B891sfFrZo3YHYsQqBX.OLlBaBm.9WN.iESPTfoBwF0xAl5arX6','E2E User 1',NULL,'user','2025-10-24 19:04:28','2025-10-24 19:04:28','','',NULL,NULL,NULL,0,0,0,0),(63,'e2e_user_2_190428','$2b$10$lB7KI1vD/JC6QIKkxhu9Qe0ruSlNOZM5oG5I5QZHZV6Z1YTMJl5ie','E2E User 2',NULL,'user','2025-10-24 19:04:28','2025-10-24 19:04:28','','',NULL,NULL,NULL,0,0,0,0),(64,'e2e_user_3_190428','$2b$10$8HwH.KelB58aOCej8thmI..sjaGHS9p7GLPB1HBPfGstncpvVheK2','E2E User 3',NULL,'user','2025-10-24 19:04:28','2025-10-24 19:04:28','','',NULL,NULL,NULL,0,0,0,0),(65,'e2e_user_1_190525','$2b$10$WRrVxSJUav/rLiVC4L88Z.W7snUAr/57RBZNPlzpSkWVrkcYl2hr.','E2E User 1',NULL,'user','2025-10-24 19:05:26','2025-10-24 19:05:26','','',NULL,NULL,NULL,0,0,0,0),(66,'e2e_user_2_190526','$2b$10$rg7vVVQsu301zgip2L3G7Oomcnu5FUVo.vI8yamM4UnkAb10Z5Ssy','E2E User 2',NULL,'user','2025-10-24 19:05:26','2025-10-24 19:05:26','','',NULL,NULL,NULL,0,0,0,0),(67,'e2e_user_3_190526','$2b$10$pQI.K/Vh.RU3Y8D7swfHieF6.bSWFjiinL9j/COwFW2k.iyeaW5wy','E2E User 3',NULL,'user','2025-10-24 19:05:26','2025-10-24 19:05:26','','',NULL,NULL,NULL,0,0,0,0),(68,'e2e_user_1_190722','$2b$10$.ggbYsUOK4QfsQX8u08EEOtmpRgmoMQhvljBcKCRlcVScPpFQE3dG','E2E User 1',NULL,'user','2025-10-24 19:07:22','2025-10-24 19:07:22','','',NULL,NULL,NULL,0,0,0,0),(69,'e2e_user_2_190723','$2b$10$PFo.E66nNTN8Hbzo4IW5xOMb.Jg1eeSG9827Krgugh0q0Jg9mcfSu','E2E User 2',NULL,'user','2025-10-24 19:07:23','2025-10-24 19:07:23','','',NULL,NULL,NULL,0,0,0,0),(70,'e2e_user_3_190723','$2b$10$QiwLkOhKL2tAKMzw/TfVO.22tE76T4KfylrJeK5.8OLda9SVtER3G','E2E User 3',NULL,'user','2025-10-24 19:07:23','2025-10-24 19:07:23','','',NULL,NULL,NULL,0,0,0,0),(71,'e2e_user_1_190832','$2b$10$8tg.bdgYfjiBb.rVXIof/Owgeb4/nBoh9Y3yUYwJYvpISZk6Aiu56','E2E User 1',NULL,'user','2025-10-24 19:08:33','2025-10-24 19:08:33','','',NULL,NULL,NULL,0,0,0,0),(72,'e2e_user_2_190833','$2b$10$RFN.jbhGchIVD4jsVs7omeba1HW8q8CnqyL1WqF2eM8De829yEz2y','E2E User 2',NULL,'user','2025-10-24 19:08:33','2025-10-24 19:08:33','','',NULL,NULL,NULL,0,0,0,0),(73,'e2e_user_3_190833','$2b$10$QluN/8B5E24tqJqQoMajcOw46N2KbfHuE.XJ.GoGxF90Hzjpmi2xu','E2E User 3',NULL,'user','2025-10-24 19:08:33','2025-10-24 19:08:33','','',NULL,NULL,NULL,0,0,0,0),(74,'e2e_user_1_192350','$2b$10$haADWSVMqbzS2Po8zZOq/ODAiCs/pZ3FWwFY7EKAIDTsdfQTrvs9e','E2E User 1',NULL,'user','2025-10-24 19:23:51','2025-10-24 19:23:51','','',NULL,NULL,NULL,0,0,0,0),(75,'e2e_user_2_192351','$2b$10$P0gnjr38gmMMmgE2JLa71OsvNA25iCODwNS0SdbACBG54dexiNzi6','E2E User 2',NULL,'user','2025-10-24 19:23:51','2025-10-24 19:23:51','','',NULL,NULL,NULL,0,0,0,0),(76,'e2e_user_3_192351','$2b$10$LAORGEH1o9UX8JbyoVHMrO.tFOc1V2G.Bmc4FjKbAKToizMQd09f6','E2E User 3',NULL,'user','2025-10-24 19:23:51','2025-10-24 19:23:51','','',NULL,NULL,NULL,0,0,0,0),(77,'e2e_user_1_192508','$2b$10$obaYOrOpWtwY/U3DqeGw0uf5u36F1YRkoZjKHgxTd2dQ.FxOU1zUO','E2E User 1',NULL,'user','2025-10-24 19:25:08','2025-10-24 19:25:08','','',NULL,NULL,NULL,0,0,0,0),(78,'e2e_user_2_192508','$2b$10$3QQjB75THsP.79H0.ChF5O9ZaXaQ1Z9pkFnUq72ib/QtpeuQHkwna','E2E User 2',NULL,'user','2025-10-24 19:25:08','2025-10-24 19:25:08','','',NULL,NULL,NULL,0,0,0,0),(79,'e2e_user_3_192508','$2b$10$TtbrcyKwzHmqnEQltCADB.btVd76AvhRC2FQo/ejcBs7PAeFJpFxe','E2E User 3',NULL,'user','2025-10-24 19:25:08','2025-10-24 19:25:08','','',NULL,NULL,NULL,0,0,0,0),(80,'e2e_user_1_192741','$2b$10$FNLGYQb1rgBCkoJF2vBVPevJYYuAPb8bCB0keqMWfgXcjJRyjaykm','E2E User 1',NULL,'user','2025-10-24 19:27:41','2025-10-24 19:27:41','','',NULL,NULL,NULL,0,0,0,0),(81,'e2e_user_2_192741','$2b$10$RxNbqRxX6SmtYU3HhYul6ORxYKwGEo1C3TGgYZK77OiiD1zqSx5N.','E2E User 2',NULL,'user','2025-10-24 19:27:41','2025-10-24 19:27:41','','',NULL,NULL,NULL,0,0,0,0),(82,'e2e_user_3_192741','$2b$10$iQpSFecofaWEWEtg5M90keJuLGeQNn0AgZgBHOgS9X5x3mK9R5zdK','E2E User 3',NULL,'user','2025-10-24 19:27:41','2025-10-24 19:27:41','','',NULL,NULL,NULL,0,0,0,0),(83,'e2e_user_1_192859','$2b$10$geBBvH.DHrf/wySnl4BFT.Il3PxbSDaVq4vxqWvmpdSt8zFljuF/W','E2E User 1',NULL,'user','2025-10-24 19:28:59','2025-10-24 19:28:59','','',NULL,NULL,NULL,0,0,0,0),(84,'e2e_user_2_192859','$2b$10$6cMVdBfIW6IiwDYkkioY6OuZJmP4xWViMIMbfhIqq7WVA18icMIhq','E2E User 2',NULL,'user','2025-10-24 19:29:00','2025-10-24 19:29:00','','',NULL,NULL,NULL,0,0,0,0),(85,'e2e_user_3_192900','$2b$10$xTxATVnN1KIMcq4jp3lydeTqfVHQ/KOm53u./kZYRul8Y5ERBHmvy','E2E User 3',NULL,'user','2025-10-24 19:29:00','2025-10-24 19:29:00','','',NULL,NULL,NULL,0,0,0,0),(86,'e2e_user_1_193001','$2b$10$CE3rq/LmCXVTS51CwY1WOOHTgPiR.qGVaEJyCuMr9ROp4eMbsrVSu','E2E User 1',NULL,'user','2025-10-24 19:30:01','2025-10-24 19:30:01','','',NULL,NULL,NULL,0,0,0,0),(87,'e2e_user_2_193001','$2b$10$w0Te41D5cOeRTFfauQixbOQp0qjikLCgEEo8BRxgCUsCx7T7pkugi','E2E User 2',NULL,'user','2025-10-24 19:30:01','2025-10-24 19:30:01','','',NULL,NULL,NULL,0,0,0,0),(88,'e2e_user_3_193001','$2b$10$4UsALP5S3qIVQ729ZEYK9OxMZmtgHZ6dwlfXmv40eDy8jv95AEfZO','E2E User 3',NULL,'user','2025-10-24 19:30:02','2025-10-24 19:30:02','','',NULL,NULL,NULL,0,0,0,0),(89,'e2e_user_1_193344','$2b$10$XTA3UR44xH9axowBsDdkGOM1/Q8Y3sg4BXQDxzdngbPZZdhg/VeYm','E2E User 1',NULL,'user','2025-10-24 19:33:44','2025-10-24 19:33:44','','',NULL,NULL,NULL,0,0,0,0),(90,'e2e_user_2_193344','$2b$10$3FTSPjA1kjKb5nqDDYEhIujL2dDCu.p/0OI.ZdSXyA8j.Kdo45LBS','E2E User 2',NULL,'user','2025-10-24 19:33:44','2025-10-24 19:33:44','','',NULL,NULL,NULL,0,0,0,0),(91,'e2e_user_3_193344','$2b$10$R1fy/3GevuG2ohBS5a0XfupWcgYeKK1tC88B67XHY/2gbieD2lpd.','E2E User 3',NULL,'user','2025-10-24 19:33:45','2025-10-24 19:33:45','','',NULL,NULL,NULL,0,0,0,0),(92,'e2e_user_1_193512','$2b$10$nE1QjhHFEJ7NFaes0oz8huT3y./Ja.1pjKEo.D2.6U0MWRwRYohnu','E2E User 1',NULL,'user','2025-10-24 19:35:12','2025-10-24 19:35:12','','',NULL,NULL,NULL,0,0,0,0),(93,'e2e_user_2_193512','$2b$10$SyOLBP5Z9nOZVcld7lpXvuPWoojZOP5ETf.aCFFKgimD4zpcbojPa','E2E User 2',NULL,'user','2025-10-24 19:35:12','2025-10-24 19:35:12','','',NULL,NULL,NULL,0,0,0,0),(94,'e2e_user_3_193512','$2b$10$Vt6hu4CIveWSIp5xw0l8AermyhSUOUK20xrxGinGBgLywXH3cpG2G','E2E User 3',NULL,'user','2025-10-24 19:35:12','2025-10-24 19:35:12','','',NULL,NULL,NULL,0,0,0,0),(95,'e2e_user_1_193729','$2b$10$QDW4wYjnETipxGODIau9t.d9L.bNTUtImu64/xhChhtrWThM9gGIC','E2E User 1',NULL,'user','2025-10-24 19:37:29','2025-10-24 19:37:29','','',NULL,NULL,NULL,0,0,0,0),(96,'e2e_user_2_193729','$2b$10$xk4m/thKmEoLzSkuavm67e.M9QR0d4B5C8AKMHf2JthWGmmefCs5G','E2E User 2',NULL,'user','2025-10-24 19:37:29','2025-10-24 19:37:29','','',NULL,NULL,NULL,0,0,0,0),(97,'e2e_user_3_193729','$2b$10$tUTMZmxidWzaz/6G3Fffzu1gm1Jo2BOe3K7BEA8lvE3ruybrZ4g/u','E2E User 3',NULL,'user','2025-10-24 19:37:29','2025-10-24 19:37:29','','',NULL,NULL,NULL,0,0,0,0),(98,'e2e_user_1_193844','$2b$10$YUX8XwcJhW6NOvXtiIOzIeNYRhx1VhXcGgsap26rP1.vBDMu7leQe','E2E User 1',NULL,'user','2025-10-24 19:38:44','2025-10-24 19:38:44','','',NULL,NULL,NULL,0,0,0,0),(99,'e2e_user_2_193844','$2b$10$NXEtVia2HSKmbpQsY2JjN.HxDNxMuV.6IJ318cvCUiYsk8erp39bq','E2E User 2',NULL,'user','2025-10-24 19:38:45','2025-10-24 19:38:45','','',NULL,NULL,NULL,0,0,0,0),(100,'e2e_user_3_193845','$2b$10$mYCzNKddZxWNI0RScVhOieGHp1DkFmrqUUKWXB0OcA8YjXtndIlV.','E2E User 3',NULL,'user','2025-10-24 19:38:45','2025-10-24 19:38:45','','',NULL,NULL,NULL,0,0,0,0),(101,'e2e_user_1_195006','$2b$10$aScQuxUelQwz/sCTFkdEfOTH/2q5NU.W6DEw.Vg2tm9/Dmxs72dL.','E2E User 1',NULL,'user','2025-10-24 19:50:06','2025-10-24 19:50:06','','',NULL,NULL,NULL,0,0,0,0),(102,'e2e_user_2_195006','$2b$10$8CrqySd2.DvIYob0xl/XHeThUKzC4kkj1iFdf0B4Ds/9b3yYvUGze','E2E User 2',NULL,'user','2025-10-24 19:50:07','2025-10-24 19:50:07','','',NULL,NULL,NULL,0,0,0,0),(103,'e2e_user_3_195007','$2b$10$FWz774NFl55mXfvp0vqYaOQHE.LPLvavAuqILGrA.D/J7K9eT0UTG','E2E User 3',NULL,'user','2025-10-24 19:50:07','2025-10-24 19:50:07','','',NULL,NULL,NULL,0,0,0,0),(104,'e2e_user_1_195312','$2b$10$W23dR44.qVqMirbecI2TBujnvojHKVcRQpQ0F58aMAmLFO6qORtNO','E2E User 1',NULL,'user','2025-10-24 19:53:12','2025-10-24 19:53:12','','',NULL,NULL,NULL,0,0,0,0),(105,'e2e_user_2_195312','$2b$10$aM2kuHjA6w8h0SX/wOj2m./ymjYxw904uAwAsst32982OFE74Nta.','E2E User 2',NULL,'user','2025-10-24 19:53:12','2025-10-24 19:53:12','','',NULL,NULL,NULL,0,0,0,0),(106,'e2e_user_3_195312','$2b$10$aOGj2NnA04q4bMZpvgFGJ.ZqvTMFTToA9c4JTX/x1lNeydY/8LVvS','E2E User 3',NULL,'user','2025-10-24 19:53:12','2025-10-24 19:53:12','','',NULL,NULL,NULL,0,0,0,0),(107,'e2e_user_1_195439','$2b$10$DHwmVTxQ4llaZWwi.mXSU.MXkYxz.z6ZxRWZbVM1FuIlwzwvAF9wG','E2E User 1',NULL,'user','2025-10-24 19:54:39','2025-10-24 19:54:39','','',NULL,NULL,NULL,0,0,0,0),(108,'e2e_user_2_195440','$2b$10$pG98AtiHD7CYV5YQdWiTZuvLjucjN6t7C.502ybbiqZSEeiEDFyV6','E2E User 2',NULL,'user','2025-10-24 19:54:40','2025-10-24 19:54:40','','',NULL,NULL,NULL,0,0,0,0),(109,'e2e_user_3_195440','$2b$10$bxd.fuSPjG3ogEihvQ8cW.p2xpSujOtEhT1Mb2f2wjVpuZEF9hnLC','E2E User 3',NULL,'user','2025-10-24 19:54:40','2025-10-24 19:54:40','','',NULL,NULL,NULL,0,0,0,0),(110,'e2e_user_1_210355','$2b$10$XIup.fbi.1GOO0/TKznWrOMdh0xo5SXhfc/F5sMLG.2KX8pscQmXS','E2E User 1',NULL,'user','2025-10-24 21:03:55','2025-10-24 21:03:55','','',NULL,NULL,NULL,0,0,0,0),(111,'e2e_user_2_210355','$2b$10$ChpxnkOkRljIHmG3yWsMfeqX8ZwelGentg6Ny1m1oVQmCaZR/V.Qa','E2E User 2',NULL,'user','2025-10-24 21:03:55','2025-10-24 21:03:55','','',NULL,NULL,NULL,0,0,0,0),(112,'e2e_user_3_210355','$2b$10$ClR7sEj7DRurJUXb5f/PKuw2ikIBgoI/h473MsMrlDfRjP3QAF12y','E2E User 3',NULL,'user','2025-10-24 21:03:55','2025-10-24 21:03:55','','',NULL,NULL,NULL,0,0,0,0),(113,'e2e_user_1_210728','$2b$10$spqFhGeAb16RvjDBkw6lFeQ7mrCBXSKCQLzCToyQZuYpAbe3PVA92','E2E User 1',NULL,'user','2025-10-24 21:07:29','2025-10-24 21:07:29','','',NULL,NULL,NULL,0,0,0,0),(114,'e2e_user_2_210729','$2b$10$2RrYUN7564VdXSom.yFCce3kGCql8/NmWjEx9/Sr6Je.BfFrAMaGa','E2E User 2',NULL,'user','2025-10-24 21:07:29','2025-10-24 21:07:29','','',NULL,NULL,NULL,0,0,0,0),(115,'e2e_user_3_210729','$2b$10$jj9AO7K5GiUcTm5BfvuOiOTEaGIggN9j2z/2TzDFP9ICzZ6E4maV2','E2E User 3',NULL,'user','2025-10-24 21:07:29','2025-10-24 21:07:29','','',NULL,NULL,NULL,0,0,0,0),(116,'e2e_user_1_143608','$2b$10$BSXIyGl73LfmIW/7KJRTCurgN1D4h6/kYAIwy6AcBwqMK2fWruI8G','E2E User 1',NULL,'user','2025-10-26 14:36:08','2025-10-26 14:36:08','','',NULL,NULL,NULL,0,0,0,0),(117,'e2e_user_2_143608','$2b$10$L/AQjKsdak3AjcXjFwevBOCEkGeoAJhtxKj4dbdsKipVPNZTD35Cy','E2E User 2',NULL,'user','2025-10-26 14:36:08','2025-10-26 14:36:08','','',NULL,NULL,NULL,0,0,0,0),(118,'e2e_user_3_143608','$2b$10$KqOdJlr2dzk0Pbpde0Nr3uJmmXaSnyg1JBZYPmjAuGoxAHzTLqbFS','E2E User 3',NULL,'user','2025-10-26 14:36:08','2025-10-26 14:36:08','','',NULL,NULL,NULL,0,0,0,0),(119,'e2e_user_1_143744','$2b$10$0cMmWDu7gFLJ42JDcC.//.htUyaQbFDo71pGd5yKGdQvP49JZUSKK','E2E User 1',NULL,'user','2025-10-26 14:37:44','2025-10-26 14:37:44','','',NULL,NULL,NULL,0,0,0,0),(120,'e2e_user_2_143744','$2b$10$M5SpxZmBTaoM02V2W2g3UuhA9/5NWQyXhvPw6yuw///MvBva6Sd1S','E2E User 2',NULL,'user','2025-10-26 14:37:44','2025-10-26 14:37:44','','',NULL,NULL,NULL,0,0,0,0),(121,'e2e_user_3_143744','$2b$10$wzZ.ueYYcB/0xDXkJ1oTDu4YCQqUZArquBl8Kg70XsNGpBz/lyIne','E2E User 3',NULL,'user','2025-10-26 14:37:45','2025-10-26 14:37:45','','',NULL,NULL,NULL,0,0,0,0),(122,'e2e_user_1_143842','$2b$10$lIxq9Folc1kAzRLYydvIie.xEBWZoAMGIRCC62C4ih8h8/nTps83e','E2E User 1',NULL,'user','2025-10-26 14:38:42','2025-10-26 14:38:42','','',NULL,NULL,NULL,0,0,0,0),(123,'e2e_user_2_143842','$2b$10$fx8lgsONwD7bsrTFJ8dzWu4J7M9oMjGn0M2FQDyVMuYizHPMyrmGC','E2E User 2',NULL,'user','2025-10-26 14:38:42','2025-10-26 14:38:42','','',NULL,NULL,NULL,0,0,0,0),(124,'e2e_user_3_143842','$2b$10$gy1PkrNg17flNtVnw8caMulaxMqTJNEjZ1MgxPDcpnGXGrQL5Zfw6','E2E User 3',NULL,'user','2025-10-26 14:38:42','2025-10-26 14:38:42','','',NULL,NULL,NULL,0,0,0,0),(125,'e2e_user_1_144011','$2b$10$0tFUtCugCYim5ZMM0ylat.zog.zonnvYRG.KD8jHz9ffjnD0ZByoG','E2E User 1',NULL,'user','2025-10-26 14:40:11','2025-10-26 14:40:11','','',NULL,NULL,NULL,0,0,0,0),(126,'e2e_user_2_144011','$2b$10$DN1U.U6zM4Fbvx02CeAxpOEU5PK98lYTEhWkrii9p0vM20sDGC7hi','E2E User 2',NULL,'user','2025-10-26 14:40:11','2025-10-26 14:40:11','','',NULL,NULL,NULL,0,0,0,0),(127,'e2e_user_3_144011','$2b$10$c6eolExzlymw9QX9jrbRO.6XJ4hSatt.RmyjP45.s0VwWoK0.B.bK','E2E User 3',NULL,'user','2025-10-26 14:40:11','2025-10-26 14:40:11','','',NULL,NULL,NULL,0,0,0,0),(128,'e2e_user_1_145013','$2b$10$ixgSM6UQHAue134OwR4fzeaHWGXM3ZUi29JT/7T2.tfEfpksFpWAu','E2E User 1',NULL,'user','2025-10-26 14:50:13','2025-10-26 14:50:13','','',NULL,NULL,NULL,0,0,0,0),(129,'e2e_user_2_145013','$2b$10$KDrBa7RB7wb9.IkAAlGFDu0JmVh7OuJnLrdThx1suvoONxWwpPr1O','E2E User 2',NULL,'user','2025-10-26 14:50:14','2025-10-26 14:50:14','','',NULL,NULL,NULL,0,0,0,0),(130,'e2e_user_3_145014','$2b$10$J4M9N0vfG4X9DoxmdSQWg.Vk64lD.ftXL6kcEOEBa2uO.6Zdw9ED6','E2E User 3',NULL,'user','2025-10-26 14:50:14','2025-10-26 14:50:14','','',NULL,NULL,NULL,0,0,0,0),(131,'e2e_user_1_145403','$2b$10$bamQSKzvd0/fR0rDmUZmOe60WFxRNltfsrQsS4c5/Sc8yFgtxILfC','E2E User 1',NULL,'user','2025-10-26 14:54:03','2025-10-26 14:54:03','','',NULL,NULL,NULL,0,0,0,0),(132,'e2e_user_2_145403','$2b$10$6bCAX3KBCUGxeq6l0BU.LuBUsIU9wCnANJxSWfHGTzUUMjeftg10m','E2E User 2',NULL,'user','2025-10-26 14:54:03','2025-10-26 14:54:03','','',NULL,NULL,NULL,0,0,0,0),(133,'e2e_user_3_145403','$2b$10$aqFcXTIcZYsjzEfgOJquHOOvGNulCcTHXPBml7KqJ45rysFsTqswq','E2E User 3',NULL,'user','2025-10-26 14:54:03','2025-10-26 14:54:03','','',NULL,NULL,NULL,0,0,0,0),(134,'e2e_user_1_145515','$2b$10$8GbknOQrqJpZpU2u8.cVr.0zfxcENiwDUvaPDH7oD.Q2FJFOjOmHa','E2E User 1',NULL,'user','2025-10-26 14:55:15','2025-10-26 14:55:15','','',NULL,NULL,NULL,0,0,0,0),(135,'e2e_user_2_145515','$2b$10$7hDoKbg6ScfItk33fNXd4e63qV9pCr9xxLEgmATZlOgIZFI6jPcHa','E2E User 2',NULL,'user','2025-10-26 14:55:15','2025-10-26 14:55:15','','',NULL,NULL,NULL,0,0,0,0),(136,'e2e_user_3_145515','$2b$10$JAEIUJuFv3Uw8K13F6weHeRF9Rl5Hn6dC6dcqJILTHnxGQp5BdDd6','E2E User 3',NULL,'user','2025-10-26 14:55:15','2025-10-26 14:55:15','','',NULL,NULL,NULL,0,0,0,0),(137,'e2e_user_1_145657','$2b$10$HUbT5W6rZw3wPLM1FX8fX.5TdgGQcvSzjjHCo.cJpgdRe5GaZOrkK','E2E User 1',NULL,'user','2025-10-26 14:56:57','2025-10-26 14:56:57','','',NULL,NULL,NULL,0,0,0,0),(138,'e2e_user_2_145657','$2b$10$kWxOmAVFPm/cY4cjeYGfyO5cQa4tbhXzUDwtfosV1Dx6wGRzeb.tm','E2E User 2',NULL,'user','2025-10-26 14:56:57','2025-10-26 14:56:57','','',NULL,NULL,NULL,0,0,0,0),(139,'e2e_user_3_145657','$2b$10$QuEw4Ybviyp1fme/d6fiHeL7oEuEqWEO4n9eP0CYWcFORVETR779S','E2E User 3',NULL,'user','2025-10-26 14:56:57','2025-10-26 14:56:57','','',NULL,NULL,NULL,0,0,0,0),(140,'e2e_user_1_145735','$2b$10$yUUC7ul6Qx7NZB32d3U2tOInIXjqzg4VuR7q/HQN9q1262j.Rnyrq','E2E User 1',NULL,'user','2025-10-26 14:57:35','2025-10-26 14:57:35','','',NULL,NULL,NULL,0,0,0,0),(141,'e2e_user_2_145735','$2b$10$sD39w3wgod2BCwHQDZflpuAoYh2V2U89rMVLgKytKzRa6KjfbAS62','E2E User 2',NULL,'user','2025-10-26 14:57:35','2025-10-26 14:57:35','','',NULL,NULL,NULL,0,0,0,0),(142,'e2e_user_3_145736','$2b$10$i0e8pRPCB3jCXpU25aZSXuUL04lSW1v3dovoACalw8T4cqMb1n8pG','E2E User 3',NULL,'user','2025-10-26 14:57:36','2025-10-26 14:57:36','','',NULL,NULL,NULL,0,0,0,0),(143,'e2e_user_1_145934','$2b$10$uY3JvOUVZrYNj4978M5TsuFE3X9he9eWNCmWvwTXWsELYcK1.JtuW','E2E User 1',NULL,'user','2025-10-26 14:59:34','2025-10-26 14:59:34','','',NULL,NULL,NULL,0,0,0,0),(144,'e2e_user_2_145934','$2b$10$kay5AF0KxowLKeFG8yfpdebEWVwF52glebTqVDuQBBt8pywFHV4/.','E2E User 2',NULL,'user','2025-10-26 14:59:34','2025-10-26 14:59:34','','',NULL,NULL,NULL,0,0,0,0),(145,'e2e_user_3_145934','$2b$10$Yml4kT78RK4JH3PK88nTWe1jSJQxrJodszyADH28SV08vgWNdLKE.','E2E User 3',NULL,'user','2025-10-26 14:59:34','2025-10-26 14:59:34','','',NULL,NULL,NULL,0,0,0,0),(146,'e2e_user_1_150051','$2b$10$/cHN7CP1fFdSJB0SNOF30.AebgUeeVOTGOQruO65YYoC2Aqg8PWiS','E2E User 1',NULL,'user','2025-10-26 15:00:51','2025-10-26 15:00:51','','',NULL,NULL,NULL,0,0,0,0),(147,'e2e_user_2_150051','$2b$10$6j/0Svtm9Ty/Jv9Romk4n.0L7VapRgrvT2yBsSeIdz3eRjg8K.S9e','E2E User 2',NULL,'user','2025-10-26 15:00:52','2025-10-26 15:00:52','','',NULL,NULL,NULL,0,0,0,0),(148,'e2e_user_3_150052','$2b$10$rcpO4l4dumVBAznbOk/0H.CkHkZVQhVEY1vTC.mnQFr4MXhDTxBeO','E2E User 3',NULL,'user','2025-10-26 15:00:52','2025-10-26 15:00:52','','',NULL,NULL,NULL,0,0,0,0),(149,'e2e_user_1_150217','$2b$10$a06t9gzymDWYs2pGe25L1uFoMun.PiwgA45PllRTFBn8QQOHcALle','E2E User 1',NULL,'user','2025-10-26 15:02:17','2025-10-26 15:02:17','','',NULL,NULL,NULL,0,0,0,0),(150,'e2e_user_2_150217','$2b$10$3Ev.aAZGh/6cwW8XZ1LbvOCgrDo6bdcWdYlkzPORgsHTVt7dbS0R2','E2E User 2',NULL,'user','2025-10-26 15:02:17','2025-10-26 15:02:17','','',NULL,NULL,NULL,0,0,0,0),(151,'e2e_user_3_150217','$2b$10$f12OWs574.kp64/6dphYdewv6ez0bKClpm35no0cZjZMeeQgzbgNO','E2E User 3',NULL,'user','2025-10-26 15:02:17','2025-10-26 15:02:17','','',NULL,NULL,NULL,0,0,0,0),(152,'e2e_user_1_151906','$2b$10$Qad.MylDvUn9d59bOKb3OusBN7q6oAnRhv7riIVbwSn.sX96wM/ue','E2E User 1',NULL,'user','2025-10-26 15:19:06','2025-10-26 15:19:06','','',NULL,NULL,NULL,0,0,0,0),(153,'e2e_user_2_151906','$2b$10$Sys/S84MASWCIHK038evsuwRE7ziB8u/ZRxvlxJeYm2fX8o.oaot6','E2E User 2',NULL,'user','2025-10-26 15:19:06','2025-10-26 15:19:06','','',NULL,NULL,NULL,0,0,0,0),(154,'e2e_user_3_151906','$2b$10$IGxI/P1PsHTOE8ljAk3V2eUtaIfUaKX4TZotsWhoeuHLlhXipFGry','E2E User 3',NULL,'user','2025-10-26 15:19:06','2025-10-26 15:19:06','','',NULL,NULL,NULL,0,0,0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 20:47:09


COMMIT;
SET FOREIGN_KEY_CHECKS=1;
-- End of combined dump

