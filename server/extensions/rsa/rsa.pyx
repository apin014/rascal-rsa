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
        plain_text += bytes("\0" * (message_block_size - (len(plain_text) % message_block_size)), "utf-8")

    for i in range(0, len(plain_text), message_block_size):
        c = pow(int.from_bytes(plain_text[i:i+message_block_size], "big"), e, n)
        cipher_text += "0" * (block_size - len(str(c))) + str(c)

    return bytes(cipher_text, "utf-8")

cpdef bytes decrypt(bytes cipher_text, object d, object n, short isFile = 0):
    cdef str c = ""

    c += cipher_text.decode("utf-8")
        
    cdef unsigned int size = len(c)

    cdef unsigned int message_block_size = 1

    while (pow(2, (8 * (message_block_size + 1))) <= n):
        message_block_size += 1

    cdef unsigned int block_size = len(str(n))

    cdef list plain_text = []

    cdef object p

    if (not isFile):
        for i in range(int(size / block_size)):
            p = pow(int(c[i*block_size:(i + 1)*block_size]), d, n)
            for i in range(0, (message_block_size * 8), 8):
                plain_text.append(int(("0" * ((message_block_size * 8) - p.bit_length()) + bin(p)[2:])[i:i+8], 2))

    cdef unsigned int length = len(plain_text)

    for i in range(len(plain_text) - 1, -1, -1):
        if (plain_text[i] == 0):
            length -= 1
        else:
            break

    plain_text = plain_text[0:length]

    return bytes(plain_text)