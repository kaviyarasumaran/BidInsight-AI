from __future__ import annotations


async def run_ocr(*, files: list[dict]) -> dict:
    """
    Perform text extraction/OCR on the given files.
    Supports PDF (via PyMuPDF), DOCX (via python-docx), and plain text.
    """
    combined_text = ""
    pages_info = []
    
    print(f"DEBUG: run_ocr called with {len(files)} files")
    for f in files:
        path = f.get("path")
        filename = f.get("filename", "unknown")
        print(f"DEBUG: Processing file: {filename}, path: {path}")
        
        if not path:
            print(f"DEBUG: Skipping {filename} - path is None")
            continue
            
        if not os.path.exists(path):
            print(f"DEBUG: Skipping {filename} - file does not exist at {path}")
            # Try relative path if absolute fails
            if not os.path.isabs(path):
                alt_path = os.path.join(os.getcwd(), path)
                if os.path.exists(alt_path):
                    path = alt_path
                    print(f"DEBUG: Found file at alt path: {path}")
                else:
                    continue
            else:
                continue
        
        ext = path.lower().split('.')[-1]
        print(f"DEBUG: File extension detected: {ext}")
        
        try:
            if ext == "pdf":
                print(f"DEBUG: Using fitz for PDF: {filename}")
                import fitz
                doc = fitz.open(path)
                print(f"DEBUG: PDF opened successfully, pages: {len(doc)}")
                for i, page in enumerate(doc):
                    text = page.get_text("text") or ""
                    
                    # Detect scanned pages
                    images = page.get_images(full=True)
                    is_scanned = not text.strip() and len(images) > 0
                    
                    if is_scanned:
                        print(f"DEBUG: Page {i+1} is scanned, attempting Tesseract")
                        try:
                            import pytesseract
                            from PIL import Image
                            import io
                            pix = page.get_pixmap()
                            img_data = pix.tobytes("png")
                            img = Image.open(io.BytesIO(img_data))
                            ocr_text = pytesseract.image_to_string(img)
                            if ocr_text.strip():
                                text = ocr_text
                                is_scanned = False
                        except Exception as ocr_err:
                            print(f"DEBUG: OCR failed on page {i+1}: {ocr_err}")
                            text = f"[WARNING: Page {i+1} appears to be a scanned image. OCR attempt failed: {ocr_err}. Ensure 'tesseract' is installed on the system.]"
                    
                    pages_info.append({
                        "file": filename, 
                        "page": i + 1, 
                        "text_length": len(text),
                        "has_images": len(images) > 0,
                        "is_scanned": is_scanned
                    })
                    combined_text += f"\n{text}"
                doc.close()
            
            elif ext == "docx":
                print(f"DEBUG: Using python-docx for: {filename}")
                import docx
                doc = docx.Document(path)
                text = "\n".join([para.text for para in doc.paragraphs])
                pages_info.append({"file": filename, "page": 1, "text_length": len(text)})
                combined_text += f"\n{text}"
                
            elif ext == "doc":
                print(f"DEBUG: Using docx2txt for: {filename}")
                import docx2txt
                text = docx2txt.process(path)
                pages_info.append({"file": filename, "page": 1, "text_length": len(text)})
                combined_text += f"\n{text}"
                
            elif ext in ["txt", "md", "csv"]:
                print(f"DEBUG: Reading text file: {filename}")
                with open(path, "r", encoding="utf-8", errors="ignore") as tf:
                    text = tf.read()
                    pages_info.append({"file": filename, "page": 1, "text_length": len(text)})
                    combined_text += f"\n{text}"
            else:
                print(f"DEBUG: Unsupported extension: {ext}")
                    
        except Exception as e:
            print(f"DEBUG: Exception during extraction of {filename}: {e}")
            continue
            
    print(f"DEBUG: run_ocr finished. Total text length: {len(combined_text)}")
    return {
        "text": combined_text.strip(), 
        "pages": pages_info,
        "ocr_engine": "multiformat_extraction"
    }
import os
