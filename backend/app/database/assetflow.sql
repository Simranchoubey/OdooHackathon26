-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: assetflow
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allocations_transfers`
--

DROP TABLE IF EXISTS `allocations_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allocations_transfers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `current_holder_id` int DEFAULT NULL,
  `target_department_id` int DEFAULT NULL,
  `requested_by_id` int NOT NULL,
  `assigned_by_id` int DEFAULT NULL,
  `expected_return_date` date DEFAULT NULL,
  `actual_return_date` date DEFAULT NULL,
  `type` enum('Allocation','Transfer') COLLATE utf8mb4_unicode_ci DEFAULT 'Allocation',
  `status` enum('Pending_Approval','Approved','Rejected','Active','Returned') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `checkin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `current_holder_id` (`current_holder_id`),
  KEY `target_department_id` (`target_department_id`),
  KEY `requested_by_id` (`requested_by_id`),
  KEY `assigned_by_id` (`assigned_by_id`),
  CONSTRAINT `allocations_transfers_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `allocations_transfers_ibfk_2` FOREIGN KEY (`current_holder_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `allocations_transfers_ibfk_3` FOREIGN KEY (`target_department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `allocations_transfers_ibfk_4` FOREIGN KEY (`requested_by_id`) REFERENCES `users` (`id`),
  CONSTRAINT `allocations_transfers_ibfk_5` FOREIGN KEY (`assigned_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allocations_transfers`
--

LOCK TABLES `allocations_transfers` WRITE;
/*!40000 ALTER TABLE `allocations_transfers` DISABLE KEYS */;
INSERT INTO `allocations_transfers` VALUES (1,4,1,NULL,1,3,'2026-07-20',NULL,'Allocation','Active',NULL,'2026-07-12 05:11:41'),(2,7,2,NULL,2,3,'2026-07-08',NULL,'Allocation','Active',NULL,'2026-07-12 05:11:41'),(3,1,2,NULL,2,NULL,'2026-07-25',NULL,'Transfer','Pending_Approval',NULL,'2026-07-12 05:11:41');
/*!40000 ALTER TABLE `allocations_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_tag` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int NOT NULL,
  `serial_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acquisition_date` date NOT NULL,
  `acquisition_cost` decimal(12,2) NOT NULL,
  `condition_state` enum('New','Good','Fair','Poor','Damaged') COLLATE utf8mb4_unicode_ci DEFAULT 'Good',
  `lifecycle_status` enum('Available','Allocated','Reserved','Under Maintenance','Lost','Retired','Disposed') COLLATE utf8mb4_unicode_ci DEFAULT 'Available',
  `location` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_shared_bookable` tinyint(1) DEFAULT '0',
  `dynamic_attributes` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_tag` (`asset_tag`),
  KEY `category_id` (`category_id`),
  KEY `idx_assets_search` (`lifecycle_status`,`is_shared_bookable`,`location`),
  CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'AF-0001','Dell XPS 15 Laptop',1,'SN-DELL-99X21','2026-01-10',1450.00,'New','Available','HQ Floor 2',0,'{\"mac_address\": \"00:1A:2B:3C:4D:5E\", \"warranty_period_months\": 36}','2026-07-12 04:17:23'),(2,'AF-0002','Conference Room B2',3,NULL,'2025-05-20',8000.00,'Good','Available','HQ Basement',1,'{\"material\": \"Glass & Mahogany\"}','2026-07-12 04:17:23'),(3,'AF-0003','Company Shuttle Van',2,'VIN-TOYOTA-88219X','2024-11-01',32000.00,'Good','Available','Main Garage',1,'{\"license_plate\": \"TS-09-EQ-1234\", \"next_service_mileage\": 45000}','2026-07-12 04:17:23'),(4,'AF-0004','HP EliteBook',1,'HP-223344','2025-08-01',1200.00,'Good','Allocated','HQ Floor 3',0,'{}','2026-07-12 05:10:44'),(5,'AF-0005','Epson Projector',1,'EP-9988','2024-09-10',900.00,'Good','Under Maintenance','Meeting Room A',1,'{}','2026-07-12 05:10:44'),(6,'AF-0006','Office Chair',3,NULL,'2025-03-15',150.00,'Good','Available','HQ Floor 1',0,'{}','2026-07-12 05:10:44'),(7,'AF-0007','MacBook Pro',1,'MAC-9988','2026-02-10',2200.00,'New','Allocated','HQ Floor 2',0,'{}','2026-07-12 05:10:44');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_cycles`
--

DROP TABLE IF EXISTS `audit_cycles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_cycles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope_department_id` int DEFAULT NULL,
  `scope_location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Draft','Active','Closed') COLLATE utf8mb4_unicode_ci DEFAULT 'Draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `scope_department_id` (`scope_department_id`),
  CONSTRAINT `audit_cycles_ibfk_1` FOREIGN KEY (`scope_department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_cycles`
--

LOCK TABLES `audit_cycles` WRITE;
/*!40000 ALTER TABLE `audit_cycles` DISABLE KEYS */;
INSERT INTO `audit_cycles` VALUES (1,'Q3 Technical Infrastructure Review',1,'HQ Floor 2','Active','2026-07-12 04:20:28');
/*!40000 ALTER TABLE `audit_cycles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_items`
--

DROP TABLE IF EXISTS `audit_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `audit_cycle_id` int NOT NULL,
  `asset_id` int NOT NULL,
  `auditor_id` int NOT NULL,
  `verification_state` enum('Pending','Verified','Missing','Damaged') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_cycle_id` (`audit_cycle_id`),
  KEY `asset_id` (`asset_id`),
  KEY `auditor_id` (`auditor_id`),
  CONSTRAINT `audit_items_ibfk_1` FOREIGN KEY (`audit_cycle_id`) REFERENCES `audit_cycles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `audit_items_ibfk_2` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `audit_items_ibfk_3` FOREIGN KEY (`auditor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_items`
--

LOCK TABLES `audit_items` WRITE;
/*!40000 ALTER TABLE `audit_items` DISABLE KEYS */;
INSERT INTO `audit_items` VALUES (1,1,1,3,'Pending',NULL,'2026-07-12 04:20:29');
/*!40000 ALTER TABLE `audit_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `custom_fields` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','{\"mac_address\": \"string\", \"warranty_period_months\": \"int\"}','2026-07-12 04:17:22'),(2,'Vehicles','{\"license_plate\": \"string\", \"next_service_mileage\": \"int\"}','2026-07-12 04:17:22'),(3,'Furniture','{\"material\": \"string\"}','2026-07-12 04:17:22');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `head_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `parent_id` (`parent_id`),
  KEY `head_id` (`head_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `departments_ibfk_2` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Engineering',NULL,'Active','2026-07-12 04:13:13',2),(2,'Facilities',NULL,'Active','2026-07-12 04:13:13',NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_requests`
--

DROP TABLE IF EXISTS `maintenance_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `reported_by_id` int NOT NULL,
  `assigned_technician_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` enum('Low','Medium','High','Critical') COLLATE utf8mb4_unicode_ci DEFAULT 'Medium',
  `status` enum('Pending','Approved','Rejected','In_Progress','Resolved') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `resolution_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `reported_by_id` (`reported_by_id`),
  KEY `assigned_technician_id` (`assigned_technician_id`),
  CONSTRAINT `maintenance_requests_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_requests_ibfk_2` FOREIGN KEY (`reported_by_id`) REFERENCES `users` (`id`),
  CONSTRAINT `maintenance_requests_ibfk_3` FOREIGN KEY (`assigned_technician_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_requests`
--

LOCK TABLES `maintenance_requests` WRITE;
/*!40000 ALTER TABLE `maintenance_requests` DISABLE KEYS */;
INSERT INTO `maintenance_requests` VALUES (1,1,2,NULL,'Display panel flickers continuously when hot.','High','Pending',NULL,'2026-07-12 04:20:28');
/*!40000 ALTER TABLE `maintenance_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_bookings`
--

DROP TABLE IF EXISTS `resource_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `user_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('Upcoming','Ongoing','Completed','Cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'Upcoming',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_booking_schedule` (`asset_id`,`start_time`,`end_time`),
  CONSTRAINT `resource_bookings_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resource_bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_bookings`
--

LOCK TABLES `resource_bookings` WRITE;
/*!40000 ALTER TABLE `resource_bookings` DISABLE KEYS */;
INSERT INTO `resource_bookings` VALUES (1,2,2,'2026-07-15 09:00:00','2026-07-15 10:00:00','Upcoming','2026-07-12 04:20:28');
/*!40000 ALTER TABLE `resource_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('Admin','Asset Manager','Department Head','Employee') COLLATE utf8mb4_unicode_ci DEFAULT 'Employee',
  `department_id` int DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Global Admin','admin@assetflow.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Admin',NULL,'Active','2026-07-12 04:13:13'),(2,'Priya Shah','priya@company.com','$2b$12$eImiTxKlG9M9H3NpFx...','Employee',1,'Active','2026-07-12 04:13:13'),(3,'Arjun Varma','arjun@company.com','$2b$12$eImiTxKlG9M9H3NpFx...','Asset Manager',2,'Active','2026-07-12 04:13:13');
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

-- Dump completed on 2026-07-12  5:18:01
