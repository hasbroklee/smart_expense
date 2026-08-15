const AuditLog = require('../models/AuditLog');

class AuditService {
    static async log(payload, session = null) {
        await AuditLog.createLog(payload, session);
    }
}

module.exports = AuditService;
