const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// यूजर स्कीमा
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema, 'users');

// रजिस्टर रूट
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username और password जरूरी हैं' });
    }

    // चेक करें कि यूजर पहले से मौजूद है
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'यह username पहले से मौजूद है' });
    }

    // पासवर्ड हैश करें
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    logger(`यूजर रजिस्टर हुआ: ${username}`);
    res.status(201).json({ message: 'यूजर सफलतापूर्वक रजिस्टर हुआ' });
  } catch (error) {
    logger(`रजिस्टर करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'रजिस्टर करने में एरर', error: error.message });
  }
});

// लॉगिन रूट (JWT टोकन जनरेट करता है)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username और password जरूरी हैं' });
    }

    // यूजर चेक करें
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'गलत username या password' });
    }

    // पासवर्ड वेरिफाई करें
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'गलत username या password' });
    }

    // JWT टोकन जनरेट करें
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    logger(`JWT टोकन जनरेट हुआ: ${username}`);
    res.json({ message: 'लॉगिन सफल', token });
  } catch (error) {
    logger(`लॉगिन करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'लॉगिन करने में एरर', error: error.message });
  }
});

module.exports = router;