-- Connexion à la base de données jardins_cocagne
\c jardins_cocagne;

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS Facture_Abonnement;
DROP TABLE IF EXISTS Commande_Tournee;
DROP TABLE IF EXISTS Commande;
DROP TABLE IF EXISTS Adhesion;
DROP TABLE IF EXISTS Facturation;
DROP TABLE IF EXISTS Abonnement;
DROP TABLE IF EXISTS Tournee_PointDeDepot;
DROP TABLE IF EXISTS Tournee;
DROP TABLE IF EXISTS PointDeDepot;
DROP TABLE IF EXISTS Panier_Frequence;
DROP TABLE IF EXISTS Frequence;
DROP TABLE IF EXISTS Panier;
DROP TABLE IF EXISTS Adherent;
DROP TABLE IF EXISTS Structure;
DROP TABLE IF EXISTS AppUser;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Calendrier;
DROP TABLE IF EXISTS Tournee_Historique;

-- Table pour les rôles
CREATE TABLE Role (
    ID_Role SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Table pour les utilisateurs
CREATE TABLE AppUser (
    ID_User SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    ID_Role INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Role) REFERENCES Role(ID_Role) ON DELETE CASCADE
);

-- Insertion des rôles
INSERT INTO Role (nom) 
VALUES ('admin'), ('user')
ON CONFLICT (nom) DO NOTHING;

-- Table pour la structure
CREATE TABLE Structure (
    ID_Structure SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    coordonnees_bancaires VARCHAR(255),
    SIRET VARCHAR(14) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les adhérents
CREATE TABLE Adherent (
    ID_Adherent SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    date_naissance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_adherent_email ON Adherent (email);

-- Table pour les paniers (produits)
CREATE TABLE Panier (
    ID_Panier SERIAL PRIMARY KEY,
    ID_Structure INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    unite VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Structure) REFERENCES Structure(ID_Structure) ON DELETE CASCADE
);

-- Table pour les fréquences
CREATE TABLE Frequence (
    ID_Frequence SERIAL PRIMARY KEY,
    type_frequence VARCHAR(50) NOT NULL,
    interval_repetition INT
);

-- Table pour l'association entre paniers et fréquences
CREATE TABLE Panier_Frequence (
    ID_Panier INT,
    ID_Frequence INT,
    PRIMARY KEY (ID_Panier, ID_Frequence),
    FOREIGN KEY (ID_Panier) REFERENCES Panier(ID_Panier) ON DELETE CASCADE,
    FOREIGN KEY (ID_Frequence) REFERENCES Frequence(ID_Frequence) ON DELETE CASCADE
);
CREATE INDEX idx_panier_frequence ON Panier_Frequence (ID_Panier, ID_Frequence);

-- Table pour les points de dépôt
CREATE TABLE PointDeDepot (
    ID_PointDeDepot SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    ID_Structure INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Structure) REFERENCES Structure(ID_Structure) ON DELETE CASCADE
);

-- Table pour les tournées
CREATE TABLE Tournee (
    ID_Tournee SERIAL PRIMARY KEY,
    jour_preparation DATE NOT NULL,
    jour_livraison DATE NOT NULL,
    statut_tournee VARCHAR(20) DEFAULT 'préparée',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (jour_preparation < jour_livraison)
);
CREATE INDEX idx_tournee_statut ON Tournee (statut_tournee);

-- Table pour les statuts des étapes
CREATE TABLE Statut_Etape (
    ID_Statut SERIAL PRIMARY KEY,
    statut_nom VARCHAR(50) NOT NULL UNIQUE
);

-- Insertion des statuts des étapes
INSERT INTO Statut_Etape (statut_nom)
VALUES ('préparée'), ('en cours'), ('livrée'), ('annulée');

-- Table pour l'association entre tournées et points de dépôt
CREATE TABLE Tournee_PointDeDepot (
    ID_Tournee INT,
    ID_PointDeDepot INT,
    numero_ordre INT NOT NULL,
    ID_Statut INT NOT NULL,
    PRIMARY KEY (ID_Tournee, ID_PointDeDepot),
    FOREIGN KEY (ID_Tournee) REFERENCES Tournee(ID_Tournee) ON DELETE CASCADE,
    FOREIGN KEY (ID_PointDeDepot) REFERENCES PointDeDepot(ID_PointDeDepot) ON DELETE CASCADE,
    FOREIGN KEY (ID_Statut) REFERENCES Statut_Etape(ID_Statut) ON DELETE CASCADE
);
CREATE INDEX idx_tournee_point ON Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot);

-- Table pour les abonnements
CREATE TABLE Abonnement (
    ID_Abonnement SERIAL PRIMARY KEY,
    ID_Adherent INT NOT NULL,
    ID_Panier INT NOT NULL,
    ID_Frequence INT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE DEFAULT NULL,
    statut VARCHAR(20) DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent) ON DELETE CASCADE,
    FOREIGN KEY (ID_Panier) REFERENCES Panier(ID_Panier) ON DELETE CASCADE,
    FOREIGN KEY (ID_Frequence) REFERENCES Frequence(ID_Frequence) ON DELETE CASCADE,
    CHECK (date_debut < date_fin)
);
CREATE INDEX idx_abonnement_statut ON Abonnement (statut);

