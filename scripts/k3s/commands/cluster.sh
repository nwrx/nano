#!/usr/bin/env bash

HELM_RELEASE="nano"
CHARTS_DIR="$ROOT_DIR/charts"
CHART_DIR="$CHARTS_DIR/nano"
KUBECONFIG="$SCRIPT_DIR/output/kubeconfig.yaml"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yaml"
VALUES_FILE="$SCRIPT_DIR/values.yaml"
EXPECTED_NODES=3
MAX_WAIT_TIME=60  # 1 minute
CHECK_INTERVAL=1   # 1 second

# Helper function to execute kubectl with kubeconfig
kubectl_exec() {
    kubectl --kubeconfig="$KUBECONFIG" "$@"
}

# Function to check if kubeconfig exists and works
check_kubeconfig() {
    [[ -f "$KUBECONFIG" ]] || return 1
    set_kubeconfig_permissions
    kubectl_exec cluster-info &>/dev/null
}

# Function to get the count of ready nodes
get_ready_nodes_count() {
    local count
    count=$(kubectl_exec get nodes --no-headers 2>/dev/null | grep -c " Ready " 2>/dev/null || echo "0")
    echo "$count" | tr -d '\n\r' | grep -E '^[0-9]+$' || echo "0"
}

# Function to check if all nodes are ready
check_nodes_ready() {
    local ready_nodes
    ready_nodes=$(get_ready_nodes_count)
    # Ensure we have a valid number
    if [[ "$ready_nodes" =~ ^[0-9]+$ ]] && [[ "$ready_nodes" -ge "$EXPECTED_NODES" ]]; then
        return 0
    else
        return 1
    fi
}

# Function to ensure kubeconfig exists and is functional
check_ready() {
    if ! check_kubeconfig; then
        return 1
    fi
    if ! check_nodes_ready; then
        return 1
    fi
    return 0
}

wait_until_ready() {
    local elapsed=0
    local ready_kubeconfig
    local ready_nodes

    # --- First check if everything is already ready.
    if check_kubeconfig && check_nodes_ready; then
        return 0
    fi

    # --- Wait for the cluster to become ready.
    print_status "Waiting for K3S cluster to become ready..."
    while [[ $elapsed -lt $MAX_WAIT_TIME ]]; do
        if check_kubeconfig && check_nodes_ready; then
            print_success "K3S cluster is ready with $EXPECTED_NODES nodes"
            return 0
        fi

        printf "."
        sleep $CHECK_INTERVAL
        elapsed=$((elapsed + CHECK_INTERVAL))
    done
    
    if [[ $elapsed -ge $MAX_WAIT_TIME ]]; then
        print_error "K3S cluster did not become ready within $MAX_WAIT_TIME seconds"
        print_error "Please check the logs for more details."
        print_error "You can view the logs with: docker-compose -f ${COMPOSE_FILE} logs"
    fi
    return 1
}

# Function to fix kubeconfig permissions
set_kubeconfig_permissions() {
    local user=$(whoami)
    local group=$(id -gn "$user")

    # --- Abort early if kubeconfig does not exist.
    if [[ ! -f "$KUBECONFIG" ]]; then
        return 0
    fi

    # --- Ensure ownership is correct
    if [[ ! -w "$KUBECONFIG" ]]; then
        print_status "Fixing kubeconfig file ownership..."
        sudo chown "$user:$group" "$KUBECONFIG"
    fi

    # --- Ensure 600 permissions
    local current_perms
    current_perms=$(stat -c "%a" "$KUBECONFIG" 2>/dev/null)
    if [[ "$current_perms" != "600" ]]; then
        print_status "Fixing kubeconfig file permissions..."
        sudo chmod 600 "$KUBECONFIG"
    fi

    # --- Make a copy of the kubeconfig file for VSCode Kubernetes extension
    mkdir -p "$ROOT_DIR/.vscode"
    cp "$KUBECONFIG" "$ROOT_DIR/.vscode/kubeconfig.yaml" || {
        print_error "Failed to copy kubeconfig file for VSCode Kubernetes extension"
        return 1
    }
}

# Enhanced deploy function that lets Traefik generate certificates
deploy_nano() {
    # --- Build chart dependencies if not already done.
    if [[ ! -d "$CHART_DIR/charts" ]] || [[ -z "$(ls -A "$CHART_DIR/charts" 2>/dev/null)" ]]; then
        print_status "Building chart dependencies..."
        helm dependency build "$CHART_DIR"
    fi

    # --- Check if release already exists and uninstall if needed
    # if helm list --kubeconfig="$KUBECONFIG" -n nano 2>/dev/null | grep -q "$HELM_RELEASE"; then
    #     print_status "Existing release found, uninstalling first..."
    #     helm uninstall "$HELM_RELEASE" --kubeconfig="$KUBECONFIG" -n nano --wait || {
    #         print_warning "Failed to uninstall existing release, continuing anyway..."
    #     }
    # fi
    
    # --- Install the chart
    print_status "Installing Helm release '$HELM_RELEASE'..."
    helm upgrade "$HELM_RELEASE" "$CHART_DIR" \
    --install \
    --kubeconfig="$KUBECONFIG" \
    --values="$VALUES_FILE" \
    --create-namespace \
    --namespace nano \
    --wait-for-jobs \
    --timeout=1m
}

# Deploy cert-manager from remote if not already installed.
deploy_cert_manager() {
    if kubectl_exec get namespace cert-manager &>/dev/null; then
        return 0
    fi
    
    print_status "Adding jetstack Helm repository..."
    helm repo add jetstack https://charts.jetstack.io --force-update
    helm repo update
    
    print_status "Installing cert-manager..."
    helm install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --version v1.9.1 \
        --create-namespace \
        --wait \
        --kubeconfig="$KUBECONFIG" \
        --set installCRDs=true
}

######################################################################3

# Command: start
cmd_start() {
    print_header "Starting K3S Cluster"
    docker-compose -f "$COMPOSE_FILE" up -d
    wait_until_ready
}

# Command: stop
cmd_stop() {
    print_header "Stopping K3S cluster"
    docker-compose -f "$COMPOSE_FILE" down
    docker-compose -f "$COMPOSE_FILE" down -v
    rm -rf $(dirname "$KUBECONFIG")
}

cmd_destroy() {
    print_header "Destroying deployed application"
    check_ready || {
        print_error "Cluster is not ready"
        exit 1
    }
    
    # --- Uninstall Helm release and delete namespace
    if helm list --kubeconfig="$KUBECONFIG" -n $HELM_RELEASE 2>/dev/null | grep -q $HELM_RELEASE; then
        print_status "Uninstalling Helm release '$HELM_RELEASE'..."
        helm uninstall $HELM_RELEASE --kubeconfig="$KUBECONFIG" -n $HELM_RELEASE --wait || \
            print_warning "Failed to uninstall Helm release"
    fi

    # --- Delete the namespace if it exists
    if kubectl_exec get namespace $HELM_RELEASE &>/dev/null; then
        print_status "Deleting namespace '$HELM_RELEASE'..."
        kubectl_exec delete namespace $HELM_RELEASE --wait --timeout=5m || \
            print_error "Failed to delete namespace"
    else
        print_warning "Namespace '$HELM_RELEASE' not found"
    fi
}

# Command: deploy
cmd_deploy() {
    print_header "Deploying Helm chart"
    check_ready || {
        print_error "Cluster is not ready. Please run 'start' command first."
        exit 1
    }
    deploy_cert_manager
    deploy_nano
}
