# Monorepo Project Structure — Dashboard Capsule AI

```
dashboard-capsule-ai/
├── apps/
│   ├── admin-portal/        # Next.js App Router — Enterprise Control Center (:3002)
│   ├── app-dashboard/       # Next.js App Router — Authenticated Workspace (:3001)
│   ├── landing-web/         # Next.js App Router — Public Marketing & Docs (:3000)
│   └── viewer/              # React WASM Canvas Viewer Runtime (:3003)
├── packages/
│   ├── sdk/                 # Third-Party Plugin SDK (@dcaps/sdk)
│   ├── types/               # Shared TypeScript DTOs (@dcaps/types)
│   └── ui/                  # Tailwind Design System Primitives (@dcaps/ui)
├── services/
│   ├── ai-core/             # Python FastAPI — Validation, Optimization, Copilot, Health (:8000)
│   ├── analytics-service/   # Go — ClickHouse Columnar Telemetry Engine (:8084)
│   ├── api-gateway/         # Go — Reverse Proxy & Rate Limiter (:8080)
│   ├── auth-service/        # Go — Enterprise Auth, RBAC & Admin Handlers (:8081)
│   ├── capsule-builder/     # Go — Gzip / AES-256 / ECDSA Compiler & Sharing (:8083)
│   └── import-engine/       # Go — PBIX VertiPaq & Layout AST Extractor (:8082)
├── deployments/
│   ├── docker/              # Dockerfiles for microservices
│   └── helm/                # Enterprise Kubernetes Helm Chart
├── docs/                    # 21 Architectural Specifications & Reports
├── scripts/                 # Utility scripts & Demo Data Generators
├── terraform/               # AWS Multi-Cloud Terraform Infrastructure
├── tests/                   # End-to-End Integration Test Suites
├── docker-compose.yml       # Production Multi-Service Orchestra
└── turbo.json               # Turborepo Monorepo Build Pipeline
```
