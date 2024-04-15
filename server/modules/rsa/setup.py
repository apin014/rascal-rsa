from setuptools import setup
from Cython.Build import cythonize
import numpy

setup(
    name='RSA cryptographic app',
    ext_modules=cythonize("rsa.pyx"),
    include_dirs=[numpy.get_include()],
)