const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Takma ad gerekli'],
    unique: true,
    trim: true,
    minlength: [2, 'Takma ad en az 2 karakter olmalı'],
    maxlength: [8, 'Takma ad en fazla 8 karakter olabilir']
  },
  password: {
    type: String,
    required: [true, 'Şifre gerekli'],
    minlength: [4, 'Şifre en az 4 karakter olmalı']
  },
  age: {
    type: Number,
    min: [3, 'Yaş en az 3 olmalı'],
    max: [99, 'Yaş en fazla 99 olabilir']
  },
  language: {
    type: String,
    enum: ['tr', 'en'],
    default: 'tr'
  },
  deviceToken: {
    type: String,
    default: null
  },
  // Garden progress data - Using Mixed type for flexibility with nested objects
  gardenState: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      prayers: {
        fajr: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
        dhuhr: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
        asr: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
        maghrib: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
        isha: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 }
      },
      character: 'boy',
      isOnboardingComplete: false,
      totalBadges: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);

