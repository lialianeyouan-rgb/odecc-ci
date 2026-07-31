const nodemailer = require("nodemailer");
const { createHttpError } = require("../../utils/httpError.js");
const { db } = require("../../config/db.js");

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Création du transport SMTP (Namecheap Private Email)
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw createHttpError(
      500,
      "Configuration SMTP incomplète (SMTP_USER et SMTP_PASS requis)",
      "SMTP_CONFIG_INCOMPLETE"
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

const VALID_SUBJECTS = new Set([
  "demande_acces",
  "faire_don",
  "partenariat",
  "autre",
]);

const sendContactEmail = async (data) => {
  const {
    lastName,
    firstName,
    address,
    phone,
    email,
    subject,
    message,
  } = data;

  // =============================
  // VALIDATION
  // =============================
  if (
    !lastName?.trim() ||
    !firstName?.trim() ||
    !address?.trim() ||
    !phone?.trim() ||
    !email?.trim() ||
    !subject ||
    !message?.trim()
  ) {
    throw createHttpError(
      400,
      "Tous les champs sont requis",
      "CONTACT_REQUIRED_FIELDS_MISSING"
    );
  }

  if (!isValidEmail(email)) {
    throw createHttpError(
      400,
      "Format d'email invalide",
      "CONTACT_INVALID_EMAIL"
    );
  }

  if (!VALID_SUBJECTS.has(subject)) {
    throw createHttpError(
      400,
      "Sujet invalide",
      "CONTACT_INVALID_SUBJECT"
    );
  }

  // =============================
  // SAUVEGARDE BDD
  // =============================
  const contactRecord = await db.contactMessage.create({
    data: {
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      subject,
      message: message.trim(),
    },
  });

  // =============================
  // ENVOI EMAIL
  // =============================
  const transporter = createTransporter();

  const subjectLabels = {
    demande_acces: "Demande d'accès",
    faire_don: "Faire un don",
    partenariat: "Partenariat",
    autre: "Autre",
  };

  const subjectLabel = subjectLabels[subject] || subject;

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

  const mailOptions = {
    from: `"ODEC-CI Website" <${fromEmail}>`, // IMPORTANT
    to: CONTACT_TO_EMAIL,
    replyTo: email, // email réel du client
    subject: `[Contact ODEC-CI] ${subjectLabel} – ${firstName} ${lastName}`,
    text: `
Nom: ${lastName}
Prénom: ${firstName}
Adresse: ${address}
Téléphone: ${phone}
Email: ${email}
Sujet: ${subjectLabel}

Message:
${message}
`,
    html: `
<h2>Nouveau message depuis le site ODEC-CI</h2>
<p><strong>Nom:</strong> ${lastName}</p>
<p><strong>Prénom:</strong> ${firstName}</p>
<p><strong>Adresse:</strong> ${address}</p>
<p><strong>Téléphone:</strong> ${phone}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Sujet:</strong> ${subjectLabel}</p>
<hr/>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br/>")}</p>
`,
  };

  try {
    await transporter.verify(); // vérifie la connexion SMTP
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("SMTP send error:", error);
    throw createHttpError(
      502,
      "Échec d'envoi du message. Veuillez réessayer plus tard.",
      "SMTP_SEND_FAILED",
      { reason: error?.message }
    );
  }

  return {
    id: contactRecord.id,
    success: true,
  };
};

module.exports = { isValidEmail, sendContactEmail };