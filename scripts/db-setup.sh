#!/bin/bash

# Exit on error
set -e

echo "Starting PostgreSQL database setup..."

# Start PostgreSQL in Docker if not already running
if ! docker ps | grep -q mobleman_postgres; then
  echo "Starting PostgreSQL container..."
  docker-compose up -d postgres
  
  # Wait for PostgreSQL to be ready
  echo "Waiting for PostgreSQL to be ready..."
  sleep 10
else
  echo "PostgreSQL container is already running."
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "Seeding the database..."
npx prisma db seed

echo "Database setup complete!" 