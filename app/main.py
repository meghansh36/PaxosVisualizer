from fastapi import requests
from fastapi import Request, FastAPI, Header, HTTPException
from fastapi.responses import HTMLResponse
from .models.message import Message

app = FastAPI(
    title="Paxos Runner",
    version="v0.0.1",
)


@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    return "success"
