from fastapi import APIRouter
from typing import Dict, Any
from app.health.scoring_engine import HealthScoringEngine

router = APIRouter(prefix="/api/v1/health", tags=["Dashboard Health Engine"])
engine = HealthScoringEngine()

health_db = {}

@router.post("/run")
def run_health_check(payload: Dict[str, Any]):
    dash_id = payload.get("dashboardId", "dash_3c91a02b")
    report = engine.calculate_health_report(dash_id)
    health_db[dash_id] = report
    return {"success": True, "data": report}

@router.get("/{dashboard_id}")
def get_health_report(dashboard_id: str):
    if dashboard_id in health_db:
        return {"success": True, "data": health_db[dashboard_id]}
    
    report = engine.calculate_health_report(dashboard_id)
    return {"success": True, "data": report}

@router.get("/history")
def list_health_history():
    return {"success": True, "data": list(health_db.values())}

@router.get("/recommendations")
def get_recommendations():
    report = engine.calculate_health_report("dash_3c91a02b")
    return {"success": True, "data": report["recommendations"]}

@router.get("/trends")
def get_trends():
    report = engine.calculate_health_report("dash_3c91a02b")
    return {"success": True, "data": report["predictions"]}
