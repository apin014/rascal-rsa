from rsa import generate_key, encrypt, decrypt
# import sys
# sys.path.append("./../hello-world")
# from hello import say_hello_to
import base64

key = (generate_key(100151, 100153))

text = "Nama saya...Muhammad Davin Dzimar"

encrypted = encrypt(bytes(text, "utf-8"), key["public_key"][0], key["public_key"][1])

decrypted = decrypt(encrypted, key["private_key"][0], key["private_key"][1])

print(decrypted.decode("utf-8"))