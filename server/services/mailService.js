const nodemailer = require("nodemailer");
class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport( {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }


    async sendActivationMail(email, link) {
        console.log(email, link)
        //
        // await this.transporter.sendMail({
        //     from: process.env.SMTP_USER,
        //     to: email,
        //     subject: `Потдверждение почты на аккаунте ${email}`,
        //     test: '',
        //     html:
        //         `
        //             <div>
        //                 <h1>Для активации перейдите по ссылке</h1>
        //                 <a href="${link}">${link}</a>
        //             </div>
        //         `
        // });
    }
}

module.exports = new MailService();