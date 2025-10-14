CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    role ENUM('CUSTOMER','ADMIN','STAFF') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE category (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE product (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    brand VARCHAR(255),
    quantity INT NOT NULL DEFAULT 0,
    category_id BIGINT,
    model VARCHAR(255),
    processor VARCHAR(255),
    ram VARCHAR(255),
    storage VARCHAR(255),
    graphics VARCHAR(255),
    display VARCHAR(255),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

CREATE TABLE shopping_carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(19,2) NOT NULL,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(255) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    status ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    notes VARCHAR(500),
    shipping_name VARCHAR(255) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(255) NOT NULL,
    shipping_postal_code VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    payment_number VARCHAR(255) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('CASH_ON_DELIVERY','BANK_TRANSFER','CREDIT_CARD','DEBIT_CARD','DIGITAL_WALLET') NOT NULL,
    status ENUM('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED','CANCELLED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);


-- Additional Resources --

-- Insert categories
INSERT INTO category (category_name) VALUES
    ('Laptops'),
    ('Gaming Laptops'),
    ('Business Laptops'),
    ('Student Laptops'),
    ('Accessories');

-- Insert sample laptop products
INSERT INTO product (name, description, price, brand, quantity, model, processor, ram, storage, graphics, display, category_id) VALUES

-- Gaming Laptops
('ASUS ROG Strix G15', 'High-performance gaming laptop with RTX 4060', 125000.00, 'ASUS', 15, 'G513IE-HN004T', 'AMD Ryzen 7 4800H', '16GB DDR4', '512GB SSD', 'NVIDIA RTX 4060 8GB', '15.6" FHD 144Hz', 2),

('MSI Gaming GF63', 'Budget gaming laptop with GTX 1650', 85000.00, 'MSI', 12, 'GF63 Thin 10SCXR-654', 'Intel Core i5-10300H', '8GB DDR4', '256GB SSD', 'NVIDIA GTX 1650 4GB', '15.6" FHD', 2),

('HP Pavilion Gaming', 'Entry-level gaming laptop', 75000.00, 'HP', 20, '15-dk1028TX', 'Intel Core i5-10300H', '8GB DDR4', '512GB SSD', 'NVIDIA GTX 1650 4GB', '15.6" FHD', 2),

-- Business Laptops
('Dell Latitude 5520', 'Professional business laptop', 95000.00, 'Dell', 18, 'Latitude 5520', 'Intel Core i5-1135G7', '8GB DDR4', '256GB SSD', 'Intel Iris Xe', '15.6" FHD', 3),

('Lenovo ThinkPad E15', 'Reliable business laptop', 88000.00, 'Lenovo', 25, '20TD003LIH', 'Intel Core i5-1135G7', '8GB DDR4', '512GB SSD', 'Intel Iris Xe', '15.6" FHD', 3),

('HP EliteBook 850', 'Premium business laptop', 110000.00, 'HP', 10, 'G8 850', 'Intel Core i7-1165G7', '16GB DDR4', '512GB SSD', 'Intel Iris Xe', '15.6" FHD', 3),

-- Student Laptops
('Acer Aspire 5', 'Budget-friendly student laptop', 65000.00, 'Acer', 30, 'A515-56-50Q9', 'Intel Core i5-1135G7', '8GB DDR4', '256GB SSD', 'Intel Iris Xe', '15.6" FHD', 4),

('ASUS VivoBook 15', 'Lightweight student laptop', 58000.00, 'ASUS', 22, 'X515EA-BQ1116T', 'Intel Core i3-1115G4', '8GB DDR4', '256GB SSD', 'Intel UHD Graphics', '15.6" FHD', 4),

('Dell Inspiron 15 3000', 'Affordable student laptop', 55000.00, 'Dell', 28, '3511', 'Intel Core i3-1115G4', '4GB DDR4', '256GB SSD', 'Intel UHD Graphics', '15.6" FHD', 4),

-- Premium Laptops
('MacBook Air M2', 'Apple laptop with M2 chip', 180000.00, 'Apple', 8, 'MacBook Air M2', 'Apple M2', '8GB Unified Memory', '256GB SSD', '8-core GPU', '13.6" Liquid Retina', 1),

('MacBook Pro 14', 'Professional Apple laptop', 250000.00, 'Apple', 5, 'MacBook Pro 14"', 'Apple M2 Pro', '16GB Unified Memory', '512GB SSD', '19-core GPU', '14.2" Liquid Retina XDR', 1),

('Dell XPS 13', 'Premium ultrabook', 140000.00, 'Dell', 12, 'XPS 13 9315', 'Intel Core i7-1250U', '16GB LPDDR5', '512GB SSD', 'Intel Iris Xe', '13.4" FHD+', 1),

-- Accessories
('Wireless Mouse', 'Logitech wireless mouse', 2500.00, 'Logitech', 50, 'M100', 'Optical', 'N/A', 'N/A', 'N/A', 'N/A', 5),

('Laptop Bag', 'Professional laptop backpack', 3500.00, 'Targus', 25, 'TBB501', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 5),

('USB-C Hub', 'Multi-port USB-C adapter', 4500.00, 'Anker', 20, 'A8396', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 5);
