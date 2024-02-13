import nodemailer from "nodemailer";

const emailFrom = process.env.emailFrom;
const emailTo = process.env.emailTo;
const emailUser = process.env.emailUser;
const emailPass = process.env.emailPass;

const emailSMTP = process.env.emailSMTPserver;

//Send Email, accepts HTML body of the message.
function sendEmail(subject, body) {
    const transporter = nodemailer.createTransport({
        host: emailSMTP,
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    async function send() {
        const info = await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: subject,
            text: "This report is formated in HTML, please enable it.",
            html: body
        });

        console.log("email sent: %s", info.messageId);
    }
    send().catch(console.error);

}

export { sendEmail };
