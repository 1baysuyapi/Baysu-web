// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Gerçek bir veritabanı yerine geçici bir kullanıcı dizisi kullanıyoruz.
// DİKKAT: Sunucu her yeniden başlatıldığında veriler sıfırlanır.
// Kalıcı bir çözüm için MongoDB veya MySQL gibi bir veritabanı bağlamanız gerekir.
let users = [];

app.use(bodyParser.json());
app.use(cors());

// Yeni kullanıcı kaydı için API endpoint'i
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Basit bir kontrol: E-posta zaten kullanılmış mı?
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
    }

    // Gerçekte şifreleri güvenli bir şekilde şifrelemelisiniz (hashing).
    const newUser = { name, email, password }; 
    users.push(newUser);
    
    console.log('Yeni kullanıcı kaydedildi:', newUser);
    res.status(201).json({ message: 'Kayıt başarılı!' });
});

// Giriş işlemi için API endpoint'i
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Kullanıcıyı veritabanında ara (geçici olarak dizide arıyoruz)
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        console.log('Giriş başarılı:', user.email);
        res.status(200).json({ message: 'Giriş başarılı!', user: { name: user.name, email: user.email } });
    } else {
        res.status(401).json({ message: 'E-posta veya şifre hatalı.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});