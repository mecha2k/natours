const pug = require("pug")
const nodemailer = require("nodemailer")
const htmlToText = require("html-to-text")

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(" ")[0]
    this.url = url
    this.from = `cstory.com <${process.env["EMAIL_FROM"]}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env["SENDGRID_USERNAME"],
          pass: process.env["SENDGRID_PASSWORD"]
        }
      })
    }

    return nodemailer.createTransport({
      host: process.env["EMAIL_HOST"],
      port: process.env["EMAIL_PORT"],
      auth: {
        user: process.env["EMAIL_USERNAME"],
        pass: process.env["EMAIL_PASSWORD"]
      }
    })
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    }

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!")
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token (valid for only 10 minutes)")
  }
}

// const sendEmail = async function (contents) {
//   const transporter = nodemailer.createTransport({
//     host: process.env["EMAIL_HOST"],
//     port: process.env["EMAIL_PORT"],
//     auth: {
//       user: process.env["EMAIL_USERNAME"],
//       pass: process.env["EMAIL_PASSWORD"]
//     }
//   })
//
//   const mailcontents = {
//     from: "cstory.com <mecha2k@gmail.com>",
//     to: contents.email,
//     subject: contents.subject,
//     text: contents.message,
//     html: "<b>Hello world?</b>"
//   }
//
//   const info = await transporter.sendMail(mailcontents)
//
//   console.log("Message sent: %s", info.messageId)
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
// }
//
// module.exports = sendEmail
