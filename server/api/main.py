from fastapi import FastAPI

from .routers import hello, rsa

app = FastAPI()

app.include_router(hello.router)
app.include_router(rsa.router)

@app.get("/")
async def home():
    return {
        "message": "Welcome!"
    }