-- Fix cart_items table to allow NULL values for product and service fields
-- This is needed to support both products and services in the same table

USE technova_db;

-- Make product fields nullable (for service items)
ALTER TABLE cart_items MODIFY COLUMN product_id BIGINT NULL;
ALTER TABLE cart_items MODIFY COLUMN product_name VARCHAR(255) NULL;
ALTER TABLE cart_items MODIFY COLUMN product_sku VARCHAR(255) NULL;
ALTER TABLE cart_items MODIFY COLUMN quantity INT NULL;

-- Make service fields nullable (for product items)
ALTER TABLE cart_items MODIFY COLUMN service_id BIGINT NULL;
ALTER TABLE cart_items MODIFY COLUMN service_name VARCHAR(255) NULL;
ALTER TABLE cart_items MODIFY COLUMN rental_period INT NULL;
ALTER TABLE cart_items MODIFY COLUMN rental_period_type VARCHAR(20) NULL;

-- Verify the changes
DESCRIBE cart_items;