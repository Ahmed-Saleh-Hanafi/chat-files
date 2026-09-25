import apiClient, { tokenStorage } from "./client";

const authApi = {
  async register({ username, email, password, confirmPassword }) {
    const { data } = await apiClient.post("/auth/register", {
      username,
      email,
      password,
      confirmPassword,
    });
    return data;
  },

  async login({ email, password, rememberMe }) {
    const { data } = await apiClient.post("/auth/login", { email, password, rememberMe });
    if (data.accessToken) {
      tokenStorage.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    }
    return data;
  },

  async loginWithGoogle({ credential }) {
    const { data } = await apiClient.post("/auth/google", { credential });
    if (data.accessToken) {
      tokenStorage.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    }
    return data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout", { refreshToken: tokenStorage.getRefreshToken() });
    } finally {
      tokenStorage.clear();
    }
  },

  async verifyEmail({ token }) {
    const { data } = await apiClient.post("/auth/verify-email", { token });
    return data;
  },

  async resendVerification({ email }) {
    const { data } = await apiClient.post("/auth/resend-verification", { email });
    return data;
  },

  async forgotPassword({ email }) {
    const { data } = await apiClient.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword({ token, password, confirmPassword }) {
    const { data } = await apiClient.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    return data;
  },

  async getCurrentUser() {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
};

export default authApi;
