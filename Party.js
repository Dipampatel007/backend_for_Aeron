const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  type: { type: String, enum: ['Vendor', 'Client'], required: true }, // Mal dene wala ya lene wala
  totalBalance: { type: Number, default: 0 }, // Positive matlab hume milenge, Negative matlab hume dene hain
  transactions: [{
    date: { type: Date, default: Date.now },
    amount: { type: Number },
    type: { type: String, enum: ['Credit', 'Debit'] }, // Credit: Paisa aaya/Bill bana, Debit: Paisa diya
    remarks: { type: String }
  }]
});

module.exports = mongoose.model('Party', partySchema);