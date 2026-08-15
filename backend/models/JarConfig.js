/**
 * JarConfig Model
 * Configuration for each jar (6 Jars financial model)
 */

const mongoose = require('mongoose');

const jarConfigSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    jarKey: {
        type: String,
        required: true,
        enum: ['NEC', 'FFA', 'LTSS', 'EDU', 'PLAY', 'GIVE'],
        index: true
    },
    jarName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    monthlyLimit: {
        type: Number,
        default: null,
        min: 0
    },
    // Percentage allocation (if using percentage-based budgeting)
    percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    // Color for UI display
    color: {
        type: String,
        default: '#3498db'
    },
    // Icon for UI display
    icon: {
        type: String,
        default: '💰'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for unique jar per user
jarConfigSchema.index({ userId: 1, jarKey: 1 }, { unique: true });

// Static method to get all jars for a user
jarConfigSchema.statics.getUserJars = async function (userId) {
    return this.find({ userId, isActive: true }).sort({ jarKey: 1 });
};

// Static method to get jar by key
jarConfigSchema.statics.getJarByKey = async function (userId, jarKey) {
    return this.findOne({ userId, jarKey, isActive: true });
};

// Static method to initialize default jars for a user
jarConfigSchema.statics.initializeDefaultJars = async function (userId, session = null) {
    const defaultJars = [
        {
            jarKey: 'NEC',
            jarName: 'Nhu cầu thiết yếu',
            description: 'Chi phí thiết yếu: ăn uống, đi lại, hóa đơn, nhà ở',
            percentage: 55,
            color: '#e74c3c',
            icon: '🏠'
        },
        {
            jarKey: 'FFA',
            jarName: 'Tự do tài chính',
            description: 'Quỹ dự phòng và bảo hiểm',
            percentage: 10,
            color: '#3498db',
            icon: '🛡️'
        },
        {
            jarKey: 'LTSS',
            jarName: 'Tiết kiệm dài hạn',
            description: 'Mục tiêu lớn: nhà ở, xe cộ, đầu tư',
            percentage: 10,
            color: '#2ecc71',
            icon: '🏦'
        },
        {
            jarKey: 'EDU',
            jarName: 'Giáo dục',
            description: 'Học tập và phát triển bản thân',
            percentage: 10,
            color: '#9b59b6',
            icon: '📚'
        },
        {
            jarKey: 'PLAY',
            jarName: 'Giải trí',
            description: 'Thư giãn và giải trí',
            percentage: 10,
            color: '#f39c12',
            icon: '🎮'
        },
        {
            jarKey: 'GIVE',
            jarName: 'Cho đi',
            description: 'Từ thiện và hỗ trợ người khác',
            percentage: 5,
            color: '#e67e22',
            icon: '❤️'
        }
    ];

    const existingJars = await this.find({ userId }).session(session);
    const existingJarKeys = existingJars.map(j => j.jarKey);

    const jarsToCreate = defaultJars.filter(j => !existingJarKeys.includes(j.jarKey));

    if (jarsToCreate.length > 0) {
        const jarsWithUserId = jarsToCreate.map(jar => ({ ...jar, userId }));
        await this.insertMany(jarsWithUserId, { session });
    }

    return this.find({ userId, isActive: true }).sort({ jarKey: 1 }).session(session);
};

module.exports = mongoose.model('JarConfig', jarConfigSchema);

