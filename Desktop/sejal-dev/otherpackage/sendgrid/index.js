const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv').config();
const { EmailTemplatesModal, EmailLogsModal } = require('./model');
const EmailNotification = require('./email-service');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
let emailObj = new EmailNotification(process.env.MONGO_URL);


const EmailNotification = require('./EmailNotification');
const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY;
const SEND_GRID_API_URL = process.env.SEND_GRID_API_URL;

sgMail.setApiKey(SEND_GRID_API_KEY);
let emailObj = new EmailNotification();


const sendMail = function () { //test
    const msg = {
        to: emailParams.to,
        from: emailParams.from, // Use the email address or domain you verified above
        subject: emailParams.subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: emailParams.html
      };
      
    sgMail.send(msg).then((data) => {
    }, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      });
}

const sendEmail = async (bodyParams, attachment=null) => {
    try {
        const sendGridDetails = {
            sendGridAPIKey: SEND_GRID_API_KEY,
            sendGridAPI: SEND_GRID_API_URL
        }
        await emailObj.sendEmail(bodyParams.from, bodyParams.to, bodyParams.params, bodyParams.templateName, sendGridDetails, attachment);
    } catch (e) {
        console.log('e: ', e);
    }
}

module.exports = { sendMail, sendEmail };