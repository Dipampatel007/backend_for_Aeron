const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Request body ko JSON mein parse karne ke liye

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Connected Successfully to aeron_erp!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// Basic Test Route
app.get('/', (req, res) => {
    res.send("Aeron ERP Backend is Running!");
});

// ==========================================
// API ROUTES CONNECT KARNA
// ==========================================

// 1. Purani API (Bhatti aur Inventory ke liye)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 2. NAYI AUTH API YAHAN ADD HOGI 👇 (Login/Register ke liye)
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// ==========================================

// Server Start Karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});