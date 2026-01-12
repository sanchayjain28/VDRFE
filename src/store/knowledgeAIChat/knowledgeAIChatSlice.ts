import { PURGE } from "redux-persist";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  IChatConversation,
  IChatHistory,
  ICitation,
  IKnowledgeAIChat,
  IMessages,
} from "./knowledgeAIChat.interface";

const initialState: IKnowledgeAIChat = {
  isLoadingChatHistory: false,
  chatHistory: [],
  totalChatHistory: 0,
  selectedChatHistory: null,
  chatConversation: null,
  isLoadingCharConversation: false,
  isSessionCreating: false,
  streamingSessionId: null,
  isDeletingChatHistoryId: null,
  isRenamingChatHistoryTitle: false,
  selectedProjectId: null,
  selectedContextIds: {
    project: [],
    knowledge: [],
  },
};

export const knowledgeAIChatSlice = createSlice({
  name: "knowledgeAIChatSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      Object.assign(state, initialState);
    });
  },
  reducers: {
    setIsLoadingChatHistory: (state, action: PayloadAction<boolean>) => {
      state.isLoadingChatHistory = action.payload;
    },
    setChatHistory: (state, action: PayloadAction<IChatHistory[]>) => {
      state.chatHistory = action.payload;
    },
    setTotalChatHistory: (state, action: PayloadAction<number>) => {
      state.totalChatHistory = action.payload;
    },
    setSelectedChatHistory: (state, action: PayloadAction<IChatHistory | null>) => {
      state.selectedChatHistory = action.payload;
    },
    renameChatHistoryTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const chatHistoryItem = state.chatHistory.find((chat) => chat.id === id);
      if (chatHistoryItem) {
        chatHistoryItem.title = title;
      }
    },
    setIsLoadingChatConversation: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCharConversation = action.payload;
    },
    setChatConversation: (state, action: PayloadAction<IChatConversation | null>) => {
      state.chatConversation = action.payload;
    },
    setIsSessionCreating: (state, action) => {
      state.isSessionCreating = action.payload;
    },
    addNewChatHistory: (state, action: PayloadAction<IChatHistory>) => {
      state.chatHistory = [action.payload, ...state.chatHistory];
      state.selectedChatHistory = action.payload;
    },
    updateChatHistoryId: (state, action: PayloadAction<{ id: string; chatHistoryId: string }>) => {
      const { id, chatHistoryId } = action.payload;
      const chatHistoryItem = state.chatHistory.find((chat) => chat.id === id);
      if (chatHistoryItem) {
        chatHistoryItem.id = chatHistoryId;
        // if selected chat history then that id need to be updated
        if (state.selectedChatHistory?.id === id) {
          state.selectedChatHistory.id = chatHistoryId;
        }
        // if chat conversation then that id need to be updated
        if (state.chatConversation?.id === id) {
          state.chatConversation.id = chatHistoryId;
        }
      }
    },
    addNewQuestionAnswer: (
      state,
      action: PayloadAction<{ chatHistoryId: string; queAns: IMessages[] }>
    ) => {
      if (!state.chatConversation) return;
      if (state.chatConversation.id !== action.payload.chatHistoryId) return;

      state.chatConversation.messages.push(...action.payload.queAns);
    },
    startStreaming: (
      state,
      action: PayloadAction<{
        sessionId: string;
      }>
    ) => {
      state.streamingSessionId = action.payload.sessionId;
    },

    appendStreamingChunk(
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string; // temp message id while streaming
        token: string;
        citations?: ICitation[]; // optional found in this chunk
      }>
    ) {
      if (!state.chatConversation || state.chatConversation.id !== action.payload.conversationId)
        return;

      const msg = state.chatConversation.messages.find((m) => m.id === action.payload.messageId);
      if (!msg) return;

      msg.content = (msg.content || "") + action.payload.token;

      if (action.payload.citations && action.payload.citations.length) {
        msg.citations = msg.citations ?? [];
        // avoid duplicates by number
        for (const c of action.payload.citations) {
          if (!msg.citations.find((x) => x.number === c.number)) {
            msg.citations.push(c);
          }
        }
      }
    },
    stopStreaming: (state) => {
      state.streamingSessionId = null;
    },
    finalizeStreamedMessage(
      state,
      action: PayloadAction<{
        conversationId: string;
        tempMessageId: string;
        finalMessage: IMessages;
      }>
    ) {
      if (!state.chatConversation || state.chatConversation.id !== action.payload.conversationId)
        return;

      const idx = state.chatConversation.messages.findIndex(
        (m) => m.id === action.payload.tempMessageId
      );
      if (idx === -1) return;

      const existing = state.chatConversation.messages[idx];

      // Merge: keep streamed citations if present, but prefer server content/metadata
      const merged: IMessages = {
        ...existing,
        ...action.payload.finalMessage,
        citations: existing.citations ?? action.payload.finalMessage.citations ?? [],
      };

      // Replace message in-place
      state.chatConversation.messages[idx] = merged;
      state.streamingSessionId = null;
    },
    setIsDeletingChatHistoryId: (state, action: PayloadAction<string | null>) => {
      state.isDeletingChatHistoryId = action.payload;
    },
    setIsRenamingChatHistoryTitle: (state, action: PayloadAction<boolean>) => {
      state.isRenamingChatHistoryTitle = action.payload;
    },
    // Regenerate flow
    resetAssistantMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
      }>
    ) => {
      const msg = state.chatConversation?.messages.find((m) => m.id === action.payload.messageId);

      if (msg) {
        msg.content = "";
        msg.citations = [];
        msg.status = "streaming";
      }
    },
    setSelectedProjectId: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
    setSelectedContextIds: (
      state,
      action: PayloadAction<{ project: string[]; knowledge: string[] }>
    ) => {
      state.selectedContextIds = action.payload;
    },
  },
});

export const {
  setIsLoadingChatHistory,
  setChatHistory,
  setTotalChatHistory,
  setChatConversation,
  setSelectedChatHistory,
  addNewQuestionAnswer,
  addNewChatHistory,
  setIsLoadingChatConversation,
  setIsSessionCreating,
  startStreaming,
  appendStreamingChunk,
  stopStreaming,
  finalizeStreamedMessage,
  setIsDeletingChatHistoryId,
  setIsRenamingChatHistoryTitle,
  renameChatHistoryTitle,
  resetAssistantMessage,
  updateChatHistoryId,
  setSelectedProjectId,
  setSelectedContextIds,
} = knowledgeAIChatSlice.actions;

export default knowledgeAIChatSlice.reducer;
