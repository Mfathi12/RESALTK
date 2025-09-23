import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html }) => {
    //sender
    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: true,
        service: "Gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    //reciver
    const mailOptions = await transporter.sendMail({
        from: `Resaltk Application  `,
        to: to,
        subject: subject,
    });
    if (mailOptions.rejected.length > 0) return false;
    return true;
};
