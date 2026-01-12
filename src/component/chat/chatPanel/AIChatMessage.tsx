import { Button, Collapse, Tooltip } from "antd";
import React, { useMemo, useState } from "react";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { IMAGES } from "../../../shared";
import { formatMathToLatexNew } from "../../../shared/helper";
import type {
  ICitation,
  IMessages,
} from "../../../store/knowledgeAIChat/knowledgeAIChat.interface";

const StepAccordion: React.FC<{ show: boolean; toggle: () => void }> = ({ show, toggle }) => {
  const items = useMemo(
    () => [
      {
        key: "1",
        label: "National ministry data.",
        children: (
          <div className="accordion-content">
            <p>• Marine Habitat Disturbance</p>
            <p>• Underwater Noise Impact</p>
            <p>• Coastal Erosion & Sediment Shifts</p>
          </div>
        ),
      },
      {
        key: "2",
        label: "Thought process",
        children: (
          <div className="accordion-content">
            <p>
              <strong>Marine Habitat Disturbance</strong>
            </p>
            <p>
              Construction activities may disrupt sensitive benthic habitats (corals, seagrass, soft
              sediments).
            </p>
            <p>Source: Volume 2 – Chapter 7, pp. 112–118</p>

            <p>
              <strong>Underwater Noise Impact on Marine Mammals</strong>
            </p>
            <p>
              Piling and vessel movement increase acoustic pressure, potentially affecting migration
              and feeding patterns of dolphins and whales.
            </p>
          </div>
        ),
        className: "deep-search",
      },
      {
        key: "3",
        label: "Additional Notes",
        children: (
          <div className="accordion-content">
            <p>
              <strong>Marine Habitat Disturbance</strong>
            </p>
            <p>
              Construction activities may disrupt sensitive benthic habitats (corals, seagrass, soft
              sediments).
            </p>
            <p>Source: Volume 2 – Chapter 7, pp. 112–118</p>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="chat-steps" hidden>
      <div className="step-header" onClick={toggle}>
        <i className={`erm-icon ${show ? "arrow-up" : "arrow-down"}`} />
        <span>{show ? "Hide steps" : "Show steps"}</span>
      </div>

      {show && (
        <div className="steps-accordion">
          <Collapse
            items={items}
            ghost
            accordion
            expandIconPosition="end"
            expandIcon={(panelProps) => (
              <i className={`erm-icon ${panelProps.isActive ? "arrow-up" : "arrow-down"}`} />
            )}
          />
        </div>
      )}
    </div>
  );
};
const AIChatMessage: React.FC<{
  msg: IMessages & { citations?: ICitation[] };
  onOpenCitation: (citation: ICitation | undefined) => void;
  onCopy: (text: string) => void;
  onFeedback: () => void;
}> = ({ msg, onOpenCitation, onCopy, onFeedback }) => {
  const [showSteps, setShowSteps] = useState(true);
  if (!msg.content) {
    return (
      <div className="message message-bot" key={msg.id}>
        <div className="message-content loading-text">Thinking...</div>
      </div>
    );
  }

  function convertCitationPlaceholders(msg: IMessages & { citations?: ICitation[]; }): string {
    if (!msg.citations) {
      return msg.content;
    }
    return msg.content.replace(/{{CITATION_PLACEHOLDER}}/g, msg.citations.map((c) => c.number).join(", "));
  }

  return (
    <>
      <StepAccordion show={showSteps} toggle={() => setShowSteps((s) => !s)} />
      <div className="message message-bot" key={msg.id}>
        <div className="message-content mark-down">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              span: ({ node, ...props }) => {
                const num = (props as any)["data-num"];

                if (props.className === "citation-placeholder" && num) {
                  const citation = (msg.citations || []).find((c) => c.number === Number(num));
                  return (
                    <Button
                      size="small"
                      className="citation-btn"
                      onClick={() => onOpenCitation(citation)}
                      aria-label={`Open citation ${num}`}>
                      {num}
                    </Button>
                  );
                }
                return <span {...props} />;
              },
              table: ({ children, ...props }: any) => {
                const tableId = `markdown-table__${msg.id}__${Math?.random()
                  ?.toString(36)
                  ?.slice(2, 9)}`;

                return (
                  <div className="markdown-table-wrapper">
                    <div className="table-scroll">
                      <table id={tableId} {...props}>
                        {children}
                      </table>
                    </div>
                  </div>
                );
              },
            }}>
            {formatMathToLatexNew(convertCitationPlaceholders(msg))}
          </Markdown>
        </div>

        <div className="action-btns" hidden={msg.status !== "sent"}>
          <Tooltip title="Copy text">
            <Button
              disabled={msg.status !== "sent"}
              onClick={() => onCopy(msg.content)}
              type="text"
              icon={<img src={IMAGES.chatCopyIcon} alt="Copy" />}
              className="action-btn"
            />
          </Tooltip>

          <Tooltip title="Give positive feedback">
            <Button
              disabled={msg.status !== "sent"}
              type="text"
              icon={<img src={IMAGES.likeIcon} alt="Like" />}
              className="action-btn"
            />
          </Tooltip>

          <Tooltip title="Give negative feedback">
            <Button
              disabled={msg.status !== "sent"}
              type="text"
              icon={<img src={IMAGES.dislikeIcon} alt="Dislike" />}
              className="action-btn"
              onClick={onFeedback}
            />
          </Tooltip>

          <Tooltip title="Regenerate response">
            <Button
              disabled={msg.status !== "sent"}
              type="text"
              icon={<img src={IMAGES.regenerateChat} alt="regenerate" />}
              className="action-btn"
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default AIChatMessage;
