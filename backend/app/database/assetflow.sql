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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allocations_transfers`
--

LOCK TABLES `allocations_transfers` WRITE;
/*!40000 ALTER TABLE `allocations_transfers` DISABLE KEYS */;
INSERT INTO `allocations_transfers` VALUES (1,4,4,NULL,4,1,'2026-07-05',NULL,'Allocation','Active',NULL,'2026-04-22 10:00:00'),(2,7,2,NULL,2,1,'2026-08-18',NULL,'Allocation','Active',NULL,'2026-02-11 11:00:00'),(3,1,4,8,4,NULL,'2026-09-25',NULL,'Transfer','Pending_Approval','Moving asset from tech pool down to option desk user.','2026-07-12 05:11:41'),(4,10,9,NULL,9,2,'2026-06-01','2026-06-02','Allocation','Returned','Returned in pristine state after evaluation assignment.','2026-01-15 09:30:00'),(5,6,8,NULL,8,3,'2026-07-10',NULL,'Allocation','Active','Standard ergonomic provisioning.','2025-03-20 14:00:00'),(6,12,5,NULL,5,1,'2026-07-01',NULL,'Allocation','Active','Critical desk visibility extension.','2026-02-16 09:00:00'),(7,11,9,NULL,9,2,'2026-08-01',NULL,'Allocation','Active','Hard Lab provisioning.','2025-05-22 10:00:00'),(8,10,7,9,7,NULL,'2026-10-01',NULL,'Transfer','Pending_Approval','Securing research hardware for InfoSec review.','2026-07-12 12:00:00'),(9,6,10,3,10,NULL,'2026-12-31',NULL,'Transfer','Pending_Approval','Relocating to standard facilities deployment.','2026-07-12 13:15:00'),(10,11,4,5,4,NULL,'2026-09-01',NULL,'Transfer','Pending_Approval','Testing data pipelines via physical terminal connection.','2026-07-12 14:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'AF-0001','Dell XPS 15 Laptop',1,'SN-DELL-99X21','2026-01-10',1450.00,'New','Available','HQ Floor 2 - Tech Hub',0,'{\"mac_address\": \"00:1A:2B:3C:4D:5E\", \"warranty_period_months\": 36}','2026-07-12 09:06:30'),(2,'AF-0002','Conference Room B2',4,NULL,'2025-05-20',8000.00,'Good','Available','HQ Basement Suite',1,'{\"av_setup_type\": \"Premium 4K Dual Matrix\", \"seating_capacity\": 14}','2026-07-12 09:06:30'),(3,'AF-0003','Company Shuttle Van',2,'VIN-TOYOTA-88219X','2024-11-01',32000.00,'Good','Available','Main Exterior Garage',1,'{\"license_plate\": \"TS-09-EQ-1234\", \"next_service_mileage\": 45000}','2026-07-12 09:06:30'),(4,'AF-0004','HP EliteBook 840',1,'HP-223344','2025-08-01',1200.00,'Good','Allocated','HQ Floor 1 - Desk A4',0,'{\"mac_address\": \"00:1A:2B:8C:9D:4F\", \"warranty_period_months\": 24}','2026-07-12 09:06:30'),(5,'AF-0005','Epson 4K Projector',1,'EP-9988','2024-09-10',900.00,'Fair','Under Maintenance','Meeting Room A Central Cabinet',1,'{}','2026-07-12 09:06:30'),(6,'AF-0006','Steelcase Ergonomic Chair',3,'SC-CH-8812','2025-03-15',850.00,'Good','Available','HQ Floor 1 - Open Bay',0,'{\"material\": \"Mesh & Polymer\", \"ergonomic_rating\": \"A+\"}','2026-07-12 09:06:30'),(7,'AF-0007','MacBook Pro M3 Max',1,'MAC-9988-M3','2026-02-10',3400.00,'New','Allocated','HQ Floor 2 - Analytics Desk',0,'{\"chipset\": \"M3 Max Single Block\", \"mac_address\": \"A1:B2:C3:D4:E5:F6\"}','2026-07-12 09:06:30'),(8,'AF-0008','Enterprise Firewall Appliance',1,'FW-CISCO-887','2026-05-11',12000.00,'Good','Under Maintenance','Server Room 1 Rack B',0,'{}','2026-07-12 09:06:30'),(9,'AF-0009','Heavy Duty Table Tennis Board',3,'TT-SPORTS-09','2025-07-11',1200.00,'Good','Available','Breakroom Floor 3',1,'{\"material\": \"Compressed Composite Board\"}','2026-07-12 09:06:30'),(10,'AF-0010','Lenovo ThinkPad P1',1,'SN-LEN-88391','2026-01-10',2100.00,'Good','Available','Desk E12 - Research Bay',0,'{}','2026-07-12 09:06:30'),(11,'AF-0011','Lab Oscilloscope Rig',5,'OSC-RIG-441','2025-05-20',4500.00,'Good','Available','R&D Hard Electronics Lab',0,'{\"voltage_rating\": 240, \"calibration_date\": \"2026-02-01\"}','2026-07-12 09:06:30'),(12,'AF-0012','UltraWide 49 Inch Monitor',1,'MON-LG-49X','2026-02-15',1100.00,'New','Available','Desk E15 - Trading Desk',0,'{}','2026-07-12 09:06:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_cycles`
--

