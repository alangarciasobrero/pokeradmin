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
