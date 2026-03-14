FROM node:lts-slim

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

LABEL maintainer=rodrigovbuttura@gmail.com

WORKDIR /app

COPY package*.json ./

RUN npm run build

COPY . .

EXPOSE 7575

CMD ["npm", "run", "start"]
