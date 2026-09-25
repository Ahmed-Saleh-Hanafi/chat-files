"""
Base API to test backend is worked or not
"""
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from services import AppServices

base_router = APIRouter(
    prefix="/api/v1/base",
    tags=["Base"]
)

@base_router.get("/")
async def base()-> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content= AppServices().get_app_info()
    )