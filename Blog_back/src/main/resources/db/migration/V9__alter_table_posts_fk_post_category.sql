ALTER TABLE posts
ADD CONSTRAINT fk_posts_category
FOREIGN KEY (category_id)
REFERENCES categories(id);

