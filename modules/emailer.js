// modules/emailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  auth:{ user:process.env.SMTP_USER, pass:process.env.SMTP_PASS }
});

exports.sendEmail = (to,subject,html)=>
  transporter.sendMail({from:process.env.SMTP_USER,to,subject,html})
             .then(()=>console.log(`[Email] Sent: ${subject}`))
             .catch(e=>console.error('[Email] Failed:',e.message));
