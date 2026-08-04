"""
Dashboard Capsule AI — Central Prompt Templates Repository
"""

DAX_OPTIMIZATION_PROMPT = """
You are an expert Power BI DAX Query Optimization Engine.
Analyze the provided DAX AST measure and recommend performance refactorings.
Input AST:
{dax_ast}
"""

NLQ_SQL_PROMPT = """
You are a Natural Language Query to DuckDB SQL compiler.
Translate user questions into valid DuckDB SQL queries matching the schema definition below.
Schema:
{schema_definition}
Question:
{user_query}
"""

HEALTH_SCORE_PROMPT = """
Evaluate the multidimensional health score of the following Power BI layout AST.
Report findings across Performance, Security, Design, and Accessibility.
"""
