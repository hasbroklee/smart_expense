const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const RecurringTransaction = require('../models/RecurringTransaction');
const Expense = require('../models/Expense');
const { authenticate } = require('../middleware/auth');

function getNextRunDate(currentDate, frequency) {
    const next = new Date(currentDate);
    if (frequency === 'DAILY') next.setDate(next.getDate() + 1);
    if (frequency === 'WEEKLY') next.setDate(next.getDate() + 7);
    if (frequency === 'MONTHLY') next.setMonth(next.getMonth() + 1);
    return next;
}

router.get('/', authenticate, async (req, res) => {
    try {
        const recurring = await RecurringTransaction.find({ userId: req.userId }).sort({ nextRunAt: 1 });
        res.json({ success: true, data: recurring });
    } catch (error) {
        console.error('Get Recurring Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tải giao dịch định kỳ' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const recurring = await RecurringTransaction.create({
            userId: req.userId,
            ...req.body
        });
        res.status(201).json({ success: true, data: recurring });
    } catch (error) {
        console.error('Create Recurring Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tạo giao dịch định kỳ' });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const recurring = await RecurringTransaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!recurring) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy giao dịch định kỳ' });
        }

        res.json({ success: true, data: recurring });
    } catch (error) {
        console.error('Update Recurring Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể cập nhật giao dịch định kỳ' });
    }
});

router.post('/run-due', authenticate, async (req, res) => {
    let session;
    try {
        const now = new Date();
        const dueItems = await RecurringTransaction.find({
            userId: req.userId,
            isActive: true,
            nextRunAt: { $lte: now }
        });

        session = await mongoose.startSession();
        const createdExpenses = [];

        await session.withTransaction(async () => {
            for (const item of dueItems) {
                const expense = new Expense({
                    userId: req.userId,
                    description: item.description,
                    amount: item.amount,
                    type: item.type,
                    category: item.category || undefined,
                    jarKey: item.type === 'EXPENSE' ? (item.jarKey || 'NEC') : undefined,
                    ai: {
                        predictedCategory: item.category || null,
                        predictedJarKey: item.jarKey || null,
                        predictedType: item.type,
                        confidence: 1,
                        extractedAmount: item.amount,
                        classifiedAt: new Date()
                    }
                });
                await expense.save({ session });
                createdExpenses.push(expense);

                item.lastRunAt = now;
                item.nextRunAt = getNextRunDate(item.nextRunAt, item.frequency);
                await item.save({ session });
            }
        });

        res.json({
            success: true,
            data: {
                processed: createdExpenses.length,
                items: createdExpenses
            }
        });
    } catch (error) {
        console.error('Run Due Recurring Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể xử lý các giao dịch định kỳ đến hạn' });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
});

module.exports = router;
