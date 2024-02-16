# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl 

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /invoice-app

ADD package.json package-lock.json ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /invoice-app

COPY --from=deps /invoice-app/node_modules /invoice-app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /invoice-app

COPY --from=deps /invoice-app/node_modules /invoice-app/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV INTERNAL_PORT="80"
ENV PORT="80"
ENV NODE_ENV="production"

WORKDIR /invoice-app

COPY --from=production-deps /invoice-app/node_modules /invoice-app/node_modules
COPY --from=build /invoice-app/node_modules/.prisma /invoice-app/node_modules/.prisma

COPY --from=build /invoice-app/build /invoice-app/build
COPY --from=build /invoice-app/public /invoice-app/public
COPY --from=build /invoice-app/package.json /invoice-app/package.json
COPY --from=build /invoice-app/start.sh /invoice-app/start.sh
COPY --from=build /invoice-app/prisma /invoice-app/prisma

ENTRYPOINT [ "./start.sh" ]
