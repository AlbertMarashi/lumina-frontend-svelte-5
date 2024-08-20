#!/bin/bash
# This script is used to deploy the project to Vercel.

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Install SurrealDB
echo "Installing SurrealDB..."
curl -L https://install.surrealdb.com | sh

# 2. Set PUBLIC_SURREAL_NAMESPACE based on VERCEL_GIT_COMMIT_REF
if [[ $VERCEL_GIT_COMMIT_REF == "main" ]]; then
    PUBLIC_SURREAL_NAMESPACE="main"
else
    PUBLIC_SURREAL_NAMESPACE="preview"
fi
echo "PUBLIC_SURREAL_NAMESPACE set to: $PUBLIC_SURREAL_NAMESPACE"

# need to make surreal-codegen a binary we can install here
# echo "Running query codegen..."
# bun sync:queries

echo "Running build..."
bun run build

echo "Running checks..."
bun check

echo "Running linter..."
bun lint

echo "All checks passed. Proceeding with database operations..."

echo "Importing schema..."
surreal import \
    --endpoint $PUBLIC_SURREAL_HOST \
    -u $SURREAL_USER \
    -p $SURREAL_PASS \
    --ns $PUBLIC_SURREAL_NAMESPACE \
    --db lumina \
    schema.surql

echo "Defining token..."
echo "DEFINE TOKEN lumina_token ON SCOPE users TYPE HS256 VALUE '$AUTH_SECRET'" | surreal sql \
    --endpoint $PUBLIC_SURREAL_HOST \
    -u $SURREAL_USER \
    -p $SURREAL_PASS \
    --ns $PUBLIC_SURREAL_NAMESPACE \
    --db lumina

echo "Deployment script completed successfully."
