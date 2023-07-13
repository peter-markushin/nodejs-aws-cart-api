FROM node:18-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN ls -la \
    && npm run build

CMD ["exit", "0"]

###
# Prodction
###
FROM public.ecr.aws/lambda/nodejs:18 as prod

COPY package*.json ${LAMBDA_TASK_ROOT}/

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /usr/src/app/dist ${LAMBDA_TASK_ROOT}/

ENV NODE_ENV production

CMD ["handler.handler"]