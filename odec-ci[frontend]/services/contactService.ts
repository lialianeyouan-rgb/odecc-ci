import { apiRequest } from "./apiClient";

export type ContactPayload = {
  lastName: string;
  firstName: string;
  address: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

export const contactService = {
  sendMessage: (payload: ContactPayload) =>
    apiRequest<{ success: boolean }>("/contact", {
      method: "POST",
      body: payload,
    }),
};

