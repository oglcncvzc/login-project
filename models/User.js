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
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10); // Salt üretimi
  const hashedPassword = await bcrypt.hash(this.password, salt);  // Şifreyi hash'le

  console.log('Hashlenmiş şifre:', hashedPassword); // Hash'lenmiş şifreyi logla

  this.password = hashedPassword; // Hash'lenmiş şifreyi kaydet
  next();
});

module.exports = mongoose.model('User', UserSchema);
