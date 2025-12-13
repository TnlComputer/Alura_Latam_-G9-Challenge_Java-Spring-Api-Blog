-- renombrar tabla
RENAME TABLE post TO posts;

-- agregar columnas nuevas
ALTER TABLE posts
    ADD COLUMN title VARCHAR(255) NOT NULL AFTER id,
    ADD COLUMN excerpt VARCHAR(255) AFTER mensaje,
    ADD COLUMN image_url VARCHAR(255),
    ADD COLUMN created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN updated_at DATETIME(6) NULL,
    ADD COLUMN author_id BIGINT;

-- renombrar columna mensaje → content
ALTER TABLE posts
    CHANGE mensaje content TEXT NOT NULL;

-- renombrar activo → active
ALTER TABLE posts
    CHANGE activo active TINYINT(1) NOT NULL DEFAULT 1;

-- foreign key
ALTER TABLE posts
    ADD CONSTRAINT fk_posts_author
        FOREIGN KEY (author_id)
        REFERENCES users(id);