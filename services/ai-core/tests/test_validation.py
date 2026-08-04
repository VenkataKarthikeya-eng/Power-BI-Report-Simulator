import unittest
from app.validators.rules import ValidationRuleEngine
from app.validators.engine import AIValidationEngine

class TestValidation(unittest.TestCase):
    def test_validation_rules_dax(self):
        engine = ValidationRuleEngine()
        measures = [{"name": "BadMeasure", "expression": "CALCULATE(SUM(Sales), FILTER(ALL(Sales), Sales[Amount] > 100))"}]
        findings = engine.validate_dax(measures)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["category"], "DAX")
        self.assertEqual(findings[0]["severity"], "HIGH")

    def test_validation_rules_security(self):
        engine = ValidationRuleEngine()
        tables = [{"name": "Users", "columns": [{"name": "UserSSN"}, {"name": "Email"}]}]
        findings = engine.validate_security(tables)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["category"], "SECURITY")
        self.assertEqual(findings[0]["severity"], "CRITICAL")

    def test_ai_validation_engine_score(self):
        ai_engine = AIValidationEngine()
        ast = {
            "id": "test_dash",
            "pages": [{"id": "p1", "displayName": "Page 1", "width": 1280, "visuals": []}],
            "measures": [],
            "tables": []
        }
        report = ai_engine.run_validation(ast)
        self.assertIn("overallScore", report)
        self.assertTrue(report["overallScore"] >= 0 and report["overallScore"] <= 100)
        self.assertTrue(len(report["findings"]) > 0)

if __name__ == "__main__":
    unittest.main()

