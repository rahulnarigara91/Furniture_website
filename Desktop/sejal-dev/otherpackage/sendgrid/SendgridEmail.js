const sgMail = require('@sendgrid/mail');
const request = require('request');
const _ = require('underscore');

class SendgridEmail {
    constructor(sendGridAPIKey, endPoint) {
        sgMail.setApiKey(sendGridAPIKey);
        this.sendGridAPIKey = sendGridAPIKey;
        this.endPoint = endPoint;
    }

    async sendEmail(from, to, subject, bodyJSON, tempateId, attachmentDetails) {
        try {
            var attachment, filename;

            bodyJSON["Subject"] = subject;
            sgMail.setSubstitutionWrappers('{{', '}}');
            var msg = {
                to: to,
                from: from,
                subject: subject,
                templateId: tempateId,
                substitutionWrappers: ['{{', '}}'],
                dynamic_template_data: bodyJSON
            };
            if(attachmentDetails) {
                const fs = require("fs");
                attachment = fs.readFileSync(attachmentDetails.filePath).toString("base64");
                filename = attachmentDetails.filePath.split('/');
                if(filename && filename.length) {
                    filename = filename[filename.length - 1]
                }

                msg["attachments"] = [{
                    content: attachment,
                    filename: filename,
                    type: attachmentDetails.fileType,
                    disposition: "attachment"  
                }]
            }
            let data = await sgMail.send(msg);
            return data;
        } catch (error) {
            console.log('error2: ', JSON.stringify(error));
            
        }
    }

    getHtmlContentByTemplateId(tempateId) {
        return new Promise((resolve, reject) => {
            var options = {
                headers: {
                    "Authorization": "Bearer " + this.sendGridAPIKey
                }
            }

            request.get(this.endPoint + "templates/" + tempateId, options, function (error, response, body) {
                if (typeof body === 'string') {
                    body = JSON.parse(body);
                }
                let versions = body.versions
                if (versions && versions.length > 0) {
                    var htmlContentObj = _.findWhere(versions, {
                        "active": 1
                    });
                    if (htmlContentObj) {
                        resolve({ sendGridTemplateData: htmlContentObj});
                    } else {
                        reject({error: "No Data Available"})
                    }
                } else {
                    reject({error: "No Data Available"})
                }
            });
        })
    }
}

module.exports = SendgridEmail;