const express = require('express');
const router = express.Router();
const BhattiBatch = require('../models/BhattiBatch');
const Inventory = require('../models/Inventory');

// ==========================================
// 1. ADD NEW BHATTI BATCH & UPDATE INVENTORY
// ==========================================
router.post('/add-batch', async (req, res) => {
    try {
        const { shift, inputScrapKg, outputIngotKg, operatorName } = req.body;

        // 1. Jalat aur Recovery Calculate karna
        const burningLossKg = inputScrapKg - outputIngotKg;
        const recoveryPercentage = (outputIngotKg / inputScrapKg) * 100;

        // 2. Naya batch create karna
        const newBatch = new BhattiBatch({
            shift,
            inputScrapKg,
            outputIngotKg,
            burningLossKg,
            recoveryPercentage: recoveryPercentage.toFixed(2),
            operatorName
        });

        await newBatch.save(); // Batch save ho gaya

        // 3. INVENTORY MAGIC: Scrap ko minus (-) karna
        await Inventory.findOneAndUpdate(
            { itemName: "Aluminum Scrap", category: "Raw Material" }, 
            { $inc: { currentStockKg: -inputScrapKg } },             
            { new: true, upsert: true }                              
        );

        // 4. INVENTORY MAGIC: Tayyar Ingot ko plus (+) karna
        await Inventory.findOneAndUpdate(
            { itemName: "Finished Ingot", category: "Finished Good" }, 
            { $inc: { currentStockKg: outputIngotKg } },              
            { new: true, upsert: true }                               
        );
        
        res.status(201).json({ 
            message: "🔥 Batch add ho gaya aur Inventory automatically update ho gayi!", 
            batchDetails: newBatch 
        });

    } catch (error) {
        res.status(500).json({ error: "Batch add karne mein error aayi", details: error.message });
    }
});

// ==========================================
// 2. GET INVENTORY API
// ==========================================
router.get('/inventory', async (req, res) => {
    try {
        const stock = await Inventory.find();
        res.status(200).json({ 
            message: "📦 Current Inventory Stock", 
            totalItems: stock.length,
            data: stock 
        });
    } catch (error) {
        res.status(500).json({ error: "Inventory fetch karne mein error", details: error.message });
    }
});

// ==========================================
// 3. PURCHASE ENTRY API (Kachha Maal Kharidna)
// ==========================================
router.post('/purchase', async (req, res) => {
    try {
        const { itemName, category, weightKg, vendorName } = req.body;

        // Inventory mein stock PLUS (+) karna
        const updatedStock = await Inventory.findOneAndUpdate(
            { itemName: itemName, category: category }, 
            { $inc: { currentStockKg: weightKg } },     
            { new: true, upsert: true }                 
        );

        res.status(201).json({
            message: `🚚 ${weightKg}kg ${itemName} godown mein add ho gaya! (Vendor: ${vendorName})`,
            data: updatedStock
        });

    } catch (error) {
        res.status(500).json({ error: "Purchase entry mein error aayi", details: error.message });
    }
});
// ==========================================
// 4. SALES & DISPATCH API (Maal Bechna)
// ==========================================
router.post('/sales', async (req, res) => {
    try {
        const { itemName, category, weightKg, clientName } = req.body;

        // Inventory se stock MINUS (-) karna (Kyunki maal factory se bahar ja raha hai)
        const updatedStock = await Inventory.findOneAndUpdate(
            { itemName: itemName, category: category }, 
            { $inc: { currentStockKg: -weightKg } },     // Dhyan de: yahan minus (-) laga hai
            { new: true }                 
        );

        if (!updatedStock) {
            return res.status(404).json({ error: "Godown mein yeh item nahi mila!" });
        }

        res.status(201).json({
            message: `🚚 ${weightKg}kg ${itemName} dispatch ho gaya! (Client: ${clientName})`
        });

    } catch (error) {
        res.status(500).json({ error: "Sales entry mein error aayi", details: error.message });
    }
});
const Party = require('../models/Party');

// 1. Nayi Party Add Karna
router.post('/parties', async (req, res) => {
    try {
        const { name, phone, type } = req.body;
        const newParty = new Party({ name, phone, type });
        await newParty.save();
        res.status(201).json(newParty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Transaction Record Karna (Paisa lena/dena)
router.post('/transaction', async (req, res) => {
    try {
        const { partyId, amount, type, remarks } = req.body;
        const party = await Party.findById(partyId);
        
        // Balance calculate karna
        const change = type === 'Credit' ? amount : -amount;
        party.totalBalance += change;
        
        party.transactions.push({ amount, type, remarks });
        await party.save();
        res.status(200).json({ message: "Khata Update Ho Gaya!", balance: party.totalBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Sab Parties ki List nikalna
router.get('/parties', async (req, res) => {
    const parties = await Party.find();
    res.json(parties);
});
const Worker = require('../models/Worker');

// ==========================================
// 5. WORKER & ATTENDANCE (HAZIRI) API
// ==========================================

// Naya Worker Add Karna
router.post('/workers', async (req, res) => {
    try {
        const { name, role, dailyWage } = req.body;
        const newWorker = new Worker({ name, role, dailyWage });
        await newWorker.save();
        res.status(201).json({ message: "Naya mistri add ho gaya!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sab Workers ki List aur Aaj ki Haziri nikalna
router.get('/workers', async (req, res) => {
    try {
        const workers = await Worker.find();
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Haziri (Attendance) Lagana
router.post('/attendance', async (req, res) => {
    try {
        const { workerId, date, status, advanceGiven } = req.body;
        const worker = await Worker.findById(workerId);
        
        // Check karo ki aaj ki haziri pehle se toh nahi lagi
        const existingIndex = worker.attendance.findIndex(a => a.date === date);
        
        if (existingIndex >= 0) {
            // Agar lagi hai toh update kar do
            worker.attendance[existingIndex].status = status;
            if(advanceGiven) worker.attendance[existingIndex].advanceGiven += advanceGiven;
        } else {
            // Nayi haziri lagao
            worker.attendance.push({ date, status, advanceGiven: advanceGiven || 0 });
        }
        
        await worker.save();
        res.status(200).json({ message: "Haziri Save Ho Gayi!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// YAHAN AAYEGA MODULE.EXPORTS SABSE LAST MEIN! 👇
module.exports = router;