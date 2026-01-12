import type { MessageType } from "../../shared";

export interface IKnowledgeAIChat {
  isLoadingChatHistory: boolean;
  chatHistory: IChatHistory[];
  totalChatHistory: number;
  selectedChatHistory: IChatHistory | null;
  chatConversation: IChatConversation | null;
  isLoadingCharConversation: boolean;
  isSessionCreating: boolean;
  streamingSessionId: string | null;
  isDeletingChatHistoryId: string | null;
  isRenamingChatHistoryTitle: boolean;
  selectedProjectId: string | null;
  selectedContextIds: {
    project: string[];
    knowledge: string[];
  };
}

export interface IChatHistory {
  id: string;
  title: string;
  projectDetails: IProjectDetails | null;
  user_id: string;
  metadata: any;
  status: string;
  error_count: number;
  last_error: any;
  created_at?: string;
  updated_at?: string;
}

export interface IMessages {
  id: string;
  session_id: string;
  content: string;
  role: MessageType;
  metadata: IMetadata | null;
  status: string;
  error_message: any;
  created_at: string;
  citations?: ICitation[];
}

export interface ICitation {
  number: number;
  page: string | null;
  file: string | null;
  raw?: string;
}

export interface IMetadata {
  generated_via: string;
}

interface IProjectDetails {
  id: string;
  name: string;
}

export interface IChatConversation {
  id: string;
  messages: IMessages[];
}
