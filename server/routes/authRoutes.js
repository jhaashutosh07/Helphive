const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Signup (email + password)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, lat, lng } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      passwordHash,
      location: { type: 'Point', coordinates: [lng, lat] }
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// Login (email + password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Google Auth
router.post('/google', async (req, res) => {
  try {
    const { token: idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, passwordHash: '', location: { type: 'Point', coordinates: [0, 0] } });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
});

module.exports = router;
