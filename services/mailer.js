import 'dotenv/config';
import nodemailer from 'nodemailer';

const config = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (to, subject, content) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: content,
    };

    try {
        console.log('Sending email to:', to);
        transporter.sendMail(mailOptions).then((info) => {
            console.log('Email sent:', info.response);
        }
        ).catch((error) => {
            console.error('Error sending email: ', error);
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

export default sendEmail;