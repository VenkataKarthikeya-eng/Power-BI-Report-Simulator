# Enterprise Administrator & Developer Operational Guides

---

## Part 1: Organization Administrator Guide

### 1. Organization Setup & Member Management
1. Navigate to **Organization Settings & IAM** in the main workspace portal (`http://localhost:3001/org/settings`).
2. Invite new team members by entering work email address and selecting the appropriate RBAC role:
   - **ORG_ADMIN**: Full tenant access, billing, user management, and capsule builder permissions.
   - **DEVELOPER**: Dashboard ingestion, compilation, and sharing permissions.
   - **BUSINESS_ANALYST**: Dashboard viewing, cross-filtering, and sharing link creation.
   - **VIEWER**: Read-only dashboard viewing.

### 2. Feature Flags & System Health Monitoring
Org Admins can view cluster performance metrics and toggle feature flags via the **Admin Portal** (`http://localhost:3002`):
- Monitor CPU, RAM memory usage, P99 API latency, and active WebAssembly viewer sessions.
- Control rollout of new AI engines (`ai_copilot_v2`, `wasm_simd_canvas`).

---

## Part 2: Developer & Plugin SDK Guide

### 1. Developing Custom BI Adapters using `@dcaps/sdk`
The Plugin SDK allows developers to extend Dashboard Capsule AI to support additional BI formats (e.g. Tableau, Looker, ThoughtSpot).

```typescript
import { BIProviderAdapter, RegisterAdapterOptions } from '@dcaps/sdk';

export class TableauProviderAdapter implements BIProviderAdapter {
  id = 'tableau-twbx';
  name = 'Tableau Adapter';

  async parse(fileBuffer: Buffer) {
    // Extract Tableau TWBX XML and data model schema
    return {
      pages: [],
      tables: [],
      measures: [],
    };
  }
}
```

---

## Part 3: Operations & Deployment Manual

### Docker Compose Local Deployment
```bash
docker-compose -f infra/docker-compose.yml up -d
```

### Kubernetes Helm Deployment
```bash
helm install dcaps-platform infra/k8s/charts/dcaps-platform
```
