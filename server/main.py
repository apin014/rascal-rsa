import uvicorn
from dotenv import dotenv_values

env = dotenv_values("./.env")

if __name__ == "__main__":
    uvicorn.run("api.main:app", port=int(env["PORT"]), log_level="info", reload=True)