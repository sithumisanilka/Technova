#!/bin/bash

# Load environment variables for local development
# Usage: source load-env-local.sh

echo "Loading local development environment variables..."

# Load from .env.local file
if [ -f "env/.env.local" ]; then
    export $(cat env/.env.local | grep -v '^#' | xargs)
    echo "✅ Local environment variables loaded from env/.env.local"
else
    echo "❌ env/.env.local file not found!"
    exit 1
fi

echo "Database URL: $SPRING_DATASOURCE_URL"
echo "Server Port: $SERVER_PORT"
echo "CORS Origins: $CORS_ALLOWED_ORIGINS"
echo ""
echo "You can now run: ./mvnw spring-boot:run"