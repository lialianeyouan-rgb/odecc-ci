const errorHandler = (err, req, res, _next) => {
  const statusCode = Number(err?.status || err?.statusCode || 500);

  let code = err?.code || "INTERNAL_ERROR";
  let message = err?.message || "Erreur interne du serveur";
  let details = err?.details;

  // Prisma: enregistrement introuvable (update/delete sur id inexistant)
  if (err?.code === "P2025") {
    code = "RESOURCE_NOT_FOUND";
    message = "La ressource demandee est introuvable";
  }

  // Prisma: violation contrainte unique
  if (err?.code === "P2002") {
    code = "UNIQUE_CONSTRAINT_VIOLATION";
    message = "Cette valeur existe deja et doit etre unique";
    details = err?.meta;
  }

  // JsonWebTokenError et TokenExpiredError
  if (err?.name === "JsonWebTokenError") {
    code = "INVALID_TOKEN";
    message = "Token invalide";
  }
  if (err?.name === "TokenExpiredError") {
    code = "TOKEN_EXPIRED";
    message = "Token expire, reconnectez-vous";
  }

  res.status(statusCode).json({
    error: message,
    code,
    details,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};


module.exports = { errorHandler };
