const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const logs = await AuditLog.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit, 10));

        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error('Get Activity Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tải lịch sử hoạt động'
        });
    }
});

module.exports = router;
