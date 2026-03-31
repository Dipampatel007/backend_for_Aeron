const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // ✅ Sahi tarika
app.use(express.json()); 

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
    res.send("Aeron ERP Backend is Running on Render! 🚀");
});

// ==========================================
// API ROUTES CONNECT KARNA (Sab kuch /api ke andar)
// ==========================================

// 1. Purani API (Bhatti aur Inventory)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 2. Auth API (Ab ye bhi /api ke andar chalegi)
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes); 

// Isse ab routes aise ban jayenge:
// /api/login, /api/register, /api/inventory, etc.
// ==========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});