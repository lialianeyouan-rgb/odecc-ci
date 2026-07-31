const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createHttpError } = require("../../utils/httpError.js");

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw createHttpError(
      500,
      "GEMINI_API_KEY manquant dans l'environnement",
      "AI_CONFIG_MISSING_KEY",
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });
};

const generateContent = async ({ prompt, task }) => {
  const model = getModel();
  const fullPrompt = [
    "Vous êtes un assistant de communication pour ODEC-CI.",
    task ? `Tache: ${task}` : "",
    `Contenu utilisateur: ${prompt}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  let r;
  try {
    r = await model.generateContent(fullPrompt);
  } catch (error) {
    throw createHttpError(
      502,
      "Echec de communication avec le fournisseur IA",
      "AI_PROVIDER_ERROR",
      { reason: error?.message || "UnknownProviderError" },
    );
  }

  const text = r.response.text();
  if (!text) {
    throw createHttpError(502, "Reponse IA vide", "AI_EMPTY_RESPONSE");
  }
  return text;
};


module.exports = { getModel, generateContent };
