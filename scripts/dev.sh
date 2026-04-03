#!/bin/bash

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""


# Start development environment
docker compose -f docker-compose.dev.yml up --build -d

# Run migrations with Drizzle
echo "📜 Applying latest schema with Drizzle..."
# IMPORTANT: For raw TCP connections (which drizzle-kit uses), the 
# neon-local container ONLY accepts the default 'neon:npg' credentials.
# Your backend can use neondb_owner via HTTP, but TCP migrations must use neon:npg!
DATABASE_URL="postgresql://neon:npg@localhost:5432/neondb" npm run db:migrate

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:4000"
echo "   Database: postgresql://neondb_owner:ud2bNkchM7sX@localhost:5432/neondb"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"