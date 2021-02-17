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

const sendGreetingEmail = (toEmail) => {
  const mailData = {
    from: mailUserName,
    to: toEmail,
    subject: 'Greeting from user todo management',
    text: 'Welcome to the user todo management.',
  };
  return transporter.sendMail(mailData);
};

const sendSharingEmail = (toEmail, selfEmail, todoTitle) => {
  const mailData = {
    from: mailUserName,
    to: toEmail,
    subject: 'Sharing notification',
    html: `<p>${selfEmail} has shared a todo "${todoTitle}" with you.</p>`
          + '<p><a href="http://localhost:5000/api/todos/">Click here</a> to see.</p>',
  };
  return transporter.sendMail(mailData);
};

const sendUnsharingEmail = (toEmail, selfEmail, todoTitle) => {
  const mailData = {
    from: mailUserName,
    to: toEmail,
    subject: 'Unsharing notification',
    text: `${selfEmail} has Unshared ${todoTitle} from you.`,
  };
  return transporter.sendMail(mailData);
};

module.exports = {
  sendGreetingEmail,
  sendSharingEmail,
  sendUnsharingEmail,
};
