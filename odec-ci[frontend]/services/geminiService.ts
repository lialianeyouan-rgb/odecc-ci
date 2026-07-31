import { apiRequest } from "./apiClient";

export const generateText = async (
  userInput: string,
  task: string,
): Promise<string> => {
  const response = await apiRequest<{ text: string }>("/ai", {
    method: "POST",
    body: {
      prompt: userInput,
      task,
    },
  });

  if (!response?.text) {
    throw new Error("Reponse IA vide");
  }

  return response.text;
};
