#!/bin/bash

# Dyagnosys Feedback Deployment Script
# Usage: ./deploy.sh [server]
# Example: ./deploy.sh root@100.95.28.30

set -e

# Configuration
SERVER="${1:-root@100.95.28.30}"
REMOTE_DIR="/tmp/logchimp-deploy"
COMPOSE_DIR="/etc/dokploy/compose/browser-login-iqu3sl/code"
REPO_URL="https://github.com/vitorcalvi/logchimp-feedback.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Dyagnosys Feedback Deployment Script ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Server: ${YELLOW}$SERVER${NC}"
echo ""

# Get script directory (where the project is)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Step 1: Commit and push any pending changes
echo -e "${YELLOW}[1/6] Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}Found uncommitted changes. Committing...${NC}"
    git add -A
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || true
fi

# Push to remote
echo -e "${YELLOW}Pushing to remote...${NC}"
git push origin master 2>/dev/null || echo "Nothing to push or push failed"
echo -e "${GREEN}✓ Repository synced${NC}"

# Step 2: Clone on server
echo -e "${YELLOW}[2/6] Cloning repository on server...${NC}"
ssh "$SERVER" "rm -rf $REMOTE_DIR && git clone $REPO_URL $REMOTE_DIR"
echo -e "${GREEN}✓ Repository cloned${NC}"

# Step 3: Build theme image
echo -e "${YELLOW}[3/6] Building theme Docker image...${NC}"
ssh "$SERVER" "cd $REMOTE_DIR && docker build -t vitorcalvi/logchimp-theme:latest -f packages/theme/Dockerfile ."
echo -e "${GREEN}✓ Theme image built${NC}"

# Step 4: Build API image
echo -e "${YELLOW}[4/6] Building API Docker image...${NC}"
ssh "$SERVER" "cd $REMOTE_DIR && docker build -t vitorcalvi/logchimp-api:latest -f packages/server/Dockerfile ."
echo -e "${GREEN}✓ API image built${NC}"

# Step 5: Restart containers
echo -e "${YELLOW}[5/6] Restarting containers...${NC}"
ssh "$SERVER" "cd $COMPOSE_DIR && docker compose up -d --force-recreate api theme"
echo -e "${GREEN}✓ Containers restarted${NC}"

# Step 6: Cleanup
echo -e "${YELLOW}[6/6] Cleaning up...${NC}"
ssh "$SERVER" "rm -rf $REMOTE_DIR"
echo -e "${GREEN}✓ Cleanup complete${NC}"

# Verify deployment
echo ""
echo -e "${YELLOW}Verifying deployment...${NC}"
ssh "$SERVER" "docker ps --filter name=logchimp --format 'table {{.Names}}\t{{.Status}}'"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!                 ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Site: ${YELLOW}https://feedback.dyagnosys.com${NC}"
echo ""
