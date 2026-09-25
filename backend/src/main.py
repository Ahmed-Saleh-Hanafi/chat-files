from fastapi import FastAPI
from core import get_settings
from api import(
    base_router,
    
)

app = FastAPI(
    title=get_settings().APP_NAME,
    version=get_settings().APP_VERSION
)

@app.on_event("startup")
async def startup():
    pass

@app.on_event("shutdown")
async def shutdown():
    pass


# Registers API routers
app.include_router(base_router)
