import apiClient from "./client";

const sourceApi = {
  async list(projectId, { search = "" } = {}) {
    const { data } = await apiClient.get(`/projects/${projectId}/sources`, {
      params: { search },
    });
    return data;
  },

  async get(projectId, sourceId) {
    const { data } = await apiClient.get(`/projects/${projectId}/sources/${sourceId}`);
    return data;
  },

  // Uploads a single file with progress reporting. Returns the created source record.
  async uploadFile(projectId, file, { onProgress } = {}) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post(`/projects/${projectId}/sources/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
    });
    return data;
  },

  async addUrl(projectId, { url }) {
    const { data } = await apiClient.post(`/projects/${projectId}/sources/url`, { url });
    return data;
  },

  // Polls processing status for a source (upload -> validate -> extract -> chunk -> embed -> index -> ready).
  async getStatus(projectId, sourceId) {
    const { data } = await apiClient.get(`/projects/${projectId}/sources/${sourceId}/status`);
    return data;
  },

  async rename(projectId, sourceId, { name }) {
    const { data } = await apiClient.patch(`/projects/${projectId}/sources/${sourceId}`, {
      name,
    });
    return data;
  },

  async reprocess(projectId, sourceId) {
    const { data } = await apiClient.post(`/projects/${projectId}/sources/${sourceId}/reprocess`);
    return data;
  },

  async remove(projectId, sourceId) {
    await apiClient.delete(`/projects/${projectId}/sources/${sourceId}`);
  },

  getDownloadUrl(projectId, sourceId) {
    return `${apiClient.defaults.baseURL}/projects/${projectId}/sources/${sourceId}/download`;
  },
};

export default sourceApi;
