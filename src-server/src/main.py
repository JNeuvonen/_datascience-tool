from contextlib import asynccontextmanager
import os
import uvicorn
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from decorators import LogException
from orm import create_tables
from route_project import router as project_router

from log import get_logger


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):
    """The code before the yield statement will be executed on boot. The code after the yield statement will be executed as a cleanup on application close."""

    with LogException("Succesfully initiated tables"):
        create_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Routers:
    PROJECT = "/project"
    STREAMS = "/streams"


app.include_router(project_router, prefix=Routers.PROJECT)


@app.post("/shutdown")
def shutdown_server():
    logger = get_logger()
    logger.info("Application is shutting down")
    os._exit(0)


@app.get("/")
def route_get_root():
    return Response(
        content="Hello World", media_type="text/plain", status_code=status.HTTP_200_OK
    )


def run():
    uvicorn.run("server:app", host="0.0.0.0", port=8000, log_level="info")


if __name__ == "__main__":
    run()
