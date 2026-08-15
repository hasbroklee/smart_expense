const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: goals });
    } catch (error) {
        console.error('Get Goals Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tải mục tiêu tiết kiệm' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const goal = await SavingsGoal.create({
            userId: req.userId,
            ...req.body
        });
        res.status(201).json({ success: true, data: goal });
    } catch (error) {
        console.error('Create Goal Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tạo mục tiêu tiết kiệm' });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const goal = await SavingsGoal.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy mục tiêu tiết kiệm' });
        }

        res.json({ success: true, data: goal });
    } catch (error) {
        console.error('Update Goal Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể cập nhật mục tiêu tiết kiệm' });
    }
});

router.get('/stats/summary', authenticate, async (req, res) => {
    try {
        const [summary] = await SavingsGoal.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$status',
                    totalTarget: { $sum: '$targetAmount' },
                    totalSaved: { $sum: '$currentAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, data: summary || { totalTarget: 0, totalSaved: 0, count: 0 } });
    } catch (error) {
        console.error('Goal Summary Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tải tổng hợp mục tiêu tiết kiệm' });
    }
});

module.exports = router;
