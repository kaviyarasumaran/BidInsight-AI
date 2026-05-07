from __future__ import annotations

from pathlib import Path
from app.db.mongo import get_mongo_db


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks


async def parse_documents(*, raw_text: str | None, ocr: dict | None, files: list[dict], job_id: str | None = None, tender_id: str | None = None) -> dict:
    # Placeholder: normalize PDF/DOCX parsing + OCR text into a canonical representation.
    combined = raw_text or ""
    if ocr and ocr.get("text"):
        combined = (combined + "\n" + ocr["text"]).strip()
    
    chunks_to_store = []
    
    # Process OCR results (which already handle PDF, DOCX, DOC, TXT)
    if ocr and ocr.get("text"):
        file_text = ocr.get("text", "")
        if file_text.strip():
            combined = (combined + "\n" + file_text).strip()
            if job_id:
                file_chunks = chunk_text(file_text)
                for i, chunk in enumerate(file_chunks):
                    chunks_to_store.append({
                        "job_id": job_id,
                        "tender_id": str(tender_id) if tender_id else None,
                        "document_type": "tender",
                        "filename": "extracted_content",
                        "chunk_index": len(chunks_to_store),
                        "content": chunk,
                        "meta": {}
                    })
    
    # Process files only if no OCR was provided (fallback)
    if not ocr or not ocr.get("text"):
        for f in files:
            path = f.get("path")
            if not path:
                continue
            ext = Path(path).suffix.lower()
            try:
                file_text = ""
                if ext == ".pdf":
                    import fitz  # pymupdf
                    doc = fitz.open(path)
                    file_text = "\n".join((page.get_text("text") or "") for page in doc)
                    doc.close()
                elif ext == ".docx":
                    import docx
                    d = docx.Document(path)
                    file_text = "\n".join((p.text or "") for p in d.paragraphs)
                
                if file_text.strip():
                    combined = (combined + "\n" + file_text).strip()
                    if job_id:
                        file_chunks = chunk_text(file_text)
                        for i, chunk in enumerate(file_chunks):
                            chunks_to_store.append({
                                "job_id": job_id,
                                "tender_id": str(tender_id) if tender_id else None,
                                "document_type": "tender",
                                "filename": f.get("filename"),
                                "chunk_index": len(chunks_to_store),
                                "content": chunk,
                                "meta": {"path": path}
                            })
            except Exception:
                continue
    
    # Also chunk the non-file text (raw_text or OCR results) if no files were processed or in addition
    if not chunks_to_store and combined.strip() and job_id:
        other_chunks = chunk_text(combined)
        for i, chunk in enumerate(other_chunks):
            chunks_to_store.append({
                "job_id": job_id,
                "tender_id": tender_id,
                "document_type": "tender",
                "filename": "raw_input",
                "chunk_index": i,
                "content": chunk,
                "meta": {}
            })

    if chunks_to_store and job_id:
        if not tender_id:
             return {"combined_text": combined, "chunks": []}
             
        try:
            mongo = get_mongo_db()
            t_id = str(tender_id)
            # Strict isolation: clear only for this job AND tender
            await mongo.document_chunks.delete_many({"job_id": job_id})
            await mongo.document_chunks.delete_many({"tender_id": t_id}) # Double lock
            await mongo.document_chunks.insert_many(chunks_to_store)
            from app.services.job_service import append_job_log
            await append_job_log(job_id, f"Stored {len(chunks_to_store)} chunks in Knowledge Base for tender {t_id}")
        except Exception as e:
            from app.services.job_service import append_job_log
            await append_job_log(job_id, f"Failed to store chunks: {e}", level="error")
            pass

    return {"combined_text": combined, "chunks": chunks_to_store}
