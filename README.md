## GitHub README

### Project Title

AI-Powered Tender Evaluation and Vendor Eligibility Analysis

---

### Overview

This project is an AI-assisted system designed to automate and standardize the evaluation of government tenders. It focuses on extracting eligibility criteria from unstructured tender documents and evaluating vendor submissions using a transparent, rule-based approach.

The system combines document intelligence with deterministic logic to deliver fast, consistent, and audit-ready procurement decisions.

---

### Problem Statement

Manual tender evaluation in government procurement is:

* Time-consuming and resource-intensive
* Prone to inconsistencies and human bias
* Difficult to audit due to lack of structured outputs

There is a need for a scalable system that ensures fairness, transparency, and efficiency.

---

### Solution

The system automates the tender evaluation workflow:

* Extracts eligibility criteria from tender documents using AI
* Converts unstructured data into structured JSON
* Evaluates vendor data against defined criteria
* Generates eligibility decisions, scores, and explanations
* Produces audit-ready outputs

---

### Key Features

* Automated tender document parsing
* AI-based eligibility extraction
* Rule-based evaluation engine
* Weighted scoring system
* Explainable decision outputs
* Scalable and modular architecture

---

### Tech Stack

* **Backend:** FastAPI
* **Frontend:** Next.js
* **AI Layer:** LLM (for criteria extraction)
* **Database:** MongoDB (optional)
* **Document Parsing:** PyMuPDF / pdfplumber

---

### System Architecture

```
                ┌──────────────────────┐
                │   Tender Document    │
                │   (PDF / DOC)        │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │  Text Extraction     │
                │  (PDF Parser)        │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │  AI Extraction Layer │
                │  (LLM/NLP)           │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ Structured Criteria  │
                │ (JSON Format)        │
                └─────────┬────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────┐                 ┌─────────────────┐
│ Vendor Input  │                 │ Rule Engine     │
│ (Form / API)  │ ──────────────▶ │ Evaluation      │
└───────────────┘                 └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ Scoring Engine  │
                                  └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ Result Output   │
                                  │ (Eligibility,   │
                                  │ Score, Reasons) │
                                  └─────────────────┘
```

---

### Project Structure

```
project-root/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   │   ├── extractor.py
│   │   ├── evaluator.py
│   │   └── scorer.py
│   └── models/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   └── services/
│
├── sample-data/
│   ├── tender.pdf
│   └── vendors.json
│
├── README.md
└── requirements.txt
```

---

### Installation

#### Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

### API Endpoints

#### Extract Criteria

```
POST /extract
```

Request:

```
{
  "tender_text": "..."
}
```

Response:

```
{
  "turnover": 50000000,
  "experience": 5,
  "certifications": ["ISO 9001"],
  "projects": 3
}
```

---

#### Evaluate Vendor

```
POST /evaluate
```

Request:

```
{
  "criteria": {...},
  "vendor": {...}
}
```

Response:

```
{
  "eligible": true,
  "score": 85,
  "reasons": [...]
}
```

---

### Example Workflow

1. Upload tender document
2. Extract eligibility criteria
3. Input vendor details
4. Run evaluation
5. View eligibility status, score, and explanation

---

### Sample Output

```
{
  "eligible": true,
  "score": 82,
  "reasons": [
    "Turnover meets requirement",
    "Experience meets requirement",
    "Missing certification: ISO 9001"
  ]
}
```

---

### Implementation Roadmap

**Phase 1**

* Document parsing
* AI extraction
* Rule engine

**Phase 2**

* API integration
* Basic UI

**Phase 3**

* Scoring system
* Explainability

**Phase 4**

* Enhancements and optimization

---

### Future Enhancements

* Multilingual tender parsing
* Fraud and anomaly detection
* Integration with government portals
* Vendor performance analytics

---

### Impact

* Reduces evaluation time by up to 80%
* Ensures consistent and unbiased decisions
* Improves transparency and auditability
* Scales across departments and use cases

---

### License

MIT License

---


