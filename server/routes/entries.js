const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');

// Apply auth middleware to all entry routes
router.use(auth);

// GET /api/entries - Get all entries and computed analytics for logged in user
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.userId }).sort({ date: -1 });

    // Calculate Analytics
    let totalIncome = 0;
    let totalSpend = 0;

    // Group entries by date (YYYY-MM-DD) for daily summary breakdown
    const dailyMap = {};
    const dailySpendsMap = {};

    entries.forEach((entry) => {
      const amt = Number(entry.amount) || 0;
      const dateStr = new Date(entry.date).toISOString().split('T')[0];

      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          date: dateStr,
          rawDate: entry.date,
          totalSpend: 0,
          totalIncome: 0,
          entriesCount: 0
        };
      }

      dailyMap[dateStr].entriesCount += 1;

      if (entry.type === 'income') {
        totalIncome += amt;
        dailyMap[dateStr].totalIncome += amt;
      } else if (entry.type === 'spend') {
        totalSpend += amt;
        dailyMap[dateStr].totalSpend += amt;
        dailySpendsMap[dateStr] = (dailySpendsMap[dateStr] || 0) + amt;
      }
    });

    // Convert dailyMap object into sorted array (newest date first)
    const dailySummary = Object.values(dailyMap).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const currentBalance = totalIncome - totalSpend;

    // Daily Spend Statistics
    const spendDays = Object.keys(dailySpendsMap);
    const totalSpendDays = spendDays.length;

    let averageDailySpend = 0;
    let highestSpendDay = null; // { date, amount }

    if (totalSpendDays > 0) {
      averageDailySpend = totalSpend / totalSpendDays;

      let maxAmount = -1;
      let maxDate = null;

      for (const [dateStr, amount] of Object.entries(dailySpendsMap)) {
        if (amount > maxAmount) {
          maxAmount = amount;
          maxDate = dateStr;
        }
      }

      highestSpendDay = {
        date: maxDate,
        amount: maxAmount
      };
    }

    res.json({
      entries,
      dailySummary,
      stats: {
        totalIncome,
        totalSpend,
        currentBalance,
        averageDailySpend: Math.round(averageDailySpend * 100) / 100,
        highestSpendDay,
        totalSpendDays
      }
    });
  } catch (err) {
    console.error('Fetch Entries Error:', err);
    res.status(500).json({ message: 'Error fetching entries' });
  }
});

// POST /api/entries - Add new spend or income entry
router.post('/', async (req, res) => {
  try {
    const { type, amount, note, date } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required' });
    }

    if (!['spend', 'income'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either spend or income' });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const entry = new Entry({
      userId: req.user.userId,
      type,
      amount: numAmount,
      note: note || (type === 'spend' ? "Today's Total Spend" : "Income / Credit"),
      date: date ? new Date(date) : new Date()
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('Create Entry Error:', err);
    res.status(500).json({ message: 'Error creating entry' });
  }
});

// DELETE /api/entries/:id - Delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry removed successfully' });
  } catch (err) {
    console.error('Delete Entry Error:', err);
    res.status(500).json({ message: 'Error deleting entry' });
  }
});

module.exports = router;
