FROM node:18-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

CMD ["exit", "0"]

###
# Prodction
###
FROM node:18-alpine as prod

RUN mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV production
ENV PORT 80

CMD ["npm", "run", "start:prod"]