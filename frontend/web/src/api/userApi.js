import apiClient from "./client";

const userApi = {
  async getProfile() {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  async updateProfile(updates) {
    const { data } = await apiClient.put("/users/me", updates);
    return data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await apiClient.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    const { data } = await apiClient.post("/users/me/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return data;
  },

  async listSessions() {
    const { data } = await apiClient.get("/users/me/sessions");
    return data;
  },

  async revokeSession(sessionId) {
    await apiClient.delete(`/users/me/sessions/${sessionId}`);
  },

  async updatePreferences(preferences) {
    const { data } = await apiClient.put("/users/me/preferences", preferences);
    return data;
  },

  async exportData() {
    const { data } = await apiClient.post("/users/me/export");
    return data;
  },

  async deleteAccount({ password }) {
    await apiClient.post("/users/me/delete", { password });
  },
};

export default userApi;
