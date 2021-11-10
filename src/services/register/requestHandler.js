import sgMail from "@sendgrid/mail";

// Set API Key

sgMail.setApiKey(process.env.SENDGRIDMAIL_KEY);

async function sendRegistrationEmail(recipientEmail, firstName, lastName) {
    const message = {
        to: recipientEmail,
        from: process.env.SENDER_EMAIL,
        subject: `Welcome to the club ${firstName}!`,
        text: "This is fallback text to show if the email application doesn't render html",
        html: `<h2>Hello ${firstName} ${lastName}</h2><hr><p>Thank you for registering!</p>`
    }
    await sgMail.send(message);
}

export default sendRegistrationEmail;
