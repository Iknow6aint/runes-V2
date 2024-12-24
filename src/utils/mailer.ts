import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'mail.glitztutors.ng', // Example host, replace with actual one
    port: 465,
    secure: true,
    auth: {
        user: 'register@glitztutors.ng',
        pass: 'Lotanna101',
    },
    tls: {
        rejectUnauthorized: false
    }
});


export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
