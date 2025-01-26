import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const router = express.Router();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    './src/app/api/structures/route.js',
    './src/app/api/points-depot/route.js',
    './src/app/api/points-depot/disponibles/[tourneeId]/route.js',
    './src/app/api/openweeks/route.js',
    './src/app/api/holidays/route.js',
    './src/app/api/commandes/route.js',
    './src/app/api/auth/users/route.js',
    './src/app/api/auth/register/route.js',
    './src/app/api/auth/login/route.js',
    './src/app/api/tournees/index/route.js',
    './src/app/api/tournees/dates/route.js',
    './src/app/api/tournees/[id]/route.js',
    './src/app/api/tournees/[id]/points-depot/route.js',
    './src/app/api/tournees/[id]/calendrier/route.js',
    './src/app/api/test-db/route.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;

export async function GET() {
  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API",
    },
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Connexion d'un utilisateur",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    mot_de_passe: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Connexion réussie",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Email ou mot de passe incorrect" },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Inscription d'un nouvel utilisateur",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nom: { type: "string" },
                    prenom: { type: "string" },
                    email: { type: "string" },
                    mot_de_passe: { type: "string" },
                    role: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Utilisateur créé",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id_user: { type: "integer" },
                      nom: { type: "string" },
                      prenom: { type: "string" },
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                },
              },
            },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/auth/users": {
        get: {
          tags: ["Auth"],
          summary: "Récupérer les informations de l'utilisateur connecté",
          responses: {
            200: {
              description: "Informations de l'utilisateur",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id_user: { type: "integer" },
                      nom: { type: "string" },
                      prenom: { type: "string" },
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                },
              },
            },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/commandes": {
        get: {
          tags: ["Commandes"],
          summary: "Récupérer la liste des commandes",
          responses: {
            200: {
              description: "Liste des commandes",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id_commande: { type: "integer" },
                        id_abonnement: { type: "integer" },
                        id_pointdedepot: { type: "integer" },
                        quantite: { type: "integer" },
                        date_livraison: { type: "string", format: "date" },
                        statut: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            500: { description: "Erreur serveur" },
          },
        },
        post: {
          tags: ["Commandes"],
          summary: "Créer une nouvelle commande",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_abonnement: { type: "integer" },
                    id_point_de_depot: { type: "integer" },
                    quantite: { type: "integer" },
                    date_livraison: { type: "string", format: "date" },
                    statut: { type: "string" },
                  },
                  example: {
                    id_abonnement: 1,
                    id_point_de_depot: 2,
                    quantite: 10,
                    date_livraison: "2023-12-01",
                    statut: "en attente",
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Commande créée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id_commande: { type: "integer" },
                      id_abonnement: { type: "integer" },
                      id_pointdedepot: { type: "integer" },
                      quantite: { type: "integer" },
                      date_livraison: { type: "string", format: "date" },
                      statut: { type: "string" },
                    },
                    example: {
                      id_commande: 1,
                      id_abonnement: 1,
                      id_pointdedepot: 2,
                      quantite: 10,
                      date_livraison: "2023-12-01",
                      statut: "en attente",
                    },
                  },
                },
              },
            },
            400: { description: "Statut invalide" },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/tournees/{id}/calendrier": {
        get: {
          tags: ["Tournées"],
          summary: "Récupérer le calendrier d'une tournée par ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "ID de la tournée",
            },
          ],
          responses: {
            200: {
              description: "Détails du calendrier de la tournée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id_tournee: { type: "integer" },
                      jour_preparation: { type: "string", format: "date" },
                      jour_livraison: { type: "string", format: "date" },
                      statut_tournee: { type: "string" },
                    },
                    example: {
                      id_tournee: 1,
                      jour_preparation: "2023-11-30",
                      jour_livraison: "2023-12-01",
                      statut_tournee: "préparée",
                    },
                  },
                },
              },
            },
            400: { description: "ID invalide" },
            404: { description: "Tournée non trouvée" },
            500: { description: "Erreur serveur" },
          },
        },
        patch: {
          tags: ["Tournées"],
          summary: "Mettre à jour le calendrier d'une tournée par ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "ID de la tournée",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    jour_preparation: { type: "string", format: "date" },
                    jour_livraison: { type: "string", format: "date" },
                    statut_tournee: { type: "string" },
                  },
                  example: {
                    jour_preparation: "2023-11-30",
                    jour_livraison: "2023-12-01",
                    statut_tournee: "préparée",
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Calendrier de la tournée mis à jour",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id_tournee: { type: "integer" },
                      jour_preparation: { type: "string", format: "date" },
                      jour_livraison: { type: "string", format: "date" },
                      statut_tournee: { type: "string" },
                    },
                    example: {
                      id_tournee: 1,
                      jour_preparation: "2023-11-30",
                      jour_livraison: "2023-12-01",
                      statut_tournee: "préparée",
                    },
                  },
                },
              },
            },
            400: { description: "Champs requis manquants ou invalides" },
            404: { description: "Tournée non trouvée" },
            500: { description: "Erreur serveur" },
          },
        },
        delete: {
          tags: ["Tournées"],
          summary: "Supprimer le calendrier d'une tournée par ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "ID de la tournée",
            },
          ],
          responses: {
            200: { description: "Calendrier de la tournée supprimé" },
            400: { description: "ID invalide" },
            404: { description: "Tournée non trouvée" },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/points-depot": {
        get: {
          tags: ["Points de Dépôt"],
          summary: "Récupérer tous les points de dépôt",
          responses: {
            200: {
              description: "Liste des points de dépôt",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ID_PointDeDepot: { type: "integer" },
                        nom: { type: "string" },
                        adresse: { type: "string" },
                        latitude: { type: "number" },
                        longitude: { type: "number" },
                      },
                      example: {
                        ID_PointDeDepot: 1,
                        nom: "Point de Dépôt A",
                        adresse: "456 Rue Exemple",
                        latitude: 48.8566,
                        longitude: 2.3522,
                      },
                    },
                  },
                },
              },
            },
            404: { description: "Aucun point de dépôt trouvé" },
            500: { description: "Erreur serveur" },
          },
        },
        post: {
          tags: ["Points de Dépôt"],
          summary: "Ajouter un nouveau point de dépôt",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nom: { type: "string" },
                    adresse: { type: "string" },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    id_structure: { type: "integer" },
                  },
                  example: {
                    nom: "Point de Dépôt B",
                    adresse: "789 Rue Exemple",
                    latitude: 48.8566,
                    longitude: 2.3522,
                    id_structure: 1,
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Point de dépôt créé",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ID_PointDeDepot: { type: "integer" },
                      nom: { type: "string" },
                      adresse: { type: "string" },
                      latitude: { type: "number" },
                      longitude: { type: "number" },
                      id_structure: { type: "integer" },
                    },
                    example: {
                      ID_PointDeDepot: 2,
                      nom: "Point de Dépôt B",
                      adresse: "789 Rue Exemple",
                      latitude: 48.8566,
                      longitude: 2.3522,
                      id_structure: 1,
                    },
                  },
                },
              },
            },
            500: { description: "Erreur serveur" },
          },
        },
        put: {
          tags: ["Points de Dépôt"],
          summary: "Mettre à jour un point de dépôt",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    nom: { type: "string" },
                    adresse: { type: "string" },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                  },
                  example: {
                    id: 1,
                    nom: "Point de Dépôt A",
                    adresse: "456 Rue Exemple",
                    latitude: 48.8566,
                    longitude: 2.3522,
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Point de dépôt mis à jour",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ID_PointDeDepot: { type: "integer" },
                      nom: { type: "string" },
                      adresse: { type: "string" },
                      latitude: { type: "number" },
                      longitude: { type: "number" },
                    },
                    example: {
                      ID_PointDeDepot: 1,
                      nom: "Point de Dépôt A",
                      adresse: "456 Rue Exemple",
                      latitude: 48.8566,
                      longitude: 2.3522,
                    },
                  },
                },
              },
            },
            500: { description: "Erreur serveur" },
          },
        },
        delete: {
          tags: ["Points de Dépôt"],
          summary: "Supprimer un point de dépôt",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                  },
                  example: {
                    id: 1,
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Point de dépôt supprimé" },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/points-depot/disponibles/{tourneeId}": {
        get: {
          tags: ["Points de Dépôt"],
          summary: "Récupérer les points de dépôt disponibles pour une tournée",
          parameters: [
            {
              in: "path",
              name: "tourneeId",
              required: true,
              schema: { type: "integer" },
              description: "ID de la tournée",
            },
          ],
          responses: {
            200: {
              description: "Liste des points de dépôt disponibles",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ID_PointDeDepot: { type: "integer" },
                        nom: { type: "string" },
                        adresse: { type: "string" },
                        latitude: { type: "number" },
                        longitude: { type: "number" },
                      },
                      example: {
                        ID_PointDeDepot: 1,
                        nom: "Point de Dépôt A",
                        adresse: "456 Rue Exemple",
                        latitude: 48.8566,
                        longitude: 2.3522,
                      },
                    },
                  },
                },
              },
            },
            400: { description: "ID de tournée invalide" },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/openweeks": {
        get: {
          tags: ["Calendrier"],
          summary: "Récupérer les semaines d'ouverture",
          responses: {
            200: {
              description: "Liste des semaines d'ouverture",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "date",
                    },
                    example: ["2023-12-01", "2023-12-08"],
                  },
                },
              },
            },
            404: { description: "Aucune semaine d'ouverture trouvée" },
            500: { description: "Erreur serveur" },
          },
        },
      },
      "/api/holidays": {
        get: {
          tags: ["Calendrier"],
          summary: "Récupérer les jours fériés",
          responses: {
            200: {
              description: "Liste des jours fériés",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "date",
                    },
                    example: ["2023-12-25", "2024-01-01"],
                  },
                },
              },
            },
            500: { description: "Erreur serveur" },
          },
        },
      },
    },
  };

  console.log('Swagger API documentation generated successfully.');

  return new Response(JSON.stringify(openApiSpec), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}