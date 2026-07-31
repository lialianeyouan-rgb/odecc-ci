import type { Handler } from "@netlify/functions";

export const handler: Handler = async () => ({
  statusCode: 410,
  body: JSON.stringify({
    error: "Endpoint deprecie",
    message: "Utilisez le backend /api/ai sur Render.",
  }),
});
