import nodemailer from 'nodemailer'

const sendEmail = async (
    { to,
        subject,
        message },
    cb
) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        })

        const mailOptions = {
            from: 'WellnessX@email.com',
            to,
            subject,
            text: message,
        }

        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.log(e)
        cb()
    }
}

export default sendEmail
