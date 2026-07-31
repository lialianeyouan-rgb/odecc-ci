const { db } = require("../../config/db.js");
const { createHttpError } = require("../../utils/httpError.js");

/**
 * Enregistre une déclaration de don (pour suivi et statistiques dashboard).
 * Le donateur effectue le virement Mobile Money séparément.
 */
const createDon = async (data) => {
  const { amount, currency, donorName, phone, note } = data;

  if (amount == null || Number(amount) <= 0) {
    throw createHttpError(
      400,
      "Le montant doit être strictement positif.",
      "DON_INVALID_AMOUNT",
    );
  }

  const amountNum = Number(amount);
  if (!Number.isFinite(amountNum)) {
    throw createHttpError(400, "Montant invalide.", "DON_INVALID_AMOUNT");
  }

  const noteText =
    [phone ? `Tél: ${String(phone).trim()}` : null, note?.trim()]
      .filter(Boolean)
      .join("\n") || null;

  const don = await db.don.create({
    data: {
      amount: amountNum,
      currency: String(currency || "XOF").trim(),
      donorName: donorName?.trim() || null,
      email: null,
      note: noteText,
    },
  });

  return { id: don.id, success: true };
};


module.exports = { createDon };
