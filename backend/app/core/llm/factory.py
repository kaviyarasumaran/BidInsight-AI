from __future__ import annotations

from app.config import settings
from app.core.llm.base import LLMClient
from app.core.llm.lmstudio import LMStudioClient
from app.core.llm.ollama import OllamaClient


def get_llm() -> LLMClient:
    if settings.llm_provider == "ollama":
        return OllamaClient()
    if settings.llm_provider in ("lmstudio", "lm_studio"):
        return LMStudioClient()
    raise ValueError(f"Unsupported LLM_PROVIDER={settings.llm_provider}")
