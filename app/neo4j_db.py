import logging
from neo4j import GraphDatabase
from app.config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DB

logger = logging.getLogger(__name__)


class Neo4jDB:

    def __init__(self):
        if not NEO4J_URI:
            raise RuntimeError("NEO4J_URI environment variable is not set. Add it in Vercel → Settings → Environment Variables.")
        if not NEO4J_USER:
            raise RuntimeError("NEO4J_USER environment variable is not set.")
        if not NEO4J_PASSWORD:
            raise RuntimeError("NEO4J_PASSWORD environment variable is not set.")

        logger.info(f"Connecting to Neo4j at {NEO4J_URI}...")
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

        # Verify connection works before creating indexes
        try:
            self.driver.verify_connectivity()
            logger.info("Neo4j connection verified.")
        except Exception as e:
            logger.error(f"Neo4j connection failed: {e}")
            raise RuntimeError(f"Cannot connect to Neo4j at {NEO4J_URI}: {e}")

        self._init_vector_index()

    def _init_vector_index(self):
        db_name = NEO4J_DB or "neo4j"
        try:
            with self.driver.session(database=db_name) as session:
                session.run("""
                CREATE VECTOR INDEX paper_embeddings_v2 IF NOT EXISTS
                FOR (p:Paper) ON (p.embedding)
                OPTIONS {indexConfig: {
                  `vector.dimensions`: 3072,
                  `vector.similarity_function`: 'cosine'
                }}
                """)
        except Exception as e:
            logger.warning(f"Could not create vector index (may already exist): {e}")

    def close(self):
        self.driver.close()

    def _session(self):
        db_name = NEO4J_DB or "neo4j"
        return self.driver.session(database=db_name)

    def insert_papers(self, papers):
        with self._session() as session:
            for p in papers:
                session.run("""
                MERGE (p:Paper {pmid:$pmid})
                SET p.title=$title, p.abstract=$abstract, p.embedding=$embedding
                """, pmid=p["pmid"], title=p["title"], abstract=p["abstract"], embedding=p.get("embedding"))

                for author in p["authors"]:
                    session.run("""
                    MERGE (a:Author {name:$name})
                    MERGE (p:Paper {pmid:$pmid})
                    MERGE (a)-[:WROTE]->(p)
                    """, name=author, pmid=p["pmid"])

                for term in p["mesh_terms"]:
                    session.run("""
                    MERGE (d:Disease {name:$term})
                    MERGE (p:Paper {pmid:$pmid})
                    MERGE (p)-[:ABOUT]->(d)
                    """, term=term, pmid=p["pmid"])

    def search_local(self, query_embedding, limit=10, threshold=0.80):
        with self._session() as session:
            result = session.run("""
            CALL db.index.vector.queryNodes('paper_embeddings_v2', $limit, $embedding)
            YIELD node AS p, score
            WHERE score >= $threshold
            RETURN p.title AS title, p.abstract AS abstract, score
            """, limit=limit, embedding=query_embedding, threshold=threshold)

            return [dict(r) for r in result]

    def get_full_graph(self):
        with self._session() as session:
            nodes_result = session.run("""
            MATCH (n)
            RETURN elementId(n) as id, labels(n)[0] as type, 
                   CASE 
                       WHEN n.title IS NOT NULL THEN n.title
                       WHEN n.name IS NOT NULL THEN n.name
                       ELSE 'Unknown'
                   END as label
            LIMIT 500
            """)
            
            nodes = [{"id": str(r["id"]), "label": r["label"], "type": r["type"]} 
                    for r in nodes_result]
            
            edges_result = session.run("""
            MATCH (a)-[r]-(b)
            RETURN elementId(a) as source, elementId(b) as target, type(r) as relationship
            LIMIT 1000
            """)
            
            edges = [{"source": str(r["source"]), "target": str(r["target"]), 
                     "relationship": r["relationship"]} for r in edges_result]
            
            return {"nodes": nodes, "edges": edges}

    def get_subgraph_for_papers(self, paper_titles):
        with self._session() as session:
            nodes_result = session.run("""
            MATCH (p:Paper)-[r]-(connected)
            WHERE p.title IN $titles OR p.pmid IN $titles
            RETURN DISTINCT elementId(p) as id, 'Paper' as type, p.title as label
            UNION
            MATCH (p:Paper)-[r]-(connected)
            WHERE p.title IN $titles OR p.pmid IN $titles
            RETURN DISTINCT elementId(connected) as id, labels(connected)[0] as type, 
                   CASE 
                       WHEN connected.name IS NOT NULL THEN connected.name
                       ELSE 'Unknown'
                   END as label
            """, titles=paper_titles)
            
            nodes = [{"id": str(r["id"]), "label": r["label"], "type": r["type"]} 
                    for r in nodes_result]
            
            edges_result = session.run("""
            MATCH (p:Paper)-[r]-(connected)
            WHERE p.title IN $titles OR p.pmid IN $titles
            RETURN elementId(p) as source, elementId(connected) as target, type(r) as relationship
            """, titles=paper_titles)
            
            edges = [{"source": str(r["source"]), "target": str(r["target"]), 
                     "relationship": r["relationship"]} for r in edges_result]
            
            return {"nodes": nodes, "edges": edges}

    def get_all_papers(self):
        with self._session() as session:
            result = session.run("""
            MATCH (p:Paper)
            RETURN p.pmid as pmid, p.title as title, p.abstract as abstract
            LIMIT 100
            """)
            
            return [dict(r) for r in result]

    def get_graph_statistics(self):
        with self._session() as session:
            stats = {
                "papers": session.run("MATCH (p:Paper) RETURN count(p) as count").single()["count"],
                "authors": session.run("MATCH (a:Author) RETURN count(a) as count").single()["count"],
                "diseases": session.run("MATCH (d:Disease) RETURN count(d) as count").single()["count"],
                "relationships": session.run("MATCH ()-[r]-() RETURN count(r) as count").single()["count"]
            }
            
            return stats
