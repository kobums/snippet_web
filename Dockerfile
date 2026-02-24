FROM --platform=linux/amd64 node:22-slim AS builder

WORKDIR /app

COPY package.json ./

RUN npm install --no-audit --prefer-offline

COPY . .
# COPY .env.production .env.production

ENV NODE_ENV=production
ENV PORT=9008

RUN npm run build

EXPOSE 9008

CMD ["npm", "start"]