# 🏛️ Nyay-Samiti - AI Legal Document Analysis Platform

> Advanced Legal Document Analysis powered by 7 fine-tuned ML models with Next.js frontend and FastAPI backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)

## 📋 Overview

Nyay-Samiti is a comprehensive AI-powered platform for analyzing legal documents. It combines a **Next.js** frontend/backend with a **FastAPI** ML service to provide real-time analysis using 7 specialized machine learning models.

### ✨ Key Features

- 🔍 **Named Entity Recognition** - Extract 29 types of legal entities (parties, dates, amounts, etc.)
- 📋 **Clause Classification** - Classify 41 types of contract clauses (CUAD dataset)
- ⚠️ **Risk Assessment** - Identify and score risk factors in contracts
- 📝 **Document Summarization** - Generate concise summaries using BART
- ❓ **Question Answering** - Ask questions about your documents
- 🔄 **Clause Comparison** - Find similar clauses across documents
- 💡 **Recommendations** - Get AI-powered clause improvements
- 📊 **Real-time Dashboard** - Track analysis progress in real-time
- 🎯 **Comprehensive Results** - View results in organized tabs

## 🎯 Use Cases

- **Legal Professionals** - Quickly analyze contracts and identify risks
- **Business Teams** - Understand contract terms before signing
- **Compliance Officers** - Ensure contracts meet regulatory requirements
- **Law Students** - Learn contract analysis techniques
- **Research** - Study legal document patterns and structures

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Next.js Application                      │
│                   (Port 3000)                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Frontend Pages                                  │   │
│  │  • /upload - Document upload                     │   │
│  │  • /dashboard - Analysis results                 │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Backend API Routes                              │   │
│  │  • /api/documents/upload                         │   │
│  │  • /api/analysis/list                            │   │
│  │  • /api/analysis/[id]/status                     │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│            FastAPI ML Service (Port 8000)                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  7 AI Models                                     │   │
│  │  1. LegalBERT NER (90%+ accuracy)                │   │
│  │  2. CUAD Classifier (77.59% accuracy)            │   │
│  │  3. Risk Scorer (84.16% accuracy)                │   │
│  │  4. BART Summarizer (ROUGE-1: 56.81%)            │   │
│  │  5. RoBERTa Q&A (87.18% accuracy)                │   │
│  │  6. Clause Comparator (MAE: 0.24)                │   │
│  │  7. T5 Recommender (ROUGE: 99.88%)               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Python** 3.11+
- **PostgreSQL** (or SQLite for development)
- **8GB+ RAM** (for ML models)
- **~10GB disk space** (for ML models)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/ronbell1/nyay-samiti.git
cd nyay-samiti
```

#### 2. Setup Next.js Frontend/Backend

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and configure your DATABASE_URL

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

#### 3. Setup FastAPI ML Service

```bash
cd "Legal ML"

# Create virtual environment
python3.11 -m venv venv_py311
source venv_py311/bin/activate  # On Windows: venv_py311\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set BACKEND_URL=http://localhost:3000/api
```

#### 4. Download ML Models

⚠️ **Important**: The trained ML models (38GB) are not included in the repository due to size constraints.

**Download the models from**: [COMING SOON - Add your download link]

Extract the models to: `Legal ML/checkpoints/`

The structure should be:
```
Legal ML/checkpoints/
├── legalbert/                  # NER model (~440MB)
├── legalbert_cuad_classifier/  # Clause classifier (~438MB)
├── bart_billsum_finetuned/     # Summarization (~1.6GB)
├── legalbert_risk_scorer/      # Risk assessment (~440MB)
├── legal_comparison_model/     # Clause comparison (~420MB)
├── t5_recommendations/         # Recommendations (~892MB)
└── legalbert_qa/               # Q&A model (~498MB)
```

### Running the Application

#### Start Both Servers

**Terminal 1 - Next.js:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - FastAPI:**
```bash
cd "Legal ML"
source venv_py311/bin/activate
python main.py
# Runs on http://localhost:8000
```

#### Access the Application

- **Frontend Dashboard**: http://localhost:3000/dashboard
- **Upload Page**: http://localhost:3000/upload
- **FastAPI Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📖 Documentation

- **[WORKFLOW.md](./WORKFLOW.md)** - Complete workflow and architecture guide
- **[MODEL_PERFORMANCE.md](./MODEL_PERFORMANCE.md)** - Model accuracy and performance metrics
- **[Legal ML/README.md](./Legal%20ML/README.md)** - ML service specific documentation

## 🎮 Usage Example

### 1. Upload a Document

Navigate to http://localhost:3000/upload and upload a legal document (PDF, DOC, DOCX, or TXT).

### 2. View Analysis Progress

The dashboard automatically refreshes and shows real-time progress:
- Pending → Processing (with progress %) → Completed

### 3. View Results

Once complete, click on the document to see 5 tabs of results:

- **Overview** - Summary statistics and key metrics
- **Entities** - Extracted parties, dates, amounts, locations
- **Classification** - Identified clause types with confidence scores
- **Risk Assessment** - Risk score and identified issues
- **Summary** - AI-generated executive summary

## 🔌 API Integration

### Upload Document

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@contract.pdf"
```

