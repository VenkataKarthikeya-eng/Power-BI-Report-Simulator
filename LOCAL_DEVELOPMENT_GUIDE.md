# Dashboard Capsule AI — Local Development Guide

**Target Audience**: DevOps Engineers, Full Stack Developers, & Technical Evaluators  
**Scope**: Exact Repository Execution, Environment Configuration & Troubleshooting

---

## 📌 1. Prerequisites & Version Verification

Before running Dashboard Capsule AI on a fresh machine, verify that your local environment has the required runtimes and tools installed:

| Tool / Runtime | Minimum Version | Verification Command |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | `node -v` |
| **npm** | `>= 9.0.0` | `npm -v` |
| **Go** | `>= 1.21.0` | `go version` |
| **Python** | `>= 3.11.0` | `python --version` or `python3 --version` |
| **Docker** | `>= 24.0.0` | `docker --version` |
| **Docker Compose** | `>= 2.20.0` | `docker compose version` |

---

## 🔐 2. Environment Setup

The monorepo uses root `.env` configuration for service port mapping, database credentials, and cryptographic secret keys.

### Create Environment Configuration

- **Linux / macOS / Bash**:
  ```bash
  cp .env.example .env
  ```
- **Windows PowerShell**:
  ```powershell
  Copy-Item .env.example .env
  ```

### Mandatory Environment Variables

The following variables in `.env` are required for local runtime binding:

```ini
# Environment Mode
NODE_ENV=development
ENVIRONMENT=development

# Database URLs
DATABASE_URL="postgresql://dcaps_user:dcaps_secret_password@localhost:5432/dashboard_capsule_db?schema=public"
REDIS_URL="redis://localhost:6379"
MONGO_URL="mongodb://localhost:27017/dcaps_layouts"
VECTOR_DB_URL="http://localhost:6333"

# Security Secrets
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRY_SECONDS=900
```

---

## 🗄️ 3. Database Startup

Dashboard Capsule AI relies on four primary datastores defined in `docker-compose.yml`. You can spin them up using Docker Compose:

### Start Datastores Container Stack

```bash
docker-compose up -d postgres redis mongodb qdrant
```

### Verify Datastore Status

- **PostgreSQL 16**: Port `5432` (`postgresql://dcaps_user:dcaps_secret_password@localhost:5432/dashboard_capsule_db`)
- **Redis 7.2**: Port `6379`
- **MongoDB 7.0**: Port `27017`
- **Qdrant Vector DB**: Port `6333` (REST API & Dashboard at `http://localhost:6333/dashboard`)

---

## 📦 4. Dependency Installation

### Step A: Root Monorepo Node.js Dependencies

Run npm installation from the repository root directory:

```bash
npm install
```

### Step B: Python AI Core Dependencies

Initialize Python virtual environment and install FastAPI/LangChain requirements:

```bash
cd services/ai-core
python -m venv venv

# Linux / macOS:
source venv/bin/activate

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cd ../..
```

### Step C: Go Microservice Modules

Download module dependencies for Go backend services:

```bash
cd services/api-gateway && go mod download && cd ../..
cd services/auth-service && go mod download && cd ../..
cd services/import-engine && go mod download && cd ../..
cd services/capsule-builder && go mod download && cd ../..
cd services/analytics-service && go mod download && cd ../..
cd services/agent-orchestrator && go mod download && cd ../..
cd services/autonomous-intelligence && go mod download && cd ../..
cd services/dashboard-builder && go mod download && cd ../..
cd services/digital-twin && go mod download && cd ../..
cd services/realtime-service && go mod download && cd ../..
```

---

## ⚙️ 5. Backend Services Directory & Startup Commands

Each backend microservice is decoupled and can be launched individually:

| Service Name | Folder Path | Startup Command | Port | Health Check URL |
| :--- | :--- | :--- | :---: | :--- |
| **API Gateway** | `services/api-gateway` | `go run main.go` | `8080` | `http://localhost:8080/health` |
| **Auth Service** | `services/auth-service` | `go run main.go` | `8081` | `http://localhost:8081/health` |
| **Import Engine** | `services/import-engine` | `go run main.go` | `8082` | `http://localhost:8082/health` |
| **Capsule Builder** | `services/capsule-builder` | `go run main.go` | `8083` | `http://localhost:8083/health` |
| **Analytics Service** | `services/analytics-service` | `go run main.go` | `8084` | `http://localhost:8084/health` |
| **Notification Service**| `services/notification-service` | `npm run dev` | `8085` | `http://localhost:8085/health` |
| **Agent Orchestrator** | `services/agent-orchestrator` | `go run main.go` | `8086` | `http://localhost:8086/health` |
| **Realtime Service** | `services/realtime-service` | `go run main.go` | `8087` | `http://localhost:8087/health` |
| **Dashboard Builder** | `services/dashboard-builder` | `go run main.go` | `8088` | `http://localhost:8088/health` |
| **Digital Twin** | `services/digital-twin` | `go run main.go` | `8089` | `http://localhost:8089/health` |
| **Autonomous Intel.** | `services/autonomous-intelligence` | `go run main.go` | `8090` | `http://localhost:8090/health` |
| **AI Core (Python)** | `services/ai-core` | `uvicorn app.main:app --port 8000 --reload` | `8000` | `http://localhost:8000/health` |

