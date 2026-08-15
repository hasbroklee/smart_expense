const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
    type: {
        type: String,
        enum: ['EXPENSE', 'INCOME'],
        required: true,
        index: true
    },
    jarKey: {
        type: String,
        enum: ['NEC', 'FFA', 'LTSS', 'EDU', 'PLAY', 'GIVE'],
        default: undefined,
        index: true
    },
    color: {
        type: String,
        default: '#64748b'
    },
    icon: {
        type: String,
        default: 'tag'
    },
    keywords: [{
        type: String,
        trim: true
    }],
    isSystem: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

categorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });
categorySchema.index({ userId: 1, jarKey: 1, isActive: 1 });

categorySchema.statics.initializeDefaultCategories = async function (userId, session = null) {
    const defaults = [
        { name: 'Ăn uống', type: 'EXPENSE', jarKey: 'NEC', color: '#ef4444', icon: 'utensils', keywords: ['food', 'meal', 'ăn', 'com'] },
        { name: 'Đi lại', type: 'EXPENSE', jarKey: 'NEC', color: '#f97316', icon: 'car', keywords: ['grab', 'bus', 'xang', 'taxi'] },
        { name: 'Hóa đơn', type: 'EXPENSE', jarKey: 'NEC', color: '#eab308', icon: 'receipt', keywords: ['bill', 'electric', 'water'] },
        { name: 'Sức khỏe', type: 'EXPENSE', jarKey: 'NEC', color: '#22c55e', icon: 'heart-pulse', keywords: ['hospital', 'medicine'] },
        { name: 'Bảo hiểm', type: 'EXPENSE', jarKey: 'FFA', color: '#0ea5e9', icon: 'shield', keywords: ['insurance', 'bao hiem'] },
        { name: 'Tiết kiệm', type: 'EXPENSE', jarKey: 'LTSS', color: '#14b8a6', icon: 'piggy-bank', keywords: ['saving', 'deposit'] },
        { name: 'Giáo dục', type: 'EXPENSE', jarKey: 'EDU', color: '#8b5cf6', icon: 'book-open', keywords: ['course', 'book', 'hoc phi'] },
        { name: 'Giải trí', type: 'EXPENSE', jarKey: 'PLAY', color: '#ec4899', icon: 'gamepad-2', keywords: ['movie', 'coffee', 'game'] },
        { name: 'Từ thiện', type: 'EXPENSE', jarKey: 'GIVE', color: '#f43f5e', icon: 'hand-heart', keywords: ['donate', 'charity'] },
        { name: 'Lương', type: 'INCOME', color: '#10b981', icon: 'wallet', keywords: ['salary', 'luong'] },
        { name: 'Làm thêm', type: 'INCOME', color: '#06b6d4', icon: 'briefcase', keywords: ['project', 'freelance'] },
        { name: 'Quà tặng', type: 'INCOME', color: '#84cc16', icon: 'gift', keywords: ['gift', 'thuong'] }
    ];

    const existing = await this.find({ userId }).session(session);
    const existingKeys = new Set(existing.map(item => `${item.type}:${item.name.toLowerCase()}`));
    const documents = defaults
        .filter(item => !existingKeys.has(`${item.type}:${item.name.toLowerCase()}`))
        .map(item => ({ ...item, userId, isSystem: true }));

    if (documents.length > 0) {
        await this.insertMany(documents, { session });
    }

    return this.find({ userId, isActive: true }).sort({ type: 1, name: 1 }).session(session);
};

module.exports = mongoose.model('Category', categorySchema);
