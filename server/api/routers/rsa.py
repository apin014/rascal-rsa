from fastapi import APIRouter, Response, status, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from ..services.rsa import encipher_text, decipher_text, encipher_file, decipher_file
import sys
import os

sys.path.append("../../extensions/")

from extensions.rsa.rsa import generate_key

router = APIRouter()

class RSAText(BaseModel):
    text: str
    
@router.post("/encrypt/text/{out}", tags=["rsa"])
async def encrypt_text(item: RSAText, p: int, q: int, out: str, resp: Response = status.HTTP_200_OK):
    key = generate_key(p, q)
    
    if (not key["public_key"] or not key["private_key"]):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be generated!"
        }
    
    if out == "text" or out == "file":
        return encipher_text(item.text, key["public_key"][0], key["public_key"][1], out)

    else:
        resp.status_code = status.HTTP_404_NOT_FOUND
        return {
            "result": "[error] Output type not found"
        }

@router.post("/decrypt/text/{out}", tags=["rsa"])
async def encrypt_text(item: RSAText, p: int, q: int, out: str, resp: Response = status.HTTP_200_OK):
    key = generate_key(p, q)
    
    if (not key["public_key"] or not key["private_key"]):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be generated!"
        }
    
    if out == "text" or out == "file":
        return decipher_text(item.text, key["private_key"][0], key["private_key"][1], out)

    else:
        resp.status_code = status.HTTP_404_NOT_FOUND
        return {
            "result": "[error] Output type not found"
        }
    
@router.post("/encrypt/file", tags=["rsa"])
async def encrypt_file(item: UploadFile, p: int, q: int, resp: Response = status.HTTP_200_OK):
    key = generate_key(p, q)
    
    if (not key["public_key"] or not key["private_key"]):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be generated!"
        }
        
    fileBytes = item.file.read()
    fileName = os.path.splitext(item.filename)[0]
    fileExt = os.path.splitext(item.filename)[1]
    
    return encipher_file(fileBytes, fileName, fileExt, key["public_key"][0], key["public_key"][1])

@router.post("/decrypt/file", tags=["rsa"])
async def decrypt_file(item: UploadFile, p: int, q: int, resp: Response = status.HTTP_200_OK):
    key = generate_key(p, q)
    
    if (not key["public_key"] or not key["private_key"]):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be generated!"
        }
        
    fileBytes = item.file.read()
    fileName = os.path.splitext(item.filename)[0]
    fileExt = os.path.splitext(item.filename)[1]
    
    return decipher_file(fileBytes, fileName, fileExt, key["private_key"][0], key["private_key"][1])
