CREATE TABLE Ad
(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title VARCHAR(100) NOT NULL,
	description TEXT,
	owner VARCHAR(100) NOT NULL,
	price INT,
    picture VARCHAR(100),
    location VARCHAR(100),
	createdAt DATE,
    category INTEGER,
    FOREIGN KEY (category) REFERENCES Category(id)
);

DROP TABLE category;

SELECT * FROM Ad;

SELECT * FROM ad;

DELETE FROM ad;

INSERT INTO Ad (title, description, owner, price, location, createdAt, category) 
VALUES 
    ('Vend velo', 'je vend un velo bon état', 'Flavien', 200, 'Lyon', date('now'), 3),
    ('Vend piano', 'je vend un piano bon état', 'Romain', 150, 'Paris', '2023-09-01', 3),
    ('Vend lit', 'je vend un lit bon état', 'Benjamin', 100, 'Lyon', '2023-09-02', 3),
    ('Vend sac', 'je vend un sac bon état', 'Sylvain', 20, 'Bordeau', date('now'), 3),
    ('Vend chemise', 'je vend une chemise bon état', 'Izabelle', 15, 'Lyon', '2023-09-04', 1),
    ('Vend ordinateur', 'je vend un ordinateur bon état', 'Théo', 800, 'Lyon', date('now'), 3),
    ('Vend voiture', 'je vend une voiture bon état', 'Stéphane', 100000, 'Paris', '2023-09-05', 2),
    ('Vend machine à laver', 'je vend une machine à laver bon état', 'Roland', 120, 'Bordeau', '2023-09-18', 3),
    ('Vend livre', 'je vend un livre bon état', 'Eliane', 10, 'Lyon', '2023-09-07', 3),
    ('Vend chaise', 'je vend une chaise bon état', 'Lucas', 15, 'Lyon', date('now'), 3),
    ('Vend casque', 'je vend un casque bon état', 'Geoffrey', 130, 'Paris', '2023-09-01', 3),
    ('Vend pull', 'je vend un pull bon état', 'Jordan', 12, 'Lyon', date('now'), 1),
    ('Vend chaussures', 'je vend des chaussures bon état', 'Aurélien', 25, 'Paris', '2023-09-02', 1),
    ('Vend raquette', 'je vend une raquette bon état', 'Ivette', 30, 'Bordeau', date('now'), 3),
    ('Vend voiture', 'je vend une voiture bon état', 'Claude', 20, 'Bordeau', '2023-09-07', 2),
    ('Vend bague', 'je vend une bague bon état', 'Aymeric', 500, 'Paris', '2023-09-01', 3),
    ('Vend lunettes', 'je vend des lunettes bon état', 'Karim', 140, 'Paris', date('now'), 3),
    ('Vend gourde', 'je vend une gourde bon état', 'jeanne', 14, 'Lyon', '2023-09-08', 3),
    ('Vend pyjama', 'je vend un pyjama bon état', 'Alexandre', 8, 'Bordeau', '2023-09-15', 1),
    ('Vend souris', 'je vend une souris bon état', 'Sabine', 45, 'Bordeau', date('now'), 3);

PRAGMA foreign_keys = ON;
PRAGMA foreign_key_list(Ad);
PRAGMA foreign_keys;