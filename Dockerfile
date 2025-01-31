ARG ALPINE_VERSION=3.20
ARG NODE_VERSION=22.11.0
ARG PNPM_VERSION=9.15.4

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
RUN corepack enable

#######################################
# Build and bundle the app.
#######################################

FROM base AS build
WORKDIR /build

# Install some binaries that are required for building some of
# the dependencies. This is done in a separate step to avoid
# having to install them in the final image.
RUN apk add --no-cache \
  python3

# Prefetch dependencies so they can be reused in the next steps
# without having to download them again if the lockfile hasn't changed.
COPY ./pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm_cache,rw pnpm fetch

# for each sub-package, we have to add one extra step to copy its manifest
# to the right place, as docker have no way to filter out only package.json with
# single instruction
COPY .npmrc .
COPY package.json .
COPY pnpm-workspace.yaml .
COPY packages/app/package.json packages/app/
COPY packages/api/package.json packages/api/
COPY packages/core/package.json packages/core/
COPY packages/module-core/package.json packages/module-core/
RUN printf "y\n" | pnpm install --recursive --frozen-lockfile --offline

# Bundle and deploy the app.
COPY ./turbo.json .
COPY ./tsconfig.json .
COPY ./packages ./packages
RUN \
  pnpm build && \
  pnpm deploy --filter @nwrx/nano-app --prod /build/app && \
  pnpm deploy --filter @nwrx/nano-api --prod /build/api

#######################################
# Build the application.
#######################################

FROM base AS production
WORKDIR /app

COPY --from=build /build/app ./app
COPY --from=build /build/api ./api

# Write a single entry point that will start the app depending on the
# arguments passed to the container. This is done to avoid having to
# create multiple Dockerfiles for each sub-package.
COPY <<EOF /usr/bin/nano
#!/usr/bin/env sh

show_help() {
  echo "Usage: nano serve [app|api]"
  echo "Commands:"
  echo "  serve app    Start the app server"
  echo "  serve api    Start the API server"
  echo "  --help       Show this help message"
}

if [ "\$1" = "--help" ]; then
  show_help
elif [ "\$1" = "serve" ]; then
  if [ "\$2" = "app" ]; then
    node app/.output/server/index.mjs
  else
    node api/dist/server.js
  fi
else
  echo "Invalid argument: \$1"
  show_help
  exit 1
fi
EOF

# Make the entrypoint script executable.
RUN chmod +x /usr/bin/nano
ENTRYPOINT ["/usr/bin/nano"]
