/**
 * Expense Model
 * MongoDB schema for expense records
 */

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    // Transaction type: EXPENSE (tiền ra) or INCOME (tiền vào)
    type: {
        type: String,
        enum: ['EXPENSE', 'INCOME'],
        default: 'EXPENSE',
        index: true
    },
    // Danh mục (bắt buộc khi là chi tiêu, optional cho thu nhập)
    category: {
        type: String,
        required: function () {
            return this.type === 'EXPENSE';
        },
        trim: true
    },
    // Jar chỉ áp dụng cho chi tiêu, thu nhập có thể để trống
    jarKey: {
        type: String,
        enum: ['NEC', 'FFA', 'LTSS', 'EDU', 'PLAY', 'GIVE'],
        required: function () {
            return this.type === 'EXPENSE';
        },
        index: true
    },
    // AI classification results
    ai: {
        predictedCategory: {
            type: String,
            default: null
        },
        predictedJarKey: {
            type: String,
            default: null
        },
        predictedType: {
            type: String,
            default: null
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: null
        },
        extractedAmount: {
            type: Number,
            default: null
        },
        classifiedAt: {
            type: Date,
            default: null
        }
    },
    // Anomaly detection results
    anomaly: {
        isAnomaly: {
            type: Boolean,
            default: false
        },
        reasons: [{
            type: String,
            enum: ['ANOMALY', 'JAR_LIMIT', 'BUDGET_LIMIT']
        }],
        level: {
            type: String,
            enum: ['normal', 'info', 'warning', 'critical'],
            default: 'normal'
        },
        message: {
            type: String,
            default: ''
        },
        detectedAt: {
            type: Date,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
expenseSchema.index({ userId: 1, createdAt: -1 });
expenseSchema.index({ userId: 1, jarKey: 1, createdAt: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index(
    { description: 'text', category: 'text' },
    { name: 'expense_text_search', weights: { description: 5, category: 2 } }
);

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function () {
    return this.amount.toLocaleString('vi-VN');
});

// Method to get monthly total for a jar
expenseSchema.statics.getMonthlyTotal = async function (userId, jarKey, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await this.aggregate([
        {
            $match: {
                userId,
                jarKey,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    return result.length > 0 ? result[0].total : 0;
};

// Method to get recent expenses for a jar
expenseSchema.statics.getRecentExpenses = async function (userId, jarKey, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.find({
        userId,
        jarKey,
        createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Expense', expenseSchema);

