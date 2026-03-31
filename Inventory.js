const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true 
    // Example: "Extrusion Scrap", "6063 Ingot", "Flux", "Coal"
  },
  category: { 
    type: String, 
    enum: ['Raw Material', 'Finished Good', 'Chemical', 'Fuel'], 
    required: true 
  },
  currentStockKg: { 
    type: Number, 
    default: 0 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);