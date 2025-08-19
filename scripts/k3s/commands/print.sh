#!/usr/bin/env bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BG_RED='\033[41m'
BG_GREEN='\033[42m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'
RESET='\033[0m'

print_status() {
  echo -e "${BG_BLUE} INFO ${RESET} $1"
}

print_success() {
  echo -e "${BG_GREEN} INFO ${RESET} $1"
}

print_warning() {
  echo -e "${BG_YELLOW} WARN ${RESET} $1"
}

print_error() {
  echo -e "${BG_RED} ERRO ${RESET} ${RED}$1${RESET}"
}

print_header() {
  local message="$1"
  local length=${#message}
  local padding=$(( (80 - length - 2) / 2 ))
  local border_t="${GREEN}╭$(printf '─%.0s' $(seq 1 78))╮${RESET}"
  local border_b="${GREEN}╰$(printf '─%.0s' $(seq 1 78))╯${RESET}"
  echo -e "${border_t}"
  printf "${GREEN}│${RESET}%*s%s%*s${GREEN}│${RESET}\n" $padding "" "$message" $((78 - length - padding)) ""
  echo -e "${border_b}"
}
