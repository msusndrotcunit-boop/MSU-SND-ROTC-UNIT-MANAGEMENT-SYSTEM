FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci

FROM base AS build
WORKDIR /app
COPY apps/api/tsconfig.json apps/api/tsconfig.json
COPY apps/api/src apps/api/src
RUN npm run build -w apps/api

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=base /app/node_modules node_modules
COPY apps/api/package.json apps/api/package.json
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
