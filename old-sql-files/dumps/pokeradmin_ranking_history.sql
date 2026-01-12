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
