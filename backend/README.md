# Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Local infra (Postgres/Mongo/Redis)

```bash
cd backend
docker compose up -d
```

If you don’t want Redis running during early dev, set `REDIS_REQUIRED=false` (job status/logs will be stored in-memory and will reset on restart).
If you don’t want Postgres running during early dev, set `POSTGRES_REQUIRED=false` (metadata/audit endpoints will still import, but DB-backed calls will fail until Postgres is up).

## Run (dev)

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000/api/health` and `http://localhost:8000/docs`.

## Async workers (recommended)

By default `QUEUE_BACKEND=local` runs workflows in-process (good for dev only).

To use Redis-backed workers:

```bash
cd backend
source .venv/bin/activate
export QUEUE_BACKEND=arq
arq app.worker.worker.WorkerSettings
```

## LangGraph + Local LLM

Workflows are orchestrated via LangGraph:

- Tender graph: `/Users/kaviii/Documents/bidinsight_ai/backend/app/graphs/tender_graph.py`
- Vendor graph: `/Users/kaviii/Documents/bidinsight_ai/backend/app/graphs/vendor_graph.py`
- Evaluation graph: `/Users/kaviii/Documents/bidinsight_ai/backend/app/graphs/evaluation_graph.py`

Local LLM provider is configurable via `.env`:

- `LLM_PROVIDER=ollama`
- `OLLAMA_BASE_URL=http://localhost:11434`
- `OLLAMA_MODEL=llama3.1`

LM Studio (OpenAI-compatible) example:

- `LLM_PROVIDER=lmstudio`
- `LMSTUDIO_BASE_URL=http://127.0.0.1:1234`
- `LMSTUDIO_MODEL=meta-llama-3-8b-instruct`

## MongoDB

Set `MONGODB_URI` and `MONGODB_DB` in `.env`.

For MongoDB Atlas (SRV) URIs, keep the credentials out of git (this repo ignores `.env` via `/Users/kaviii/Documents/bidinsight_ai/backend/.gitignore`). Rotate the password if it was ever shared.

## Tests

```bash
cd backend
source .venv/bin/activate
pytest -q
```
