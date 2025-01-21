# Utilisez une image Node.js officielle
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (ou yarn.lock) dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code de l'application
COPY . .

# Construire le projet (si vous avez une étape de build)
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "dev"]
