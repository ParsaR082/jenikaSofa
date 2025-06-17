# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "Starting PostgreSQL database setup..." -ForegroundColor Green

# Start PostgreSQL in Docker if not already running
if (-not (docker ps | Select-String -Pattern "mobleman_postgres")) {
    Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "PostgreSQL container is already running." -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Seed the database
Write-Host "Seeding the database..." -ForegroundColor Yellow
npx prisma db seed

Write-Host "Database setup complete!" -ForegroundColor Green 