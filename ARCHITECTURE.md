# System Architecture — Dashboard Capsule AI Version 2.0

## 1. High-Level Enterprise System Topology

```mermaid
graph TD
    Client[Web Browser / WASM Viewer Runtime] --> Gateway[API Gateway :8080]

    subgraph Microservices Cluster
        Gateway --> Auth[Auth Service :8081]
        Gateway --> Ingest[Import Engine :8082]
        Gateway --> Builder[Capsule Builder :8083]
        Gateway --> Analytics[Analytics Service :8084]
    end

    subgraph AI Core Cluster
        Gateway --> AICore[Python FastAPI AI Core :8000]
        AICore --> Agents[Multi-Agent Intelligence Swarm]
        AICore --> RAG[RAG Vector Retriever]
        AICore --> GenBuilder[Generative Dashboard Builder]
    end

    subgraph Storage & Infrastructure
        Auth --> Postgres[(PostgreSQL DB)]
        Analytics --> ClickHouse[(ClickHouse Columnar Event Store)]
        Builder --> S3[(AWS S3 Capsule Vault)]
        Builder --> KMS[AWS KMS Key Management]
    end
```

---

## 2. Security Architecture

- **Authentication**: BCrypt ($cost=12$) password hashing with RS256 RSA JWT issuance & token rotation.
- **Capsule Encryption**: AES-256-GCM KMS Envelope Encryption.
- **Digital Signatures**: ECDSA P-384 hardware-backed cryptographic signing.
- **Canvas Security**: Dynamic SVG watermark overlay + read-only canvas interaction locks.

---

## 3. WebAssembly Client Execution Pipeline

```
.dcaps Package ──► Signature Verification ──► AES-256 Decryption ──► WASM Canvas Memory ──► Interactivity Engine
```
