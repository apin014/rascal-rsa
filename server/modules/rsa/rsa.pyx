from sympy import mod_inverse, isprime
from math import gcd

cpdef dict generate_key(object p, object q):
    if (not (isprime(p) and isprime(q))):
        return {
            "public_key": False,
            "private_key": False
        }

    cdef object n = p *  q
    cdef object phi_n = (p - 1) * (q - 1)

    cdef unsigned long long e = 2

    while (e < phi_n):
        if (gcd(e, phi_n) == 1):
            break
        e += 1

    cdef object d = mod_inverse(e, phi_n)

    return {
        "public_key": [e, n],
        "private_key": [d, n]
    }

cpdef bytes encrypt(bytes plain_text, object e, object n):
    cdef unsigned int message_block_size = 1

    while pow(2, (8 * (message_block_size + 1))) <= n:
        message_block_size += 1

    cdef unsigned int block_size = len(str(n))

    cdef str cipher_text = ""

    cdef object c

    if (len(plain_text) % message_block_size != 0):
        plain_text += bytes(" " * (message_block_size - (len(plain_text) % message_block_size)), "utf-8")

    for i in range(0, len(plain_text), message_block_size):
        c = pow(int.from_bytes(plain_text[i:i+message_block_size], "big"), e, n)
        cipher_text += "0" * (block_size - len(str(c))) + str(c)

    return bytes(cipher_text, "utf-8")

cpdef bytes decrypt(bytes cipher_text, object d, object n):
    cdef str c = ""

    c += cipher_text.decode("utf-8")
        
    cdef unsigned int size = len(c)

    cdef unsigned int message_block_size = 1

    while (pow(2, (8 * (message_block_size + 1))) <= n):
        message_block_size += 1

    cdef unsigned int block_size = len(str(n))

    cdef str plain_text = ""

    cdef object p

    for i in range(int(size / block_size)):
        p = pow(int(c[i*block_size:(i + 1)*block_size]), d, n)
        for i in range(0, (message_block_size * 8), 8):
            plain_text += chr(int(("0" * ((message_block_size * 8) - p.bit_length()) + bin(p)[2:])[i:i+8], 2))

    return bytes(plain_text, "utf-8")