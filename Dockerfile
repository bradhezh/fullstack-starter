FROM node:22.21.1 AS build-stage
ARG DB_URL_TEST

WORKDIR /usr/app
COPY . .

RUN corepack enable && corepack prepare pnpm@10.21.0 --activate
RUN pnpm i --frozen-lockfile
RUN pnpm build
RUN pnpm lint
RUN DB_URL=$DB_URL_TEST pnpm test
RUN CI=true pnpm i --frozen-lockfile --prod

FROM node:22.21.1

WORKDIR /usr/app
COPY --from=build-stage /usr/app/backend/node_modules ./node_modules
COPY --from=build-stage /usr/app/backend/build ./build

USER node
ENV NODE_ENV=production
CMD ["node", "build/main.js"]
