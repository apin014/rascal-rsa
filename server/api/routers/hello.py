from fastapi import APIRouter, Response, status

router = APIRouter()

@router.get("/hello", tags=["hello"])
async def sayHelloTo(name: str = "Random Person", resp: Response = status.HTTP_200_OK):
    return {
        "message": "Hello, " + name + "!"
    }