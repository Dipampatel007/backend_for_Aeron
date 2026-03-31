const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Local testing ke liye agar .env file use kar rahe ho

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connection String: Ye Render ki "Key" (MONGO_URI) se connect hoga
// Agar Render pe Key nahi milti toh ye localhost dhoondhega (sirf testing ke liye)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/aeron_erp";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Atlas (Cloud) Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 2. Sample Route (Check karne ke liye ki server live hai ya nahi)
app.get('/', (req, res) => {
  res.send("Aeron ERP Backend is Live on Cloud! 🚀");
})

// 3. Tere Purane Routes (Yahan apne asli routes add kar lena)
// Example: app.use('/api/users', require('./routes/userRoutes'));
// Example: app.use('/api/stock', require('./routes/stockRoutes'));

// 4. Port Setting: Render apne aap PORT assign karta hai
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
