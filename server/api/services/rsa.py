import sys
import os
from fastapi.responses import FileResponse

sys.path.append("../../extensions")

from extensions.rsa.rsa import generate_key, encrypt, decrypt

def encipher_text(text: str, e, n, out):
    encrypted = encrypt(bytes(text, "utf-8"), e, n)
    
    if out == "text":
        return {
            "result": encrypted.decode("utf-8")
        }
        
    elif out == "file":
        path = "downloads/encrypted"
        with open(path, "wb") as encryptedFile:
            encryptedFile.write(encrypted)
        return FileResponse(path)
    
def decipher_text(text: str, d, n, out):
    decrypted = decrypt(bytes(text, "utf-8"), d, n)
    
    if out == "text":
        return {
            "result": decrypted.decode("utf-8")
        }
        
    elif out == "file":
        path = "downloads/encrypted"
        with open(path, "wb") as decryptedFile:
            decryptedFile.write(decrypted)
        return FileResponse(path)
    
def encipher_file(fileBytes: bytes, fileName: str, fileExt: str, e, n):
    encrypted = encrypt(fileBytes, e, n)
    
    path = "downloads/" + fileName + " (encrypted)" + fileExt
    
    with open(path, "wb") as encryptedFile:
        encryptedFile.write(encrypted)
    return FileResponse(path)

def decipher_file(fileBytes: bytes, fileName: str, fileExt: str, d, n):
    decrypted = decrypt(fileBytes, d, n)
    
    path = "downloads/" + fileName + " (decrypted)" + fileExt
    
    with open(path, "wb") as decryptedFile:
        decryptedFile.write(decrypted)
    return FileResponse(path)

def key_gen(key: dict, name: str): 
    privateKeyPath = "keys/" + name + ".pri"
    publicKeyPath = "keys/" + name + ".pub"
    
    with open(privateKeyPath, "w") as privateKey:
        privateKey.write("d=" + str(key["private_key"][0]) + "\nn=" + str(key["private_key"][1]))
        
    with open(publicKeyPath, "w") as publicKey:
        publicKey.write("e=" + str(key["public_key"][0]) + "\nn=" + str(key["public_key"][1]))