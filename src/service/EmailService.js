import nodemailer from 'nodemailer';
import * as config from './config.js';

const SendToken = async (destination, value) => {
  let transporter = nodemailer.createTransport({
    host: config.MAILING_HOST,
    port: config.MAILING_PORT,
    secure: false,
    auth: {
      user: config.MAILING_USERNAME,
      pass: config.MAILING_PASSWORD
    }
  });

  if (config.MAILING_TEST_MODE) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });

    console.log('using test mode');
    console.log('user: %s', testAccount.user);
    console.log('pass : %s', testAccount.pass);
  }

  let info = await transporter.sendMail({
    from: `${config.MAILING_SENDER_NAME} <${config.MAILING_USERNAME}>`, // sender address
    to: destination, // list of receivers
    subject: "Activate your account !", // Subject line
    text: "Your activation code is : " + value, // plain text body
    html: "<center><h1>Activate your account</h1><p>" + value + "</p></center>" // html body
  });

  if(config.MAILING_TEST_MODE){
    console.log("Email envoyé. URL = %s", nodemailer.getTestMessageUrl(info));
  }
}

export { SendToken };