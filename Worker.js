const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Mistri' },
  dailyWage: { type: Number, required: true }, // Ek din ki dihaadi
  attendance: [{
    date: { type: String }, // Date format: YYYY-MM-DD
    status: { type: String, enum: ['Present', 'Absent', 'Half-Day'] },
    advanceGiven: { type: Number, default: 0 }
  }]
});

module.exports = mongoose.model('Worker', workerSchema);