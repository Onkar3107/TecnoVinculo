const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//for encrypting the password feild before saving into db
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // console.log('Hashed Password during Registration:', this.password);
  next();  // Ensure that next() is called after hashing
});

module.exports = mongoose.model('User', userSchema);
