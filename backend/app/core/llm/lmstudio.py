from __future__ import annotations

import json

import httpx

from app.config import settings


class LMStudioClient:
    """
    LM Studio exposes an OpenAI-compatible API by default:
      POST {base_url}/v1/chat/completions
    """

    def __init__(self) -> None:
        self._base_url = settings.lmstudio_base_url.rstrip("/")
        self._model = settings.lmstudio_model

    def _parse_first_json(self, content: str) -> dict:
        """
        LM Studio models often wrap JSON in markdown fences or include extra text.
        Parse the first valid JSON object/array found in the response.
        """
        stripped = (content or "").strip()
        if not stripped:
            return {"raw": content}

        # Fast path: exact JSON
        try:
            val = json.loads(stripped)
            return val if isinstance(val, dict) else {"data": val}
        except Exception:
            pass

        # Remove common markdown fences
        cleaned = stripped.replace("```json", "```").replace("```JSON", "```")
        if "```" in cleaned:
            parts = cleaned.split("```")
            # take the largest fenced block as likely JSON
            fenced = max((p.strip() for i, p in enumerate(parts) if i % 2 == 1), default="")
            if fenced:
                cleaned = fenced

        decoder = json.JSONDecoder()
        # Find first '{' or '[' then raw_decode from there
        for start_char in ("{", "["):
            idx = cleaned.find(start_char)
            if idx != -1:
                try:
                    obj, _ = decoder.raw_decode(cleaned[idx:])
                    return obj if isinstance(obj, dict) else {"data": obj}
                except Exception:
                    continue

        return {"raw": content}

    async def generate_json(self, *, system: str, user: str, schema_hint: str | None = None) -> dict:
        prompt = user
        if schema_hint:
            prompt = f"{user}\n\nReturn ONLY valid JSON matching this schema hint:\n{schema_hint}\n"

        async with httpx.AsyncClient(timeout=1800.0) as client:
            resp = await client.post(
                f"{self._base_url}/v1/chat/completions",
                json={
                    "model": self._model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2,
                },
            )
            if resp.status_code != 200:
                error_detail = ""
                try:
                    error_detail = resp.text
                except:
                    pass
                print(f"DEBUG: LM Studio Error {resp.status_code}: {error_detail}")
                resp.raise_for_status()
            
            data = resp.json()
            # LM Studio returns an OpenAI-compatible envelope. Prefer parsing JSON from message.content,
            # but fall back to parsing the whole response if needed.
            content = ((((data or {}).get("choices") or [{}])[0].get("message") or {}).get("content")) or ""
            parsed = self._parse_first_json(content)
            if parsed.get("raw") and isinstance(data, dict):
                # Last resort: parse JSON from the entire response (useful when server already returns JSON)
                parsed = self._parse_first_json(json.dumps(data))
            return parsed
    async def generate_text(self, *, system: str, user: str) -> str:
        async with httpx.AsyncClient(timeout=1800.0) as client:
            resp = await client.post(
                f"{self._base_url}/v1/chat/completions",
                json={
                    "model": self._model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            content = ((((data or {}).get("choices") or [{}])[0].get("message") or {}).get("content")) or ""
            return content.strip()
