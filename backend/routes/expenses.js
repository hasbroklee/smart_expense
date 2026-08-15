/**
 * Expense Routes
 * API endpoints for expense management
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Expense = require('../models/Expense');
const AIService = require('../services/aiService');
const AnomalyService = require('../services/anomalyService');
const Alert = require('../models/Alert');
const SavingsGoal = require('../models/SavingsGoal');
const RecurringTransaction = require('../models/RecurringTransaction');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/expenses
 * Create a new expense with AI classification
 * Requires authentication
 */
router.post('/', authenticate, async (req, res) => {
    let session;
    try {
        const { description, amount, category, jarKey, type } = req.body;
        const userId = req.userId; // Get from authenticated user

        // Validate required fields
        if (!description) {
            return res.status(400).json({
                success: false,
                error: 'Mô tả giao dịch là bắt buộc'
            });
        }

        let finalAmount = amount;
        let finalCategory = category;
        let finalJarKey = jarKey;
        let finalType = type || 'EXPENSE'; // default to EXPENSE
        let aiResult = null;

        // Normalize amount input (convert to number when provided)
        if (finalAmount !== undefined && finalAmount !== null && finalAmount !== '') {
            const parsedAmount = Number(finalAmount);
            finalAmount = Number.isNaN(parsedAmount) ? null : parsedAmount;
        } else {
            finalAmount = null;
        }

        // Nếu thiếu category/jar hoặc type, dùng AI để gợi ý
        if (!category || !jarKey || !type) {
            try {
                // Call AI service for classification
                aiResult = await AIService.classifyExpense(description, userId, finalAmount);

                if (aiResult.success) {
                    // Nếu frontend chưa chọn type, dùng type do AI dự đoán
                    if (!type && aiResult.data.predictedType) {
                        finalType = aiResult.data.predictedType;
                    }

                    // Chỉ tự gán category / jar khi là giao dịch chi tiêu
                    if (finalType === 'EXPENSE') {
                        if (!finalCategory && aiResult.data.predictedCategory) {
                            finalCategory = aiResult.data.predictedCategory;
                        }
                        if (!finalJarKey && aiResult.data.predictedJarKey) {
                            finalJarKey = aiResult.data.predictedJarKey;
                        }
                    }

                    // Dù là thu hay chi, vẫn có thể dùng số tiền AI đọc được nếu chưa nhập
                    if (!finalAmount && aiResult.data.extractedAmount) {
                        finalAmount = aiResult.data.extractedAmount;
                    }
                } else {
                    // Fallback cho trường hợp AI lỗi
                    if (finalType === 'EXPENSE') {
                        finalCategory = finalCategory || 'Khác';
                        finalJarKey = finalJarKey || 'NEC';
                    }
                }
            } catch (error) {
                console.error('AI Classification Error:', error);
                // Fallback cho lỗi AI chỉ áp dụng với chi tiêu
                if (finalType === 'EXPENSE') {
                    finalCategory = finalCategory || 'Khác';
                    finalJarKey = finalJarKey || 'NEC';
                }
            }
        }

        // Use AI extracted amount if not provided
        if ((!finalAmount || finalAmount <= 0) && aiResult?.success && aiResult.data.extractedAmount) {
            finalAmount = aiResult.data.extractedAmount;
        }

        // Final fallback if no amount detected: store as 0 (still allow expense creation)
        if (!finalAmount || Number.isNaN(finalAmount)) {
            finalAmount = 0;
        }

        finalAmount = Math.max(0, Number(finalAmount));

        // Create expense
        // Với giao dịch chi tiêu, nếu vẫn chưa có category/jar thì gán mặc định
        if (finalType === 'EXPENSE') {
            if (!finalCategory) {
                finalCategory = 'Khác';
            }
            if (!finalJarKey) {
                finalJarKey = 'NEC';
            }
        }

        const expenseData = {
            userId,
            description,
            amount: finalAmount,
            type: finalType,
            // category / jarKey sẽ khác nhau giữa EXPENSE và INCOME
            category: finalCategory,
            jarKey: finalJarKey,
            ai: aiResult && aiResult.success ? {
                predictedCategory: aiResult.data.predictedCategory,
                predictedJarKey: aiResult.data.predictedJarKey,
                predictedType: aiResult.data.predictedType || finalType,
                confidence: aiResult.data.confidence,
                extractedAmount: aiResult.data.extractedAmount,
                classifiedAt: new Date()
            } : null
        };

        // Nếu là INCOME thì bỏ hẳn jarKey (và category có thể để trống)
        if (finalType === 'INCOME') {
            if (!expenseData.category) {
                delete expenseData.category;
            }
            if (!expenseData.jarKey) {
                delete expenseData.jarKey;
            }
        }

        session = await mongoose.startSession();
        let expense;
        let anomalyError = null;

        await session.withTransaction(async () => {
            expense = new Expense(expenseData);
            await expense.save({ session });

            if (finalType === 'EXPENSE') {
                try {
                    const anomalyResult = await AnomalyService.detectAnomaly(
                        userId,
                        finalJarKey,
                        finalAmount
                    );

                    expense.anomaly = {
                        isAnomaly: anomalyResult.isAnomaly,
                        reasons: anomalyResult.reasons,
                        level: anomalyResult.level,
                        message: anomalyResult.message,
                        detectedAt: new Date()
                    };
                    await expense.save({ session });

                    if (anomalyResult.isAnomaly) {
                        const alertTitle = anomalyResult.reasons.includes('JAR_LIMIT')
                            ? `Vượt hạn mức hũ: ${finalJarKey}`
                            : anomalyResult.reasons.includes('BUDGET_LIMIT')
                                ? 'Vượt ngân sách tháng'
                                : 'Phát hiện giao dịch bất thường';

                        await Alert.create([{
                            userId,
                            expenseId: expense._id,
                            type: anomalyResult.reasons[0],
                            level: anomalyResult.level,
                            title: alertTitle,
                            message: anomalyResult.message,
                            metadata: {
                                jarKey: finalJarKey,
                                amount: finalAmount
                            }
                        }], { session });
                    }
                } catch (error) {
                    anomalyError = error;
                }
            }
        });

        if (anomalyError) {
            console.error('Anomaly Detection Error:', anomalyError);
        }

        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Create Expense Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tạo giao dịch'
        });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
});

