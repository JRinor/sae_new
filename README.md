## Tournées

### Récupérer toutes les tournées

- **URL**: `/api/tournees`
- **Méthode**:

GET

- **Description**: Récupère toutes les tournées.
- **Réponse**:
  - `200 OK`: Liste des tournées.
  - `500 Internal Server Error`: Erreur serveur.

### Créer une nouvelle tournée

- **URL**: `/api/tournees`
- **Méthode**:

POST

- **Description**: Crée une nouvelle tournée.
- **Corps de la requête**:
  ```json
  {
    "jour_preparation": "YYYY-MM-DD",
    "jour_livraison": "YYYY-MM-DD",
    "statut_tournee": "string"
  }
  ```
- **Réponse**:
  - `201 Created`: Tournée créée.
  - `400 Bad Request`: Champs requis manquants ou invalides.
  - `500 Internal Server Error`: Erreur serveur.

### Récupérer une tournée par ID

- **URL**: `/api/tournees/[id]`
- **Méthode**:

GET

- **Description**: Récupère une tournée par son ID.
- **Réponse**:
  - `200 OK`: Détails de la tournée.
  - `404 Not Found`: Tournée non trouvée.
  - `500 Internal Server Error`: Erreur serveur.

### Mettre à jour une tournée par ID

- **URL**: `/api/tournees/[id]`
- **Méthode**:

PATCH

- **Description**: Met à jour une tournée par son ID.
- **Corps de la requête**:
  ```json
  {
    "jour_preparation": "YYYY-MM-DD",
    "jour_livraison": "YYYY-MM-DD",
    "statut_tournee": "string"
  }
  ```
- **Réponse**:
  - `200 OK`: Tournée mise à jour.
  - `400 Bad Request`: Champs requis manquants ou invalides.
  - `404 Not Found`: Tournée non trouvée.
  - `500 Internal Server Error`: Erreur serveur.

### Supprimer une tournée par ID

- **URL**: `/api/tournees/[id]`
- **Méthode**:

DELETE

- **Description**: Supprime une tournée par son ID.
- **Réponse**:
  - `200 OK`: Tournée supprimée.
  - `404 Not Found`: Tournée non trouvée.
  - `500 Internal Server Error`: Erreur serveur.

## Points de dépôt

### Récupérer tous les points de dépôt

- **URL**: `/api/points-depot`
- **Méthode**:

GET

- **Description**: Récupère tous les points de dépôt.
- **Réponse**:
  - `200 OK`: Liste des points de dépôt.
  - `404 Not Found`: Aucun point de dépôt trouvé.
  - `500 Internal Server Error`: Erreur serveur.

### Ajouter un point de dépôt

- **URL**: `/api/points-depot`
- **Méthode**:

POST

- **Description**: Ajoute un nouveau point de dépôt.
- **Corps de la requête**:
  ```json
  {
    "nom": "string",
    "adresse": "string",
    "latitude": "number",
    "longitude": "number",
    "id_structure": "number"
  }
  ```
- **Réponse**:
  - `201 Created`: Point de dépôt ajouté.
  - `500 Internal Server Error`: Erreur serveur.

### Mettre à jour un point de dépôt

- **URL**: `/api/points-depot`
- **Méthode**:

PUT

- **Description**: Met à jour un point de dépôt.
- **Corps de la requête**:
  ```json
  {
    "id": "number",
    "nom": "string",
    "adresse": "string",
    "latitude": "number",
    "longitude": "number"
  }
  ```
- **Réponse**:
  - `200 OK`: Point de dépôt mis à jour.
  - `500 Internal Server Error`: Erreur serveur.

### Supprimer un point de dépôt

- **URL**: `/api/points-depot`
- **Méthode**:

DELETE

- **Description**: Supprime un point de dépôt.
- **Corps de la requête**:
  ```json
  {
    "id": "number"
  }
  ```
- **Réponse**:
  - `200 OK`: Point de dépôt supprimé.
  - `500 Internal Server Error`: Erreur serveur.

## Points de dépôt pour une tournée

### Récupérer les points de dépôt pour une tournée

- **URL**: `/api/tournees/[id]/points-depot`
- **Méthode**:

GET

- **Description**: Récupère les points de dépôt pour une tournée.
- **Réponse**:
  - `200 OK`: Liste des points de dépôt.
  - `404 Not Found`: Aucun point de dépôt trouvé pour cette tournée.
  - `500 Internal Server Error`: Erreur serveur.

### Ajouter un point de dépôt à une tournée

- **URL**: `/api/tournees/[id]/points-depot`
- **Méthode**:

POST

- **Description**: Ajoute un point de dépôt à une tournée.
- **Corps de la requête**:
  ```json
  {
    "pointId": "number",
    "ordre": "number"
  }
  ```
- **Réponse**:
  - `200 OK`: Point de dépôt ajouté à la tournée.
  - `400 Bad Request`: ID de tournée ou ID de point invalide.
  - `500 Internal Server Error`: Erreur serveur.

### Supprimer un point de dépôt d'une tournée

- **URL**: `/api/tournees/[id]/points-depot`
- **Méthode**:

DELETE

- **Description**: Supprime un point de dépôt d'une tournée.
- **Corps de la requête**:
  ```json
  {
    "pointId": "number"
  }
  ```
- **Réponse**:
  - `200 OK`: Point de dépôt retiré de la tournée.
  - `400 Bad Request`: ID de tournée ou de point manquant.
  - `500 Internal Server Error`: Erreur serveur.
