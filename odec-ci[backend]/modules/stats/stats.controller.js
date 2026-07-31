const { db } = require("../../config/db.js");
const { createHttpError } = require("../../utils/httpError.js");

const getStats = async (_req, res, next) => {
  try {
    const [totalForms, totalDonsResult, totalInscrits] = await Promise.all([
      db.contactMessage.count(),
      db.don.aggregate({ _sum: { amount: true } }),
      db.inscription.count(),
    ]);

    const totalDons = Number(totalDonsResult._sum?.amount ?? 0);

    res.json({
      totalForms,
      totalDons,
      totalInscrits,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { getStats };
