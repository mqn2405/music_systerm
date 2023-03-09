const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const CLIENT_ID =
  "302296299882-16i2pv69fp2qksdm8dop13vr5avgrbde.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04YyoYwL82kOICgYIARAAGAQSNwF-L9IrcFE65izwLlRxaIvv2rxvbdM3JPBE8IX5GTc0uIH4CZfgaMDRi2hVO39EvWdR9ann0nI";

const oauth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const getTransporter = async () => {
  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      console.log('err >>>> ', err);
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  return (transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "mqn2405@gmail.com",
      accessToken,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  }));
};

module.exports = {
  SEND_MAIL: async (to, otp) => {
    try {
      const transporter = await getTransporter();
      const mailOptions = {
        from: '"ONE SOUND" <mqn2405@gmail.com>',
        to: to,
        subject: "Gửi mã OTP",
        html: ` 
        <div>
            <p>ONE SOUND gửi bạn mã OTP quên mật khẩu</p>
            <p>Mã OTP của bạn là <span style="color:blue;">${otp}</span></p>
            <p style="color: red;">Lưu ý không cung cấp OTP này cho bất kì ai</p>
        </div>`,
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
            console.log("Email sent: " + info.response);
          }
        });
      });
    } catch (error) {
      return false;
    }
  },
};
