# Deliverable 13: AI Copilot RAG Architecture & Provider Specification

## 1. Executive Summary & RAG Pipeline

The **AI Copilot & Natural Language Engine** operates over vector embeddings derived from active `.dcaps` AST metadata, DAX measures, validation reports, and telemetry interaction history.

```mermaid
graph TD
    UserQuery[User Natural Language Query] --> Embed[Vector Embedding Generator]
    Embed --> VectorDB[DuckDB / Pinecone Vector Store]
    
    VectorDB --> RAGRetriever[RAG Context Retriever: DAX Measures & Schema AST]
    RAGRetriever --> PromptBuilder[Prompt Builder & Context Injector]

    PromptBuilder --> ProviderInterface[LLM Provider Abstraction Layer]
    ProviderInterface --> OpenAI[OpenAI API Provider]
    ProviderInterface --> Anthropic[Anthropic Claude API]
    ProviderInterface --> LocalLLM[Local LLM / Mock Engine]

    ProviderInterface --> AIResponse[Conversational Business Answer]
```

---

## 2. LLM Provider Abstraction Layer

```python
class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_response(self, prompt: str, context: Dict[str, Any]) -> str:
        pass
```

Supports seamless runtime switching between `OPENAI`, `ANTHROPIC`, `AZURE_OPENAI`, and `LOCAL_LLM` providers without modifying core application logic.

---

## 3. Security & Prompt Injection Mitigation

- **Context Isolation**: AST schema data is sanitized prior to context injection.
- **RBAC Enforcement**: The RAG retriever filters vector embeddings based on user role permissions (e.g. non-admin users cannot retrieve salary/compensation measures).
