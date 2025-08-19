#!/usr/bin/env bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname $(dirname "$SCRIPT_DIR"))"

# Source command functions
for cmd in "$SCRIPT_DIR/commands"/*.sh; do
  if [[ -f "$cmd" ]]; then
    source "$cmd"
  fi
done

# Function to show help
show_help() {
    echo "K3S cluster management script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start         Start the k3s cluster with 3 nodes and wait for readiness"
    echo "  deploy        Deploy the Helm chart to the k3s cluster using values.yaml"
    echo "  destroy       Destroy the deployed application and namespace"
    echo "  stop          Stop the k3s cluster and remove all volumes"
    echo "  status        Check the status of the k3s cluster"
    echo "  build         Build the nano Docker image locally"
    echo "  certs         Generate local certificates for HTTPS"
    echo "  dev           Build image, start cluster, deploy app, and generate certs"
    echo "  help          Show this help message"
    echo ""
    echo "Configuration:"
    echo "  The deploy command uses '$SCRIPT_DIR/values.yaml' for Helm values"
    echo "  This file is pre-configured for Traefik ingress with local domains:"
    echo "    - app.nano.local (Frontend)"
    echo "    - api.nano.local (API)"
    echo ""
    echo "If no command is provided, 'start' will be executed by default."
    echo ""
    echo "Examples:"
    echo "  $0 start                     # Start cluster only"
    echo "  $0 dev                       # Full development setup"
    echo "  $0 build                     # Build image only"
    echo "  $0 deploy                    # Deploy to cluster"
    echo "  $0 destroy                   # Remove deployment"
    echo "  $0 status                    # Check cluster status"
}


# Main script execution
main() {
    
    # Get the command (first non-option argument)
    local command=""
    for arg in "$@"; do
        if [[ ! "$arg" =~ ^-- ]]; then
            command="$arg"
            break
        fi
    done
    
    # Default to start if no command provided
    command="${command:-start}"
    case "$command" in
        "start")
            cmd_start
            ;;
        "deploy")
            cmd_deploy
            ;;
        "destroy")
            cmd_destroy
            ;;
        "stop")
            cmd_stop
            ;;
        "build")
            cmd_build
            ;;
        "certs")
            cmd_certs
            ;;
        "dev")
            cmd_start
            cmd_build
            cmd_deploy
            cmd_certs
            ;;
        "help")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
