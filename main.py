from __future__ import annotations

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db import init_db
from app.web import router as web_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    init_db()

    app.include_router(web_router)
    app.mount("/static", StaticFiles(directory="app/static"), name="static")
    return app


app = create_app()
