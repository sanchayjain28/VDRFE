import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IChatHistory } from "../../../store/knowledgeAIChat/knowledgeAIChat.interface";
import PromptSuggestion from "../promptSuggestion/PromptSuggestion";
import SelectSources from "../selectSources/SelectSources";
import "./ChatInputPanel.scss";

interface ChatInputPanelProps {
  onSendMessage?: (message: string, projectId: string | null) => void;
  className?: string;
  placeholder?: string;
  selectedChatHistory?: IChatHistory | null;
  streamingSessionId?: string | null;
  selectedContextIds?: { project: string[]; knowledge: string[] };
  selectedProjectId?: string | null;
  onContextIdsChange?: (contextIds: { project: string[]; knowledge: string[] }) => void;
}

const DEFAULT_PLACEHOLDER = "Type your question. I’ll analyze your selected sources and respond.";

const ChatInputPanel: React.FC<ChatInputPanelProps> = ({
  onSendMessage,
  className = "",
  placeholder = DEFAULT_PLACEHOLDER,
  selectedChatHistory = null,
  streamingSessionId = null,
  selectedContextIds = { project: [], knowledge: [] },
  selectedProjectId: propSelectedProjectId = null,
  onContextIdsChange,
}) => {
  const navigate = useNavigate();
  // const { pathname } = useLocation();

  const [inputValue, setInputValue] = useState("");
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [selectedProjectId] = useState<string | null>(propSelectedProjectId);

  const handleOpenSources = useCallback(() => {
    setIsSourceModalOpen(true);
  }, []);

  const handleCloseSources = useCallback(() => {
    setIsSourceModalOpen(false);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    if (onSendMessage) {
      onSendMessage(inputValue.trim(), selectedProjectId);
      setInputValue("");
      return;
    }

  }, [inputValue, onSendMessage, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-input-container ${className}`}>
      <PromptSuggestion />
      <div className="chat-input-box">
        <div className="input-wrapper">
          <Input.TextArea
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 2, maxRows: 10 }}
            className="chat-input"
          />
        </div>
        <div className="input-controls">
          <div className="left-controls">
            <Tooltip title="Select sources">
              <Button
                hidden
                shape="circle"
                variant="outlined"
                icon={<PlusOutlined />}
                className="control-btn"
                onClick={handleOpenSources}
              />
            </Tooltip>
            <Button
              // hidden={!(pathname === PATHS.chat || pathname.startsWith(`${PATHS.chat}/`))}
              variant="outlined"
              icon={<i className="erm-icon source" />}
              className="control-btn source-select-btn"
              onClick={handleOpenSources}
              disabled={true}
              >
              {selectedContextIds?.project?.length === 0 &&
                selectedContextIds?.knowledge?.length === 0
                ? "Sources"
                : `(${selectedContextIds?.project?.length + selectedContextIds?.knowledge?.length
                }) Sources Selected`}
            </Button>

            <Tooltip title="Deep Research">
              <Button
                hidden
                shape="circle"
                variant="outlined"
                icon={<i className="erm-icon deep-research" />}
                className="control-btn"
              />
            </Tooltip>
          </div>

          <div className="right-controls">
            <Tooltip title="My projects">
              <Button
                hidden
                shape="round"
                variant="outlined"
                icon={<i className="erm-icon my-project" />}
                className="control-btn">
                Shell
              </Button>
            </Tooltip>
            {streamingSessionId === selectedChatHistory?.id ? (
              <Button
                type="text"
                shape="circle"
                className="stop-streaming-btn"
                icon={<i className="erm-icon stop-generation" />}
              />
            ) : (
              <Button
                type="primary"
                shape="circle"
                icon={<ArrowRightOutlined />}
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="primary-btn ask-btn"
              />
            )}
          </div>
        </div>
      </div>
      {isSourceModalOpen && (
        <SelectSources
          open={isSourceModalOpen}
          onClose={handleCloseSources}
          selectedProjectId={selectedProjectId}
          selectedContextIds={selectedContextIds}
          onContextIdsChange={onContextIdsChange}
        />
      )}
    </div>
  );
};

export default ChatInputPanel;
