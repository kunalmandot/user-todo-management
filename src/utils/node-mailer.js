const nodeMailer = require('nodemailer');

const { mailUserName, mailPassword } = require('../../config');

const transporter = nodeMailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: mailUserName,
    pass: mailPassword,
  },
  secure: true,
});

const sendGreetingEmail = (email) => {
  const mailData = {
    from: mailUserName,
    to: email,
    subject: 'Greeting from user todo management',
    text: 'Welcome to the user todo management',
  };
  return transporter.sendMail(mailData);
};

module.exports = {
  sendGreetingEmail,
};
