const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true,
        index: true
    },
    entityType: {
        type: String,
        required: true,
        index: true
    },
    entityId: {
        type: String,
        default: null
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
}, {
    versionKey: false
});

auditLogSchema.statics.createLog = async function (payload, session = null) {
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    return this.create([{ ...payload, expiresAt }], { session });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
