import SibApiV3Sdk from "@getbrevo/brevo";

const client = new SibApiV3Sdk.TransactionalEmailsApi();

client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (
  { to, subject, message },
  cb
) => {
  try {
    const payload = {
      sender: {
        email: process.env.EMAIL_SENDER, // must be verified
        name: "Pulse",
      },
      to: [
        {
          email: to, // keep same format as old file (string)
        },
      ],
      subject,
      textContent: message, // same as old: plain text
    };

    await client.sendTransacEmail(payload);

  } catch (e) {
    console.log("Brevo error:", e.response?.body || e.message);
    if (cb) cb();
  }
};

export default sendEmail;
