from rsa import generate_key, encrypt, decrypt
# import sys
# sys.path.append("./../hello-world")
# from hello import say_hello_to
import base64

# say_hello_to("Udin Petot")
key = (generate_key(100151, 100153))
print(key)
# print(exp(5))

text = "nama saya Davin."

encrypted = encrypt(bytes(text, "utf-8"), key["public_key"][0], key["public_key"][1])

b64 = base64.b64encode(encrypted).decode()

print(b64)

print(encrypted.decode("utf-8"))

decrypted = decrypt(encrypted, key["private_key"][0], key["private_key"][1])
print(decrypted.decode("utf-8").strip())