-- Table pour les commandes
CREATE TABLE Commande (
    ID_Commande SERIAL PRIMARY KEY,
    ID_Abonnement INT NOT NULL,
    ID_PointDeDepot INT NOT NULL,
    quantite INT NOT NULL CHECK (quantite > 0),
    date_commande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'en attente' CHECK (statut IN ('en attente', 'en cours', 'livrée', 'annulée')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Abonnement) REFERENCES Abonnement(ID_Abonnement) ON DELETE CASCADE,
    FOREIGN KEY (ID_PointDeDepot) REFERENCES PointDeDepot(ID_PointDeDepot) ON DELETE CASCADE
);
CREATE INDEX idx_commande_statut ON Commande (statut);

-- Table pour l'association entre commandes et tournées
CREATE TABLE Commande_Tournee (
    ID_Commande INT,
    ID_Tournee INT,
    statut_livraison VARCHAR(20) DEFAULT 'non livrée',
    PRIMARY KEY (ID_Commande, ID_Tournee),
    FOREIGN KEY (ID_Commande) REFERENCES Commande(ID_Commande) ON DELETE CASCADE,
    FOREIGN KEY (ID_Tournee) REFERENCES Tournee(ID_Tournee) ON DELETE CASCADE
);
CREATE INDEX idx_commande_tournee ON Commande_Tournee (ID_Commande, ID_Tournee);

-- Table pour la facturation
CREATE TABLE Facturation (
    ID_Facture SERIAL PRIMARY KEY,
    ID_Adherent INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL CHECK (montant >= 0),
    date_facture TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent) ON DELETE CASCADE
);

-- Table pour le lien entre factures et abonnements
CREATE TABLE Facture_Abonnement (
    ID_Facture INT,
    ID_Abonnement INT,
    PRIMARY KEY (ID_Facture, ID_Abonnement),
    FOREIGN KEY (ID_Facture) REFERENCES Facturation(ID_Facture) ON DELETE CASCADE,
    FOREIGN KEY (ID_Abonnement) REFERENCES Abonnement(ID_Abonnement) ON DELETE CASCADE
);

-- Table pour les adhésions
CREATE TABLE Adhesion (
    ID_Adhesion SERIAL PRIMARY KEY,
    ID_Adherent INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE DEFAULT NULL,
    statut VARCHAR(20) DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ID_Adherent, type, statut),
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent) ON DELETE CASCADE,
    CHECK (date_debut < date_fin)
);

-- Table pour les semaines d'ouverture et les jours fériés
CREATE TABLE Calendrier (
    ID_Calendrier SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ouverture', 'ferie')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour l'historique des tournées
CREATE TABLE Tournee_Historique (
    ID_Historique SERIAL PRIMARY KEY,
    ID_Tournee INT NOT NULL,
    jour_preparation DATE NOT NULL,
    jour_livraison DATE NOT NULL,
    statut_tournee VARCHAR(20) DEFAULT 'préparée',
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Tournee) REFERENCES Tournee(ID_Tournee) ON DELETE CASCADE
);



-- DONNEES D'INSERTION

-- Insertion des rôles
INSERT INTO Role (nom) 
VALUES ('admin'), ('user')
ON CONFLICT (nom) DO NOTHING;

-- Insertion des utilisateurs
INSERT INTO AppUser (nom, prenom, email, mot_de_passe, ID_Role)
VALUES 
    ('Dupont', 'Jean', 'jean.dupont@example.com', '$2b$10$goW7/1/idp1Q1Bo.EXS/A.gPQq7DyDzm30dXA.vWT1PXPc7nHpgWO', 1), 
    ('Martin', 'Marie', 'marie.martin@example.com', '$2b$10$goW7/1/idp1Q1Bo.EXS/A.gPQq7DyDzm30dXA.vWT1PXPc7nHpgWO', 2);

-- Insertion de la structure
INSERT INTO Structure (nom, adresse, coordonnees_bancaires, SIRET)
VALUES 
    ('Cocagne Jardin', '1 Rue de la Terre, Paris', '1234567890', '12345678901234');

-- Insertion d'adhérents
INSERT INTO Adherent (nom, prenom, email, telephone, adresse, date_naissance)
VALUES 
    ('Durand', 'Pierre', 'pierre.durand@example.com', '0102030405', '5 Rue de l''Eau, Paris', '1990-05-15'),
    ('Lemoine', 'Sophie', 'sophie.lemoine@example.com', '0102030406', '10 Rue de l''Air, Paris', '1985-08-20');

-- Insertion de paniers
INSERT INTO Panier (ID_Structure, nom, description, unite, image)
VALUES 
    (1, 'Panier de légumes', 'Panier contenant divers légumes frais', 'kg', 'image_legumes.jpg'),
    (1, 'Panier de fruits', 'Panier contenant divers fruits frais', 'kg', 'image_fruits.jpg');

