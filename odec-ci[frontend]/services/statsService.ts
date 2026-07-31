import { apiRequest } from "./apiClient";
import { authService } from "./authService";

export type DashboardStats = {
  totalForms: number;
  totalDons: number;
  totalInscrits: number;
};

export const statsService = {
  async getStats(): Promise<DashboardStats> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Session admin invalide. Reconnectez-vous.");
    }
    return apiRequest<DashboardStats>("/stats", { token });
  },
};
