"""
Dashboard Capsule AI — Validation Engine Rule Definitions
"""
from typing import List, Dict, Any

class ValidationRuleEngine:
    def __init__(self):
        self.sensitive_keywords = ["ssn", "salary", "credit_card", "password", "dob", "pin"]

    def validate_structure(self, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        findings = []
        if not pages:
            findings.append({
                "id": "val_str_001",
                "category": "STRUCTURE",
                "severity": "CRITICAL",
                "title": "Empty Dashboard Layout",
                "problemDescription": "No visible report pages detected in layout AST.",
                "rootCause": "PBIX layout stream empty or missing page sections.",
                "recommendation": "Ensure report contains at least one active page before ingestion.",
                "estimatedImpact": "Viewer canvas failure",
                "confidenceScore": 100
            })
        for page in pages:
            if not page.get("visuals"):
                findings.append({
                    "id": f"val_str_empty_{page.get('id')}",
                    "category": "STRUCTURE",
                    "severity": "MEDIUM",
                    "title": f"Empty Report Page: {page.get('displayName')}",
                    "problemDescription": f"Page '{page.get('displayName')}' contains no visual elements.",
                    "rootCause": "Unused blank page left in PBIX before publishing.",
                    "recommendation": "Delete empty page or add required visuals to save storage.",
                    "estimatedImpact": "Slight layout clutter",
                    "confidenceScore": 95,
                    "affectedResource": page.get("displayName")
                })
        return findings

    def validate_visuals(self, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        findings = []
        for page in pages:
            visuals = page.get("visuals", [])
            for vis in visuals:
                # Off-canvas check
                if vis.get("x", 0) < 0 or vis.get("y", 0) < 0 or vis.get("x", 0) > page.get("width", 1280):
                    findings.append({
                        "id": f"val_vis_off_{vis.get('id')}",
                        "category": "VISUAL",
                        "severity": "HIGH",
                        "title": f"Off-Canvas Visual Detected in {page.get('displayName')}",
                        "problemDescription": f"Visual {vis.get('id')} lies partially outside viewport boundaries.",
                        "rootCause": "Visual positioning offset coordinates exceed canvas width.",
                        "recommendation": "Reposition visual inside page boundaries (X: 0 - 1280px).",
                        "estimatedImpact": "Visual clipping in WASM viewer",
                        "confidenceScore": 98,
                        "affectedResource": vis.get("id")
                    })
        return findings

    def validate_dax(self, measures: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        findings = []
        for m in measures:
            expr = m.get("expression", "")
            if "FILTER(ALL(" in expr.replace(" ", ""):
                findings.append({
                    "id": f"val_dax_filter_{m.get('name')}",
                    "category": "DAX",
                    "severity": "HIGH",
                    "title": f"Inefficient DAX Pattern in '{m.get('name')}'",
                    "problemDescription": "Misuse of FILTER(ALL(...)) causing full table scan during evaluation.",
                    "rootCause": "FILTER(ALL()) overrides storage engine optimization.",
                    "recommendation": "Refactor measure to use KEEPFILTERS or REMOVEFILTERS for sub-50ms execution.",
                    "estimatedImpact": "50% - 80% DAX evaluation speed improvement",
                    "confidenceScore": 92,
                    "affectedResource": m.get("name")
                })
        return findings

    def validate_security(self, tables: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        findings = []
        for table in tables:
            for col in table.get("columns", []):
                col_name = col.get("name", "").lower()
                for keyword in self.sensitive_keywords:
                    if keyword in col_name:
                        findings.append({
                            "id": f"val_sec_pii_{table.get('name')}_{col.get('name')}",
                            "category": "SECURITY",
                            "severity": "CRITICAL",
                            "title": f"Potential PII Exposure: Column '{col.get('name')}'",
                            "problemDescription": f"Column '{col.get('name')}' in table '{table.get('name')}' contains sensitive identifier pattern.",
                            "rootCause": "Unencrypted PII included in data model dictionary.",
                            "recommendation": "Apply Row-Level Security (RLS) or mask column values prior to packaging.",
                            "estimatedImpact": "Prevention of GDPR/HIPAA compliance violation",
                            "confidenceScore": 90,
                            "affectedResource": f"{table.get('name')}.{col.get('name')}"
                        })
        return findings
