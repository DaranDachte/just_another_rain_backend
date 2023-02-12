import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendEmail(to) {
    this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "You have successfully sent the Question!",
      text: "Congratulations, your question was sent.It takes two working days to respond. Please wait for.",
    });
  }
}

export default new EmailService();
