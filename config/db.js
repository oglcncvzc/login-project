const mongoose = require('mongoose');
require('dotenv').config(); // .env dosyasını yükle

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // .env dosyasındaki URI'yı al
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas veritabanına bağlanıldı...');
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1); // Sunucu başlatmayı durdurur
  }
};

module.exports = connectDB;
