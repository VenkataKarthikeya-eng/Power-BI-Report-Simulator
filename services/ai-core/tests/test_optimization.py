import unittest
from app.optimizers.dax_optimizer import DAXOptimizer
from app.optimizers.layout_optimizer import LayoutOptimizer
from app.optimizers.visual_optimizer import VisualOptimizer
from app.optimizers.engine import AIOptimizationEngine

class TestOptimization(unittest.TestCase):
    def test_dax_optimizer(self):
        opt = DAXOptimizer()
        measures = [{"name": "SalesFilter", "expression": "CALCULATE(SUM(Sales), FILTER(ALL(Sales), Sales[Val] > 10))"}]
        suggestions = opt.optimize_measures(measures)
        self.assertEqual(len(suggestions), 1)
        self.assertEqual(suggestions[0]["category"], "DAX")
        self.assertIn("KEEPFILTERS", suggestions[0]["proposedCodeOrConfig"])

    def test_layout_optimizer(self):
        opt = LayoutOptimizer()
        pages = [{"displayName": "Page1", "visuals": [{"id": "vis1", "x": 41, "y": 40}]}]
        suggestions = opt.optimize_layout(pages)
        self.assertEqual(len(suggestions), 1)
        self.assertEqual(suggestions[0]["category"], "LAYOUT")
        self.assertIn("40px", suggestions[0]["proposedCodeOrConfig"])

    def test_ai_optimization_engine_report(self):
        engine = AIOptimizationEngine()
        ast = {"id": "dash_test", "pages": [], "measures": []}
        report = engine.run_optimization(ast)
        self.assertGreater(report["overallImprovementPercent"], 0)
        self.assertTrue(len(report["suggestions"]) > 0)

if __name__ == "__main__":
    unittest.main()

