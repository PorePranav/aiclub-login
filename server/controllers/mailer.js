import nodemailer from "nodemailer";
import mailgen from "mailgen";
import ENV from "../config.js";

const smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
    },
};

const transporter = nodemailer.createTransport(smtpConfig);

let mailGenerator = new mailgen({
    theme: "cerberus",
    product: {
        name: "AI Club, VITB",
        link: "aivitb.com",
    },
});

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    let email = {
        body: {
            name: username,
            intro:
                text ||
                "Welcome to AI Club! We're excited to have you on board!",
        },
    };

    let emailBody = mailGenerator.generate(email);
    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup successful!",
        html: emailBody,
    };

    transporter
        .sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "Email sent" });
        })
        .catch((error) => res.status(500).send({ error }));
};
