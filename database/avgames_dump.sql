/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: avgames
-- ------------------------------------------------------
-- Server version	11.8.3-MariaDB-0+deb13u1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `cache` VALUES
('laravel-cache-fe9faa5f3f33c825e6cdb82b5e8ee483','i:1;',1771526772),
('laravel-cache-fe9faa5f3f33c825e6cdb82b5e8ee483:timer','i:1771526772;',1771526772);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_id_product_id_unique` (`cart_id`,`product_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `cart_items` VALUES
(2,1,2,3,0.00,'2026-02-19 17:49:45','2026-02-19 17:50:02');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carts_user_id_index` (`user_id`),
  KEY `carts_session_id_index` (`session_id`),
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `carts` VALUES
(1,1,NULL,'2026-02-19 17:38:57','2026-02-19 17:38:57');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `color` varchar(255) NOT NULL DEFAULT '#7f13ec',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `categories` VALUES
(1,'Adventure','adventure','Explore vast worlds and embark on epic quests in these classic adventure titles.','explore','#7f13ec',1,1,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(2,'Shooter','shooter','Fast-paced action and intense combat in these legendary shooter games.','gps_fixed','#ff1744',1,2,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(3,'RPG','rpg','Deep stories, character progression and epic battles await in these role-playing games.','auto_stories','#00e676',1,3,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(4,'Racing','racing','High-speed thrills and intense competition in these classic racing titles.','speed','#ff9100',1,4,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(5,'Puzzle','puzzle','Test your mind with these challenging puzzle and brain-teaser games.','extension','#00b0ff',1,5,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(6,'Platformer','platformer','Jump, run and explore in these timeless platforming classics.','sports_esports','#bc13fe',1,6,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(7,'Fighting','fighting','Prove your skills in one-on-one combat with legendary fighting games.','sports_mma','#ff5722',1,7,'2026-02-19 17:37:38','2026-02-19 17:37:38'),
(8,'Arcade','arcade','Relive the arcade experience with these coin-op classics.','arcade','#ffeb3b',1,8,'2026-02-19 17:37:38','2026-02-19 17:37:38');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2025_01_23_000001_create_categories_table',1),
(5,'2025_01_23_000002_create_products_table',1),
(6,'2025_01_23_000003_create_carts_table',1),
(7,'2025_01_23_000004_create_cart_items_table',1),
(8,'2025_01_23_000005_create_orders_table',1),
(9,'2025_01_23_000006_create_order_items_table',1),
(10,'2025_08_26_100418_add_two_factor_columns_to_users_table',1),
(11,'2026_01_29_000001_add_admin_and_status_fields_to_users_table',1),
(12,'2026_01_29_000002_create_user_downloads_table',1),
(13,'2025_02_09_000000_create_product_files_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billing_address`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_user_id_status_index` (`user_id`,`status`),
  KEY `orders_order_number_index` (`order_number`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `product_files`
--

DROP TABLE IF EXISTS `product_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_files` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `downloads` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_files_product_id_is_active_index` (`product_id`,`is_active`),
  CONSTRAINT `product_files_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_files`
--

