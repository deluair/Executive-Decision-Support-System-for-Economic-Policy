from fastapi import APIRouter

from app.api.api_v1.endpoints import economic

api_router = APIRouter()
api_router.include_router(economic.router, prefix="/economic", tags=["economic"]) 