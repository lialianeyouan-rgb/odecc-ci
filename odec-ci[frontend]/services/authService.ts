import { apiRequest } from "./apiClient";

const TOKEN_STORAGE_KEY = "odec_admin_token";

type LoginResponse = {
  token: string;
};

export const authService = {
  async login(username: string, password: string): Promise<void> {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: { username, password },
    });

    sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
  },

  logout(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(sessionStorage.getItem(TOKEN_STORAGE_KEY));
  },
};
