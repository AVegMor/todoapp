INSERT INTO tasks (title, completed)
SELECT 'Aprender Spring Boot', FALSE
WHERE NOT EXISTS (SELECT 1 FROM tasks);
