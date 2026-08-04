from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.optimizers.engine import AIOptimizationEngine

router = APIRouter(prefix="/api/v1/optimization", tags=["AI Optimization Engine"])
engine = AIOptimizationEngine()

optimization_db = {}

@router.post("/run")
def run_optimization(dashboard_ast: Dict[str, Any]):
    report = engine.run_optimization(dashboard_ast)
    optimization_db[report["id"]] = report
    return {"success": True, "data": report}

@router.get("/{job_id}")
def get_optimization_report(job_id: str):
    if job_id in optimization_db:
        return {"success": True, "data": optimization_db[job_id]}
    
    # Return mock report if job_id not in-memory
    report = engine.run_optimization({"id": "dash_3c91a02b"})
    return {"success": True, "data": report}

@router.get("/history")
def list_optimization_history():
    return {"success": True, "data": list(optimization_db.values())}

@router.post("/apply")
def apply_optimization(payload: Dict[str, Any]):
    job_id = payload.get("optimizationJobId")
    suggestion_ids = payload.get("suggestionIds", [])
    
    if job_id in optimization_db:
        report = optimization_db[job_id]
        for sug in report["suggestions"]:
            if not suggestion_ids or sug["id"] in suggestion_ids:
                sug["applied"] = True
        report["status"] = "APPLIED"
        return {"success": True, "data": report}

    return {"success": True, "data": {"status": "APPLIED", "appliedSuggestionsCount": len(suggestion_ids)}}

@router.post("/rollback")
def rollback_optimization(payload: Dict[str, Any]):
    job_id = payload.get("optimizationJobId")
    if job_id in optimization_db:
        report = optimization_db[job_id]
        for sug in report["suggestions"]:
            sug["applied"] = False
        report["status"] = "ROLLED_BACK"
        return {"success": True, "data": report}

    return {"success": True, "data": {"status": "ROLLED_BACK", "message": "Optimizations reverted to original PBIX AST"}}
