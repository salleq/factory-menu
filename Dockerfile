FROM node:20-alpine

# Asennetaan git, jotta commit ja push toimivat kontin sisältä
RUN apk add --no-cache git

WORKDIR /app

# Kopioidaan projektitiedostot
COPY package*.json ./
RUN npm install
COPY . .

# Ajetaan skreippi, kun kontti käynnistyy
CMD ["node", "scrape.js"]
