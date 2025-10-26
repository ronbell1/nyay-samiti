# 🔄 Nyay-Samiti Platform Workflow

## Overview

Nyay-Samiti is an AI-powered legal document analysis platform that combines a **Next.js frontend/backend** with a **FastAPI ML service** to provide comprehensive legal document analysis using 7 specialized machine learning models.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Browser)                      │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS APPLICATION                            │
│                      (Port 3000)                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FRONTEND PAGES                                          │   │
│  │  • /upload          - Document upload interface         │   │
│  │  • /dashboard       - Analysis dashboard                │   │
│  │  • /how-it-works    - Information page                  │   │
│  │  • /contact         - Contact page                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  BACKEND API ROUTES (/app/api/)                         │   │
│  │  • /api/documents/upload       - Handle file uploads    │   │
│  │  • /api/documents/[id]         - Get document details   │   │
│  │  • /api/analysis/list          - List all analyses      │   │
│  │  • /api/analysis/[id]/status   - Get/update status      │   │
│  │  • /api/analysis/results       - Receive ML results     │   │
│  │  • /api/webhooks/*             - Handle notifications   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DATABASE LAYER (Prisma ORM)                            │   │
│  │  • Document Model  - Store uploaded documents           │   │
│  │  • Analysis Model  - Track analysis progress & results  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               FASTAPI ML SERVICE (Port 8000)                     │
│                   Legal ML/main.py                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API ENDPOINTS (/api/)                                   │   │
│  │  • POST /api/document/analyze  - Trigger analysis        │   │
│  │  • GET  /api/integration/health - Health check           │   │
│  │  • GET  /docs                  - API documentation       │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ML MODELS (7 Specialized Models)                        │   │
│  │  1. 🏷️  LegalBERT NER       - Entity Recognition         │   │
│  │  2. 📋 CUAD Classifier      - Clause Classification      │   │
│  │  3. ⚠️  Risk Scorer          - Risk Assessment           │   │
│  │  4. 📝 BART Summarizer      - Document Summarization     │   │
│  │  5. ❓ RoBERTa Q&A          - Question Answering         │   │
│  │  6. 🔍 Clause Comparator    - Similarity Analysis        │   │
│  │  7. 💡 Recommendations      - Clause Improvements        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  BACKEND INTEGRATION SERVICE                             │   │
│  │  • Update analysis status in Next.js                     │   │
│  │  • Send results to Next.js                               │   │
│  │  • Fetch document details from Next.js                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Complete Document Analysis Workflow

### Phase 1: Document Upload

```
User → Upload Page (/upload)
  │
  ├─→ User selects file (PDF, DOC, DOCX, TXT)
  │
  ├─→ Frontend validates file (type, size)
  │
  └─→ POST /api/documents/upload
       │
       ├─→ Next.js reads file content
       ├─→ Creates Document record in database
       ├─→ Creates Analysis record (status: "pending", progress: 0)
       └─→ Returns: {document_id, analysis_id}
```

**Database State:**
```sql
Document {
  id: "cuid_abc123"
  name: "employment-contract.pdf"
  content: "EMPLOYMENT AGREEMENT This Employment..."
  size: 15420
  contentType: "application/pdf"
  createdAt: 2025-10-27T10:30:00Z
}

Analysis {
  id: "analysis_xyz789"
  documentId: "cuid_abc123"
  status: "pending"
  progress: 0
  results: null
}
```

---

### Phase 2: ML Analysis Trigger

```
Next.js Backend → POST http://localhost:8000/api/document/analyze
  │
  │ Request Body:
  │ {
  │   "analysis_id": "analysis_xyz789",
  │   "document_id": "cuid_abc123",
  │   "document_text": "EMPLOYMENT AGREEMENT...",
  │   "analysis_type": "comprehensive"
  │ }
  │
  └─→ FastAPI receives request
       │
       ├─→ Creates background task
       ├─→ Responds immediately: {status: "queued"}
       └─→ Starts async processing
```

**Analysis Status:**
```
Status: "queued" → "processing"
Progress: 0% → 10%
```

---

### Phase 3: ML Model Processing (Background)

The FastAPI service processes the document through 7 ML models sequentially:

#### 3.1 Named Entity Recognition (10% → 25%)

```
LegalBERT NER Model
  │
  ├─→ Tokenizes document text
  ├─→ Identifies 29 entity types:
  │    • Parties (person, organization)
  │    • Dates (effective date, termination date)
  │    • Financial terms (amounts, currencies)
  │    • Legal terms (obligations, rights)
  │    • Locations (addresses, jurisdictions)
  └─→ Returns: List of entities with positions

Example Output:
{
  "entities": [
    {
      "text": "Acme Corporation",
      "type": "PARTY",
      "start": 45,
      "end": 61,
      "confidence": 0.98
    },
    {
      "text": "January 1, 2025",
      "type": "DATE",
      "start": 120,
      "end": 135,
      "confidence": 0.95
    }
  ]
}
```

**Status Update:**
```
PATCH http://localhost:3000/api/analysis/analysis_xyz789/status
Body: {status: "processing", progress: 25}
```

---

#### 3.2 Clause Classification (25% → 50%)

```
CUAD Classifier (Contract Understanding Atticus Dataset)
  │
  ├─→ Segments document into paragraphs
  ├─→ Classifies each paragraph into 41 clause types:
  │    • Termination provisions
  │    • Payment terms
  │    • Confidentiality clauses
  │    • Liability limitations
  │    • Intellectual property rights
  │    • etc.
  └─→ Returns: Classified clauses with confidence scores

Example Output:
{
  "classification": {
    "document_type": "Employment Agreement",
    "confidence": 0.94,
    "clauses": [
      {
        "paragraph": "The Employee agrees to maintain...",
        "label": "Confidentiality Clause",
        "score": 0.92,
        "position": 5
      },
      {
        "paragraph": "Either party may terminate...",
        "label": "Termination Provision",
        "score": 0.88,
        "position": 12
      }
    ]
  }
}
```

**Status Update:**
```
PATCH http://localhost:3000/api/analysis/analysis_xyz789/status
Body: {status: "processing", progress: 50}
```

---

#### 3.3 Risk Assessment (50% → 75%)

```
Risk Scoring Model
  │
  ├─→ Analyzes top 5 clauses from classification
  ├─→ Evaluates risk factors:
  │    • Ambiguous language
  │    • One-sided terms
  │    • Missing standard protections
  │    • Unusual obligations
  │    • Compliance issues
  ├─→ Assigns risk scores (0-1 scale)
  └─→ Returns: Risk assessment per clause + overall score

Example Output:
{
  "risk_assessment": {
    "risk_score": 0.65,
    "risk_level": "medium",
    "risk_factors": [
      {
        "clause": "The Employee agrees to maintain...",
        "type": "Confidentiality Clause",
        "risk_score": 0.75,
        "risk_level": "high",
        "confidence": 0.89,
        "issues": [
          "Overly broad definition",
          "Indefinite duration"
        ]
      },
      {
        "clause": "Either party may terminate...",
        "type": "Termination Provision",
        "risk_score": 0.45,
        "risk_level": "low",
        "confidence": 0.92
      }
    ]
  }
}
```

**Status Update:**
```
PATCH http://localhost:3000/api/analysis/analysis_xyz789/status
Body: {status: "processing", progress: 75}
```

---

#### 3.4 Document Summarization (75% → 90%)

```
BART Summarizer (fine-tuned on legal documents)
  │
  ├─→ Processes entire document
  ├─→ Identifies key points and obligations
  ├─→ Generates concise summary (150-200 words)
  └─→ Returns: Executive summary

Example Output:
{
  "summary": "This Employment Agreement establishes a full-time 
  employment relationship between Acme Corporation (Employer) and 
  John Smith (Employee). Key terms include: annual salary of $85,000, 
  standard benefits package, 2-week notice period for termination, 
  confidentiality obligations extending 2 years post-employment, and 
  assignment of intellectual property created during employment. The 
  agreement is governed by California law and contains mandatory 
  arbitration provisions."
}
```

**Status Update:**
```
PATCH http://localhost:3000/api/analysis/analysis_xyz789/status
Body: {status: "processing", progress: 90}
```

---

#### 3.5 Final Processing (90% → 100%)

```
Result Compilation
  │
  ├─→ Aggregates all model outputs
  ├─→ Calculates summary statistics
  ├─→ Formats results for frontend display
  └─→ Prepares response payload

Final Results Object:
{
  "analysis_id": "analysis_xyz789",
  "document_id": "cuid_abc123",
  "status": "completed",
  "timestamp": "2025-10-27T10:32:45Z",
  "analysis_type": "comprehensive",
  "results": {
    "entities": [...],
    "classification": {...},
    "risk_assessment": {...},
    "summary": "...",
    "qa_results": []
  }
}
```

---

### Phase 4: Results Delivery

```
FastAPI ML Service → POST http://localhost:3000/api/analysis/results
  │
  │ Request Body: Complete analysis results
  │
  └─→ Next.js API receives results
       │
       ├─→ Updates Analysis record in database:
       │    • status: "completed"
       │    • progress: 100
       │    • results: {complete results object}
       │    • completedAt: timestamp
       │
       └─→ Data persisted in PostgreSQL/SQLite
```

**Database State:**
```sql
Analysis {
  id: "analysis_xyz789"
  documentId: "cuid_abc123"
  status: "completed"
  progress: 100
  results: {entities: [...], classification: {...}, ...}
  completedAt: 2025-10-27T10:32:45Z
}
```

---

### Phase 5: User Views Results

```
User → Dashboard (/dashboard)
  │
  ├─→ Frontend polls: GET /api/analysis/list
  │    (Auto-refresh every 3 seconds)
  │
  ├─→ Receives list of analyses with status
  │
  ├─→ Detects completed analysis
  │
  └─→ Displays results in 5 tabs:
       │
       ├─→ Tab 1: OVERVIEW
       │    • Document name, size, upload time
       │    • Analysis completion time
       │    • Overall risk score
       │    • Quick statistics
       │
       ├─→ Tab 2: ENTITIES
       │    • Extracted parties
       │    • Important dates
       │    • Financial terms
       │    • Legal terms
       │    • Locations
       │
       ├─→ Tab 3: CLASSIFICATION
       │    • Document type (with confidence)
       │    • All classified clauses
       │    • Clause types and positions
       │
       ├─→ Tab 4: RISK ASSESSMENT
       │    • Overall risk score (visual indicator)
       │    • Risk level (low/medium/high)
       │    • Detailed risk factors per clause
       │    • Identified issues
       │
       └─→ Tab 5: SUMMARY
            • AI-generated executive summary
            • Key points and obligations
            • Main terms highlighted
```

---

## 🔄 Real-Time Status Updates

Throughout the analysis process, the dashboard provides real-time feedback:

### Progress Tracking

```javascript
// Frontend polls status every 2-3 seconds
GET /api/analysis/list

Response:
{
  "analyses": [
    {
      "id": "analysis_xyz789",
      "documentName": "employment-contract.pdf",
      "status": "processing",
      "progress": 50,
      "startedAt": "2025-10-27T10:30:00Z"
    }
  ]
}

// Dashboard displays:
// ⏳ Processing... [████████░░░░░░] 50%
```

### Status Transitions

```
"pending"     →  Gray badge, no progress bar
"processing"  →  Blue badge, animated progress bar
"completed"   →  Green badge, 100% progress, clickable
"failed"      →  Red badge, error message
```

---

## 🗄️ Database Schema

### Document Model

```prisma
model Document {
  id          String     @id @default(cuid())
  name        String     // Original filename
  content     String?    @db.Text  // Full document text
  size        Int?       // File size in bytes
  contentType String?    // MIME type
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  analyses    Analysis[] // One-to-many relationship
}
```

### Analysis Model

```prisma
model Analysis {
  id             String    @id @default(cuid())
  documentId     String    // Foreign key
  status         String    @default("pending")
  progress       Int       @default(0)
  analysisType   String    @default("comprehensive")
  results        Json?     // Stores ML model results
  error          String?   @db.Text
  startedAt      DateTime  @default(now())
  completedAt    DateTime?
  updatedAt      DateTime  @updatedAt
  document       Document  @relation(fields: [documentId], references: [id])
}
```

---

## 🔐 API Communication Flow

### Next.js → FastAPI (Trigger Analysis)

```http
POST http://localhost:8000/api/document/analyze
Content-Type: application/json

{
  "analysis_id": "analysis_xyz789",
  "document_id": "cuid_abc123",
  "document_text": "EMPLOYMENT AGREEMENT...",
  "analysis_type": "comprehensive"
}

Response 200 OK:
{
  "analysis_id": "analysis_xyz789",
  "status": "queued",
  "message": "Analysis started successfully"
}
```

### FastAPI → Next.js (Status Update)

```http
PATCH http://localhost:3000/api/analysis/analysis_xyz789/status
Content-Type: application/json

{
  "status": "processing",
  "progress": 50
}

Response 200 OK:
{
  "success": true
}
```

### FastAPI → Next.js (Results Delivery)

```http
POST http://localhost:3000/api/analysis/results
Content-Type: application/json

{
  "analysis_id": "analysis_xyz789",
  "document_id": "cuid_abc123",
  "status": "completed",
  "results": {
    "entities": [...],
    "classification": {...},
    "risk_assessment": {...},
    "summary": "..."
  },
  "timestamp": "2025-10-27T10:32:45Z"
}

Response 200 OK:
{
  "success": true,
  "analysis_id": "analysis_xyz789"
}
```

---

## 🚀 Deployment Architecture

### Development Environment

```
Terminal 1: Next.js Development Server
$ cd /path/to/nyay-samiti
$ npm run dev
→ Running on http://localhost:3000

Terminal 2: FastAPI ML Service
$ cd "Legal ML"
$ source venv_py311/bin/activate
$ python main.py
→ Running on http://localhost:8000
```

### Production Considerations

1. **Database**: Upgrade from SQLite to PostgreSQL
2. **API Keys**: Implement proper authentication between services
3. **Rate Limiting**: Add rate limits to API endpoints
4. **Caching**: Cache ML model predictions for duplicate documents
5. **Scaling**: Deploy FastAPI with multiple workers (Gunicorn/uvicorn)
6. **Monitoring**: Add logging, metrics, and error tracking
7. **CORS**: Restrict CORS to specific origins
8. **File Storage**: Move from database to cloud storage (S3, etc.)

---

## 📋 Error Handling

### Upload Failures

```
Scenario: File too large / Invalid format
→ Next.js validates and returns 400 error
→ User sees error message in upload modal
```

### Analysis Failures

```
Scenario: ML model error during processing
→ FastAPI catches exception
→ Sends failed status to Next.js:
  POST /api/analysis/results
  {
    "analysis_id": "...",
    "status": "failed",
    "error": "Model loading failed: ..."
  }
→ Next.js updates database status: "failed"
→ Dashboard shows red badge with error message
```

### Network Failures

```
Scenario: FastAPI service unavailable
→ Next.js mlService.analyzeDocument() fails
→ Analysis record marked as "failed"
→ User notified in dashboard
```

---

## 🔧 Configuration

### Environment Variables

**Next.js (.env)**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/nyay_samiti"
ML_SERVICE_URL="http://localhost:8000/api"
ML_API_KEY="your_secret_key"
```

**FastAPI (Legal ML/.env)**
```env
BACKEND_URL="http://localhost:3000/api"
BACKEND_API_KEY="your_secret_key"
```

---

## 📊 Performance Metrics

**Average Processing Times:**
- Document Upload: < 1 second
- NER Extraction: 2-4 seconds
- Clause Classification: 3-5 seconds
- Risk Assessment: 1-2 seconds
- Summarization: 2-3 seconds
- **Total Analysis Time: 10-15 seconds** (average for 5-10 page contract)

**System Requirements:**
- RAM: 8GB minimum (ML models require ~4-6GB)
- CPU: Multi-core recommended (parallel processing)
- Disk: ~10GB for models and checkpoints
- Network: Low latency between Next.js and FastAPI

---

## 🎯 Summary

The Nyay-Samiti workflow provides a seamless, end-to-end solution for legal document analysis:

1. **User uploads** document via intuitive interface
2. **Next.js backend** stores document and creates analysis record
3. **FastAPI ML service** processes document through 7 AI models
4. **Real-time updates** keep user informed of progress
5. **Comprehensive results** displayed in organized dashboard
6. **Database persistence** ensures data is never lost

The architecture is designed for **scalability**, **reliability**, and **user experience**, making legal document analysis accessible and efficient.
