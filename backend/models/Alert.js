/**
 * Alert Model
 * Alerts for anomalies, budget limits, and notifications
 */

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        default: null
    },
    type: {
        type: String,
        required: true,
        enum: ['ANOMALY', 'JAR_LIMIT', 'BUDGET_LIMIT', 'SYSTEM', 'INFO'],
        index: true
    },
    level: {
        type: String,
        required: true,
        enum: ['normal', 'info', 'warning', 'critical'],
        default: 'info',
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    // Additional data for the alert
    metadata: {
        jarKey: {
            type: String,
            enum: ['NEC', 'FFA', 'LTSS', 'EDU', 'PLAY', 'GIVE'],
            default: null
        },
        amount: {
            type: Number,
            default: null
        },
        limit: {
            type: Number,
            default: null
        },
        currentTotal: {
            type: Number,
            default: null
        },
        overage: {
            type: Number,
            default: null
        }
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
alertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
alertSchema.index({ userId: 1, type: 1, createdAt: -1 });
alertSchema.index({ userId: 1, level: 1 });

// Static method to get unread alerts for a user
alertSchema.statics.getUnreadAlerts = async function (userId, limit = 50) {
    return this.find({
        userId,
        isRead: false
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('expenseId', 'description amount category jarKey');
};

// Static method to mark alert as read
alertSchema.statics.markAsRead = async function (alertId, userId) {
    return this.findOneAndUpdate(
        { _id: alertId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
    );
};

// Static method to mark all alerts as read for a user
alertSchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

// Static method to create alert
alertSchema.statics.createAlert = async function (data) {
    const {
        userId,
        expenseId = null,
        type,
        level = 'info',
        title,
        message,
        metadata = {}
    } = data;

    return this.create({
        userId,
        expenseId,
        type,
        level,
        title,
        message,
        metadata
    });
};

// Instance method to mark as read
alertSchema.methods.markAsRead = async function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

module.exports = mongoose.model('Alert', alertSchema);

