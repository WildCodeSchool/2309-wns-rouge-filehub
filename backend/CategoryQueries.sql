CREATE TABLE Category 
(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(100) NOT NULL,
);

DROP TABLE Category;

SELECT * FROM Category;

INSERT INTO Category (name)
VALUES
    ('Vêtement'),
    ('Voiture'),
    ('Autre');