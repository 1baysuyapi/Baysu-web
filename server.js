const express = require('express');
const cors = require('cors'); // CORS modülü eklendi
const bodyParser = require('body-parser');
const app = express();
// Render'ın dinamik olarak atadığı portu kullan, yoksa 10000'i kullan
const port = process.env.PORT || 10000; 

// CORS ve JSON ayarları
app.use(cors()); // CORS middleware'i eklendi
app.use(bodyParser.json());

// Veritabanı yerine basit bir kullanıcı dizisi
let users = [];

// KAYIT OL endpoint'i
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Tüm alanları doldurunuz.' });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
    }
    const newUser = { name, email, password };
    users.push(newUser);
    res.status(201).json({ message: 'Kayıt işlemi başarılı!' });
});

// GİRİŞ YAP endpoint'i
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.status(200).json({ message: 'Giriş başarılı!', user: { email: user.email } });
    } else {
        res.status(401).json({ message: 'E-posta veya şifre hatalı.' });
    }
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor...`);
});