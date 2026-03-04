import SibApiV3Sdk from "@getbrevo/brevo";

const client = new SibApiV3Sdk.TransactionalEmailsApi();

client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, message }, cb) => {
  try {
    const missing = [];

    if (!to) missing.push("to");
    if (!subject) missing.push("subject");
    if (!message) missing.push("message");

    if (missing.length) {
      console.error("Email missing fields:", missing.join(", "));
      throw new Error("Missing email fields");
    }

    const payload = {
      sender: {
        email: process.env.EMAIL_SENDER,
        name: "Pulse",
      },
      to: [{ email: to }],
      subject,
      textContent: message,
    };

    await client.sendTransacEmail(payload);

  } catch (e) {
    console.error("Brevo error:", e.response?.body || e.message);
    if (cb) cb(e);
  }
};

export default sendEmail;
