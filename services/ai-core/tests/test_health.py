import unittest
from app.health.scoring_engine import HealthScoringEngine

class TestHealth(unittest.TestCase):
    def test_health_scoring_report(self):
        engine = HealthScoringEngine()
        report = engine.calculate_health_report("dash_3c91a02b")

        self.assertTrue(report["scores"]["overallScore"] >= 0 and report["scores"]["overallScore"] <= 100)
        self.assertEqual(report["scores"]["performanceScore"], 96)
        self.assertEqual(report["scores"]["securityScore"], 100)
        self.assertTrue(len(report["recommendations"]) > 0)
        self.assertTrue(len(report["predictions"]) > 0)

if __name__ == "__main__":
    unittest.main()

