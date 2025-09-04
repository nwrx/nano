#!/usr/bin/env bash

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
PACKAGE_JSON="$ROOT_DIR/package.json"

# Extract version information
export NANO_VERSION=$(cat "$PACKAGE_JSON" | jq -r .version)
export NANO_VERSION_SHA=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')

# Run docker compose with all arguments passed through
exec docker compose -f docker-compose.yaml "$@"
