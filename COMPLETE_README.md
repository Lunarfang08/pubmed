# MedGraph - Professional Medical Literature Search with Knowledge Graph

A full-stack application combining semantic search, knowledge graphs, and AI-powered summarization for medical research.

## 🏗 Architecture

```
MedGraph/
├── backend/                    (FastAPI + Python)
│   ├── app/
│   │   ├── api.py             # FastAPI endpoints
│   │   ├── pipeline.py        # Hybrid search orchestrator
│   │   ├── llm_layer.py       # Gemini embeddings & summarization
│   │   ├── neo4j_db.py        # Knowledge graph management
│   │   ├── parser.py          # Paper metadata extraction
│   │   ├── pub_med_client.py  # PubMed API integration
│   │   └── config.py
│   ├── requirements.txt
│   └── .env                   # Configuration
│
└── frontend/                   (React + TypeScript)
    ├── src/
    │   ├── components/        # UI components
    │   ├── hooks/            # Custom React hooks
    │   ├── App.tsx           # Main application
    │   └── main.tsx          # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🎯 Features

- **Semantic Search**: Vector-based search using Gemini embeddings
- **Knowledge Graph Visualization**: Interactive Neo4j graph with Cytoscape.js
- **AI Summarization**: Google Gemini 3-flash for concise paper summaries
- **PubMed Integration**: Automatic fallback to fetch fresh research papers
- **Professional UI**: Beautiful glassmorphism design with Tailwind CSS
- **Real-time Graph**: Dynamic visualization of paper-author-disease relationships
- **Smooth Animations**: Framer motion for polished user experience

## 🚀 Quick Start

### Backend Setup

```bash
# 1. Install dependencies
cd app
pip install -r requirements.txt

# 2. Configure environment (.env)
GEMINI_API_KEY=your_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
NCBI_API_KEY=your_key_here

# 3. Start Neo4j database
# (via Docker or Neo4j Desktop)

# 4. Run FastAPI server
cd ..
uvicorn app.api:app --reload --port 8000
```

### Frontend Setup

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start development server
npm run dev

# Open browser: http://localhost:3000
```

## 📡 API Endpoints

### Search
- `POST /api/search` - Hybrid search (local + PubMed fallback)
- `POST /api/semantic-search` - Pure semantic search

### Graph
- `GET /api/graph` - Full knowledge graph
- `POST /api/graph/subgraph` - Subgraph for specific papers
- `GET /api/graph/stats` - Graph statistics

### System
- `GET /health` - Health check

## 🔧 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: Neo4j (Knowledge Graph)
- **AI**: Google Gemini API
- **External APIs**: NCBI PubMed

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + custom animations
- **Visualization**: Cytoscape.js + D3.js
- **Animation**: Framer Motion
- **HTTP**: Axios + React Query

## 📊 Workflow

1. User enters medical query
2. System generates semantic embedding (Gemini)
3. Searches local Neo4j graph via vector index
4. If results < 5 papers: Fetches from PubMed API
5. Parses and stores new papers in Neo4j
6. Generates AI summary of combined results
7. Displays results + interactive knowledge graph

## 🎨 UI Highlights

- **Glassmorphism Design**: Modern frosted glass effect
- **Gradient Text**: Professional typography
- **Smooth Transitions**: Framer Motion animations
- **Dark Theme**: Eye-friendly professional interface
- **Responsive Grid**: Mobile-first responsive design
- **Interactive Graph**: Hover effects + pan/zoom controls

## 📝 Environment Variables

Create `.env` in `app/` directory:

```env
NCBI_API_KEY=
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=
NEO4J_DB=neo4j
GEMINI_API_KEY=
```

## 🔐 API Keys Required

1. **Google Gemini**: https://ai.google.dev/gemini-api/docs/api-key
2. **Neo4j**: Local instance or Neo4j Aura
3. **NCBI (Optional)**: https://www.ncbi.nlm.nih.gov/account/

## 📦 Deployment

### Backend
```bash
uvicorn app.api:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
npm run build
npm run preview
```

## 🧪 Development

```bash
# Backend tests
pytest app/

# Frontend type checking
npm run type-check

# Linting
npm run lint
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ for medical researchers and healthcare professionals**
