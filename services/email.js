import SibApiV3Sdk from "@getbrevo/brevo";

const client = new SibApiV3Sdk.TransactionalEmailsApi();

client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sender = {
  email: process.env.EMAIL_SENDER, // must be verified in Brevo
  name: "Pulse",
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const payload = {
      sender,
      to, // must be array [{ email: "...", name?: "..." }]
      subject,
      htmlContent: html,
    };

    const response = await client.sendTransacEmail(payload);
    return response;
  } catch (error) {
    console.error(
      "Brevo error:",
      error.response?.body || error.message
    );
    throw new Error("Email sending failed");
  }
};


