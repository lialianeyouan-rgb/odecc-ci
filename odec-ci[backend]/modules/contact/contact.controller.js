const { sendContactEmail } = require("./contact.service.js");
const { z } = require("zod");
const { validateSchema } = require("../../utils/validate.js");

const contactSchema = z.object({
  lastName: z.string().trim().min(1, "Nom requis"),
  firstName: z.string().trim().min(1, "Prénom requis"),
  address: z.string().trim().min(1, "Adresse requise"),
  phone: z.string().trim().min(1, "Numéro de téléphone requis"),
  email: z.string().trim().email("Email invalide"),
  subject: z.enum(["demande_acces", "faire_don", "partenariat", "autre"], {
    errorMap: () => ({ message: "Sujet invalide" }),
  }),
  message: z.string().trim().min(10, "Message trop court"),
});

const sendMail = async (req, res, next) => {
  try {
    const payload = validateSchema(contactSchema, req.body || {});
    const result = await sendContactEmail(payload);
    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès",
      id: result.id,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { sendMail };
