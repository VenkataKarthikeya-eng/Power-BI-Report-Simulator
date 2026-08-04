# Security Policy & Vulnerability Disclosure

Dashboard Capsule AI Version 1.0.0 prioritizes zero-trust cryptographic security, multi-tenant isolation, and complete data privacy for enterprise deployment.

## Supported Versions

| Version | Supported | Security Updates | Critical Patches |
| :--- | :---: | :---: | :---: |
| **1.0.x (LTS)** | ✅ | ✅ | ✅ |
| `< 1.0.0` | ❌ | ❌ | ❌ |

## Security Architecture Highlights

1. **AES-256-GCM Ephemeral Payload Encryption**: All compiled `.dcaps` binary packages utilize unique 256-bit AES data encryption keys (DEK) generated via CSPRNG `crypto/rand`.
2. **ECDSA P-384 Digital Signatures**: Every capsule artifact is cryptographically signed to prevent unauthorized payload tampering.
3. **Role-Based Access Control (RBAC)**: Strict permission boundaries enforce multi-tenant isolation across Org Admin, Developer, Business Analyst, Viewer, HR, Guest, and External roles.
4. **JWT Session Hardening**: Access tokens expire in 15 minutes, coupled with cryptographically secure refresh token rotation.

## Reporting a Vulnerability

If you discover a security vulnerability within Dashboard Capsule AI, please follow our responsible disclosure policy:

1. **Do NOT open a public GitHub issue.**
2. Send a detailed report via encrypted email to **security@capsule.ai**.
3. Include step-by-step reproduction steps, proof-of-concept payload, and affected component names.
4. The Dashboard Capsule AI Security Response Team will acknowledge your report within **24 hours** and provide a patch timeline within **72 hours**.

We request that you keep all information regarding the vulnerability confidential until we issue an official patch and public advisory.