/**
 * GET /api/expenses
 * Get expenses for a user with optional filters
 * Requires authentication
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const { jarKey, category, startDate, endDate, limit = 50, page = 1, q, type } = req.query;
        const userId = req.userId; // Get from authenticated user

        const query = { userId };

        // Apply filters
        if (jarKey) query.jarKey = jarKey;
        if (category) query.category = category;
        if (type) query.type = type;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        if (q) query.$text = { $search: q };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let expenseQuery = Expense.find(query)
            .limit(parseInt(limit))
            .skip(skip);

        if (q) {
            expenseQuery = expenseQuery
                .select({ score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' }, createdAt: -1 });
        } else {
            expenseQuery = expenseQuery.sort({ createdAt: -1 });
        }

        const expenses = await expenseQuery;

        const total = await Expense.countDocuments(query);

        res.json({
            success: true,
            data: expenses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get Expenses Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tải danh sách giao dịch'
        });
    }
});

/**
 * GET /api/expenses/:id
 * Get a single expense by ID
 * Requires authentication
 */
router.get('/:id([0-9a-fA-F]{24})', authenticate, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId // Ensure user can only access their own expenses
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy giao dịch'
            });
        }

        res.json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Get Expense Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tải giao dịch'
        });
    }
});

/**
 * PUT /api/expenses/:id
 * Update an expense
 * Requires authentication
 */
router.put('/:id([0-9a-fA-F]{24})', authenticate, async (req, res) => {
    try {
        const { description, amount, category, jarKey } = req.body;

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId // Ensure user can only update their own expenses
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy giao dịch'
            });
        }

        // Update fields
        if (description) expense.description = description;
        if (amount) expense.amount = amount;
        if (category) expense.category = category;
        if (jarKey) expense.jarKey = jarKey;

        expense.updatedAt = new Date();
        await expense.save();

        res.json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Update Expense Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể cập nhật giao dịch'
        });
    }
});

/**
 * DELETE /api/expenses/:id
 * Delete an expense
 * Requires authentication
 */
router.delete('/:id([0-9a-fA-F]{24})', authenticate, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId // Ensure user can only delete their own expenses
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy giao dịch'
            });
        }

        res.json({
            success: true,
            message: 'Đã xoá giao dịch thành công'
        });
    } catch (error) {
        console.error('Delete Expense Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể xoá giao dịch'
        });
    }
});

/**
 * GET /api/expenses/stats/summary
 * Get expense statistics summary
 * Requires authentication
 */
