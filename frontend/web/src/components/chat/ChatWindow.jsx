import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import Spinner from "../common/Spinner.jsx";
import chatApi from "../../api/chatApi";
import conversationApi from "../../api/conversationApi";
import useProject from "../../hooks/useProject";
import useToast from "../../hooks/useToast";
import { normalizeError } from "../../api/client";

const SUGGESTED_PROMPTS = [
  "Summarize the key points across my sources",
  "What are the main risks or open questions?",
  "Compare the two most recent documents",
];

export default function ChatWindow({ conversationId, onUploadClick }) {
  const { projectId, project, reloadConversations } = useProject();
  const navigate = useNavigate();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!conversationId) {
        setMessages([]);
        setLoadingHistory(false);
        return;
      }
      setLoadingHistory(true);
      try {
        const data = await chatApi.listMessages(projectId, conversationId);
        if (!cancelled) setMessages(data.items || data || []);
      } catch {
        if (!cancelled) toast.error("Couldn't load this conversation.");
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [conversationId, projectId, toast]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const handleSend = async (question) => {
    let activeConversationId = conversationId;

    // If no conversation exists yet, create one on first message, then move
    // the URL so refreshes / sharing keep working.
    if (!activeConversationId) {
      try {
        const conversation = await conversationApi.create(projectId, {
          title: question.slice(0, 60),
        });
        activeConversationId = conversation.id;
        await reloadConversations();
        navigate(`/app/projects/${projectId}/chat/${activeConversationId}`, { replace: true });
      } catch {
        toast.error("Couldn't start a new conversation.");
        return;
      }
    }

    const userMessage = { id: `local-${Date.now()}`, role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    const streamId = `streaming-${Date.now()}`;
    setStreamingMessage({ id: streamId, role: "assistant", content: "", citations: [] });

    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = "";
    let citations = [];

    await chatApi.sendMessageStream(
      projectId,
      activeConversationId,
      { question },
      {
        signal: controller.signal,
        onToken: (text) => {
          accumulated += text;
          setStreamingMessage((m) => (m ? { ...m, content: accumulated } : m));
        },
        onCitations: (c) => {
          citations = c;
          setStreamingMessage((m) => (m ? { ...m, citations: c } : m));
        },
        onDone: (finalMessage) => {
          setMessages((prev) => [
            ...prev,
            finalMessage || {
              id: streamId,
              role: "assistant",
              content: accumulated,
              citations,
            },
          ]);
          setStreamingMessage(null);
          setSending(false);
        },
        onError: async () => {
          // Fall back to a non-streaming request if the stream endpoint isn't available.
          try {
            const result = await chatApi.sendMessage(projectId, activeConversationId, {
              question,
            });
            setMessages((prev) => [...prev, result]);
          } catch (err) {
            toast.error(normalizeError(err).message || "Couldn't get a response. Please try again.");
          } finally {
            setStreamingMessage(null);
            setSending(false);
          }
        },
      }
    );
  };

  const handleRegenerate = async (message) => {
    setSending(true);
    try {
      const updated = await chatApi.regenerate(projectId, conversationId, message.id);
      setMessages((prev) => prev.map((m) => (m.id === message.id ? updated : m)));
    } catch {
      toast.error("Couldn't regenerate that response.");
    } finally {
      setSending(false);
    }
  };

  const handleFeedback = async (message, rating) => {
    try {
      await chatApi.submitFeedback(projectId, conversationId, message.id, { rating });
    } catch {
      // Feedback is best-effort; fail silently rather than interrupting the chat.
    }
  };

  const handleCitationClick = (citation) => {
    if (!citation?.sourceId) return;
    navigate(`/app/projects/${projectId}/sources/${citation.sourceId}`, {
      state: { highlightPassage: citation.passage, page: citation.page },
    });
  };

  const isEmpty = !loadingHistory && messages.length === 0 && !streamingMessage;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size={24} />
          </div>
        ) : isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-600/15 text-accent-400">
              <Sparkles size={26} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-base-100">
                Ask anything about your project knowledge
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-base-400">
                {project?.name
                  ? `Your questions will be answered using everything you've added to "${project.name}".`
                  : "Upload a source to start chatting with your project knowledge."}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-base-600 bg-base-850 px-3.5 py-1.5 text-xs text-base-300 hover:border-accent-500 hover:text-base-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCitationClick={handleCitationClick}
                onRegenerate={handleRegenerate}
                onFeedback={handleFeedback}
              />
            ))}
            {streamingMessage && (
              <ChatMessage message={streamingMessage} isStreaming onCitationClick={handleCitationClick} />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} onUploadClick={onUploadClick} disabled={sending} />
    </div>
  );
}
