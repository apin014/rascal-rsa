# rascal-rsa
aplikasi simulasi pertukaran pesan instan yang mengimplementasikan cipher RSA (Rivest-Shamir-Adleman)

# Cara Menjalankan
1. Buatlah virtual environment python (`python -m venv .venv`) dan aktifkan
2. Instal semua dependensi yang tercantum dalam `server/requirements.txt`, dapat menggunakan perintah `pip install -r requirements.txt` dalam folder `server`
3. Instal semua dependensi untuk `app` dengan masuk ke folder `app` dan menjalankan perintah `npm install`
4. Buat dua buah folder baru di dalam folder `server` dengan nama `keys` dan `downloads`
5. Buka dua terminal, satu terminal untuk menjalankan server dan satu lagi untuk menjalankan app
6. Untuk menjalankan server, masuk ke folder `server` dan jalankan `python main.py`
7. Untuk menjalankan app, masuk ke folder `app` dan jalankan `npm run dev`
8. Masuk ke alamat URL yang diperlihatkan oleh app

---
Perlu diperhatikan bahwa versi Node.JS yang digunakan adalah versi 20+ dan versi Python yang digunakan adalah 3.12+.
