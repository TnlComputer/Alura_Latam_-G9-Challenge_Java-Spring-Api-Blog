CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Insertar categorías existentes de tus posts
INSERT INTO categories (name)
SELECT DISTINCT category FROM posts;