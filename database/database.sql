-- Laravel migrations and schema for avgames
-- Import this on your MariaDB server with:
-- mysql avgames < database.sql
--
-- Or from within mysql:
-- source /path/to/database.sql;

SET FOREIGN_KEY_CHECKS=0;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `two_factor_secret` longtext COLLATE utf8mb4_unicode_ci NULL,
  `two_factor_recovery_codes` longtext COLLATE utf8mb4_unicode_ci NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `level` int DEFAULT 1,
  `experience` int DEFAULT 0,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `suspended_until` timestamp NULL DEFAULT NULL,
  `ban_reason` longtext COLLATE utf8mb4_unicode_ci NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  INDEX `users_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cache table
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job batches table
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci NULL,
  `cancelled_at` int NULL DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs table
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL DEFAULT 0,
  `reserved_at` int unsigned NULL DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  INDEX `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrations table
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `description` longtext COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `description` longtext COLLATE utf8mb4_unicode_ci NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NULL,
  `category_id` bigint unsigned NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci NULL,
  `featured` tinyint(1) DEFAULT 0,
  `published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  INDEX `products_category_id_index` (`category_id`),
  INDEX `products_slug_index` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carts table
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint unsigned NOT NULL UNIQUE,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart items table
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `cart_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  INDEX `cart_items_cart_id_index` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint unsigned NOT NULL,
  `total` decimal(10, 2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `orders_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User downloads table
CREATE TABLE IF NOT EXISTS `user_downloads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `downloaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_downloads_user_product_unique` (`user_id`, `product_id`),
  INDEX `user_downloads_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert migration records
INSERT INTO `migrations` (`migration`, `batch`) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2025_01_23_000001_create_categories_table', 1),
('2025_01_23_000002_create_products_table', 1),
('2025_01_23_000003_create_carts_table', 1),
('2025_01_23_000004_create_cart_items_table', 1),
('2025_01_23_000005_create_orders_table', 1),
('2025_01_23_000006_create_order_items_table', 1),
('2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
('2026_01_29_000001_add_admin_and_status_fields_to_users_table', 1),
('2026_01_29_000002_create_user_downloads_table', 1);

-- Insert default admin user
-- Email: admin@avgames.com
-- Password: password (bcrypt hashed)
INSERT INTO `users` (`name`, `email`, `email_verified_at`, `password`, `is_admin`, `level`, `experience`, `status`, `created_at`, `updated_at`) VALUES
('Admin', 'admin@avgames.com', NOW(), '$2y$12$i.6/tnpaQw5jyzUObZx5A.ZkmmT75ixI9nHWk04g.y7tV.vltEnaW', 1, 99, 9999, 'active', NOW(), NOW());

SET FOREIGN_KEY_CHECKS=1;
