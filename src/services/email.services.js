import nodemailer from 'nodemailer'
import config from '../config/config.js'
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.gmail.email,
                pass: config.gmail.password
            }
        })
    }

    sendEmail(to, subject, html, attachments = []) {

        return this.transporter.sendMail({
            from: config.gmail.email,
            to,
            subject,
            html,
            attachments,
        })
    }
}

export default new EmailService();