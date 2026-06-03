# Setup & Run Guide - MedGraph Professional Platform

## 📂 Project Structure

```
med_graph/
├── app/                          # Backend (Python/FastAPI)
│   ├── api.py                   # FastAPI server (NEW)
│   ├── pipeline.py              # Unchanged
│   ├── llm_layer.py             # Unchanged
│   ├── neo4j_db.py              # Updated with graph helpers
│   ├── parser.py                # Unchanged
│   ├── pub_med_client.py        # Unchanged
│   ├── config.py                # Unchanged
│   ├── main.py                  # DEPRECATED (use api.py instead)
│   └── requirements.txt          # Updated
│
├── frontend/                      # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchHeader.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ResultsPanel.tsx
│   │   │   ├── KnowledgeGraph.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   └── useSearch.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
└── COMPLETE_README.md
```

## 🚀 Complete Setup Instructions

### Step 1: Get Your API Keys

**A. Google Gemini API**
1. Go to https://ai.google.dev/gemini-api/docs/api-key
2. Click "Get API Key"
3. Create a new Google Cloud project or select existing
4. Copy your API key

**B. Neo4j Database**
- **Option 1: Local (Recommended for dev)**
  - Download Neo4j Desktop: https://neo4j.com/download/
  - Create new database, set password
  - Start database
  
- **Option 2: Cloud (Production)**
  - Go to https://neo4j.com/cloud/aura/
  - Create account → New database
  - Get connection string

**C. NCBI API Key (Optional)**
1. Go to https://www.ncbi.nlm.nih.gov/account/
2. Register/Login
3. Account Settings → API Key Management
4. Create new API key

### Step 2: Backend Setup

```bash
# Navigate to project root
cd /Users/pro2019/Desktop/med/med_graph

# Create .env file in app directory
cat > app/.env << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password_here
NEO4J_DB=neo4j
NCBI_API_KEY=your_ncbi_api_key_here
EOF

# Install Python dependencies
pip install -r app/requirements.txt

# IMPORTANT: Make sure Neo4j is running before next step
# (via Neo4j Desktop or Docker)
```

### Step 3: Start FastAPI Backend

```bash
cd /Users/pro2019/Desktop/med/med_graph

# Start the server
uvicorn app.api:app --reload --port 8000

# You'll see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete

# Test the server - open browser:
# http://localhost:8000/docs  (Interactive API documentation)
```

### Step 4: Frontend Setup

**In a NEW terminal:**

```bash
cd /Users/pro2019/Desktop/med/med_graph/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# You'll see output like:
# VITE v4.x.x ready in xxx ms
# ➜  Local:   http://localhost:3000

# Open browser: http://localhost:3000
```

## 🎮 Using the Application

1. **Open http://localhost:3000** in your browser
2. Enter a medical query (e.g., "Type 2 Diabetes treatments")
3. Click search or press Enter
4. System will:
   - Generate embedding
   - Search local Neo4j database
   - Fall back to PubMed if needed
   - Display AI summary + papers
   - Show interactive knowledge graph
5. Switch between "Summary & Papers" and "Knowledge Graph" tabs

## 📊 Example Queries

- "What are the latest treatments for lung cancer?"
- "CRISPR gene therapy clinical trials"
- "COVID-19 long-term effects"
- "Type 2 Diabetes management 2024"
- "Immunotherapy for melanoma"

## 🔧 Configuration

### Backend (.env)

```env
# Required
GEMINI_API_KEY=sk-...                    # Google Gemini API key
NEO4J_URI=bolt://localhost:7687          # Neo4j connection
NEO4J_USER=neo4j                         # Neo4j username
NEO4J_PASSWORD=your_password             # Neo4j password
NEO4J_DB=neo4j                           # Database name

# Optional but recommended
NCBI_API_KEY=your_api_key                # NCBI/PubMed API key
```

### Frontend (Automatic)

Frontend automatically connects to:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### Environment

- **Python**: 3.8+
- **Node.js**: 16+
- **Neo4j**: 5.0+ (with vector index support)

## 🌟 Features

### Backend (FastAPI)
- ✅ RESTful API with automatic documentation
- ✅ Semantic search with vector embeddings
- ✅ Knowledge graph management
- ✅ Hybrid search (local + PubMed)
- ✅ AI summarization
- ✅ CORS enabled for frontend

### Frontend (React)
- ✅ Beautiful glassmorphism design
- ✅ Real-time search with debouncing
- ✅ Interactive Cytoscape.js graph
- ✅ Smooth Framer Motion animations
- ✅ Responsive mobile design
- ✅ Dark professional theme
- ✅ Error handling & loading states

## 📈 Performance Optimization

### Backend
- Vector caching in Neo4j
- Connection pooling
- Query optimization
- Background processing ready

### Frontend
- React Query caching
- Lazy component loading
- Optimized re-renders
- CSS-in-JS with Tailwind

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'app'"
**Solution**: Change to project directory first
```bash
cd /Users/pro2019/Desktop/med/med_graph
python -m app.api
```

### "No API key was provided"
**Solution**: Make sure `.env` file exists in `app/` with correct keys
```bash
ls -la app/.env
cat app/.env  # verify keys are set
```

### "Connection refused" (Neo4j)
**Solution**: Start Neo4j database first
- Neo4j Desktop: Click "Start"
- Or via Docker: `docker run -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j`

### Frontend can't connect to backend
**Solution**: Make sure backend is running on port 8000
```bash
# Check if running
curl http://localhost:8000/health
```

### "Port already in use"
**Solution**: Kill process and restart
```bash
# Backend (8000)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Frontend (3000)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📚 API Documentation

Once backend is running, visit:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

```
POST /api/search
  Body: { "query": string, "limit": int, "threshold": float }
  Returns: { summary, papers[], graph_data }

GET /api/graph
  Returns: { nodes[], edges[] }

POST /api/semantic-search
  Body: { "query": string, "limit": int }
  Returns: { results[], count }

GET /health
  Returns: { status, service, version }
```

## 🎯 Next Steps

1. **Search**: Try your first query
2. **Explore**: Click papers and examine relationships
3. **Visualize**: Switch to graph tab for knowledge visualization
4. **Customize**: Modify components in `frontend/src/components/`
5. **Deploy**: Ready for production with Docker

## 📦 Production Deployment

### Backend
```bash
# Build
pip install -r app/requirements.txt

# Use production ASGI server
gunicorn app.api:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
# Build
cd frontend
npm run build

# Serves optimized build from dist/
npm run preview
```

## 🤝 Support

For issues:
1. Check backend logs: `uvicorn output`
2. Check frontend console: Browser DevTools (F12)
3. Verify `.env` file: `cat app/.env`
4. Test API: http://localhost:8000/health

---

**Ready to explore medical literature with AI-powered intelligence!** 🚀
