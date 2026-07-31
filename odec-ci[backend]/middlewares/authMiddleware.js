const jwt = require("jsonwebtoken");
const { createHttpError } = require("../utils/httpError.js");

const protect = (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      createHttpError(
        401,
        "Token manquant. Utilisez le format Authorization: Bearer <token>",
        "TOKEN_MISSING",
      ),
    );
  }

  if (!process.env.JWT_SECRET) {
    return next(
      createHttpError(
        500,
        "JWT_SECRET manquant dans la configuration serveur",
        "JWT_SECRET_MISSING",
      ),
    );
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    if (!req.user?.admin) {
      return next(
        createHttpError(403, "Acces admin requis", "ADMIN_ACCESS_REQUIRED"),
      );
    }
    return next();
  } catch (error) {
    return next(
      createHttpError(401, "Token invalide ou expire", "TOKEN_INVALID", {
        reason: error?.name || "UnknownTokenError",
      }),
    );
  }
};


module.exports = { protect };
