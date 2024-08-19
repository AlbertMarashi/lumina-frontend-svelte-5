#!/bin/bash
# This script is used to deploy the project to Vercel.

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Install SurrealDB
echo "Installing SurrealDB..."
curl -L https://install.surrealdb.com | sh

# 2. Set SURREAL_NAMESPACE based on VERCEL_GIT_COMMIT_REF
if [[ $VERCEL_GIT_COMMIT_REF == "main" ]]; then
    SURREAL_NAMESPACE="main"
else
    SURREAL_NAMESPACE="preview"
fi
echo "SURREAL_NAMESPACE set to: $SURREAL_NAMESPACE"

# 3. Run codegen for queries
echo "Running query codegen..."
bun sync:queries

# 4. Run build
echo "Running build..."
bun run build

# 5. Run check
echo "Running checks..."
bun check

# 6. Run lint
echo "Running linter..."
bun lint

# 7. If all checks pass, proceed with database operations
echo "All checks passed. Proceeding with database operations..."

# 8. Import schema
echo "Importing schema..."
surreal import \
    --endpoint $PUBLIC_SURREAL_HOST \
    -u $SURREAL_USER \
    -p $SURREAL_PASS \
    --ns $SURREAL_NAMESPACE \
    --db lumina \
    schema.surql

# 9. Define token
echo "Defining token..."
echo "DEFINE TOKEN lumina_token ON SCOPE users TYPE HS256 VALUE '$AUTH_SECRET'" | surreal sql \
    --endpoint $PUBLIC_SURREAL_HOST \
    -u $SURREAL_USER \
    -p $SURREAL_PASS \
    --ns $SURREAL_NAMESPACE \
    --db lumina

echo "Deployment script completed successfully."
