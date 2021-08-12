const sgMail = require('@sendgrid/mail')
const {getJwtToken} = require('../utils');

const dotenv = require('dotenv').config();
//const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const sendMail = require('../otherpackage/sendgrid/sendEmail')
//SENDGRID_API_KEY= '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';

const sendMail = () => {
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: 'sejaldhandhukiya1995@gmail.com', // Change to your recipient
      from: 'sejaldhandhukiya1995@gmail.com', // Change to your verified sender
      subject: 'Hello, welcome ',
      text: 'welcome my first sendgrid email',
      html: '<h1>and easy to do anywhere, even with Node.js</h1>',
    
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error("Error=", error)
      })

}
const sendEmail = function (bodyParams) {
  //console.log(process.env.SENDGRID_API_KEY);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
      to: 'sejaldhandhukiya1995@gmail.com',
      from: 'sejaldhandhukiya1995@gmail.com',
      subject: 'welcome',
      html: '<h1>hii welcome</h1>',
      //templateName:'user.register',
      templateName:'user.forgot.password'
    
  };
  try {
      sgMail.send(msg);
      console.log("Email sent directly");
      
  } catch (error) {
      console.log('error: ', error);
  }
}

module.exports = sendEmail;