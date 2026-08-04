# Deliverable 18: Multi-BI Platform, Plugin SDK & Extensibility Specification

## 1. Executive Summary & Plugin Architecture

**Dashboard Capsule AI** provides a modular, BI-agnostic architecture. While Power BI is the initial native provider, third-party developers can build custom BI adapters, custom WASM visuals, custom AI models, and webhook integrations using `@dcaps/sdk`.

```mermaid
graph TD
    PBI[Microsoft Power BI Engine] --> CoreAdapter[BI Provider Adapter Layer]
    Tableau[Tableau Adapter Plugin] --> CoreAdapter
    Looker[Looker LookML Adapter Plugin] --> CoreAdapter
    Qlik[Qlik Sense Adapter Plugin] --> CoreAdapter

    CoreAdapter --> AST[Standardized Dashboard AST]
    AST --> SDK[@dcaps/sdk Extension Pipeline]

    SDK --> CustomVisuals[Custom Visuals & 3D Charts]
    SDK --> Webhooks[Slack / Teams / Webhook Subscriptions]
```

---

## 2. BI Provider Adapter Interface (`@dcaps/sdk`)

Third-party developers implement the `BIProviderAdapter` contract:

```typescript
export interface BIProviderAdapter {
  providerType: 'POWER_BI' | 'TABLEAU' | 'LOOKER' | 'QLIK_SENSE' | 'APACHE_SUPERSET';
  parseReportToAST(fileBuffer: ArrayBuffer): Promise<DashboardAST>;
}
```

---

## 3. Webhook HMAC Signature Verification

All webhook payload deliveries include an `X-Dcaps-Signature` header calculated using HMAC-SHA256:

$$\text{Header} = \text{HMAC-SHA256}(\text{PayloadBytes}, \text{SecretToken})$$
