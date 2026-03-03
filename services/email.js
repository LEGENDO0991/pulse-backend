import nodemailer from 'nodemailer'

const sendEmail = async (
    { to,
        subject,
        message },
    cb
) => {
    try {
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     // host: 'smtp.gmail.com',
        //     // port: 587,
        //     // secure: true,
        //     auth: {
        //         user: process.env.GMAIL,
        //         pass: process.env.GMAIL_PASSWORD,
        //     },
        // })

        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false, // true only for port 465
          auth: {
            user: process.env.BREVO_LOGIN,   // example: abc123@smtp-brevo.com
            pass: process.env.BREVO_PASSWORD,
            },
        });

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



