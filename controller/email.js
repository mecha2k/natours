const nodemailer = require("nodemailer")

const sendEmail = async function (contents) {
  const transporter = nodemailer.createTransport({
    host: process.env["EMAIL_HOST"],
    port: process.env["EMAIL_PORT"],
    auth: {
      user: process.env["EMAIL_USERNAME"],
      pass: process.env["EMAIL_PASSWORD"],
    },
  })

  const mailcontents = {
    from: "cstory.com <mecha2k@gmail.com>",
    to: contents.email,
    subject: contents.subject,
    text: contents.message,
    html: "<b>Hello world?</b>",
  }

  await transporter.sendMail(mailcontents)

  console.log("Message sent: %s", mailcontents.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}

module.exports = sendEmail
