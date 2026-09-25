import apiClient from "./client";

const projectApi = {
  async list({ search = "", page = 1, pageSize = 20 } = {}) {
    const { data } = await apiClient.get("/projects", { params: { search, page, pageSize } });
    return data;
  },

  async get(projectId) {
    const { data } = await apiClient.get(`/projects/${projectId}`);
    return data;
  },

  async create({ name, goal, aiInstructions }) {
    const { data } = await apiClient.post("/projects", {
      name,
      goal,
      aiInstructions,
    });
    return data;
  },

  async update(projectId, updates) {
    const { data } = await apiClient.put(`/projects/${projectId}`, updates);
    return data;
  },

  async remove(projectId) {
    await apiClient.delete(`/projects/${projectId}`);
  },

  async getKnowledgeStats(projectId) {
    const { data } = await apiClient.get(`/projects/${projectId}/knowledge`);
    return data;
  },
};

export default projectApi;
