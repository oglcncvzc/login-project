const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Şifreyi kaydetmeden önce hash'le
UserSchema.pre('save', async function (next) {
  console.log('pre save çalışıyor!'); // Çalıştığından emin olun
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  console.log('Hashlenmiş şifre:', hashedPassword);
  this.password = hashedPassword;
  next();
});


module.exports = mongoose.model('User', UserSchema);
