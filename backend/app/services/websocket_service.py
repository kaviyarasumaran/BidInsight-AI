from __future__ import annotations

import json
from collections import defaultdict

from fastapi import WebSocket


class JobWebSocketHub:
    def __init__(self) -> None:
        self._connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, job_id: str, ws: WebSocket) -> None:
        await ws.accept()
        self._connections[job_id].add(ws)

    def disconnect(self, job_id: str, ws: WebSocket) -> None:
        self._connections[job_id].discard(ws)
        if not self._connections[job_id]:
            self._connections.pop(job_id, None)

    async def broadcast(self, job_id: str, event: dict) -> None:
        conns = list(self._connections.get(job_id, set()))
        if not conns:
            return
        payload = json.dumps(event)
        for ws in conns:
            try:
                await ws.send_text(payload)
            except Exception:
                self.disconnect(job_id, ws)


hub = JobWebSocketHub()
