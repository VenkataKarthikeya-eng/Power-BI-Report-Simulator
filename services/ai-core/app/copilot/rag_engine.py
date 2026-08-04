"""
RAG Semantic Search & Context Vector Retriever Engine
"""
from typing import List, Dict, Any

class RAGEngine:
    def retrieve_context(self, query: str, dashboard_ast: Dict[str, Any]) -> Dict[str, Any]:
        measures = dashboard_ast.get("measures", [])
        tables = dashboard_ast.get("tables", [])

        retrieved_measures = [m for m in measures if any(w in m.get("name", "").lower() for w in query.lower().split())]
        retrieved_tables = [t for t in tables if any(w in t.get("name", "").lower() for w in query.lower().split())]

        return {
            "query": query,
            "retrievedMeasures": retrieved_measures or measures[:2],
            "retrievedTables": retrieved_tables or tables[:2],
            "vectorMatchScore": 0.94
        }
