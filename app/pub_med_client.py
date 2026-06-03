import requests
from app.config import NCBI_API_KEY

BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

def search_pubmed(query, retmax=20):
    url = f"{BASE}/esearch.fcgi"
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": retmax,
        "retmode": "json",
        "api_key": NCBI_API_KEY
    }
    res = requests.get(url, params=params)
    return res.json()["esearchresult"]["idlist"]


def fetch_pubmed_details(ids):
    url = f"{BASE}/efetch.fcgi"
    params = {
        "db": "pubmed",
        "id": ",".join(ids),
        "retmode": "xml",
        "api_key": NCBI_API_KEY
    }
    return requests.get(url, params=params).text