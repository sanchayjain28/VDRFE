import { Button, Popover } from "antd";
import { useState } from "react";
import "./PromptSuggestion.scss";

const PromptSuggestion = () => {
  const [isOpenPrompt, setIsOpenPrompt] = useState(false);

  return (
    <Popover
      trigger="click"
      placement="topLeft"
      open={isOpenPrompt}
      onOpenChange={(visible) => setIsOpenPrompt(visible)}
      content={
        <div className="prompt-popover">
          <div className="prompt-list">
            <h4>Review the project description and scope provide</h4>
            <p>Generate a clear executive summary and highlight ke</p>
          </div>
          <div className="prompt-list">
            <h4>Here is the methodology and admin framework</h4>
            <p>Assess whether these approaches adequately support th</p>
          </div>
          <div className="prompt-list">
            <h4>Evaluate these event/impact logs and management plans</h4>
            <p>Summarize unplanned events, cumulative impacts, and req</p>
          </div>
          <div className="prompt-list">
            <h4>Analyze the inputs on infrastructure, services, and transport.</h4>
            <p>Assess the socioeconomic impacts and identify vulnerable</p>
          </div>
        </div>
      }>
      <Button className="prompt-btn" onClick={() => setIsOpenPrompt(!isOpenPrompt)}>
        <i className="erm-icon prompts-icon" /> Suggested Prompts
      </Button>
    </Popover>
  );
};

export default PromptSuggestion;
