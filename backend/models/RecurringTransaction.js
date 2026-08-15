const mongoose = require('mongoose');

const recurringTransactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
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
    type: {
        type: String,
        enum: ['EXPENSE', 'INCOME'],
        default: 'EXPENSE',
        index: true
    },
    category: {
        type: String,
        default: ''
    },
    jarKey: {
        type: String,
        enum: ['NEC', 'FFA', 'LTSS', 'EDU', 'PLAY', 'GIVE'],
        default: undefined
    },
    frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY'],
        required: true,
        index: true
    },
    nextRunAt: {
        type: Date,
        required: true,
        index: true
    },
    lastRunAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

recurringTransactionSchema.index({ userId: 1, isActive: 1, nextRunAt: 1 });

recurringTransactionSchema.statics.initializeDefaultRecurring = async function (userId, session = null) {
    const baseDate = new Date();
    const defaults = [
        {
            userId,
            title: 'Lương hàng tháng',
            description: 'Lương hàng tháng',
            amount: 18000000,
            type: 'INCOME',
            category: 'Lương',
            frequency: 'MONTHLY',
            nextRunAt: new Date(baseDate.getFullYear(), baseDate.getMonth(), 28)
        },
        {
            userId,
            title: 'Tiền internet',
            description: 'Thanh toán internet hàng tháng',
            amount: 320000,
            type: 'EXPENSE',
            category: 'Hóa đơn',
            jarKey: 'NEC',
            frequency: 'MONTHLY',
            nextRunAt: new Date(baseDate.getFullYear(), baseDate.getMonth(), 25)
        }
    ];

    const existing = await this.find({ userId }).session(session);
    if (existing.length === 0) {
        await this.insertMany(defaults, { session });
    }

    return this.find({ userId }).sort({ nextRunAt: 1 }).session(session);
};

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);
