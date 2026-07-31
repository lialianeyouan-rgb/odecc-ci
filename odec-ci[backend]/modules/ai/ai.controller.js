const { generateContent } = require("./ai.service.js");
const { z } = require("zod");
const { validateSchema } = require("../../utils/validate.js");

const aiSchema = z.object({
  prompt: z.string().trim().min(3, "prompt trop court"),
  task: z.string().trim().max(200, "task trop long").optional().default(""),
});

const generate = async (req, res, next) => {
  try {
    const { prompt, task } = validateSchema(aiSchema, req.body || {});

    const text = await generateContent({ prompt, task });
    res.json({ text });
  } catch (error) {
    next(error);
  }
};


module.exports = { generate };
