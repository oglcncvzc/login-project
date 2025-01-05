const bcrypt = require('bcrypt');
const password = 'cevizci';  // Şifreyi buraya yazın

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Hashleme hatası:', err);
  } else {
    console.log('Yeni hash:', hash);  // Bu hash'i veritabanınıza kaydedebilirsiniz
  }
});
