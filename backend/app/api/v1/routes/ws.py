from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.websocket_service import hub

router = APIRouter()


@router.websocket("/ws/jobs/{job_id}")
async def job_ws(ws: WebSocket, job_id: str):
    await hub.connect(job_id, ws)
    try:
        while True:
            # keepalive / allow client pings
            await ws.receive_text()
    except WebSocketDisconnect:
        hub.disconnect(job_id, ws)
    except Exception:
        hub.disconnect(job_id, ws)
