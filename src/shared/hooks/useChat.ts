import { useState, useCallback } from "react";
import type {
  IChatHistory,
  IMessages,
  IChatConversation,
} from "../../store/knowledgeAIChat/knowledgeAIChat.interface";
import { MessageType } from "../constants";
import { uniqueId } from "../helper";

// HELPERS
const buildUserMessage = (value: string, sessionId: string): IMessages => ({
  id: uniqueId().toString(),
  role: MessageType.User,
  content: value,
  session_id: sessionId,
  created_at: new Date().toISOString(),
  error_message: "",
  metadata: null,
  status: "sent",
});

const buildAssistantTempMessage = (sessionId: string): IMessages => ({
  id: `temp-${uniqueId()}`,
  role: MessageType.Assistant,
  content: "",
  session_id: sessionId,
  created_at: new Date().toISOString(),
  error_message: "",
  metadata: null,
  status: "streaming",
});

export const useChat = () => {
  const [chatConversation, setChatConversation] = useState<IChatConversation | null>(null);
  const [selectedChatHistory, setSelectedChatHistory] = useState<IChatHistory | null>(null);
  const [isLoadingCharConversation] = useState(false);
  const [isSessionCreating] = useState(false);
  const [streamingSessionId, setStreamingSessionId] = useState<string | null>(null);
  const [selectedContextIds, setSelectedContextIds] = useState<{ project: string[]; knowledge: string[] }>({
    project: [],
    knowledge: [],
  });

  // SEND MESSAGE
  const handleSendMessage = useCallback(async (value: string) => {
    if (!value.trim()) return;

    setChatConversation((prevConversation) => {
      const currentSessionId = selectedChatHistory?.id ?? null;
      const tempSessionId = `temp-${uniqueId()}`;
      const sessionId = currentSessionId ?? tempSessionId;

      // Build messages immediately
      const userMsg = buildUserMessage(value, sessionId);
      const assistantMsg = buildAssistantTempMessage(sessionId);

      // Create session if needed
      if (!currentSessionId) {
        const tempchatHistory: IChatHistory = {
          id: tempSessionId,
          title: value.slice(0, 50) || "New Chat",
          projectDetails: null,
          user_id: "",
          metadata: null,
          status: "active",
          error_count: 0,
          last_error: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSelectedChatHistory(tempchatHistory);
        setStreamingSessionId(tempSessionId);

        // Simulate assistant response (no API call)
        setTimeout(() => {
          setChatConversation((conv) => {
            if (!conv || conv.id !== tempSessionId) return conv;
            const updatedMessages = [...conv.messages];
            const assistantIndex = updatedMessages.findIndex((m) => m.id === assistantMsg.id);
            if (assistantIndex !== -1) {
              updatedMessages[assistantIndex] = {
                ...assistantMsg,
                content: "This is a placeholder response. API calls have been removed.",
                status: "sent",
              };
            }
            return { ...conv, messages: updatedMessages };
          });
          setStreamingSessionId(null);
        }, 1000);

        return { id: tempSessionId, messages: [userMsg, assistantMsg] };
      } else {
        // Add messages to existing conversation
        if (prevConversation && prevConversation.id === sessionId) {
          setStreamingSessionId(sessionId);

          // Simulate assistant response (no API call)
          setTimeout(() => {
            setChatConversation((conv) => {
              if (!conv || conv.id !== sessionId) return conv;
              const updatedMessages = [...conv.messages];
              const assistantIndex = updatedMessages.findIndex((m) => m.id === assistantMsg.id);
              if (assistantIndex !== -1) {
                updatedMessages[assistantIndex] = {
                  ...assistantMsg,
                  content: "This is a placeholder response. API calls have been removed.",
                  status: "sent",
                };
              }
              return { ...conv, messages: updatedMessages };
            });
            setStreamingSessionId(null);
          }, 1000);

          return {
            ...prevConversation,
            messages: [...prevConversation.messages, userMsg, assistantMsg],
          };
        }
        return prevConversation;
      }
    });
  }, [selectedChatHistory]);

  const handleStartNewChatBtn = useCallback(() => {
    setSelectedChatHistory(null);
    setChatConversation(null);
  }, []);

  const onRegenerate = useCallback(async (msg: IMessages) => {
    if (!msg.id || !msg.session_id) return;
    setStreamingSessionId(msg.session_id);
    // Simulate regeneration (no API call)
    setTimeout(() => {
      setStreamingSessionId(null);
    }, 1000);
  }, []);

  const stopGeneration = useCallback(() => {
    setStreamingSessionId(null);
  }, []);

  const fetchChatHistory = useCallback(async () => {
    // No API call - return empty array
    return [];
  }, []);

  return {
    handleSendMessage,
    handleStartNewChatBtn,
    onRegenerate,
    stopGeneration,
    fetchChatHistory,
    chatConversation,
    selectedChatHistory,
    isLoadingCharConversation,
    isSessionCreating,
    streamingSessionId,
    selectedContextIds,
    setSelectedContextIds,
  };
};
