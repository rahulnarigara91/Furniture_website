const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmailLogsSchema = new Schema({
    subject: String,
    to: String,
    from: String,
    body: Object,
    timestamp: Number,
    templateId: String
}, {
    collection: 'EmailLogs',
    versionKey: false
})

const EmailTemplatesSchema = new Schema({
    templateId: String,
    templateName: String,
    isSendGrid: Boolean,
    subject: String,
    templateEndpoint: String,
    language: String,
    versionName: String,
    versionId: String,
    templateService: String,
    senderService: String,
    status: String,
    metadata: Object,
    createdAt: Date,
    updatedAt: Date,
    updatedBy: String,
    attachment: String
}, {
    collection: 'EmailTemplates',
    versionKey: false
})

var EmailTemplatesModal = mongoose.model('EmailTemplates', EmailTemplatesSchema);
var EmailLogsModal = mongoose.model('EmailLogs', EmailLogsSchema);

module.exports = { EmailTemplatesModal, EmailLogsModal };