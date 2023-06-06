import nodemailer from 'nodemailer';
import mailgen from 'mailgen';

import ENV from '../config.js';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'bertrand.leannon@ethereal.email',
        pass: 'kmgd6EqJvD7Ycrhdan'
    }
});

let mailGenerator = new mailgen({
    theme: 'default',
    product: {
        name: 'Mailgen',
        link: 'https://mailgen.js'
    }
})

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    let email = {
        body: {
            name: username,
            intro: text || 'Welcome to AI Club! We\'re excited to have you on board!'
        }
    }

    let emailBody = mailGenerator.generate(email);
    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || 'Signup successful!',
        html: emailBody
    }

    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: 'You should have received an email from us.'})
        })
        .catch(error => res.status(500).send({ error }))
}