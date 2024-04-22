from fastapi import APIRouter, Response, status, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from ..services.rsa import encipher_text, decipher_text, encipher_file, decipher_file, key_gen
import sys
import os

sys.path.append("../../extensions/")

from extensions.rsa.rsa import generate_key as generate_rsa_key

router = APIRouter()

class RSAText(BaseModel):
    text: str
    
@router.post("/encrypt/text/{out}", tags=["rsa"])
async def encrypt_text(item: RSAText, pubKeyName: str, out: str, resp: Response = status.HTTP_200_OK):
    e = None
    n = None
    with open("keys/" + pubKeyName, "r") as key:
        lines = key.readlines()
        e = int(lines[0].split("=")[1])
        n = int(lines[1].split("=")[1])
            
    
    if (not e or not n):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be found!"
        }
    
    if out == "text" or out == "file":
        return encipher_text(item.text, e, n, out)

    else:
        resp.status_code = status.HTTP_404_NOT_FOUND
        return {
            "result": "[error] Output type not found"
        }

@router.post("/decrypt/text/{out}", tags=["rsa"])
async def encrypt_text(item: RSAText, privKeyName: str, out: str, resp: Response = status.HTTP_200_OK):
    d = None
    n = None
    with open("keys/" + privKeyName, "r") as key:
        lines = key.readlines()
        d = int(lines[0].split("=")[1])
        n = int(lines[1].split("=")[1])
    
    if (not d or not n):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be found!"
        }
    
    if out == "text" or out == "file":
        return decipher_text(item.text, d, n, out)

    else:
        resp.status_code = status.HTTP_404_NOT_FOUND
        return {
            "result": "[error] Output type not found"
        }
    
@router.post("/encrypt/file", tags=["rsa"])
async def encrypt_file(file: UploadFile, pubKeyName: str, resp: Response = status.HTTP_200_OK):
    e = None
    n = None
    with open("keys/" + pubKeyName, "r") as key:
        lines = key.readlines()
        e = int(lines[0].split("=")[1])
        n = int(lines[1].split("=")[1])
            
    
    if (not e or not n):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be found!"
        }
        
    fileBytes = file.file.read()
    fileName = os.path.splitext(file.filename)[0]
    fileExt = os.path.splitext(file.filename)[1]
    
    return encipher_file(fileBytes, fileName, fileExt, e, n)

@router.post("/decrypt/file", tags=["rsa"])
async def decrypt_file(file: UploadFile, privKeyName: str, resp: Response = status.HTTP_200_OK):
    d = None
    n = None
    with open("keys/" + privKeyName, "r") as key:
        lines = key.readlines()
        d = int(lines[0].split("=")[1])
        n = int(lines[1].split("=")[1])
    
    if (not d or not n):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be found!"
        }
        
    fileBytes = file.file.read()
    fileName = os.path.splitext(file.filename)[0]
    fileExt = os.path.splitext(file.filename)[1]
    
    return decipher_file(fileBytes, fileName, fileExt, d, n)

@router.get("/keygen", tags=["rsa"])
async def generate_key(p: int, q: int, name: str, resp: Response = status.HTTP_200_OK):
    key = generate_rsa_key(p, q)
    
    if (not key["public_key"] or not key["private_key"]):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "result": "[error] Keys cannot be generated!"
        }
        
    key_gen(key, name)
        
    return {
        "result": "keys have been generated!"
    }