import logging
from app.pub_med_client import search_pubmed, fetch_pubmed_details
from app.parser import parse_pubmed
from app.neo4j_db import Neo4jDB
from app.llm_layer import summarize_results, generate_embedding

logger = logging.getLogger(__name__)

_db = None


def _get_db():
    global _db
    if _db is None:
        logger.info("Initializing Neo4j connection...")
        _db = Neo4jDB()
    return _db


def hybrid_pipeline(query):
    db = _get_db()

    logger.info("Generating query embedding...")
    query_embedding = generate_embedding(query)

    logger.info("Searching Neo4j for similar papers...")
    local = db.search_local(query_embedding)

    if len(local) < 5:
        logger.info(f"Only {len(local)} local results. Fetching from PubMed...")

        ids = search_pubmed(query, 20)
        logger.info(f"Found {len(ids)} PubMed IDs. Fetching details...")
        xml = fetch_pubmed_details(ids)

        papers = parse_pubmed(xml)
        logger.info(f"Parsed {len(papers)} papers. Generating embeddings...")

        for p in papers:
            p['embedding'] = generate_embedding(p['title'] + " " + p['abstract'])

        db.insert_papers(papers)
        logger.info("Papers inserted. Re-searching...")

        local = db.search_local(query_embedding)

    else:
        logger.info(f"Using {len(local)} cached results")

    logger.info(f"Summarizing {len(local)} results...")
    summary = summarize_results(query, local)

    return summary, local
