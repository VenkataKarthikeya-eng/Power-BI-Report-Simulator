# Deliverable 7 & 8: API Blueprint & Database Schema Blueprint

## 1. REST API Blueprint Specification

All endpoints are versioned under `/api/v1` and require TLS 1.3 encryption. Authentication requires standard HTTP Header: `Authorization: Bearer <JWT_ACCESS_TOKEN>`.

### 1.1 Authentication & IAM Module APIs
- `POST /api/v1/auth/login`: Authenticate email/password, return access & refresh JWTs.
- `POST /api/v1/auth/sso/saml`: Initiate SAML 2.0 IdP authentication flow.
- `POST /api/v1/auth/mfa/verify`: Validate 6-digit TOTP / SMS MFA code.
- `POST /api/v1/auth/refresh`: Exchange valid refresh token for new short-lived access JWT.
- `POST /api/v1/auth/logout`: Invalidate current session and revoke refresh token in Redis.

### 1.2 Workspace & Organization Management APIs
- `GET /api/v1/organizations/current`: Fetch active tenant details, subscription limits, and settings.
- `PUT /api/v1/organizations/current`: Update tenant settings (Admin only).
- `GET /api/v1/workspaces`: List workspaces accessible to current user.
- `POST /api/v1/workspaces`: Create new workspace within active organization.
- `GET /api/v1/workspaces/{workspace_id}/members`: List workspace members and assigned RBAC roles.
- `POST /api/v1/workspaces/{workspace_id}/members`: Invite new user to workspace.

### 1.3 Dashboard Ingestion & Parsing APIs
- `POST /api/v1/workspaces/{workspace_id}/dashboards/import`: Upload `.pbix` / `.pbit` binary file stream. Returns async `job_id`.
- `GET /api/v1/jobs/{job_id}/status`: Poll status of ingestion, parsing, and AI optimization pipeline.
- `GET /api/v1/jobs/{job_id}/validation`: Retrieve AI validation report and linting findings.
- `POST /api/v1/jobs/{job_id}/optimize`: Trigger AI optimization refactoring step.

### 1.4 Capsule Compiler & Management APIs
- `POST /api/v1/jobs/{job_id}/build`: Package AST into `.dcaps` binary container.
- `GET /api/v1/dashboards/{dashboard_id}`: Fetch dashboard metadata, version history, and active capsule details.
- `GET /api/v1/capsules/{capsule_id}/download`: Download compiled `.dcaps` static file (Authorized users).
- `DELETE /api/v1/dashboards/{dashboard_id}`: Soft-delete dashboard and revoke all associated `.dcaps` capsules.

### 1.5 Secure Viewer Runtime & Decryption APIs
- `GET /api/v1/viewer/capsule/{share_token}`: Fetch public capsule manifest & encrypted payload metadata.
- `POST /api/v1/viewer/capsule/{share_token}/key`: Perform key handshake with passcode verification; returns short-lived ephemeral decryption key.

### 1.6 AI Engine APIs (Copilot, Health, Documentation)
- `POST /api/v1/ai/copilot/query`: Send natural language / voice prompt to AI Copilot; returns generated DuckDB SQL & filter DTO.
- `GET /api/v1/dashboards/{dashboard_id}/health`: Fetch latest 0-100 Health Index breakdown and recommendations.
- `GET /api/v1/dashboards/{dashboard_id}/documentation`: Retrieve auto-generated Markdown documentation & schema lineage.

### 1.7 Sharing & Access Control APIs
- `POST /api/v1/dashboards/{dashboard_id}/shares`: Create new secure share link with passcode/expiry/ABAC rules.
- `GET /api/v1/dashboards/{dashboard_id}/shares`: List all active share links for a dashboard.
- `DELETE /api/v1/shares/{share_id}`: Immediately revoke a share link.

### 1.8 Audit Logs & Telemetry APIs
- `GET /api/v1/admin/audit-logs`: Query ClickHouse audit log index with filtering parameters (actor, timeframe, event_type).
- `POST /api/v1/telemetry/events`: Ingest client WASM view and interaction events (Batch payload).

---

## 2. Complete Database Schema Blueprint (PostgreSQL 16)

```sql
-- PostgreSQL Core Schema Definition for Dashboard Capsule AI Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORGANIZATIONS TABLE
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE_TRIAL',
    max_users INT NOT NULL DEFAULT 50,
    max_storage_gb INT NOT NULL DEFAULT 500,
    security_policy JSONB NOT NULL DEFAULT '{"mfa_required": true, "sso_only": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- 2. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    system_role VARCHAR(50) NOT NULL DEFAULT 'DEVELOPER',
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_org_email ON users(organization_id, email);

-- 3. WORKSPACES TABLE
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_workspaces_org ON workspaces(organization_id);

-- 4. WORKSPACE MEMBERSHIPS TABLE
CREATE TABLE workspace_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);

-- 5. DASHBOARDS TABLE
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pbix_fingerprint_sha256 CHAR(64) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    current_version_number VARCHAR(20) DEFAULT '1.0.0',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dashboards_workspace ON dashboards(workspace_id);

-- 6. DASHBOARD VERSIONS TABLE
CREATE TABLE dashboard_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    commit_message TEXT NOT NULL,
    mongo_layout_ast_id VARCHAR(50) NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dashboard_versions_dash ON dashboard_versions(dashboard_id);

-- 7. CAPSULES TABLE (.dcaps artifacts)
CREATE TABLE capsules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID NOT NULL REFERENCES dashboard_versions(id) ON DELETE CASCADE,
    s3_bucket VARCHAR(100) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    ecdsa_signature TEXT NOT NULL,
    kms_key_arn VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_capsules_version ON capsules(version_id);

-- 8. SHARED LINKS TABLE
CREATE TABLE shared_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    share_token VARCHAR(100) NOT NULL UNIQUE,
    passcode_hash VARCHAR(255),
    is_passcode_protected BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_domains JSONB DEFAULT '[]',
    watermark_text VARCHAR(255),
    allow_export BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_shared_links_token ON shared_links(share_token);

-- 9. HEALTH REPORTS TABLE
CREATE TABLE health_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    overall_score INT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    performance_score INT NOT NULL,
    security_score INT NOT NULL,
    design_score INT NOT NULL,
    accessibility_score INT NOT NULL,
    findings_json JSONB NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_health_reports_dash ON health_reports(dashboard_id);
```
