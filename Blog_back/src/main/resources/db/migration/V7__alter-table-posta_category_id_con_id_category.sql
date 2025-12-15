UPDATE posts p
JOIN categories c ON p.category = c.name
SET p.category_id = c.id;
