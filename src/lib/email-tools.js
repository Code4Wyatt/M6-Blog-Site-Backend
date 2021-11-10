import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRIDMAIL_KEY); // Set the API Key

async function sendAuthorEmail(recipientEmail) {
    const message = {
        to: recipientEmail,
        from: process.env.SENDER_EMAIL,
        subject: `Thanks for blogging with us!`,
        text: "This is fallback text to show if the email application doesn't render HTML",
        html: `<h2>Hello!</h2><hr><p>Thank you for submitting a blog post on our site!</p>`,
    };

    

    await sgMail.send(message); // Send an email
};

export default sendAuthorEmail;

