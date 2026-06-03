#!/bin/bash
# MedGraph Quick Start Script
# Run this script from project root: bash QUICK_START.sh

set -e

echo "================================"
echo "🚀 MedGraph Quick Start Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found: $(python3 --version)${NC}"

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

echo ""
echo -e "${BLUE}Step 1: Setting up backend...${NC}"

# Update requirements.txt is already done in the file
pip install -r app/requirements.txt --quiet
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 2: Setting up frontend...${NC}"

cd frontend
npm install --silent
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""
echo -e "${YELLOW}Step 3: Configuration${NC}"
echo "Create app/.env with your API keys:"
echo ""
echo "  GEMINI_API_KEY=your_key_here"
echo "  NEO4J_URI=bolt://localhost:7687"
echo "  NEO4J_USER=neo4j"
echo "  NEO4J_PASSWORD=your_password"
echo "  NCBI_API_KEY=your_key_here"
echo ""

if [ ! -f "app/.env" ]; then
    echo -e "${YELLOW}❓ app/.env not found. Create it now (y/n)?${NC}"
    read -r response
    if [[ "$response" == "y" ]]; then
        cat > app/.env << 'EOF'
GEMINI_API_KEY=
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=
NEO4J_DB=neo4j
NCBI_API_KEY=
EOF
        echo -e "${GREEN}✓ Created app/.env. Please edit with your API keys.${NC}"
    fi
else
    echo -e "${GREEN}✓ app/.env already exists${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Edit app/.env with your API keys"
echo "   - Get Gemini key: https://ai.google.dev/gemini-api/docs/api-key"
echo "   - Start Neo4j: Neo4j Desktop or Docker"
echo ""
echo "2. Start backend (Terminal 1):"
echo "   ${YELLOW}uvicorn app.api:app --reload --port 8000${NC}"
echo ""
echo "3. Start frontend (Terminal 2):"
echo "   ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo "4. Open browser:"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "API Docs:"
echo "   ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
