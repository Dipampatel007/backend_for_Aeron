const mongoose = require('mongoose');

const bhattiBatchSchema = new mongoose.Schema({
  batchDate: { 
    type: Date, 
    default: Date.now 
  },
  shift: { 
    type: String, 
    enum: ['Day', 'Night'],
    required: true
  },
  inputScrapKg: { 
    type: Number, 
    required: true // Kitna kachha maal bhatti mein dala
  },
  outputIngotKg: { 
    type: Number, 
    required: true // Kitna tayyar ingot nikla
  },
  burningLossKg: { 
    type: Number // Input - Output (API mein calculate karenge)
  },
  recoveryPercentage: { 
    type: Number // (Output / Input) * 100 (API mein calculate karenge)
  },
  operatorName: { 
    type: String // Bhatti par kaunsa mistri/labour tha
  }
});

module.exports = mongoose.model('BhattiBatch', bhattiBatchSchema);