import apiClient from "./client";

const conversationApi = {
  async list(projectId, { search = "" } = {}) {
    const { data } = await apiClient.get(`/projects/${projectId}/conversations`, {
      params: { search },
    });
    return data;
  },

  async get(projectId, conversationId) {
    const { data } = await apiClient.get(
      `/projects/${projectId}/conversations/${conversationId}`
    );
    return data;
  },

  async create(projectId, { title } = {}) {
    const { data } = await apiClient.post(`/projects/${projectId}/conversations`, { title });
    return data;
  },

  async rename(projectId, conversationId, { title }) {
    const { data } = await apiClient.patch(
      `/projects/${projectId}/conversations/${conversationId}`,
      { title }
    );
    return data;
  },

  async archive(projectId, conversationId) {
    const { data } = await apiClient.post(
      `/projects/${projectId}/conversations/${conversationId}/archive`
    );
    return data;
  },

  async remove(projectId, conversationId) {
    await apiClient.delete(`/projects/${projectId}/conversations/${conversationId}`);
  },
};

export default conversationApi;
