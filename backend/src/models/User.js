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
  // Garden progress data
  gardenState: {
    prayers: {
      fajr: { count: { type: Number, default: 0 }, lastCompletedDate: String, state: { type: String, default: 'seed' }, harvestCount: { type: Number, default: 0 } },
      dhuhr: { count: { type: Number, default: 0 }, lastCompletedDate: String, state: { type: String, default: 'seed' }, harvestCount: { type: Number, default: 0 } },
      asr: { count: { type: Number, default: 0 }, lastCompletedDate: String, state: { type: String, default: 'seed' }, harvestCount: { type: Number, default: 0 } },
      maghrib: { count: { type: Number, default: 0 }, lastCompletedDate: String, state: { type: String, default: 'seed' }, harvestCount: { type: Number, default: 0 } },
      isha: { count: { type: Number, default: 0 }, lastCompletedDate: String, state: { type: String, default: 'seed' }, harvestCount: { type: Number, default: 0 } }
    },
    character: {
      type: String,
      enum: ['boy', 'girl'],
      default: 'boy'
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false
    },
    // Toplam rozet sayısı (her hasat = 1 rozet = 1 seviye)
    totalBadges: {
      type: Number,
      default: 0
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

