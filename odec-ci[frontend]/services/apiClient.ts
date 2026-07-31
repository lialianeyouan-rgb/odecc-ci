import { authService } from "./authService";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  isFormData?: boolean; // ✅ support FormData
};

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const handleAuthError = () => {
  authService.logout();
  if (window.location.pathname.startsWith("/admin")) {
    window.location.href = "/admin/login";
  }
};

export const apiRequest = async <T>(
  path: string,
  { method = "GET", body, token, isFormData = false }: RequestOptions = {},
): Promise<T> => {
  try {
    const headers: HeadersInit = {};

    // ✅ On met Content-Type uniquement si ce n'est PAS du FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(buildUrl(path), {
      method,
      headers,
      body:
        body !== undefined
          ? isFormData
            ? (body as FormData)
            : JSON.stringify(body)
          : undefined,
    });

    // ✅ Gestion session expirée
    if (response.status === 401 || response.status === 403) {
      handleAuthError();
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const text = await response.text();
    let payload: unknown = null;

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { message: text };
      }
    }

    if (!response.ok) {
      const payloadRecord = payload as Record<string, string> | null;
      const message =
        payloadRecord?.error ||
        payloadRecord?.message ||
        `Erreur API (${response.status})`;
      throw new Error(message);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Erreur de connexion. Vérifiez votre connexion internet.",
      );
    }
    throw error;
  }
};