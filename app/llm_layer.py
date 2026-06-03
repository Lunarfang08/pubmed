import logging
from google import genai
from app.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

_client = None
LLM_MODEL = "gemini-3-flash-preview"
EMBED_MODEL = "gemini-embedding-2"


def _get_client():
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY environment variable is not set")
        logger.info("Initializing Gemini client...")
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def generate_embedding(text):
    result = _get_client().models.embed_content(
        model=EMBED_MODEL,
        contents=text
    )
    return result.embeddings[0].values


def summarize_results(query, results):

    context = "\n\n".join([f"Title: {r['title']}\nAbstract: {r['abstract']}" for r in results])

    prompt = f"""
    Answer the question based on the research papers below.

    Question: {query}

    Papers:
    {context}

    Give a concise, factual summary.
    """

    response = _get_client().models.generate_content(
        model=LLM_MODEL,
        contents=prompt
    )
    return response.text
