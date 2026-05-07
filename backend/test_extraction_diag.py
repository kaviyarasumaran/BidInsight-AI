import os
import sys

# Add backend to path
sys.path.append("/Users/kaviii/Documents/bidinsight_ai/backend")

async def test_extraction():
    from app.services.ocr_service import run_ocr
    
    # Test a docx file
    docx_path = "/Users/kaviii/Documents/bidinsight_ai/backend/storage/upl_ff4e2da199d94ffa92e7fe2bf78f411a/sample_tender_document.docx"
    files = [{"filename": "sample.docx", "path": docx_path}]
    
    print(f"Testing DOCX: {docx_path}")
    result = await run_ocr(files=files)
    print(f"Result engine: {result.get('ocr_engine')}")
    print(f"Text length: {len(result.get('text', ''))}")
    print(f"Text snippet: {result.get('text', '')[:200]}")
    
    # Test a pdf file
    pdf_path = "/Users/kaviii/Documents/bidinsight_ai/backend/storage/upl_e65dc21ffa17430fba279c720fbd35f3/1756360660_7125_Tender Documents (2)_compressed (1).pdf"
    if os.path.exists(pdf_path):
        print(f"\nTesting PDF: {pdf_path}")
        files = [{"filename": "sample.pdf", "path": pdf_path}]
        result = await run_ocr(files=files)
        print(f"Result engine: {result.get('ocr_engine')}")
        print(f"Text length: {len(result.get('text', ''))}")
        print(f"Text snippet: {result.get('text', '')[:200]}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_extraction())
