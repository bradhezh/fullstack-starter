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
COPY --from=build-stage /usr/app/package.json .
COPY --from=build-stage /usr/app/pnpm-lock.yaml .
COPY --from=build-stage /usr/app/pnpm-workspace.yaml .
COPY --from=build-stage /usr/app/backend/package.json ./backend/
COPY --from=build-stage /usr/app/backend/build ./backend/build

RUN corepack enable && corepack prepare pnpm@10.21.0 --activate
RUN pnpm --filter backend i --frozen-lockfile

USER node
CMD ["pnpm", "start"]
