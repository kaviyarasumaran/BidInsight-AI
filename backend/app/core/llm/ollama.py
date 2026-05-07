from __future__ import annotations

import json

import httpx

from app.config import settings


class OllamaClient:
    def __init__(self) -> None:
        self._base_url = settings.ollama_base_url.rstrip("/")
        self._model = settings.ollama_model

    async def generate_json(self, *, system: str, user: str, schema_hint: str | None = None) -> dict:
        prompt = user
        if schema_hint:
            prompt = f"{user}\n\nReturn ONLY valid JSON matching this schema hint:\n{schema_hint}\n"

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self._base_url}/api/chat",
                json={
                    "model": self._model,
                    "stream": False,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt},
                    ],
                },
            )
            resp.raise_for_status()
            data = resp.json()
            content = (((data or {}).get("message") or {}).get("content")) or "{}"
            try:
                return json.loads(content)
            except Exception:
                # Best-effort fallback if model returns extra text
                start = content.find("{")
                end = content.rfind("}")
                if start != -1 and end != -1 and end > start:
                    return json.loads(content[start : end + 1])
                return {"raw": content}
    async def generate_text(self, *, system: str, user: str) -> str:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self._base_url}/api/chat",
                json={
                    "model": self._model,
                    "stream": False,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                },
            )
            resp.raise_for_status()
            data = resp.json()
            content = (((data or {}).get("message") or {}).get("content")) or ""
            return content.strip()
