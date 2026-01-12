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
INSERT INTO `players` VALUES (1,'Juan','Pérez','juan.perez@example.com','111111111','JuampiPoker','2025-09-27 00:25:14',100,0,0),(2,'María','Gómez','maria.gomez@example.com','222222222','Maru','2025-09-27 00:25:14',200,0,0),(3,'Carlos','López','carlos.lopez@example.com','333333333','Charly','2025-09-27 00:25:14',150,0,0),(4,'Ana','Martínez','ana.martinez@example.com','444444444','Anita','2025-09-27 00:25:14',300,0,0),(5,'Luis','Rodríguez','luis.rodriguez@example.com','555555555','Luigi','2025-09-27 00:25:14',250,0,0),(6,'Sofía','Fernández','sofia.fernandez@example.com','666666666','Sofi','2025-09-27 00:25:14',180,0,0),(7,'Pedro','Ramírez','pedro.ramirez@example.com','777777777','Pete','2025-09-27 00:25:14',120,0,0),(8,'Lucía','Torres','lucia.torres@example.com','888888888','Lulu','2025-09-27 00:25:14',220,0,0),(9,'Diego','Sánchez','diego.sanchez@example.com','999999999','Didi','2025-09-27 00:25:14',170,0,0),(10,'Camila','Morales','camila.morales@example.com','101010101','Cami','2025-09-27 00:25:14',140,0,0),(21,'alan','garcia','alan.garcia@example.com','234234234','elalan','2025-10-05 20:25:38',0,0,0),(74,'','','',NULL,NULL,'2025-10-24 19:23:51',0,0,0);
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
