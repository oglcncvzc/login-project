const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // db.js dosyasını import ediyoruz

dotenv.config();  // .env dosyasını yükle

const app = express();

// MongoDB bağlantısı sağlanır
connectDB();  

// CORS yapılandırması (isteğe bağlı olarak özelleştirebilirsiniz)
app.use(cors());

// JSON ve urlencoded verisini almak için Express'in yerleşik middleware'lerini kullanıyoruz
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth route
app.use('/api/auth', require('./routes/auth'));

app.use('/api/todos', require('./routes/todo'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));
