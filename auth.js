const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ek secret key JWT ke liye (Real app me isko .env me rakhte hain)
const JWT_SECRET = "AeronERPSecretKey123!@#";

// ==========================================
// 1. REGISTER API (Naya User Banane Ke Liye)
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check karo ki user pehle se toh nahi hai
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Yeh username pehle se majood hai!" });

        // Password ko encrypt (hash) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user save karna
        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "✅ User successfully create ho gaya!" });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ==========================================
// 2. LOGIN API (App mein ghusne ke liye)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // User dhundho
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User nahi mila!" });

        // Password check karo
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Password galat hai!" });

        // Token generate karo (Jisme user ki ID aur Role chhupa hoga)
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: "🔓 Login Successful!",
            token,
            role: user.role,
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ error: "Login error", details: error.message });
    }
});

module.exports = router;