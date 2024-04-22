from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import hello, rsa

app = FastAPI()

app.include_router(hello.router)
app.include_router(rsa.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {
        "message": "Welcome!"
    }