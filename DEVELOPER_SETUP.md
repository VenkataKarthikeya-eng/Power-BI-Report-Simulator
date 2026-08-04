# Developer Setup & Onboarding Guide

## Environment Setup

### 1. Repository Setup
```bash
git clone https://github.com/dashboard-capsule-ai/monorepo.git
cd dashboard-capsule-ai
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Setup (PostgreSQL & Prisma)
To run local datastores using Docker:
```bash
cd infra/docker
docker-compose up -d postgres redis mongodb qdrant
```

To run Prisma database migrations and seed data:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Running Microservices Individually

#### AI Core (Python FastAPI)
```bash
cd services/ai-core
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Go Microservices (API Gateway, Auth, Import Engine)
```bash
cd services/api-gateway
go run main.go
```

#### Node.js Workspace Apps
```bash
npm run dev
```
