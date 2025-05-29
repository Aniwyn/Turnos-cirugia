const db = require('../models')

async function logAudit(auditData) {
  try {
    await db.AuditLog.create(auditData)
  } catch (err) {
    console.error('Error al generar registro:', err)
  }
}

module.exports = logAudit
