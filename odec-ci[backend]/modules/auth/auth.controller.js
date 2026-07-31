const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { createHttpError } = require("../../utils/httpError.js");
const { validateSchema } = require("../../utils/validate.js");
const { db } = require("../../config/db.js");

const loginSchema = z.object({
  username: z.string().trim().min(1, "username requis"),
  password: z.string().min(1, "password requis"),
});

const login = async (req, res, next) => {
  try {
    const { username, password } = validateSchema(loginSchema, req.body || {});

    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      throw createHttpError(
        401,
        "Identifiants invalides",
        "AUTH_INVALID_CREDENTIALS",
      );
    }

    if (!process.env.JWT_SECRET) {
      throw createHttpError(
        500,
        "JWT_SECRET manquant dans les variables d'environnement",
        "JWT_SECRET_MISSING",
      );
    }

    const token = jwt.sign(
      { id: admin.id, admin: true },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};


module.exports = { login };
