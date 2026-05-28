# ===================================
# DOCKERFILE - BurgerHouse API
# ===================================

FROM node:20-alpine

LABEL maintainer="Luis Yactayo"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
