from app.pub_med_client import search_pubmed, fetch_pubmed_details
from app.parser import parse_pubmed
from app.neo4j_db import Neo4jDB
from app.llm_layer import summarize_results, generate_embedding

db = Neo4jDB()

def hybrid_pipeline(query):
    print("Generating query embedding...")
    query_embedding = generate_embedding(query)

    local = db.search_local(query_embedding)

    if len(local) < 5:
        print("Fetching from PubMed...")

        ids = search_pubmed(query, 20)
        xml = fetch_pubmed_details(ids)

        papers = parse_pubmed(xml)
        
        print("Generating embeddings for new papers...")
        for p in papers:
            # Generate embedding based on abstract (or title + abstract)
            p['embedding'] = generate_embedding(p['title'] + " " + p['abstract'])

        db.insert_papers(papers)

        local = db.search_local(query_embedding)

    else:
        print("Using cached graph data")

    summary = summarize_results(query, local)

    return summary, local