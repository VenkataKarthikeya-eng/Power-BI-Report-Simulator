import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.copilot.providers import get_llm_provider
from app.copilot.rag_engine import RAGEngine
from app.copilot.insight_engine import InsightEngine

router = APIRouter(prefix="/api/v1/copilot", tags=["AI Copilot & Natural Language Analytics"])

rag = RAGEngine()
insights = InsightEngine()
chat_history_db = []

@router.post("/chat")
def copilot_chat(payload: Dict[str, Any]):
    message = payload.get("message", "")
    dash_id = payload.get("dashboardId", "dash_3c91a02b")
    provider_type = payload.get("provider", "LOCAL_LLM")

    provider = get_llm_provider(provider_type)
    rag_context = rag.retrieve_context(message, {"id": dash_id})
    ai_text = provider.generate_response(message, rag_context)

    msg_id = f"msg_{uuid.uuid4().hex[:10]}"
    chat_entry = {
        "id": msg_id,
        "role": "assistant",
        "content": ai_text,
        "retrievedContextCount": len(rag_context.get("retrievedMeasures", [])),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    chat_history_db.append(chat_entry)

    return {"success": True, "data": chat_entry}

@router.post("/explain")
def copilot_explain(payload: Dict[str, Any]):
    dash_id = payload.get("dashboardId", "dash_3c91a02b")
    visual_id = payload.get("visualId", "vis_kpi_1")
    return {
        "success": True,
        "data": {
            "visualId": visual_id,
            "explanation": "This visual renders the 'Total Freight Margin' KPI. It evaluates net shipping revenue minus carrier transit costs using the formula: SUM(Fact_Shipments[FreightCost]).",
            "rootCause": "Margin increased due to 15% rate renegotiation with FedEx Freight.",
            "confidenceScore": 96
        }
    }

@router.post("/summarize")
def copilot_summarize(payload: Dict[str, Any]):
    dash_id = payload.get("dashboardId", "dash_3c91a02b")
    summary = insights.generate_summary(dash_id)
    return {"success": True, "data": summary}

@router.post("/recommend")
def copilot_recommend(payload: Dict[str, Any]):
    return {
        "success": True,
        "data": [
            {"type": "FILTER", "recommendation": "Filter view by 'North America' region to focus on highest margin routes."},
            {"type": "VISUAL", "recommendation": "Replace Pie Chart with Horizontal Bar Chart for carrier breakdown."}
        ]
    }

@router.post("/feedback")
def copilot_feedback(payload: Dict[str, Any]):
    return {"success": True, "data": {"status": "FEEDBACK_RECORDED"}}

@router.get("/history")
def list_copilot_history():
    return {"success": True, "data": chat_history_db}