LOCK TABLES `audit_cycles` WRITE;
/*!40000 ALTER TABLE `audit_cycles` DISABLE KEYS */;
INSERT INTO `audit_cycles` VALUES (1,'Q3 Core Audit: Engineering Hub',2,'HQ Floor 2','Closed','2026-07-01 09:00:00'),(2,'Midyear Operational Fleet Audit',3,'Main Exterior Garage','Active','2026-07-10 10:00:00'),(3,'Emergency Infrastructure Reconciliation',NULL,'HQ Basement Suite','Draft','2026-07-12 13:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_items`
--

LOCK TABLES `audit_items` WRITE;
/*!40000 ALTER TABLE `audit_items` DISABLE KEYS */;
INSERT INTO `audit_items` VALUES (1,1,1,2,'Verified','Located at target production work space.','2026-07-02 14:25:00'),(2,1,4,2,'Verified','Asset context verified intact.','2026-07-02 15:00:00'),(3,2,3,3,'Verified','Fleet logistics verify validation match clear.','2026-07-11 08:11:27'),(4,2,11,3,'Damaged','Screen has dead pixel cluster line tracing across display output.','2026-07-12 04:27:00'),(5,2,12,3,'Missing','Nowhere to be found at target desk coordinates. Local infrastructure checklist scan failed.','2026-07-12 14:10:00'),(6,2,6,3,'Damaged','Armrest connection hardware snapped off structural mount points.','2026-07-12 14:15:00'),(7,2,10,3,'Pending','Awaiting field engineer scanner upload.','2026-07-12 14:20:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics & Compute','{\"chipset\": \"string\", \"mac_address\": \"string\", \"warranty_period_months\": \"int\"}','2026-07-12 09:06:30'),(2,'Vehicles & Logistics Fleet','{\"fuel_type\": \"string\", \"license_plate\": \"string\", \"next_service_mileage\": \"int\"}','2026-07-12 09:06:30'),(3,'Office Infrastructure & Furniture','{\"material\": \"string\", \"ergonomic_rating\": \"string\"}','2026-07-12 09:06:30'),(4,'Shared Office Spaces','{\"av_setup_type\": \"string\", \"seating_capacity\": \"int\"}','2026-07-12 09:06:30'),(5,'Lab Equipment & Testing Kits','{\"voltage_rating\": \"int\", \"calibration_date\": \"string\"}','2026-07-12 09:06:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Executive Board',NULL,'Active','2026-01-01 09:00:00',NULL),(2,'Engineering',1,'Active','2026-01-02 10:00:00',2),(3,'Facilities & Operations',1,'Active','2026-01-02 10:30:00',3),(4,'Sports & Fitness Management',3,'Active','2026-01-05 11:00:00',6),(5,'Data Analytics Center',2,'Active','2026-02-10 08:00:00',NULL),(6,'Research & Development',2,'Active','2026-02-12 08:30:00',NULL),(7,'Human Resources',1,'Active','2026-01-15 09:00:00',NULL),(8,'Finance & Options Trading',1,'Active','2026-03-01 09:00:00',5),(9,'Information Security',2,'Active','2026-03-15 14:00:00',NULL),(10,'Logistics & Fleet',3,'Active','2026-04-01 11:00:00',NULL),(11,'Marketing & PR',1,'Inactive','2026-01-02 10:00:00',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_requests`
--

LOCK TABLES `maintenance_requests` WRITE;
/*!40000 ALTER TABLE `maintenance_requests` DISABLE KEYS */;
INSERT INTO `maintenance_requests` VALUES (1,1,4,NULL,'Display panel flickers continuously when operating near maximum temperature thresholds.','High','Pending',NULL,'2026-07-12 04:20:00'),(2,4,4,NULL,'Battery expanding noticeably under aluminum structural casing framework.','Critical','Pending',NULL,'2026-07-12 11:30:00'),(3,5,2,NULL,'Laser brightness degraded by 50 percent. Structural lens cluster replacement required.','Medium','Approved',NULL,'2026-07-12 04:50:00'),(4,8,1,3,'Internal fan assembly failing completely, producing distinct grinding audio anomalies.','Critical','Approved',NULL,'2026-07-12 05:00:00'),(5,7,2,2,'Kernel panic on power adapter attachment.','High','Approved',NULL,'2026-07-12 06:15:00'),(6,3,8,3,'Transmission fluid showing premature thermal exhaustion signatures during shuttle run loops.','High','In_Progress',NULL,'2026-07-11 09:00:00'),(7,10,9,2,'OS corruption after unexpected storage driver dismount event.','Medium','In_Progress',NULL,'2026-07-12 10:00:00'),(8,6,3,3,'Hydraulic lift cylinder sinking down completely on human loading forces.','Low','Resolved','Piston dynamic seals lubricated and replacement mechanical retention locks secured.','2026-07-12 03:00:00'),(9,1,2,2,'Keyboard key caps broken.','Low','Resolved','Key cap matrix component swapped cleanly from spare storage stock.','2026-07-10 11:00:00'),(10,12,5,3,'Display stand unstable configuration.','Low','Resolved','Tightened structural base fasteners.','2026-07-09 14:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_bookings`
--

LOCK TABLES `resource_bookings` WRITE;
/*!40000 ALTER TABLE `resource_bookings` DISABLE KEYS */;
INSERT INTO `resource_bookings` VALUES (1,2,4,'2026-07-12 16:00:00','2026-07-12 18:00:00','Upcoming','2026-07-12 09:00:00'),(2,2,5,'2026-07-12 19:00:00','2026-07-12 21:00:00','Upcoming','2026-07-12 09:30:00'),(3,3,8,'2026-07-11 08:00:00','2026-07-11 12:00:00','Completed','2026-07-10 14:00:00'),(4,2,7,'2026-07-10 10:00:00','2026-07-10 11:30:00','Completed','2026-07-09 11:00:00'),(5,3,10,'2026-07-09 13:00:00','2026-07-09 17:00:00','Completed','2026-07-08 15:00:00'),(6,9,6,'2026-07-12 12:00:00','2026-07-12 13:00:00','Completed','2026-07-12 11:00:00'),(7,2,9,'2026-07-12 14:00:00','2026-07-12 15:30:00','Ongoing','2026-07-12 08:00:00'),(8,2,4,'2026-07-12 09:00:00','2026-07-12 10:00:00','Cancelled','2026-07-11 17:00:00'),(9,3,4,'2026-07-12 10:00:00','2026-07-12 11:00:00','Cancelled','2026-07-12 07:00:00'),(10,9,8,'2026-07-13 15:00:00','2026-07-13 16:00:00','Upcoming','2026-07-12 14:20:00');
/*!40000 ALTER TABLE `resource_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_logs`
--

DROP TABLE IF EXISTS `system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Alert','Approval','Booking','General') COLLATE utf8mb4_unicode_ci DEFAULT 'General',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_logs`
--

LOCK TABLES `system_logs` WRITE;
/*!40000 ALTER TABLE `system_logs` DISABLE KEYS */;
INSERT INTO `system_logs` VALUES (1,'Laptop AF-0004 assigned directly to Rahul Khichar','General','2026-07-12 14:12:00'),(2,'Maintenance request tracking ticket AF-0004 approved for processing','Approval','2026-07-12 13:58:00'),(3,'Booking confirmed: Conference Room B2 : 04:00 PM to 06:00 PM','Booking','2026-07-12 13:30:00'),(4,'Transfer request initiated: Dell XPS 15 Laptop (AF-0001) to Devika Sen','Approval','2026-07-12 05:11:41'),(5,'Overdue return alert: Asset HP EliteBook 840 (AF-0004) past due date by 7 days','Alert','2026-07-12 00:01:00'),(6,'Audit item discrepancy flagged: UltraWide 49 Inch Monitor (AF-0012) missing from HQ Floor 2','Alert','2026-07-12 14:10:00'),(7,'Audit item discrepancy flagged: Lab Oscilloscope Rig (AF-0011) recorded as damaged','Alert','2026-07-12 04:27:00'),(8,'Maintenance request tracking ticket AF-0008 approved for processing','Approval','2026-07-12 05:00:00'),(9,'Booking confirmed: Company Shuttle Van : 07:00 PM to 09:00 PM','Booking','2026-07-12 09:30:00'),(10,'Asset registration execution complete: UltraWide 49 Inch Monitor (AF-0012) logged under infrastructure','General','2026-02-15 08:00:00');
/*!40000 ALTER TABLE `system_logs` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Global Admin','admin@assetflow.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Admin',NULL,'Active','2026-01-01 09:05:00'),(2,'Priya Shah','priya@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Asset Manager',2,'Active','2026-01-02 10:15:00'),(3,'Arjun Varma','arjun@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Asset Manager',3,'Active','2026-01-02 10:45:00'),(4,'Rahul Khichar','rahul.k@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Employee',5,'Active','2026-04-20 09:00:00'),(5,'Devika Sen','devika@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Department Head',8,'Active','2026-03-02 09:15:00'),(6,'Rohan Sharma','rohan@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Department Head',4,'Active','2026-01-06 11:30:00'),(7,'Kabir Mehta','kabir@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Employee',9,'Active','2026-03-16 14:15:00'),(8,'Vikram Malhotra','vikram@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Employee',10,'Active','2026-04-02 11:15:00'),(9,'Ananya Rao','ananya@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Employee',6,'Active','2026-02-15 10:00:00'),(10,'Marcus Aurelius','marcus@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Employee',3,'Active','2026-01-10 09:00:00'),(11,'Inactive Tester','test.user@company.com','$2b$12$eImiTxKlG9M9H3NpFx...dummyhash','Employee',7,'Inactive','2026-05-01 12:00:00');
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

-- Dump completed on 2026-07-12  9:08:52
