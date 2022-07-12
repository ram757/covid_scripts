const nodemailer = require('nodemailer');

//FOR VERIZON USERS: You can send as text to your phone by using email address: 1234567890@vzwpix.com
const ENV_RECIPIENTS = 'example1@example.com, example2@example.com'; //CHANGEME - put email addresses to send to here

//This relies on a gmail account currently
const ENV_SENDER_EMAIL = 'example@example.com'; //CHANGEME - put gmail email here
const ENV_SENDER_PASS = 'asdffpassword'; //CHANGEME - put gmail pass here
//DISCLAIMER: you must tone down your gmail security to allow unauthorized app logins... Probably best to create a new gmail account for that

const MAX_RETRIES = 5;
let transporter = null;

const sendMessage = async (subject, body) => {
  if (!transporter) {
    throw new Error('Transporter is dead!!!');
  }

  // send mail with defined transport object
  const send = async () => {
    const info = await transporter.sendMail({
      from: '"CVS Bot" <foo@example.com>', // sender address
      to: ENV_RECIPIENTS, // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
    });
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  };

  let tries = 0;
  while (0 <= tries && tries < MAX_RETRIES) {
    try {
      await send();
      tries = -1;
    } catch (e) {
      console.error(e);
      tries++;
    }
  }
  if (tries === MAX_RETRIES) {
    throw new Error('Failed email message too many times!');
  }
};

const transportProxy = {
  sendMessage: sendMessage,
};
module.exports.transporter = {
  getTransporter: async () => {
    if (transporter) {
      return transportProxy;
    }

    //TODO: Currently relies on gmail account; use a dummy gmail, relax the sign-in security settings, and you're good to go :)
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ENV_SENDER_EMAIL,
        pass: ENV_SENDER_PASS,
      },
    });

    return transportProxy;
  },
};

// transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: testAccount.user, // generated ethereal user
//     pass: testAccount.pass, // generated ethereal password
//   },
// });
