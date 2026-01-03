const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Capitalize first letter, lowercase rest (e.g., "AHMET" -> "Ahmet")
const capitalizeNickname = (name) => {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

/**
 * Nickname önerileri oluşturma algoritması (OPTİMİZE - Batch Query):
 * 
 * 1. Temel ismi al (örn: "Ali")
 * 2. Tüm olası önerileri oluştur
 * 3. TEK SORGUDA hepsini kontrol et (performans!)
 * 4. Boş olanları döndür
 * 
 * ⚡ Performans: 35 sorgu → 1-2 sorgu
 */
const generateSuggestions = async (nickname) => {
  // ===== ADIM 1: Tüm olası önerileri oluştur =====
  const suggestions = [];
  
  // Çocuklara uygun suffix'ler
  const suffixes = ['', 'Jr', 'Can'];
  // Kolay hatırlanır numaralar
  const numbers = ['1', '2', '3', '99', ''];
  
  for (const suffix of suffixes) {
    for (const num of numbers) {
      // Boş suffix + boş numara = orijinal isim (zaten alınmış, atla)
      if (suffix === '' && num === '') continue;
      
      const suggestion = `${nickname}${suffix}${num}`;
      
      // Max 8 karakter kontrolü
      if (suggestion.length <= 8) {
        suggestions.push(suggestion);
      }
    }
  }
  
  // ===== ADIM 2: TEK SORGUDA tüm alınmış olanları bul =====
  // Case-insensitive arama için lowercase'e çevir
  const lowerSuggestions = suggestions.map(s => s.toLowerCase());
  
  const takenUsers = await User.find({
    nickname: { 
      $in: suggestions.map(s => new RegExp(`^${s}$`, 'i'))
    }
  }).select('nickname').lean();
  
  // Alınmış olanları Set'e çevir (hızlı lookup için)
  const takenSet = new Set(takenUsers.map(u => u.nickname.toLowerCase()));
  
  // ===== ADIM 3: Boş olanları filtrele (max 4) =====
  const available = suggestions
    .filter(s => !takenSet.has(s.toLowerCase()))
    .slice(0, 4)
    .map(s => capitalizeNickname(s));
  
  // ===== ADIM 4: Güvenlik - Random fallback (tek sorgu) =====
  if (available.length === 0) {
    // 10 tane random öneri oluştur
    const randomSuggestions = [];
    const usedNums = new Set();
    
    while (randomSuggestions.length < 10 && usedNums.size < 90) {
      const randomNum = Math.floor(Math.random() * 90) + 10; // 10-99
      if (usedNums.has(randomNum)) continue;
      usedNums.add(randomNum);
      
      const randomSuggestion = `${nickname}${randomNum}`;
      if (randomSuggestion.length <= 8) {
        randomSuggestions.push(randomSuggestion);
      }
    }
    
    // Tek sorguda kontrol et
    const takenRandoms = await User.find({
      nickname: { 
        $in: randomSuggestions.map(s => new RegExp(`^${s}$`, 'i'))
      }
    }).select('nickname').lean();
    
    const takenRandomSet = new Set(takenRandoms.map(u => u.nickname.toLowerCase()));
    
    const availableRandoms = randomSuggestions
      .filter(s => !takenRandomSet.has(s.toLowerCase()))
      .slice(0, 2)
      .map(s => capitalizeNickname(s));
    
    available.push(...availableRandoms);
  }
  
  return available;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { nickname, password, age, language, deviceToken } = req.body;

    // Format nickname: first letter uppercase, rest lowercase
    const formattedNickname = capitalizeNickname(nickname.trim());

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ 
      nickname: { $regex: new RegExp(`^${formattedNickname}$`, 'i') }
    });
    if (existingUser) {
      // Alternatif öneriler oluştur
      const suggestions = await generateSuggestions(formattedNickname);
      return res.status(400).json({
        success: false,
        message: 'Bu takma ad zaten kullanılıyor',
        suggestions: suggestions // Öneriler eklendi
      });
    }

    // Create user with formatted nickname
    const user = await User.create({
      nickname: formattedNickname,
      password,
      age: age ? parseInt(age) : undefined,
      language: language || 'tr',
      deviceToken
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı! Hoş geldin küçük bahçıvan! 🌱',
      data: {
        user: {
          id: user._id,
          nickname: user.nickname,
          age: user.age,
          language: user.language,
          gardenState: user.gardenState
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu takma ad zaten kullanılıyor'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { nickname, password, deviceToken } = req.body;

    // Check for user (case-insensitive)
    const user = await User.findOne({ 
      nickname: { $regex: new RegExp(`^${nickname.trim()}$`, 'i') }
    }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Takma ad veya şifre hatalı'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Takma ad veya şifre hatalı'
      });
    }

    // Update device token if provided
    if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Giriş başarılı! Tekrar hoş geldin! 🌻',
      data: {
        user: {
          id: user._id,
          nickname: user.nickname,
          age: user.age,
          language: user.language,
          gardenState: user.gardenState
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş sırasında bir hata oluştu'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          nickname: user.nickname,
          age: user.age,
          language: user.language,
          gardenState: user.gardenState
        }
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı bilgileri alınamadı'
    });
  }
};

// @desc    Update garden state
// @route   PUT /api/auth/garden
// @access  Private
const updateGardenState = async (req, res) => {
  try {
    const { gardenState } = req.body;

    if (!gardenState) {
      return res.status(400).json({
        success: false,
        message: 'Garden state gerekli'
      });
    }

    // DEBUG: Gelen gardenState'i kontrol et
    console.log('=== BACKEND UPDATE GARDEN STATE DEBUG ===');
    console.log('User ID:', req.user.id);
    if (gardenState.prayers) {
      Object.entries(gardenState.prayers).forEach(([prayer, progress]) => {
        console.log(`${prayer} harvestCount:`, progress.harvestCount);
      });
    }
    console.log('Total badges:', gardenState.totalBadges);
    console.log('=== END BACKEND DEBUG ===');

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // gardenState'i direkt atama (Mixed type için)
    user.gardenState = gardenState;
    await user.save();

    // DEBUG: Kaydedilen gardenState'i kontrol et
    console.log('=== BACKEND SAVED GARDEN STATE DEBUG ===');
    if (user.gardenState.prayers) {
      Object.entries(user.gardenState.prayers).forEach(([prayer, progress]) => {
        console.log(`${prayer} harvestCount (saved):`, progress.harvestCount);
      });
    }
    console.log('Total badges (saved):', user.gardenState.totalBadges);
    console.log('=== END SAVED DEBUG ===');

    res.json({
      success: true,
      message: 'Bahçe durumu güncellendi! 🌱',
      data: {
        gardenState: user.gardenState
      }
    });
  } catch (error) {
    console.error('UpdateGardenState error:', error);
    res.status(500).json({
      success: false,
      message: 'Bahçe durumu güncellenirken bir hata oluştu'
    });
  }
};

// @desc    Get garden state
// @route   GET /api/auth/garden
// @access  Private
const getGardenState = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      data: {
        gardenState: user.gardenState
      }
    });
  } catch (error) {
    console.error('GetGardenState error:', error);
    res.status(500).json({
      success: false,
      message: 'Bahçe durumu alınamadı'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateGardenState,
  getGardenState
};

