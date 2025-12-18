/**
 * Jar Routes
 * API endpoints for jar configuration management
 */

const express = require('express');
const router = express.Router();
const JarConfig = require('../models/JarConfig');
const Expense = require('../models/Expense');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/jars
 * Get all jars for a user
 * Requires authentication
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Get from authenticated user

        const jars = await JarConfig.getUserJars(userId);

        // Get current month spending for each jar
        const now = new Date();
        const jarsWithSpending = await Promise.all(
            jars.map(async (jar) => {
                const monthlyTotal = await Expense.getMonthlyTotal(
                    userId,
                    jar.jarKey,
                    now.getFullYear(),
                    now.getMonth() + 1
                );

                const spendingPercentage = jar.monthlyLimit
                    ? (monthlyTotal / jar.monthlyLimit) * 100
                    : null;

                return {
                    ...jar.toObject(),
                    currentSpending: monthlyTotal,
                    spendingPercentage: spendingPercentage ? Math.min(spendingPercentage, 100) : null,
                    remaining: jar.monthlyLimit ? Math.max(0, jar.monthlyLimit - monthlyTotal) : null
                };
            })
        );

        res.json({
            success: true,
            data: jarsWithSpending
        });
    } catch (error) {
        console.error('Get Jars Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch jars'
        });
    }
});

/**
 * POST /api/jars/initialize
 * Initialize default jars for a user
 * Requires authentication
 */
router.post('/initialize', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Get from authenticated user

        const jars = await JarConfig.initializeDefaultJars(userId);

        res.json({
            success: true,
            data: jars,
            message: 'Default jars initialized successfully'
        });
    } catch (error) {
        console.error('Initialize Jars Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to initialize jars'
        });
    }
});

/**
 * PUT /api/jars/:jarKey
 * Update a jar configuration
 * Requires authentication
 */
router.put('/:jarKey', authenticate, async (req, res) => {
    try {
        const { monthlyLimit, percentage, color, icon, isActive } = req.body;
        const { jarKey } = req.params;
        const userId = req.userId; // Get from authenticated user

        const jar = await JarConfig.findOne({ userId, jarKey });

        if (!jar) {
            return res.status(404).json({
                success: false,
                error: 'Jar not found'
            });
        }

        // Update fields
        if (monthlyLimit !== undefined) jar.monthlyLimit = monthlyLimit;
        if (percentage !== undefined) jar.percentage = percentage;
        if (color !== undefined) jar.color = color;
        if (icon !== undefined) jar.icon = icon;
        if (isActive !== undefined) jar.isActive = isActive;

        jar.updatedAt = new Date();
        await jar.save();

        res.json({
            success: true,
            data: jar
        });
    } catch (error) {
        console.error('Update Jar Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update jar'
        });
    }
});

/**
 * GET /api/jars/:jarKey/stats
 * Get statistics for a specific jar
 * Requires authentication
 */
router.get('/:jarKey/stats', authenticate, async (req, res) => {
    try {
        const { month, year } = req.query;
        const { jarKey } = req.params;
        const userId = req.userId; // Get from authenticated user

        const now = new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const jar = await JarConfig.getJarByKey(userId, jarKey);

        if (!jar) {
            return res.status(404).json({
                success: false,
                error: 'Jar not found'
            });
        }

        const monthlyTotal = await Expense.getMonthlyTotal(
            userId,
            jarKey,
            targetYear,
            targetMonth
        );

        const recentExpenses = await Expense.getRecentExpenses(userId, jarKey, 30);

        res.json({
            success: true,
            data: {
                jar: jar.toObject(),
                monthlyTotal,
                monthlyLimit: jar.monthlyLimit,
                remaining: jar.monthlyLimit ? Math.max(0, jar.monthlyLimit - monthlyTotal) : null,
                spendingPercentage: jar.monthlyLimit
                    ? Math.min((monthlyTotal / jar.monthlyLimit) * 100, 100)
                    : null,
                recentExpenses: recentExpenses.slice(0, 10)
            }
        });
    } catch (error) {
        console.error('Get Jar Stats Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch jar statistics'
        });
    }
});

module.exports = router;

