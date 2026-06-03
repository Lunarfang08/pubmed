"""Vercel serverless entry point — wraps FastAPI with Mangum."""
from mangum import Mangum
from app.api import app

handler = Mangum(app, lifespan="off")
