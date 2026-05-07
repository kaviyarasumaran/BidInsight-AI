import requests
import uuid

def test_ocr_api():
    base_url = "http://localhost:8000/api"
    
    # Try a dummy UUID
    test_id = str(uuid.uuid4())
    print(f"Testing OCR API for tender {test_id}...")
    
    try:
        response = requests.get(f"{base_url}/tenders/{test_id}/ocr")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ocr_api()
