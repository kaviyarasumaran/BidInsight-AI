from __future__ import annotations

from typing import Protocol


class LLMClient(Protocol):
    async def generate_json(self, *, system: str, user: str, schema_hint: str | None = None) -> dict: ...
    async def generate_text(self, *, system: str, user: str) -> str: ...