### Check Analysis Status

```bash
curl http://localhost:3000/api/analysis/list
```

### Get Specific Analysis

```bash
curl http://localhost:3000/api/analysis/{analysis_id}/status
```

## 📊 Model Performance

| Model | Task | Accuracy | Speed (CPU) |
|-------|------|----------|-------------|
| LegalBERT NER | Entity Recognition | 90%+ | 3.2s |
| CUAD Classifier | Clause Classification | 77.59% | 4.5s |
| Risk Scorer | Risk Assessment | 84.16% | 2.1s |
| BART Summarizer | Summarization | ROUGE-1: 56.81% | 8.3s |
| RoBERTa Q&A | Question Answering | 87.18% | 1.5s per question |

**Total Analysis Time**: 10-15 seconds per document (5-10 pages)

For detailed metrics, see [MODEL_PERFORMANCE.md](./MODEL_PERFORMANCE.md)

## 🛠️ Technology Stack

### Frontend/Backend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL/SQLite** - Database
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations

### ML Service
- **FastAPI** - Python web framework
- **PyTorch** - Deep learning framework
- **Transformers** - HuggingFace models
- **Sentence-BERT** - Semantic similarity
- **spaCy** - NLP utilities

## 📁 Project Structure

```
nyay-samiti/
├── app/                    # Next.js application
│   ├── api/               # Backend API routes
│   ├── dashboard/         # Dashboard page
│   └── upload/            # Upload page
├── components/            # React components
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   └── ml-service.ts     # ML service integration
├── prisma/               # Database schema
├── tests/                # Test documents
├── docs/                 # Documentation
│   ├── WORKFLOW.md
│   └── MODEL_PERFORMANCE.md
└── Legal ML/             # FastAPI ML service
    ├── app/
    │   ├── api/          # FastAPI routes
    │   └── services/     # ML model services
    ├── checkpoints/      # Trained models (not in repo)
    ├── datasets/         # Dataset preparation scripts
    ├── training/         # Model training scripts
    └── main.py           # FastAPI entry point
```

## 🧪 Testing

### Test Documents

Sample test documents are provided in the `tests/` directory:
- `test-employment-contract.txt`
- `test-nda-agreement.txt`
- `test-software-license.txt`

### Run Tests

```bash
# Next.js tests
npm test

# ML service tests
cd "Legal ML"
pytest tests/
```

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HuggingFace** - For transformer models and datasets
- **CUAD Dataset** - Contract Understanding Atticus Dataset
- **InLegalNER** - Legal named entity recognition dataset
- **BillSum** - Legal summarization dataset
- **OpenAI** - For inspiration in AI applications

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Add support for more document formats (DOCX, PDF parsing improvements)
- [ ] Multi-language support
- [ ] Batch document processing
- [ ] Document comparison features
- [ ] Export analysis results (PDF, JSON, CSV)
- [ ] User authentication and document history
- [ ] API rate limiting and caching
- [ ] GPU support for faster inference
- [ ] Docker deployment configuration
- [ ] Cloud deployment guides (AWS, Azure, GCP)

## ⚠️ Disclaimer

This tool is designed to assist with legal document analysis but should not replace professional legal advice. Always consult with qualified legal professionals for important legal matters.

---

**Made with ❤️ for the legal tech community**
