const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ideally, hash the password before saving!
    const newUser = new User({ username, email, password });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Get user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

module.exports = router;