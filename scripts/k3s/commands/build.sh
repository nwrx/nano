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

# Function to syncronize the image in the cluster with the recently built image,
# but only if the cluster is running, the chart is deployed and the image sha256 does
# not match the current image sha256 in the deployment.
sync_image_in_cluster() {
    if ! check_ready; then
        print_warning "Cluster is not ready, skipping image sync"
        return 0
    fi
    
    # Check if the helm release is deployed
    print_status "Checking if deployment needs image sync..."
    if ! helm list --kubeconfig="$KUBECONFIG" -n nano 2>/dev/null | grep -q "$HELM_RELEASE"; then
        print_warning "Helm release '$HELM_RELEASE' not found, skipping image sync"
        return 0
    fi
    
    print_status "Triggering rollout restart for all workloads..."
    
    local rollout_success=true
    local workloads_restarted=()
    
    # Restart API deployment if it exists
    if kubectl_exec get deployment nano-api -n nano &>/dev/null; then
        print_status "Restarting API deployment..."
        if kubectl_exec rollout restart deployment/nano-api -n nano; then
            workloads_restarted+=("deployment/nano-api")
        else
            print_error "Failed to restart API deployment"
            rollout_success=false
        fi
    fi
    
    # Restart APP deployment if it exists
    if kubectl_exec get deployment nano-app -n nano &>/dev/null; then
        print_status "Restarting APP deployment..."
        if kubectl_exec rollout restart deployment/nano-app -n nano; then
            workloads_restarted+=("deployment/nano-app")
        else
            print_error "Failed to restart APP deployment"
            rollout_success=false
        fi
    fi
    
    # Restart Runner StatefulSets
    local runner_statefulsets
    runner_statefulsets=$(kubectl_exec get statefulsets -n nano -l app.kubernetes.io/component=runner -o name 2>/dev/null || echo "")
    
    if [[ -n "$runner_statefulsets" ]]; then
        while IFS= read -r statefulset; do
            if [[ -n "$statefulset" ]]; then
                local sts_name=${statefulset#statefulset.apps/}
                print_status "Restarting runner StatefulSet: $sts_name..."
                if kubectl_exec rollout restart statefulset/"$sts_name" -n nano; then
                    workloads_restarted+=("statefulset/$sts_name")
                else
                    print_error "Failed to restart runner StatefulSet: $sts_name"
                    rollout_success=false
                fi
            fi
        done <<< "$runner_statefulsets"
    fi
    
    if [[ ${#workloads_restarted[@]} -eq 0 ]]; then
        print_warning "No workloads found to restart"
        return 0
    fi
    
    print_status "Waiting for rollouts to complete..."
    
    # Wait for all workload rollouts to complete
    for workload in "${workloads_restarted[@]}"; do
        print_status "Waiting for rollout: $workload"
        if ! kubectl_exec rollout status "$workload" -n nano --timeout=60s; then
            print_error "Rollout failed or timed out for $workload"
            rollout_success=false
        fi
    done
    
    if [[ "$rollout_success" == "true" ]]; then
        print_success "Image sync completed successfully for all workloads"
        return 0
    else
        print_error "Some rollouts failed"
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
    sync_image_in_cluster
}
