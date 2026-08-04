from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.validators.engine import AIValidationEngine

router = APIRouter(prefix="/api/v1/validation", tags=["AI Validation Engine"])
engine = AIValidationEngine()

# In-memory storage for demo validation reports
validation_db = {}

@router.post("/run")
def run_validation(dashboard_ast: Dict[str, Any]):
    report = engine.run_validation(dashboard_ast)
    validation_db[report["id"]] = report
    return {"success": True, "data": report}

@router.get("/{report_id}")
def get_validation_report(report_id: str):
    if report_id in validation_db:
        return {"success": True, "data": validation_db[report_id]}
    
    # Return mock report if id not in-memory
    mock_ast = {
        "id": "dash_3c91a02b",
        "pages": [{"id": "page_1", "displayName": "Q3 Overview", "width": 1280, "visuals": [{"id": "vis_1", "x": 40, "y": 40}]}],
        "measures": [{"name": "Delayed Shipments", "expression": "CALCULATE(COUNTROWS(Fact_Shipments), FILTER(ALL(Fact_Shipments), Fact_Shipments[TransitDelayHours] > 48))"}],
        "tables": [{"name": "Fact_Shipments", "columns": [{"name": "ShipmentID"}, {"name": "DriverSSN"}]}]
    }
    report = engine.run_validation(mock_ast)
    return {"success": True, "data": report}

@router.get("/history")
def list_validation_history():
    return {"success": True, "data": list(validation_db.values())}
