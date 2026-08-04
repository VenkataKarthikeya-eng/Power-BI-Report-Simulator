import unittest
from app.copilot.providers import get_llm_provider
from app.copilot.rag_engine import RAGEngine
from app.copilot.insight_engine import InsightEngine

class TestCopilot(unittest.TestCase):
    def test_llm_provider_abstraction(self):
        provider = get_llm_provider("LOCAL_LLM")
        resp = provider.generate_response("What caused revenue to decrease?", {})
        self.assertTrue("Freight" in resp or "Logistics" in resp)

    def test_rag_engine_retrieval(self):
        rag = RAGEngine()
        ast = {"measures": [{"name": "Total Freight Cost"}]}
        res = rag.retrieve_context("Freight", ast)
        self.assertTrue(len(res["retrievedMeasures"]) > 0)

    def test_insight_engine_summary(self):
        engine = InsightEngine()
        summary = engine.generate_summary("dash_3c91a02b")
        self.assertIn("oneMinuteSummary", summary)
        self.assertTrue(len(summary["keyInsights"]) > 0)

if __name__ == "__main__":
    unittest.main()

