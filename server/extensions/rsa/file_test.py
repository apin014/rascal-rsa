from rsa import generate_key, encrypt, decrypt
import os

key = (generate_key(39916801, 479001599))

print(key)

# ENCRYPT

path = "./20231205_112825.jpg"

file = open(path, "rb")

encrypted = encrypt(file.read(), key["public_key"][0], key["public_key"][1])

with open("encrypted" + os.path.splitext(path)[1], "wb") as outFile:
    outFile.write(encrypted)

# DECRYPT

# path = "./encrypted.jpg"

# file = open(path, "rb")

# decrypted = decrypt(file.read(), key["private_key"][0], key["private_key"][1])

# with open("decrypted" + os.path.splitext(path)[1], "wb") as outFile:
#     outFile.write(decrypted)