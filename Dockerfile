ARG ALPINE_VERSION=3.22
ARG NODE_VERSION=22.17.0
ARG PNPM_VERSION=10.14.0

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

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

# for each sub-package, we have to add one extra step to copy its manifest
# to the right place, as docker have no way to filter out only package.json with
# single instruction
COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY packages/ai/package.json packages/ai/
COPY packages/app/package.json packages/app/
COPY packages/api/package.json packages/api/
COPY packages/core/package.json packages/core/
COPY packages/runner/package.json packages/runner/

# Install the dependencies for all sub-packages.
RUN --mount=type=cache,target=/pnpm/store,rw pnpm install --recursive --frozen-lockfile

# Bundle and deploy the app.
COPY ./turbo.json .
COPY ./tsconfig.json .
COPY ./packages ./packages
RUN pnpm build

# Install the production dependencies for `runner` and `api` packages.
# We also ensure that there is no symlink as we are going to copy the
# `node_modules` directory to the final image.
RUN pnpm deploy --prod --legacy --filter @nwrx/nano-api /build/deploy/api
RUN pnpm deploy --prod --legacy --filter @nwrx/nano-runner /build/deploy/runner

#######################################
# Build the application.
#######################################

FROM base AS production
WORKDIR /app

ARG ALPINE_VERSION
ARG NODE_VERSION
ARG NANO_VERSION
ARG NANO_VERSION_SHA

# Add metadata labels
LABEL maintainer="Nanoworks"
LABEL org.opencontainers.image.title="Nano"
LABEL org.opencontainers.image.description="LLM workflow orchestration"
LABEL org.opencontainers.image.version="${NANO_VERSION}"
LABEL org.opencontainers.image.revision="${NANO_VERSION_SHA}"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="Nanoworks"
LABEL org.opencontainers.image.source="https://github.com/nwrx/nano"
LABEL org.opencontainers.image.documentation="https://github.com/nwrx/nano#readme"
LABEL org.opencontainers.image.base.name="node:${NODE_VERSION}-alpine${ALPINE_VERSION}"
LABEL org.opencontainers.image.created="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

# Runtime labels
LABEL nano.services="app,api,runner"
LABEL nano.default-port="3000"
LABEL nano.volume="/data"
LABEL nano.version="${NANO_VERSION}"
LABEL nano.version.sha="${NANO_VERSION_SHA}"

COPY --from=build /build/packages/app/.output ./app
COPY --from=build /build/deploy/api ./api
COPY --from=build /build/deploy/runner ./runner

# Write a single entry point that will start the app depending on the
# arguments passed to the container. This is done to avoid having to
# create multiple Dockerfiles for each sub-package.
COPY <<EOF /usr/bin/nano
#!/usr/bin/env sh

show_help() {
  echo "Usage: nano app"
  echo "Commands:"
  echo "  app          Start the Nano Application (SPA)"
  echo "  api          Start the Nano API Server"
  echo "  runner       Start the Nano Runner Server"
  echo "  --help       Show this help message"
}

if [ "\$1" = "--help" ]; then
  show_help
  exit 0
elif [ "\$1" = "app" ]; then
  node /app/app/server/index.mjs
elif [ "\$1" = "api" ]; then
  node /app/api/dist/server.mjs
elif [ "\$1" = "runner" ]; then
  node /app/runner/dist/server.mjs
else
  show_help
  exit 1
fi
EOF

# Ensure environment variables are set for the application.
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Set the storage and database paths.
ENV DATABASE_TYPE=sqlite
ENV DATABASE_PATH=/data/database/nano.database

# Set version environment variables
ENV NUXT_PUBLIC_NANO_VERSION=${NANO_VERSION}
ENV NUXT_PUBLIC_NANO_VERSION_SHA=${NANO_VERSION_SHA}

# Expose the port the app runs on.
EXPOSE 3000
VOLUME [ "/data" ]

# Make the entrypoint script executable.
RUN chmod +x /usr/bin/nano
ENTRYPOINT ["/usr/bin/nano"]
