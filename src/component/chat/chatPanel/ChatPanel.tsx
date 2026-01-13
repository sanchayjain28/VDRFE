import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type {
  ICitation,
  IMessages,
} from "../../../store/knowledgeAIChat/knowledgeAIChat.interface";
import ChatInputPanel from "../chatInputPanel/ChatInputPanel";
import LoadingChatConversation from "../loadingChatConversation/LoadingChatConversation";
import AIChatMessage from "./AIChatMessage";
import "./ChatPanel.scss";
import UserChatMessage from "./UserChatMessage";
import { useChat } from "../../../shared/hooks/useChat";
import { IMAGES, MessageType } from "../../../shared";
import { Button } from "antd";

interface ChatPanelProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  title = "Ask ERM AI",
  subtitle = "Ask anything from the knowledge base",
  className = "",
}) => {
  const {
    handleSendMessage,
    chatConversation,
    isLoadingCharConversation,
    selectedChatHistory,
    streamingSessionId,
    selectedContextIds,
    setSelectedContextIds,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [, setIsFeedbackModalOpen] = useState(false);
  const [isAskQuestion, setIsAskQuestion] = useState(false);

  // autoscroll to bottom when messages change (only for existing chats)
  useEffect(() => {
    if (!selectedChatHistory) return;

    const end = messagesEndRef.current;
    if (!end) return;

    requestAnimationFrame(() => {
      end.scrollIntoView({ behavior: "smooth" });
    });

    const nodes = document.querySelectorAll(".message-fade");
    nodes.forEach((el) => el.classList.add("show"));
  }, [chatConversation?.messages, selectedChatHistory, isAskQuestion]);

  // copy handler
  const handleCopyClick = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Text copied successfully");
    } catch (error) {
      console.error("Error copying text:", error);
      toast.error("Copy failed");
    }
  }, []);

  const onOpenCitation = useCallback((c?: ICitation) => {
    c
  }, []);

  const onFeedbackOpen = useCallback(() => {
    setIsFeedbackModalOpen(true);
  }, []);

  return (
    <div className={`chat-interface ${className}`}>
      {!selectedChatHistory && (
        <div className="container">
          <Button
            shape="round"
            variant="outlined"
            className="chat-history-btn"
            icon={<i className="erm-icon history" />}
          >
            History
          </Button>
          <div className="chat-welcome">
            <div className="welcome-header">
              <div className="welcome-logo">
                <img src={IMAGES.chatLogo} alt="ERM" />
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </div>
            </div>
          </div>

          <ChatInputPanel
            onSendMessage={(value) => handleSendMessage(value)}
            selectedChatHistory={selectedChatHistory}
            streamingSessionId={streamingSessionId}
            selectedContextIds={selectedContextIds}
            onContextIdsChange={setSelectedContextIds}
          />
        </div>
      )}
      {/* <div className="page-header-innerpage"></div> */}
      {selectedChatHistory && (
        <div className="chat-stepper-wrapper">
          <div className="chat-messages" ref={messagesContainerRef}>
            {/* Loading State */}
            {isLoadingCharConversation && <LoadingChatConversation />}

            {/* Empty State */}
            {!isLoadingCharConversation && chatConversation?.messages?.length === 0 && (
              <div className="no-messages-yet">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}

            {/* Messages */}
            {!isLoadingCharConversation &&
              chatConversation &&
              chatConversation?.messages?.length > 0 &&
              chatConversation.messages.map((msgBase: IMessages | any, index: number) => {
                const msg =
                  msgBase.role === MessageType.Assistant || msgBase.type === "assistant"
                    ? (msgBase as IMessages & { citations?: ICitation[] })
                    : (msgBase as IMessages);

                // USER MESSAGE
                if (msg.role === MessageType.User) {
                  return <UserChatMessage msg={msg} />;
                }

                // AI MESSAGE
                return (
                  <div
                    key={msg.id}
                    className={
                      chatConversation &&
                        chatConversation?.messages?.length - 1 === index &&
                        isAskQuestion
                        ? "message-fade chat-bottom-spacer"
                        : "message-fade"
                    }>
                    <AIChatMessage
                      msg={msg}
                      onOpenCitation={onOpenCitation}
                      onCopy={handleCopyClick}
                      onFeedback={onFeedbackOpen}
                    />
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {selectedChatHistory && (
        <ChatInputPanel
          className="footer-chat"
          onSendMessage={(value) => {
            setIsAskQuestion(true);
            handleSendMessage(value);
          }}
          selectedChatHistory={selectedChatHistory}
          streamingSessionId={streamingSessionId}
          selectedContextIds={selectedContextIds}
          onContextIdsChange={setSelectedContextIds}
        />
      )}
    </div>
  );
};

export default ChatPanel;
