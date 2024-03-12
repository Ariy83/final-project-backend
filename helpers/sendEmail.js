import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = (data) => {
  const email = { ...data, from: SENDGRID_FROM };
  return sgMail.send(email);
};

export default sendEmail;
