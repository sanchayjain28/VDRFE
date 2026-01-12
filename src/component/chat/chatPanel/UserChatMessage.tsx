import React from "react";
import type { IMessages } from "../../../store/knowledgeAIChat/knowledgeAIChat.interface";

const UserChatMessage: React.FC<{ msg: IMessages }> = ({ msg }) => {
  return (
    <div key={msg.id} className="message-fade">
      <div key={msg.id} className="message message-user chat-question">
        <div className="bubble">
          <div className="avatar">S</div>
          <div className="user-question">{msg.content}</div>
        </div>
      </div>
    </div>
  );
};

export default UserChatMessage;
