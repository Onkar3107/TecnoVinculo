const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const zxcvbn = require('zxcvbn'); // Importing zxcvbn for password strength checking

const router = express.Router();

// POST: Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body)

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check password strength using zxcvbn
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) { // You can adjust the score threshold (0-4)
      return res.status(400).json({ message: 'Password is too weak. Please use a stronger password.' });
    }

    // Create a new user with plain password (hashed in the model)
    const user = new User({ name, email, password });
    await user.save(); // Hashing is handled by the pre-save hook in the model

    // Generate a JSON Web Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with the token
    res.status(201).json({ username: user.name, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Sign In
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JSON Web Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with the token
    res.status(201).json({ username: user.name, token });
    console.log(user.name);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
