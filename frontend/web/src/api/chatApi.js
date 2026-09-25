import apiClient, { tokenStorage, normalizeError } from "./client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const chatApi = {
  async listMessages(projectId, conversationId) {
    const { data } = await apiClient.get(
      `/projects/${projectId}/conversations/${conversationId}/messages`
    );
    return data;
  },

  // Non-streaming fallback: sends a question and waits for the full answer.
  async sendMessage(projectId, conversationId, { question, sourceIds } = {}) {
    const { data } = await apiClient.post(
      `/projects/${projectId}/conversations/${conversationId}/messages`,
      { question, sourceIds }
    );
    return data;
  },

  // Streaming send using fetch + a newline-delimited event stream. The backend is
  // expected to stream chunks like: {"type":"token","text":"..."} and finish with
  // {"type":"done","message":{...,"citations":[...]}}.
  async sendMessageStream(
    projectId,
    conversationId,
    { question, sourceIds },
    { onToken, onCitations, onDone, onError, signal }
  ) {
    try {
      const response = await fetch(
        `${BASE_URL}/projects/${projectId}/conversations/${conversationId}/messages/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenStorage.getAccessToken() || ""}`,
          },
          body: JSON.stringify({ question, sourceIds }),
          signal,
        }
      );

      if (!response.ok || !response.body) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed (${response.status}).`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
          if (!payload || payload === "[DONE]") continue;

          try {
            const event = JSON.parse(payload);
            if (event.type === "token") onToken?.(event.text);
            else if (event.type === "citations") onCitations?.(event.citations);
            else if (event.type === "done") onDone?.(event.message);
            else if (event.type === "error") onError?.(event.message);
          } catch {
            // Ignore malformed keep-alive lines.
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      onError?.(normalizeError({ response: null, message: error.message })?.message || error.message);
    }
  },

  async regenerate(projectId, conversationId, messageId) {
    const { data } = await apiClient.post(
      `/projects/${projectId}/conversations/${conversationId}/messages/${messageId}/regenerate`
    );
    return data;
  },

  async submitFeedback(projectId, conversationId, messageId, { rating, comment } = {}) {
    const { data } = await apiClient.post(
      `/projects/${projectId}/conversations/${conversationId}/messages/${messageId}/feedback`,
      { rating, comment }
    );
    return data;
  },
};

export default chatApi;
