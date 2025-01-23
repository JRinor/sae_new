// src/app/api/docs/route.js
/**
 * @swagger
 * /api/docs:
 *   get:
 *     tags: [API Documentation]
 *     summary: Récupérer la documentation de l'API
 *     responses:
 *       200:
 *         description: Documentation retournée avec succès
 */
export async function GET() {
    const openApiSpec = {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "Documentation de l'API",
      },
      paths: {
        "/api/commandes": {
          get: {
            summary: "Liste des commandes",
            responses: {
              "200": {
                description: "Liste retournée avec succès",
              },
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
                  },
                },
              },
            },
            responses: {
              201: { description: "Commande créée" },
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
              },
            ],
            responses: {
              200: { description: "Détails du calendrier de la tournée" },
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
                  },
                },
              },
            },
            responses: {
              200: { description: "Calendrier de la tournée mis à jour" },
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
        "/api/structures": {
          get: {
            tags: ["Structures"],
            summary: "Récupérer toutes les structures",
            responses: {
              200: { description: "Liste des structures" },
              500: { description: "Erreur serveur" },
            },
          },
        },
        "/api/points-depot": {
          get: {
            tags: ["Points de Dépôt"],
            summary: "Récupérer tous les points de dépôt",
            responses: {
              200: { description: "Liste des points de dépôt" },
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
                  },
                },
              },
            },
            responses: {
              201: { description: "Point de dépôt créé" },
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
                  },
                },
              },
            },
            responses: {
              200: { description: "Point de dépôt mis à jour" },
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
        "/api/openweeks": {
          get: {
            tags: ["Calendrier"],
            summary: "Récupérer les semaines d'ouverture",
            responses: {
              200: { description: "Liste des semaines d'ouverture" },
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
              200: { description: "Liste des jours fériés" },
              500: { description: "Erreur serveur" },
            },
          },
        },
      },
    };
  
    return new Response(JSON.stringify(openApiSpec), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
