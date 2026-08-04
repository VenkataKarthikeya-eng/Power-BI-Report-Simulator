# Dashboard Capsule AI — Enterprise Autonomous BI Platform

[![Version](https://img.shields.io/badge/Version-2.0.0--Certified-emerald.svg)](./docs/RELEASE_NOTES_V2.0.md)
[![License](https://img.shields.io/badge/License-Enterprise--Commercial-indigo.svg)](#license)
[![Build Status](https://img.shields.io/badge/Turborepo-11%2F11%20Passing-brightgreen.svg)](#build-status)

**Dashboard Capsule AI** is a universal, portable, AI-native Business Intelligence platform. It converts heavy Power BI (`.pbix`) and multi-BI reports into secure, standalone **Dashboard Capsules (`.dcaps`)** capable of running anywhere via client-side WebAssembly without Power BI Desktop licenses.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Local Setup](#-local-setup)
- [Docker Setup](#-docker-setup)
- [Deployment Instructions](#-deployment-instructions)
- [Documentation](#-documentation)

---

## 🌟 Overview

Dashboard Capsule AI revolutionizes business intelligence by eliminating vendor lock-in, recurring per-user licensing fees, and desktop hardware requirements. By parsing legacy reports (Power BI `.pbix`, Tableau, Looker) into open JSON ASTs, Dashboard Capsule AI compiles dashboards into encrypted, self-contained binary capsules (`.dcaps`) that execute zero-latency queries directly inside client browsers using DuckDB WebAssembly.

---

## ✨ Features

- 🤖 **Autonomous Multi-Agent Swarm**: Specialized AI agents (Data Analyst, DAX Specialist, UX Designer, Security Auditor) automatically audit and optimize dashboards.
- ⚡ **Client-Side WASM Engine**: High-performance DuckDB WASM query execution with sub-50ms render times.
- 🔒 **Enterprise Security & Cryptography**: Envelope encryption using AWS KMS (AES-256-GCM) and hardware-backed ECDSA P-384 digital signatures.
- 🔮 **Digital Twin Scenario Simulator**: Run interactive Monte Carlo What-If projections directly in-browser on client data models.
- 📊 **Real-Time ClickHouse Analytics**: Live visual heatmaps, user interaction telemetry, and query latency monitoring.
- 🔌 **Multi-BI Plugin SDK (`@dcaps/sdk`)**: Universal BI provider adapters for Power BI, Tableau, Looker, Qlik, Superset, and Metabase.

---

## 🏗 Architecture

```
                      +----------------------------------+
                      |         User / Web Client        |
                      +----------------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
        +---------------------+                 +---------------------+
        |  apps/landing-web   |                 | apps/app-dashboard  |
        |   (Marketing Portal)|                 | (Enterprise Workspace|
        |     [Port 3000]     |                 |     [Port 3001]     |
        +---------------------+                 +---------------------+
                   |                                       |
                   +-------------------+-------------------+
                                       |
                            +--------------------+
                            | services/api-gateway|
                            | (Go Gateway Proxy) |
                            |     [Port 8080]    |
                            +--------------------+
                                       |
        +------------------+-----------+-----------+-------------------+
        |                  |                       |                   |
+---------------+  +---------------+       +---------------+   +---------------+
| services/     |  | services/     |       | services/     |   | services/     |
| auth-service  |  | import-engine |       | capsule-builder|   | ai-core       |
|  (Go Auth)    |  |  (Go PBIX)    |       | (Go Builder)  |   | (Python Fast) |
|  [Port 8081]  |  |  [Port 8082]  |       |  [Port 8083]  |   |  [Port 8000]  |
+---------------+  +---------------+       +---------------+   +---------------+
        |                  |                       |                   |
  +-----------+      +-----------+           +-----------+       +-----------+
  | PostgreSQL|      | MongoDB   |           | Redis     |       | Qdrant    |
  +-----------+      +-----------+           +-----------+       +-----------+
```

### Monorepo Structure

- `apps/landing-web`: Public Marketing Portal — Next.js / React (Port 3000)
- `apps/app-dashboard`: Core Enterprise Dashboard Workspace — Next.js / React (Port 3001)
- `apps/admin-portal`: Enterprise Control Center & System Administration (Port 3002)
- `apps/viewer`: Standalone Client-side WASM Canvas Viewer (Port 3003)
- `services/api-gateway`: Go Reverse Proxy & Gateway Router (Port 8080)
- `services/ai-core`: Python FastAPI Multi-Agent AI Engine (Port 8000)
- `services/auth-service`: Go Authentication & Access Management (Port 8081)
- `services/import-engine`: Go PBIX/Multi-BI Parser & AST Converter (Port 8082)
- `services/capsule-builder`: Go Capsule Binary Compiler & Encryption Engine (Port 8083)
- `services/analytics-service`: Go ClickHouse Telemetry & Analytics Service (Port 8084)
- `infra/docker`: Central Docker Compose & Container Orchestration configurations

---

## 💻 Tech Stack

- **Monorepo Management**: Turborepo, npm workspaces
- **Frontend Frameworks**: Next.js, React, TypeScript, Tailwind CSS, DuckDB WASM
- **Backend Services**: Go (Gin / Chi), Python 3.11 (FastAPI, PyTorch, LangChain, Qdrant Client)
- **Databases & Caching**: PostgreSQL 16, MongoDB 7.0, Redis 7.2, Qdrant Vector DB, ClickHouse
- **Infrastructure & Containerization**: Docker, Docker Compose, Kubernetes, Terraform

---

## 🛠 Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Go**: v1.21 or higher
- **Python**: v3.11 or higher

### Step-by-Step Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/VenkataKarthikeya-eng/dashboard-capsule-ai.git
   cd dashboard-capsule-ai
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

3. **Install Monorepo Dependencies**
   ```bash
   npm install
   ```

4. **Verify TypeScript & Typecheck**
   ```bash
   npx tsc --noEmit
   ```

5. **Start Local Development Services**
   ```bash
   npm run dev
   ```

   The services will be accessible at:
   - Landing Web: http://localhost:3000
   - Dashboard App: http://localhost:3001
   - Admin Portal: http://localhost:3002
   - Viewer: http://localhost:3003
   - API Gateway: http://localhost:8080
   - AI Core: http://localhost:8000

---

## 🐳 Docker Setup

You can run the full Dashboard Capsule AI stack locally with Docker Compose:

1. **Build and start all containerized services**
   ```bash
   docker-compose up --build -d
   ```

2. **Verify container status**
   ```bash
   docker-compose ps
   ```

3. **Tail logs across services**
   ```bash
   docker-compose logs -f
   ```

4. **Stop containers**
   ```bash
   docker-compose down
   ```

---

## 🚀 Deployment Instructions

### Monorepo Production Build
To create optimized production builds for all web applications and packages:

```bash
npm run build
```

### Docker Container Orchestration
For containerized deployments to staging or production:
- Pre-built images can be published to AWS ECR, Docker Hub, or GCP Artifact Registry.
- Deployment manifests for Kubernetes can be found in [`infra/kubernetes`](./infra/kubernetes).

### Cloud Infrastructure
Automated Terraform scripts for cloud resource allocation (AWS / GCP) are maintained in [`infra/terraform`](./infra/terraform).

---

## 📜 Documentation

- [Release Notes v2.0](./docs/RELEASE_NOTES_V2.0.md)
- [System Architecture](./ARCHITECTURE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Developer Setup Guide](./DEVELOPER_SETUP.md)
- [Security Policy](./SECURITY.md)

---

## 📄 License

Enterprise Commercial License — see [LICENSE](./LICENSE) for details.
