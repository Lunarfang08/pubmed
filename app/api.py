"""
FastAPI backend for MedGraph - Medical Literature Search & Knowledge Graph
"""

import asyncio
import hashlib
import os
import time
import traceback
from collections import OrderedDict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel
from typing import List, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MedGraph API",
    description="Medical Literature Search with Knowledge Graph",
    version="2.0.0",
    default_response_class=ORJSONResponse,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cache: OrderedDict[str, tuple[float, dict]] = OrderedDict()
CACHE_TTL = 300
CACHE_MAX = 50


def _cache_key(query: str) -> str:
    return hashlib.md5(query.strip().lower().encode()).hexdigest()


def _get_cached(key: str) -> Optional[dict]:
    if key in _cache:
        ts, data = _cache[key]
        if time.time() - ts < CACHE_TTL:
            _cache.move_to_end(key)
            return data
        del _cache[key]
    return None


def _set_cached(key: str, data: dict):
    _cache[key] = (time.time(), data)
    if len(_cache) > CACHE_MAX:
        _cache.popitem(last=False)


class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 10
    threshold: Optional[float] = 0.80


class SearchResponse(BaseModel):
    summary: str
    papers: List[dict]
    graph_data: dict


@app.get("/health", tags=["System"])
async def health_check():
    # Quick env check
    missing = []
    for var in ["NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD", "GEMINI_API_KEY"]:
        if not os.getenv(var):
            missing.append(var)
    if missing:
        return {"status": "warning", "missing_env_vars": missing}
    return {"status": "healthy", "service": "MedGraph API", "version": "2.0.0"}


@app.post("/api/search", tags=["Search"])
async def search_medical_literature(request: SearchRequest):
    try:
        logger.info(f"Processing search query: {request.query}")

        key = _cache_key(request.query)
        cached = _get_cached(key)
        if cached:
            logger.info("Returning cached result")
            return cached

        # Lazy imports — only load heavy deps when actually needed
        from app.pipeline import hybrid_pipeline
        from app.neo4j_db import Neo4jDB

        summary, papers = await asyncio.to_thread(hybrid_pipeline, request.query)

        db = Neo4jDB()
        graph_data = await asyncio.to_thread(
            db.get_subgraph_for_papers,
            [p.get("title", "") for p in papers],
        )
        db.close()

        logger.info(f"Search completed. Found {len(papers)} papers")

        result = {
            "summary": summary,
            "papers": papers,
            "graph_data": graph_data,
        }
        _set_cached(key, result)
        return result

    except Exception as e:
        tb = traceback.format_exc()
        logger.error(f"Search error: {str(e)}\n{tb}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/api/papers", tags=["Papers"])
async def get_all_papers():
    try:
        from app.neo4j_db import Neo4jDB
        db = Neo4jDB()
        papers = await asyncio.to_thread(db.get_all_papers)
        db.close()
        return {"papers": papers, "total": len(papers)}
    except Exception as e:
        logger.error(f"Error fetching papers: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch papers: {str(e)}")


@app.get("/api/graph", tags=["Graph"])
async def get_full_graph():
    try:
        from app.neo4j_db import Neo4jDB
        db = Neo4jDB()
        graph_data = await asyncio.to_thread(db.get_full_graph)
        db.close()
        return graph_data
    except Exception as e:
        logger.error(f"Graph error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch graph: {str(e)}")


@app.post("/api/graph/subgraph", tags=["Graph"])
async def get_subgraph(papers: List[str]):
    try:
        from app.neo4j_db import Neo4jDB
        db = Neo4jDB()
        subgraph = await asyncio.to_thread(db.get_subgraph_for_papers, papers)
        db.close()
        return subgraph
    except Exception as e:
        logger.error(f"Subgraph error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch subgraph: {str(e)}")


@app.get("/api/graph/stats", tags=["Graph"])
async def get_graph_statistics():
    try:
        from app.neo4j_db import Neo4jDB
        db = Neo4jDB()
        stats = await asyncio.to_thread(db.get_graph_statistics)
        db.close()
        return stats
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")


@app.post("/api/semantic-search", tags=["Search"])
async def semantic_search(query: str, limit: int = 10, threshold: float = 0.80):
    try:
        from app.llm_layer import generate_embedding
        from app.neo4j_db import Neo4jDB
        query_embedding = await asyncio.to_thread(generate_embedding, query)
        db = Neo4jDB()
        results = await asyncio.to_thread(db.search_local, query_embedding, limit, threshold)
        db.close()
        return {"query": query, "results": results, "count": len(results)}
    except Exception as e:
        logger.error(f"Semantic search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "MedGraph API",
        "description": "Medical Literature Search with Knowledge Graph",
        "docs": "/docs",
        "version": "2.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