LOCK TABLES `product_files` WRITE;
/*!40000 ALTER TABLE `product_files` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `product_files` VALUES
(1,2,'3a289599-4463-4ac0-81c4-292283733ed8_1771526977.zip','ll.zip','products/2/3a289599-4463-4ac0-81c4-292283733ed8_1771526977.zip',15442,'application/zip',1,NULL,NULL,1,'2026-02-19 17:49:37','2026-02-19 17:50:14');
/*!40000 ALTER TABLE `product_files` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `short_description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `stock` int(11) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_new_release` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `platform` varchar(255) DEFAULT NULL,
  `developer` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `release_year` year(4) DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `downloads` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_is_active_index` (`category_id`,`is_active`),
  KEY `products_is_featured_index` (`is_featured`),
  KEY `products_is_new_release_index` (`is_new_release`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `products` VALUES
(1,1,'hola','hola-699758b9d8371','aaaa','aaa',0.00,NULL,'products/xyzgsmfsqfsQt0L7DvY2Bii55YzUkxizDX8W0MtD.jpg',NULL,999,0,0,1,'PC',NULL,NULL,2026,0.0,0,'2026-02-19 17:38:49','2026-02-19 17:38:49'),
(2,1,'SHADOW BLADE: ORIGINS','shadow-blade-origins','Un ninja en busca de venganza atraviesa 12 niveles de acción frenética pixel art. Combates cuerpo a cuerpo fluidos, secretos ocultos y un jefe final que te dejará sin palabras.','Un ninja en busca de venganza atraviesa 12 niveles de acción frenética pixel art. Combates cuerpo a cuerpo fluidos, secr',0.00,NULL,NULL,NULL,999,1,0,1,'NES','PIXEL NINJAS','RETRO STORE PUBLISHING',1990,4.8,98000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(3,3,'DRAGON VALE: LEGACY','dragon-vale-legacy','Un RPG épico con más de 30 horas de historia, 6 personajes jugables y combates por turnos. Explora mazmorras, forja alianzas y derrota al Dragón Oscuro.','Un RPG épico con más de 30 horas de historia, 6 personajes jugables y combates por turnos. Explora mazmorras, forja alia',0.00,NULL,NULL,NULL,999,1,0,1,'SNES','MYTHFORGE STUDIOS','RETRO STORE PUBLISHING',1994,4.9,145000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(4,6,'METRO RUNNER','metro-runner','Salta, desliza y corre a través de la ciudad subterránea. 8 mundos, 64 niveles y potenciadores secretos en este clásico de plataformas a gran velocidad.','Salta, desliza y corre a través de la ciudad subterránea. 8 mundos, 64 niveles y potenciadores secretos en este clásico ',0.00,NULL,NULL,NULL,999,0,1,1,'Genesis','SPEED PIXELS','RETRO STORE PUBLISHING',1992,4.7,112000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(5,2,'GALAXY FORCE III','galaxy-force-iii','Pilota tu cazaestrellas por 10 galaxias distintas. Potencia tus armas, esquiva oleadas de enemigos y enfrenta jefes colosales en este shooter espacial definitivo.','Pilota tu cazaestrellas por 10 galaxias distintas. Potencia tus armas, esquiva oleadas de enemigos y enfrenta jefes colo',0.00,NULL,NULL,NULL,999,0,0,1,'Arcade','STARBLAST INC.','RETRO STORE PUBLISHING',1991,4.6,88000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(6,7,'IRON FIST TOURNAMENT','iron-fist-tournament','Elige entre 8 luchadores únicos con movimientos especiales devastadores. Arcade, Versus y Story Mode incluidos en el mejor juego de peleas de los 90.','Elige entre 8 luchadores únicos con movimientos especiales devastadores. Arcade, Versus y Story Mode incluidos en el mej',0.00,NULL,NULL,NULL,999,0,0,1,'Arcade','COMBAT BYTE','RETRO STORE PUBLISHING',1993,4.5,76000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(7,4,'NITRO CIRCUIT','nitro-circuit','Compite en 16 pistas de todo el mundo con 10 vehículos desbloqueables. Derrapa en cada curva y cruza la meta primero en este clásico del racing retro.','Compite en 16 pistas de todo el mundo con 10 vehículos desbloqueables. Derrapa en cada curva y cruza la meta primero en ',0.00,NULL,NULL,NULL,999,0,0,1,'SNES','TURBO BYTE','RETRO STORE PUBLISHING',1995,4.4,65000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(8,5,'MIND SHIFT','mind-shift','100 niveles de puzzles con mecánicas que doblan la mente. Gravedad invertida, portales y bloques que cambian de forma. El juego de puzzles más original del 8-bit.','100 niveles de puzzles con mecánicas que doblan la mente. Gravedad invertida, portales y bloques que cambian de forma. E',0.00,NULL,NULL,NULL,999,0,1,1,'Game Boy','LOGICA GAMES','RETRO STORE PUBLISHING',1996,4.8,54000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(9,8,'COIN OP CLASSICS VOL.1','coin-op-classics-vol1','Colección de 5 juegos de arcade icónicos en un solo cartucho. Incluye Breakout, Snake, Frogger, Pac-Man clone y Space Invaders. Diversión sin fin garantizada.','Colección de 5 juegos de arcade icónicos en un solo cartucho. Incluye Breakout, Snake, Frogger, Pac-Man clone y Space In',0.00,NULL,NULL,NULL,999,0,0,1,'NES','NOSTALGIA BITS','RETRO STORE PUBLISHING',1989,4.3,42000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(10,1,'LOST ARK: PIXEL EDITION','lost-ark-pixel-edition','Archaeología de acción en vista isométrica. Descifra jeroglíficos, desactiva trampas y escapa de templos antes de que se derrumben. Indiana Jones en 8-bit.','Archaeología de acción en vista isométrica. Descifra jeroglíficos, desactiva trampas y escapa de templos antes de que se',0.00,NULL,NULL,NULL,999,0,0,1,'NES','EXPLORE INC.','RETRO STORE PUBLISHING',1990,4.6,73000,'2026-02-19 17:39:37','2026-02-19 17:39:37'),
(11,3,'CRYSTAL WARS: DAWN','crystal-wars-dawn','El universo se fragmenta y solo tú puedes reunir los 7 cristales del poder. RPG de mundo abierto con sistema de crafting, gremios y 40+ horas de contenido.','El universo se fragmenta y solo tú puedes reunir los 7 cristales del poder. RPG de mundo abierto con sistema de crafting',0.00,NULL,NULL,NULL,999,1,1,1,'SNES','OPAL INTERACTIVE','RETRO STORE PUBLISHING',1997,4.9,132000,'2026-02-19 17:39:37','2026-02-19 17:39:37');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `sessions` VALUES
('6tc4EHcLB38MoJrjomQ0XVpUIj7kqj0CmSPBaQpy',1,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoieTBENXVOYU5KdEVSNHd2cjZnMkhLcDgyNGRlZFVtSWF4Ym1xUDREcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9waW5nP2NiPTE3NzE1MjcxMDA3ODAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjA6e31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=',1771527100),
('FRoEhuKAfPNPY9QxQDyncvCuKgo1Evd2dnWN699j',1,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiN1ZCWnA0aUFGS0dyWmp3TzZFZXdEYnUyTkF6dkpJNFlDZFhqT0FBYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi9zdGF0aXN0aWNzIjtzOjU6InJvdXRlIjtzOjE2OiJhZG1pbi5zdGF0aXN0aWNzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9',1771526983),
('t13go2DIHI7jbT9cBlPzcQMS3BQJCR4I7o0rttU8',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSElCdDhqQlBBSENUZTcwd1k4anl3d1lSZThtMW02Wkh6TEhXVk5MSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1771525871);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `user_downloads`
--

DROP TABLE IF EXISTS `user_downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_downloads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `downloaded_at` timestamp NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_downloads_product_id_foreign` (`product_id`),
  KEY `user_downloads_user_id_product_id_index` (`user_id`,`product_id`),
  KEY `user_downloads_downloaded_at_index` (`downloaded_at`),
  CONSTRAINT `user_downloads_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_downloads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_downloads`
--

LOCK TABLES `user_downloads` WRITE;
/*!40000 ALTER TABLE `user_downloads` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `user_downloads` VALUES
(1,1,2,'2026-02-19 17:50:14','127.0.0.1','2026-02-19 17:50:14','2026-02-19 17:50:14');
/*!40000 ALTER TABLE `user_downloads` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `experience` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','suspended','banned') NOT NULL DEFAULT 'active',
  `suspended_until` timestamp NULL DEFAULT NULL,
  `ban_reason` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
(1,'Admin','admin@avgames.com',1,1,9999,'active',NULL,NULL,NULL,'2026-02-19 17:32:23','$2y$12$DLrkSCbQ3fY9vBnBF/tXKuRd1Ofq2OD/Rr5uAflqrZcJGVT7Bpvme',NULL,NULL,NULL,NULL,'2026-02-19 17:32:23','2026-02-19 17:50:14'),
(2,'Carlos Ramírez','carlos@demo.com',0,42,4200,'active',NULL,NULL,NULL,'2026-02-19 17:42:58','$2y$12$7tBuDa19wmCmPwWMLWmqIu6pe/TYWsDNaOhqdihFQCw8hkkmb69oC',NULL,NULL,NULL,NULL,'2026-02-19 17:37:25','2026-02-19 17:42:59'),
(3,'María López','maria@demo.com',0,35,3500,'active',NULL,NULL,NULL,'2026-02-19 17:42:58','$2y$12$KVwVOTvCiQ7FsB5SWSE/eunkSr8c5Ek0e34D3aGqDmGrrSvnx/5ES',NULL,NULL,NULL,NULL,'2026-02-19 17:37:25','2026-02-19 17:42:59'),
(4,'Álvaro Gómez','alvaro@demo.com',0,28,2800,'active',NULL,NULL,NULL,'2026-02-19 17:42:59','$2y$12$WZ/jCLUIvycmKJVEMF5x1uH/xW3hQm.mDWcbV8HkXVrjFuh8iybtC',NULL,NULL,NULL,NULL,'2026-02-19 17:37:25','2026-02-19 17:42:59'),
(5,'Sara Vidal','sara@demo.com',0,17,1700,'active',NULL,NULL,NULL,'2026-02-19 17:42:59','$2y$12$.iauRw0T2Dt1DYKU5Om9k.r6LEYpFfZqGHmOvQajOEAPyZsDeG59C',NULL,NULL,NULL,NULL,'2026-02-19 17:37:25','2026-02-19 17:42:59'),
(6,'Javier Torres','javier@demo.com',0,55,5500,'active',NULL,NULL,NULL,'2026-02-19 17:42:59','$2y$12$fosu/uL/0QOOG/cyQXtv7etMx3dyukp4RGnlMPxzVA.IcAq.ZauNi',NULL,NULL,NULL,NULL,'2026-02-19 17:37:25','2026-02-19 17:42:59');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-02-19 19:51:44
