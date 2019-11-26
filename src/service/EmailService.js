import nodemailer from 'nodemailer';
import * as config from './config.js';

const SendToken = async (destination, value) => {
    const transporter = nodemailer.createTransport({
        host: config.MAILING_HOST,
        port: config.MAILING_PORT,
        secure: false,
        auth: {
          user: config.MAILING_USERNAME,
          pass: config.MAILING_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `${MAILING_SENDER_NAME} <${config.MAILING_USERNAME}>`, // sender address
        to: destination, // list of receivers
        subject: "Account Activation Code", // Subject line
        text: "Your validation token is " + value, // plain text body
        html: "<b>Your validation token </b>" + value // html body
      });
}

export { SendToken };