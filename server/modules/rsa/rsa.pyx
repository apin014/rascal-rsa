from sympy import mod_inverse, gcd, isprime

cpdef dict generate_key(unsigned long p, unsigned long q):
    if (not (isprime(p) and isprime(q))):
        return {
            "public_key": False,
            "private_key": False
        }

    cdef unsigned long long n = p *  q
    cdef unsigned long long phi_n = (p - 1) * (q - 1)

    cdef unsigned long long e = 2

    while (e < phi_n):
        if (gcd(e, phi_n) == 1):
            break
        e += 1

    cdef unsigned long long d = mod_inverse(e, phi_n)

    return {
        "public_key": [e, n],
        "private_key": [d, n]
    }

cpdef bytes encrypt(bytes plain_text, unsigned long long e, unsigned long long n):
    cdef unsigned int block_size = len(str(n))

    cdef str cipher_text = ""

    cdef unsigned long long c

    for byte in plain_text:
        c = pow(byte, e, n)
        cipher_text += "0" * (block_size - len(str(c))) + str(c)

    return bytes(cipher_text, "utf-8")

cpdef bytes decrypt(bytes cipher_text, unsigned long long d, unsigned long long n):
    cdef str c = ""

    c += cipher_text.decode("utf-8")
        
    cdef unsigned int size = len(c)

    cdef unsigned int block_size = len(str(n))

    cdef str plain_text = ""

    cdef unsigned long long p

    for i in range(int(size / block_size)):
        p = pow(int(c[i*block_size:(i + 1)*block_size]), d, n)
        plain_text += chr(p)

    return bytes(plain_text, "utf-8")

cpdef list exp(unsigned int n):
    cdef list arr = []
    for i in range(n):
        arr.append(0)
    
    return arr