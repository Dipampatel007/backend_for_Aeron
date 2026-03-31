const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// Basic Test Route
app.get('/', (req, res) => {
    res.send("Aeron ERP Backend is Running! 🚀");
});

// ==========================================
// API ROUTES (FILES SEEDHA BAHAR HAIN)
// ==========================================

// 1. Bhatti aur Inventory (api.js file)
const apiRoutes = require('./api'); // ✅ './routes/api' ki jagah sirf './api'
app.use('/api', apiRoutes);

// 2. Auth (auth.js file)
const authRoutes = require('./auth'); // ✅ './routes/auth' ki jagah sirf './auth'
app.use('/api', authRoutes); 

// ==========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
