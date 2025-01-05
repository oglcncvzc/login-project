const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/login-project_db';  // MongoDB bağlantı dizesi
    await mongoose.connect(mongoURI);  // Artık useNewUrlParser ve useUnifiedTopology opsiyonlarına gerek yok
    console.log('MongoDB veritabanına bağlanıldı...');
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1);  // Sunucu başlatmayı durdurur, MongoDB bağlanmadığında hata verir
  }
};

module.exports = connectDB;
