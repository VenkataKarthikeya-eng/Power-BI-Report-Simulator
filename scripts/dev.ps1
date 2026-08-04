# Dashboard Capsule AI — Local Development Orchestration Script
Write-Host "🚀 Launching Dashboard Capsule AI Local Development Environment..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host "📋 Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

Write-Host "📦 Starting Turbo Monorepo Development Servers..." -ForegroundColor Green
npm run dev
