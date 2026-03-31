const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ CORS Import kiya
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // ✅ Ye line ab sabhi requests ko allow karegi (Mobile + Web)
app.use(express.json());

// 1. Connection String: Render ki "Key" (MONGO_URI) se connect hoga
const mongoURI = process.env.MONGO_URI; 

if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI is not defined in Render Environment Variables!");
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Atlas (Cloud) Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 2. Default Route (Check karne ke liye ki server live hai)
app.get('/', (req, res) => {
  res.send("Aeron ERP Backend is Live on Render! 🚀");
});

// 3. Routes (Apne purane routes yahan niche add kar lena)
// Example: app.use('/api/inventory', require('./routes/inventory'));
// Example: app.use('/api/auth', require('./routes/auth'));

// 4. Port Setting: Render apne aap PORT assign karta hai (default 10000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
