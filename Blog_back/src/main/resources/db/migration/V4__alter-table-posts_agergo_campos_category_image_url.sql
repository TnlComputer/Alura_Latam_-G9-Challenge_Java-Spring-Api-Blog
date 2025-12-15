-- Agregar columna 'category' para los posts
ALTER TABLE posts
ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'general';

-- Asegurarse que 'image_url' exista y sea opcional
ALTER TABLE posts
MODIFY COLUMN image_url VARCHAR(255) DEFAULT NULL;