router.get('/stats/summary', authenticate, async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.userId; // Get from authenticated user

        const now = new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const [expenseAgg, incomeAgg, categoryAgg, dailyAgg] = await Promise.all([
            // Expenses by jar
            Expense.aggregate([
                {
                    $match: {
                        userId,
                        type: 'EXPENSE',
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$jarKey',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            // Total income (không chia jar)
            Expense.aggregate([
                {
                    $match: {
                        userId,
                        type: 'INCOME',
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            // Thống kê chi theo category
            Expense.aggregate([
                {
                    $match: {
                        userId,
                        type: 'EXPENSE',
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            // Thống kê thu/chi theo ngày trong tháng
            Expense.aggregate([
                {
                    $match: {
                        userId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: '$createdAt' },
                            type: '$type'
                        },
                        total: { $sum: '$amount' }
                    }
                }
            ])
        ]);

        const totalExpense = expenseAgg.reduce((sum, stat) => sum + (stat.total || 0), 0);
        const totalIncome = incomeAgg.length > 0 ? incomeAgg[0].total : 0;
        const expenseCount = expenseAgg.reduce((sum, stat) => sum + (stat.count || 0), 0);

        // Chuẩn hoá dữ liệu daily: mảng { day, income, expense }
        const daysInMonth = endDate.getDate();
        const dailyMap = {};
        for (let d = 1; d <= daysInMonth; d++) {
            dailyMap[d] = { day: d, income: 0, expense: 0 };
        }
        for (const row of dailyAgg) {
            const day = row._id.day;
            const t = row._id.type;
            if (!dailyMap[day]) continue;
            if (t === 'INCOME') {
                dailyMap[day].income += row.total;
            } else if (t === 'EXPENSE') {
                dailyMap[day].expense += row.total;
            }
        }
        const daily = Object.values(dailyMap);

        res.json({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                totalExpense,
                totalIncome,
                net: totalIncome - totalExpense,
                expenseCount,
                incomeCount: incomeAgg.length > 0 ? incomeAgg[0].count : 0,
                expenseByJar: expenseAgg.map(stat => ({
                    jarKey: stat._id,
                    total: stat.total,
                    count: stat.count
                })),
                expenseByCategory: categoryAgg.map(stat => ({
                    category: stat._id || 'Khác',
                    total: stat.total,
                    count: stat.count
                })),
                daily
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tải thống kê'
        });
    }
});

router.get('/stats/insights', authenticate, async (req, res) => {
    try {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const [expenseInsights, goals, recurringDue] = await Promise.all([
            Expense.aggregate([
                {
                    $match: {
                        userId: req.userId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $facet: {
                        totals: [
                            {
                                $group: {
                                    _id: '$type',
                                    total: { $sum: '$amount' },
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        jarBreakdown: [
                            { $match: { type: 'EXPENSE' } },
                            {
                                $group: {
                                    _id: '$jarKey',
                                    total: { $sum: '$amount' },
                                    count: { $sum: 1 },
                                    avgAmount: { $avg: '$amount' }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'jarconfigs',
                                    let: { jarKey: '$_id' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$userId', req.userId] },
                                                        { $eq: ['$jarKey', '$$jarKey'] }
                                                    ]
                                                }
                                            }
                                        },
                                        { $project: { _id: 0, jarName: 1, monthlyLimit: 1, color: 1 } }
                                    ],
                                    as: 'jarConfig'
                                }
                            },
                            { $addFields: { jarConfig: { $arrayElemAt: ['$jarConfig', 0] } } },
                            { $sort: { total: -1 } }
                        ],
                        topCategories: [
                            { $match: { type: 'EXPENSE' } },
                            {
                                $group: {
                                    _id: '$category',
                                    total: { $sum: '$amount' },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { total: -1 } },
                            { $limit: 5 }
                        ],
                        anomalySummary: [
                            { $match: { 'anomaly.isAnomaly': true } },
                            {
                                $group: {
                                    _id: '$anomaly.level',
                                    count: { $sum: 1 },
                                    totalAmount: { $sum: '$amount' }
                                }
                            }
                        ]
                    }
                }
            ]),
            SavingsGoal.aggregate([
                {
                    $match: {
                        userId: req.userId,
                        status: 'ACTIVE'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        jarKey: 1,
                        targetAmount: 1,
                        currentAmount: 1,
                        progress: {
                            $cond: [
                                { $gt: ['$targetAmount', 0] },
                                { $multiply: [{ $divide: ['$currentAmount', '$targetAmount'] }, 100] },
                                0
                            ]
                        }
                    }
                },
                { $sort: { createdAt: -1 } }
            ]),
            RecurringTransaction.aggregate([
                {
                    $match: {
                        userId: req.userId,
                        isActive: true,
                        nextRunAt: { $lte: now }
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ])
        ]);

        const insights = expenseInsights[0] || {
            totals: [],
            jarBreakdown: [],
            topCategories: [],
            anomalySummary: []
        };

        res.json({
            success: true,
            data: {
                ...insights,
                goals,
                recurringDue
            }
        });
    } catch (error) {
        console.error('Get Insights Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tải dữ liệu tổng hợp'
        });
    }
});

module.exports = router;

