#!/usr/bin/env bash

REGISTRY_HOST="localhost:5000"
IMAGE_NAME="nwrx/nano"
TAG="latest"
FULL_IMAGE_NAME="${REGISTRY_HOST}/${IMAGE_NAME}:${TAG}"

# Function to check if registry is running
ensure_registry_running() {
    if curl -s "http://${REGISTRY_HOST}/v2/" > /dev/null 2>&1; then
        print_success "Local registry is running"
        return 0
    else
        print_error "Local registry is not running at ${REGISTRY_HOST}"
        print_error "Please start the registry with: ./scripts/k3s/main.sh start"
        exit 1
    fi
}

# Function to build the Docker image
build_image() {
    cd $ROOT_DIR
    sha256=$(docker build \
        --quiet \
        --tag "${FULL_IMAGE_NAME}" \
        --file ${ROOT_DIR}/Dockerfile \
        .)

    print_success "Docker image built successfully: ${YELLOW}${sha256}${RESET}"
}

# Function to push the image to local registry
push_image_to_registry() {
    image=$(docker push "${FULL_IMAGE_NAME}" --quiet)
    print_success "Image was pushed to local registry successfully: ${YELLOW}${image}${RESET}"
}

# Function to verify the push
verify_image_exists() {
    manifest_url="http://${REGISTRY_HOST}/v2/${IMAGE_NAME}/manifests/${TAG}"

    response=$(curl -s -o /dev/null -w "%{http_code}" "$manifest_url")
    if [[ "$response" == "200" ]]; then
        print_success "Image exists in local registry: ${YELLOW}${FULL_IMAGE_NAME}${RESET}"
    else
        print_error "Failed to verify image in registry: ${YELLOW}${FULL_IMAGE_NAME}${RESET}"
        print_error "Could not find image in registry at ${manifest_url}"
        print_error "HTTP response code: ${response}"

        return 1
    fi
}

# Command: build
cmd_build() {
    print_header "Building Docker image"
    ensure_registry_running
    build_image
    push_image_to_registry
    verify_image_exists
}
