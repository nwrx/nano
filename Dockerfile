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
RUN pnpm build

#######################################
# Build the application.
#######################################

FROM base AS production
WORKDIR /app

COPY --from=build /build/packages/app/.output .

# Write a single entry point that will start the app depending on the
# arguments passed to the container. This is done to avoid having to
# create multiple Dockerfiles for each sub-package.
COPY <<EOF /usr/bin/nano
#!/usr/bin/env sh

show_help() {
  echo "Usage: nano serve"
  echo "Commands:"
  echo "  serve        Start the Nano UI server"
  echo "  --help       Show this help message"
}

if [ "\$1" = "--help" ]; then
  show_help
elif [ "\$1" = "serve" ]; then
  node /app/server/index.mjs
else
  show_help
  exit 1
fi
EOF

# Make the entrypoint script executable.
RUN chmod +x /usr/bin/nano
ENTRYPOINT ["/usr/bin/nano", "serve"]
