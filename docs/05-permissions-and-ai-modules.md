# Deliverable 9 & 10: Granular Permission Matrix & AI Engine Blueprint

## 1. Role-Based & Attribute-Based Access Control (RBAC/ABAC) Matrix

The system enforces 8 distinct organizational roles. Operations are authorized at the API Gateway via JWT claims and spatial workspace memberships.

| System Action / Resource Permission | Super Admin | Org Admin | Developer | Analyst | Viewer | HR | Guest | External User |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage Tenant & Billing** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Configure SAML SSO / SCIM** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Manage Users & Role Grants** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Immutable Audit Logs** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅* | ❌ | ❌ |
| **Create & Delete Workspaces** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Import PBIX / PBIT Files** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Run AI Validation & Opt** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Compile & Generate `.dcaps`** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Create & Revoke Share Links** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Dashboard WASM Runtime**| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Interact with AI Copilot** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Use AI Voice Assistant** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Export Data & Visual Images** | ✅ | ✅ | ✅ | ✅ | ❌* | ❌* | ❌ | ❌ |
| **View AI Documentation Engine**| ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

*\*HR role accesses Audit Logs strictly for HR workspace events; Viewer/HR Export capabilities subject to ABAC link policy flags.*

---

## 2. Comprehensive AI Engine Sub-Modules Architecture

```
                                  +---------------------------------------+
                                  |     CENTRAL AI ORCHESTRATOR           |
                                  +---------------------------------------+
                                                      |
    +-------------------+-------------------+---------+---------+-------------------+-------------------+
    |                   |                   |                   |                   |                   |
    v                   v                   v                   v                   v                   v
[Validation AI]   [Optimization AI]   [Health AI]        [Doc Engine]       [Copilot RAG]       [Voice & Speech]
 (DAX AST Linting) (VertiPaq Re-index) (Multidim Vector)  (Data Lineage DAG) (Qdrant Vector DB)  (Whisper Engine)
```

### 2.1 Sub-Engine 1: Validation AI Engine
* **Purpose**: Parse raw VertiPaq schema & DAX expressions to identify anti-patterns, missing foreign keys, circular relationships, and syntax errors.
* **Core Logic**:
  - Traverses the AST looking for scalar DAX evaluation bottlenecks (e.g., `FILTER(ALL(Table))` without `KEEPFILTERS`).
  - Verifies visual color contrast ratios against WCAG 2.1 standards.

### 2.2 Sub-Engine 2: AI Optimization Engine
* **Purpose**: Automatically refactor inefficient DAX, optimize dictionary encoding cardinality, and propose visual layout aggregations.
* **Core Logic**:
  - Rewrites multi-nested `CALCULATE` measures into simplified storage engine syntax.
  - Strips unreferenced columns and high-cardinality timestamps from the VertiPaq dictionary before WASM DuckDB compilation.

### 2.3 Sub-Engine 3: Health Scoring AI
* **Purpose**: Generate a 0-100 multidimensional health index.
* **Mathematical Weight Vector**:
  $$H = 0.40 \cdot \text{Performance} + 0.30 \cdot \text{Security} + 0.15 \cdot \text{Design} + 0.15 \cdot \text{Accessibility}$$

### 2.4 Sub-Engine 4: AI Documentation Engine
* **Purpose**: Eliminate manual report documentation by auto-generating Markdown guides and visual lineage DAG graphs.
* **Outputs**:
  - Executive Business Summary.
  - Data Dictionary & Metric Calculation Lineage.
  - Compliance & Data Privacy Exposure Report.

### 2.5 Sub-Engine 5: AI Copilot (Natural Language Query) Engine
* **Purpose**: Enable natural language chat exploration over active dashboard views.
* **Architecture**: RAG over Qdrant Vector DB storing dataset schemas and table semantics $\rightarrow$ LLM generates DuckDB SQL $\rightarrow$ Client WASM executes filter query (<30ms).

### 2.6 Sub-Engine 6: Recommendation AI Engine
* **Purpose**: Recommend optimal visual chart types based on data field types and cardinality.

### 2.7 Sub-Engine 7: Voice AI Assistant
* **Purpose**: Real-time hands-free speech-to-text processing for dashboard filtering.
* **Stack**: Client-side Whisper WebAssembly model with streaming audio chunking.

### 2.8 Sub-Engine 8: Predictive Analytics AI
* **Purpose**: Run lightweight time-series forecasting (Prophet/Holt-Winters) over active visual metrics directly inside browser WebAssembly.
