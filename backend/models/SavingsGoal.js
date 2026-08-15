const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    jarKey: {
        type: String,
        enum: ['NEC', 'FFA', 'LTSS', 'EDU', 'PLAY', 'GIVE'],
        default: 'LTSS',
        index: true
    },
    targetAmount: {
        type: Number,
        required: true,
        min: 1
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    targetDate: {
        type: Date,
        default: null
    },
    note: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'COMPLETED', 'PAUSED'],
        default: 'ACTIVE',
        index: true
    }
}, {
    timestamps: true
});

savingsGoalSchema.index({ userId: 1, status: 1, jarKey: 1 });

savingsGoalSchema.statics.initializeDefaultGoals = async function (userId, session = null) {
    const defaults = [
        {
            userId,
            name: 'Quy du phong 3 thang',
            jarKey: 'FFA',
            targetAmount: 15000000,
            currentAmount: 0,
            note: 'Quy du phong cho tinh huong khan cap'
        },
        {
            userId,
            name: 'Tiet kiem nang cap laptop',
            jarKey: 'LTSS',
            targetAmount: 25000000,
            currentAmount: 0,
            note: 'Muc tieu tiet kiem cho cong viec va hoc tap'
        }
    ];

    const existing = await this.find({ userId }).session(session);
    if (existing.length === 0) {
        await this.insertMany(defaults, { session });
    }

    return this.find({ userId }).sort({ createdAt: -1 }).session(session);
};

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