-- Insertion de fréquences
INSERT INTO Frequence (type_frequence, interval_repetition)
VALUES 
    ('hebdomadaire', 7),
    ('mensuel', 30);

-- Insertion dans la table de liaison Panier_Frequence
INSERT INTO Panier_Frequence (ID_Panier, ID_Frequence)
VALUES 
    (1, 1),
    (2, 2);

-- Insertion de points de dépôt
INSERT INTO PointDeDepot (ID_PointDeDepot, nom, adresse, latitude, longitude, ID_Structure)
VALUES 
    (1, 'Eglise Saint Antoine', '12, rue Armand Colle, Epinal', 48.18333, 6.45, 1),
    (2, 'Ligue de l''enseignement', '15, rue Général de Reffye, Epinal', 48.1813164, 6.4334178, 1),
    (3, 'Centre Léo LaGrange', '6, Avenue Salvador Allende, Epinal', 48.1935933, 6.460096, 1),
    (4, 'APF', 'Local extérieur – ESAT – Rue de la papeterie, Dinozé', 48.1435, 6.46923, 1),
    (5, 'Ecodenn''ergie', '36, bis rue de la Plaine, Golbey', 48.19764, 6.43966, 1),
    (6, 'Botanic', 'Avenue des Terres St Jean, Golbey', 48.19764, 6.43966, 1),
    (7, 'Pharmacie Robert', '24, rue du Gal de Gaulle, St Nabord', 48.05171, 6.58248, 1),
    (8, 'Association AGACI', '26, Rue de la Joncherie, Remiremont', 48.0187639, 6.5939034, 1),
    (9, 'Office du tourisme', '6 Place C. Poncelet, Remiremont', 48.01754, 6.5882, 1),
    (10, 'Mr et Mme Boulassel', '1, rue Moncey, Docelles', 48.1467753, 6.6167044, 1),
    (11, 'Jardins de Cocagne', 'Prairie Claudel, Thaon', 48.2528634, 6.4268873, 1),
    (12, 'Madame Pierot', '15, Rue Ste Barbe, Charmes', 48.3776798, 6.2953624, 1),
    (13, '3ème Rive Café Associatif', '15 rue du Maréchal Lyautey, Epinal', 48.18333, 6.45, 1),
    (14, 'Point Vert Mafra', 'Zac Barbazan, Bruyères', 49.15756, 2.32577, 1),
    (15, 'Pro et Cie', '45, Boulevard d''Alsace, Gérardmer', 48.073803, 6.8767334, 1),
    (16, 'M. Lecomte François', '24, route du Noirpré, Le Tholy', 48.0812336, 6.7452634, 1);

-- Insertion de tournées
INSERT INTO Tournee (ID_Tournee, jour_preparation, jour_livraison, statut_tournee)
VALUES 
    (1, '2025-01-15', '2025-01-16', 'préparée'),
    (2, '2025-01-17', '2025-01-18', 'préparée');

-- Insertion dans la table de liaison Tournee_PointDeDepot
INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre, ID_Statut)
VALUES 
    (1, 1, 1, 1),
    (1, 2, 2, 1),
    (1, 3, 3, 1),
    (2, 4, 1, 1),
    (2, 5, 2, 1),
    (2, 6, 3, 1);

-- Insertion d'abonnements
INSERT INTO Abonnement (ID_Adherent, ID_Panier, ID_Frequence, date_debut, date_fin, statut)
VALUES 
    (1, 1, 1, '2025-01-01', NULL, 'actif'),
    (2, 2, 2, '2025-01-01', NULL, 'actif');

-- Insertion de commandes
INSERT INTO Commande (ID_Abonnement, ID_PointDeDepot, quantite, date_commande, statut)
VALUES 
    (1, 1, 1, CURRENT_TIMESTAMP, 'en attente'),
    (2, 2, 2, CURRENT_TIMESTAMP, 'en attente');

-- Insertion d'une commande associée à une tournée
INSERT INTO Commande_Tournee (ID_Commande, ID_Tournee, statut_livraison)
VALUES 
    (1, 1, 'non livrée'),
    (2, 2, 'non livrée');

-- Insertion de facturations
INSERT INTO Facturation (ID_Adherent, montant, date_facture)
VALUES 
    (1, 100.00, CURRENT_TIMESTAMP),
    (2, 150.00, CURRENT_TIMESTAMP);

-- Insertion dans la table de liaison Facture_Abonnement
INSERT INTO Facture_Abonnement (ID_Facture, ID_Abonnement)
VALUES 
    (1, 1),
    (2, 2);

-- Insertion d'adhésions
INSERT INTO Adhesion (ID_Adherent, type, date_debut, date_fin, statut)
VALUES 
    (1, 'annuelle', '2025-01-01', NULL, 'actif'),
    (2, 'annuelle', '2025-01-01', NULL, 'actif');

-- Insertion de jours fériés et semaines d'ouverture
INSERT INTO Calendrier (date, type) VALUES
('2025-01-01', 'ferie'),
('2025-01-02', 'ouverture'),
('2025-01-03', 'ouverture');
