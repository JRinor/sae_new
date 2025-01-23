# Projet jardins de cocagne

## Table des matières
1. [Introduction](#introduction)
2. [Environnement de développement](#environnement-de-développement)
3. [Prérequis](#prérequis)
4. [Ports Utilisés](#ports-utilisés)
5. [Installation](#installation)
6. [Lancer l'application](#lancer-lapplication)
7. [Environnement Docker](#environnement-docker)
8. [Importer la base de données](#importer-la-base-de-données)
9. [Accéder à l'application](#accéder-à-lapplication)
10. [Pipeline CI](#pipeline-ci)
11. [Endpoints de l'API](#endpoints-de-lapi)
12. [Documentation Swagger](#documentation-swagger)
13. [Importer les tests API dans Postman](#importer-les-tests-api-dans-postman)

## Introduction
Projet jardins de cocagne pour la S.A.É. Développement avancé (S5.A.01).

## Environnement de développement
L'application utilise plusieurs technologies et outils pour le développement et la gestion des environnements.

**Technologies principales**

- **Next.js** : Un framework React pour le rendu côté serveur et la génération de sites statiques.
- **Docker** : Utilisé pour containeriser l'application et ses dépendances, facilitant ainsi le déploiement et la gestion des environnements.
- **PgAdmin** : Une interface web pour gérer la base de données PostgreSQL.

## Prérequis
- Docker
- Docker Compose

## Ports Utilisés

L'application utilise les ports suivants :

- **Application Web (Next.js)** : `3000`
- **Base de Données (PostgreSQL)** : `5432`
- **PgAdmin** : `5050`

### Modifier les Ports

Pour modifier les ports utilisés par les services, vous pouvez éditer le fichier `docker-compose.yml` à la racine du projet. Par exemple, pour changer le port de l'application web :

```yaml
services:
  app:
    ports:
      - "3000:3000"  # Changez le port ici
```

## Installation

1. Clonez le dépôt GitHub :
    ```sh
    git clone https://github.com/JRinor/sae_new.git
    cd sae_new
    ```

## Lancer l'application

1. Assurez-vous que Docker et Docker Compose sont installés sur votre machine.
2. Exécutez la commande suivante pour démarrer l'application :
    ```sh
    docker-compose up --build
    ```

    Si l'application ne fonctionne pas correctement, essayez les commandes suivantes :
    ```sh
    docker-compose down -v
    docker-compose up --build
    ```

3. Pour vous connecter à la base de données PostgreSQL via la ligne de commande, utilisez la commande suivante :
    ```sh
    docker exec -it new-db-1 psql -U user -d mydatabase
    ```

## Environnement Docker
- **Service Web** : Utilise une image Node.js pour exécuter l'application Next.js. Le code source est monté dans le conteneur permettant un développement interactif.
- **Service Base de Données (Postgres)** : Utilise une image Postgres. Les données sont stockées dans un volume Docker pour persistance. Un script SQL d'initialisation est exécuté au démarrage.
- **Service PgAdmin** : Utilise une image PgAdmin pour la gestion de la base de données via une interface web.

## Importer la base de données
Pour importer la base de données, ajoutez votre fichier SQL d'initialisation dans `init.sql`. Ce fichier sera exécuté automatiquement lors du démarrage du conteneur PostgreSQL.

Le fichier SQL contient les tables nécessaires et des données d'insertion de test pour l'application.

## Accéder à l'application
- **Application Web** : [http://localhost:3000](http://localhost:3000)
- **PgAdmin** : [http://localhost:5050](http://localhost:5050)

**Identifiants PgAdmin**
- **Email** : `admin@example.com`
- **Mot de passe** : `admin`

Pour vous connecter au serveur PostgreSQL via PgAdmin, utilisez les informations suivantes:

- **Nom du serveur** : Votre choix (par exemple, "Projet Cocagne")
- **Hôte** : `db`
- **Port** : `5432`
- **Nom de la base de données** : `mydatabase`
- **Nom d'utilisateur** : `user`
- **Mot de passe** : `password`

## Pipeline CI
Le pipeline CI utilise GitHub Actions pour automatiser les tests et la construction de l'application. Voici les étapes principales :
1. **Checkout du code** : Récupère le code source du dépôt.
2. **Setup Docker Buildx** : Configure l'environnement pour les builds multi-plateformes.
3. **Login Docker Hub** : Se connecte à Docker Hub pour accéder aux images nécessaires.
4. **Installation de Docker Compose** : Télécharge et installe Docker Compose.
5. **Docker Compose Down** : Arrête tous les conteneurs et supprime les volumes Docker existants pour un environnement propre.
6. **Docker Compose Up and Build** : Construit et démarre les conteneurs Docker.
7. **Wait for services to be healthy** : Attend que tous les services soient en bonne santé avant de continuer.
8. **Run API tests** : Exécute les tests API pour vérifier le bon fonctionnement de l'application.
9. **Docker Compose Down** : Arrête tous les conteneurs et supprime les volumes Docker.
10. **Clean up Docker images** : Nettoie les images Docker inutilisées pour libérer de l'espace.

## Endpoints de l'API

**Tournees**
- **GET** `/api/tournees/dates` : Récupérer toutes les dates des tournées
- **GET** `/api/tournees/:id` : Récupérer une tournée par ID
- **PATCH** `/api/tournees/:id` : Mettre à jour une tournée par ID
- **PUT** `/api/tournees/:id` : Remplacer une tournée par ID
- **DELETE** `/api/tournees/:id` : Supprimer une tournée par ID
- **POST** `/api/tournees` : Ajouter une nouvelle tournée
- **GET** `/api/tournees/:id/points-depot` : Récupérer les points de dépôt pour une tournée
- **POST** `/api/tournees/:id/points-depot` : Ajouter un point de dépôt à la tournée
- **DELETE** `/api/tournees/:id/points-depot` : Supprimer un point de dépôt de la tournée
- **GET** `/api/tournees/:id/calendrier` : Récupérer le calendrier d'une tournée par ID
- **PATCH** `/api/tournees/:id/calendrier` : Mettre à jour le calendrier d'une tournée par ID
- **DELETE** `/api/tournees/:id/calendrier` : Supprimer le calendrier d'une tournée par ID

**Points de Dépôt**
- **GET** `/api/points-depot` : Récupérer tous les points de dépôt
- **POST** `/api/points-depot` : Ajouter un nouveau point de dépôt
- **PUT** `/api/points-depot` : Mettre à jour un point de dépôt
- **DELETE** `/api/points-depot` : Supprimer un point de dépôt

**Structures**
- **GET** `/api/structures` : Récupérer toutes les structures

**Calendrier**
- **GET** `/api/openweeks` : Récupérer les semaines d'ouverture
- **GET** `/api/holidays` : Récupérer les jours fériés

**Commandes**
- **POST** `/api/commandes` : Créer une nouvelle commande

## Documentation Swagger
La documentation Swagger de l'API est disponible à l'adresse suivante :
- **Swagger UI** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Importer les tests API dans Postman
Un fichier JSON pour importer les tests API dans Postman est disponible :
- **Test API Postman** : [POSTMAN_API.json](https://github.com/JRinor/sae_new/blob/main/POSTMAN_API.json) .