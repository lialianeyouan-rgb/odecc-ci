const { ZodError } = require("zod");
const { createHttpError } = require("./httpError.js");

const validateSchema = (schema, input) => {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw createHttpError(400, "Donnees invalides", "VALIDATION_ERROR", {
        fields: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    throw error;
  }
};


module.exports = { validateSchema };
