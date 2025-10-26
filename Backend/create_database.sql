-- Create railway database if it doesn't exist
CREATE DATABASE IF NOT EXISTS railway;
USE railway;

-- Create categories table if not exists (backup in case JPA doesn't create it)
CREATE TABLE IF NOT EXISTS category (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Insert sample categories
INSERT IGNORE INTO category (category_name, description) VALUES
('Business Laptops', 'High-performance laptops for business and professional use'),
('Gaming Laptops', 'Powerful laptops designed for gaming and high-performance computing'),
('Ultrabooks', 'Thin, lightweight laptops for portability and everyday use'),
('Workstations', 'Professional-grade laptops for specialized work and content creation'),
('Budget Laptops', 'Affordable laptops for basic computing needs'),
('2-in-1 Convertibles', 'Versatile devices that function as both laptops and tablets');

-- Show created categories
SELECT * FROM category;