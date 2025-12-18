/**
 * Alert Routes
 * API endpoints for alerts management
 */

const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/alerts
 * Get alerts for a user
 * Requires authentication
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const { isRead, type, level, limit = 50 } = req.query;
        const userId = req.userId; // Get from authenticated user

        const query = { userId };

        // Apply filters
        if (isRead !== undefined) {
            query.isRead = isRead === 'true';
        }
        if (type) query.type = type;
        if (level) query.level = level;

        const alerts = await Alert.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('expenseId', 'description amount category jarKey createdAt');

        const unreadCount = await Alert.countDocuments({ userId, isRead: false });

        res.json({
            success: true,
            data: alerts,
            unreadCount
        });
    } catch (error) {
        console.error('Get Alerts Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch alerts'
        });
    }
});

/**
 * GET /api/alerts/unread
 * Get unread alerts for a user
 * Requires authentication
 */
router.get('/unread', authenticate, async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const userId = req.userId; // Get from authenticated user

        const alerts = await Alert.getUnreadAlerts(userId, parseInt(limit));

        res.json({
            success: true,
            data: alerts,
            count: alerts.length
        });
    } catch (error) {
        console.error('Get Unread Alerts Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch unread alerts'
        });
    }
});

/**
 * PUT /api/alerts/:id/read
 * Mark an alert as read
 * Requires authentication
 */
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Get from authenticated user

        const alert = await Alert.markAsRead(req.params.id, userId);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        res.json({
            success: true,
            data: alert
        });
    } catch (error) {
        console.error('Mark Alert Read Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to mark alert as read'
        });
    }
});

/**
 * PUT /api/alerts/read-all
 * Mark all alerts as read for a user
 * Requires authentication
 */
router.put('/read-all', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Get from authenticated user

        const result = await Alert.markAllAsRead(userId);

        res.json({
            success: true,
            message: `Marked ${result.modifiedCount} alerts as read`
        });
    } catch (error) {
        console.error('Mark All Alerts Read Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to mark all alerts as read'
        });
    }
});

/**
 * DELETE /api/alerts/:id
 * Delete an alert
 */
router.delete('/:id', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndDelete(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        res.json({
            success: true,
            message: 'Alert deleted successfully'
        });
    } catch (error) {
        console.error('Delete Alert Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete alert'
        });
    }
});

module.exports = router;

