const moment = require('moment');
const _ = require('underscore');
var handlebars = require('handlebars');
var SendgridEmail = require('./SendgridEmail');

const SendGrid = "SendGrid";
const { EmailTemplatesModal, EmailLogsModal } = require('./model');

class EmailNotification {
    constructor() {
    }

    async fetchTemplateDetailByName(mappingName) {
        try {
            var template = await EmailTemplatesModal.findOne({
                templateName: mappingName
            });
            return template;
        } catch (error) {
            console.log('error: ', error);
            
        }
    }

    replaceContentByParameters(htmlContent, params) {
        var template = handlebars.compile(htmlContent);
        return template(params);
    }

    sendEmail(from, to, params, mappingName, sendGridDetails, attachment=null) {
        var self = this;
        return new Promise((resolve, reject) => {
            const templateDetailsPromise = self.fetchTemplateDetailByName(mappingName);
            templateDetailsPromise.then(async (templateDetails) => {
                if (templateDetails.senderService == SendGrid) {
                    if(_.isEmpty(sendGridDetails)) {
                        return reject({ error: "SendGridDetails is require" })
                    }
                    let sendGridObj = new SendgridEmail(sendGridDetails.sendGridAPIKey, sendGridDetails.sendGridAPI);
                    await sendGridObj.sendEmail(from, to, templateDetails.subject, params, templateDetails.templateId, attachment);
                    self.saveDataIntoMongoDB(from, to, templateDetails.subject, params, templateDetails.templateId);
                    return resolve({ success: "Email sent" })
                }                
            }).catch((e)=> {
                console.log('e: ', e);
                return reject({
                    error: "No such template found"
                })
            })
        })        
    }

    saveDataIntoMongoDB(from, to, subject, params, templateId) {
        let log = new EmailLogsModal();
        log.timestamp = moment(new Date()).valueOf();
        log.to = to;
        log.from = from;
        log.subject = subject;
        log.body = params;
        log.templateId = templateId;
        log.save(function (err) {
            if (err) console.log('err: ', err);
            else console.log("Mail Sent!");
        });
    }
}
module.exports = EmailNotification;