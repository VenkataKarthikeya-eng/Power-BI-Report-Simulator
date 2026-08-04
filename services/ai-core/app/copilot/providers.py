"""
LLM Provider Abstraction Layer (OpenAI, Anthropic, Azure OpenAI, Local LLM)
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_response(self, prompt: str, context: Dict[str, Any]) -> str:
        pass

class MockLocalLLMProvider(BaseLLMProvider):
    def generate_response(self, prompt: str, context: Dict[str, Any]) -> str:
        prompt_lower = prompt.lower()
        if "revenue" in prompt_lower or "freight" in prompt_lower:
            return "Based on the Q3 Logistics dataset schema, Total Freight Cost increased by +14.2% primarily driven by 54.1 transit delay hours on DHL Express routes."
        elif "explain" in prompt_lower or "kpi" in prompt_lower:
            return "The 'Total Freight Margin' KPI measures net shipping revenue minus carrier costs. The active measure formula is: SUM(Fact_Shipments[FreightCost])."
        elif "summarize" in prompt_lower:
            return "Executive Summary: Q3 Logistics operations processed 14,200 total shipments. Overall health score is 94/100 with sub-50ms query latency."
        return f"AI Analysis of query: '{prompt}'. Retrieved 4 schema vectors from DuckDB WASM DataModel."

class OpenAIProvider(BaseLLMProvider):
    def generate_response(self, prompt: str, context: Dict[str, Any]) -> str:
        return f"[OpenAI gpt-4o] Response to: '{prompt}'"

class AnthropicProvider(BaseLLMProvider):
    def generate_response(self, prompt: str, context: Dict[str, Any]) -> str:
        return f"[Anthropic Claude-3.5-Sonnet] Response to: '{prompt}'"

def get_llm_provider(provider_type: str = "LOCAL_LLM") -> BaseLLMProvider:
    if provider_type == "OPENAI":
        return OpenAIProvider()
    elif provider_type == "ANTHROPIC":
        return AnthropicProvider()
    return MockLocalLLMProvider()
