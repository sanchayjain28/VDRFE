import { useState } from "react";
import { Button, Input } from "antd";
import "./Chat.scss";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages = [], onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-logo">
              <div className="logo-circle"></div>
            </div>
            <h2 className="chat-title">Deal Room AI</h2>
            <p className="chat-subtitle">Leverage Request files to ask queries</p>
            <Button className="suggested-prompts-btn" type="default">
              <i className="erm-icon sparkle-icon" />
              Suggested Prompts
            </Button>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${message.isUser ? "user" : "ai"}`}
              >
                <div className="message-content">{message.text}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-input-wrapper">
        <div className="chat-input-actions">
          <Button type="text" className="sources-btn">
            <i className="erm-icon file-icon" />
            Sources
          </Button>
          <Button type="text" className="globe-btn">
            <i className="erm-icon globe-icon" />
          </Button>
        </div>
        <div className="chat-input-box">
          <Input.TextArea
            className="chat-input"
            placeholder="Type your question I'll analyse your selected sources and respond."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <Button
            type="primary"
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <i className="erm-icon send-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