---

## 🖥️ 6. Frontend Applications Directory & Startup Commands

| Application | Folder Path | Startup Command | Port | Local URL |
| :--- | :--- | :--- | :---: | :--- |
| **Landing Web** | `apps/landing-web` | `npm run dev -- --port 3000` | `3000` | `http://localhost:3000` |
| **App Dashboard** | `apps/app-dashboard` | `npm run dev -- --port 3001` | `3001` | `http://localhost:3001` |
| **Admin Portal** | `apps/admin-portal` | `npm run dev -- --port 3002` | `3002` | `http://localhost:3002` |
| **WASM Viewer** | `apps/viewer` | `npm run dev -- --port 3003` | `3003` | `http://localhost:3003` |

---

## 🚀 7. Recommended Development Modes

### Option A: Single-Command Monorepo Orchestration (Recommended for UI & Frontend Dev)

Run Turborepo's unified development pipeline from the root directory:

```bash
npm run dev
```

This starts all Next.js applications (`landing-web`, `app-dashboard`, `admin-portal`, `viewer`) concurrently with hot reloading. Note that frontends feature built-in client-side simulation fallbacks, allowing complete end-to-end user workflows even when Go microservices are offline.

### Option B: Targeted Terminal Execution (Recommended for Full-Stack & Microservices Dev)

- **Terminal 1 (Datastores)**: `docker-compose up -d postgres redis mongodb qdrant`
- **Terminal 2 (API Gateway)**: `cd services/api-gateway && go run main.go`
- **Terminal 3 (AI Core)**: `cd services/ai-core && uvicorn app.main:app --port 8000 --reload`
- **Terminal 4 (App Dashboard)**: `npm run dev`

---

## 🐳 8. Full Docker Containerization

To run the entire platform (Datastores, Go services, Python AI Core, and Next.js applications) fully containerized:

```bash
# 1. Build and launch all containers in detached mode
docker-compose up --build -d

# 2. Check running container status
docker-compose ps

# 3. View logs for a specific service
docker-compose logs -f app-dashboard
docker-compose logs -f api-gateway
docker-compose logs -f ai-core

# 4. Tear down container stack
docker-compose down
```

---

## ✅ 9. Verification Checklist

After launching the application, verify that key endpoints and interfaces are healthy:

1. **Self-Guided App Dashboard**: Open `http://localhost:3001` — Verify 4-step welcome onboarding modal displays.
2. **Demo Mode Verification**: Click **"✨ Explore Demo Workspace"** on the top header of `http://localhost:3001` — Verify pre-populated Q3 Logistics dashboard and capsules load.
3. **API Gateway Health**: Visit `http://localhost:8080/health` — Expect `{"status":"UP","service":"api-gateway","version":"1.0.0"}`.
4. **AI Core OpenAPI Docs**: Visit `http://localhost:8000/docs` — Expect FastAPI Swagger UI.
5. **Qdrant Vector Dashboard**: Visit `http://localhost:6333/dashboard`.

---

## 🔧 10. Troubleshooting

### Port Conflicts (`EADDRINUSE`)
If port `3001` or `8080` is already in use:
- **Windows PowerShell**:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
  ```
- **Linux / macOS**:
  ```bash
  lsof -ti:3001 | xargs kill -9
  ```

### SWC Lockfile Patch Warnings in Next.js
If Next.js logs `⚠ Found lockfile missing swc dependencies, patching...` during build:
- This is an automatic telemetry/SWC lockfile patch notice in Next.js monorepos when running offline. It does not affect application functionality or static page compilation.

### Python Module Import Errors in `ai-core`
Ensure your virtual environment is active before running `uvicorn`:
```bash
cd services/ai-core
source venv/bin/activate # or .\venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
```
