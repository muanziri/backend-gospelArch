const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = '149457032654-m9fs76pje2ii0rvll16450tov6rf7kt1.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04CQbV-hOu2LBCgYIARAAGAQSNwF-L9IrHVFIfJSOJypElaRoMQKrJRRxvNpoJ1ZeQzeGrmStpbfRRCWOX20HtWt4VO1xkSH9rsE';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(To,subject,Html) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'gospelarchived0@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'GOSPELARCHIVE__NO__REPLIES<gospelarchived0@gmail.com>',
      to: To,
      subject: subject,
      html: Html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

 module.exports= {sendMail}