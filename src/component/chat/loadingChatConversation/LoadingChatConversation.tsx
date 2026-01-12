import { Skeleton } from "antd";
import "./LoadingChatConversation.scss";

const LoadingChatConversation = () => {
  return (
    <div className="message message-bot">
      <div className="message-content-skeleton">
        <div className="skelton-big">
          <span className="skeltion-circle"></span>
        </div>
        <div className="skelton-set">
          <Skeleton.Input active style={{ width: "100%" }} />
          <Skeleton.Input active style={{ width: "90%" }} />
          {/* <Skeleton.Input active style={{ width: "100%" }} />
          <Skeleton.Input active style={{ width: "40%" }} /> */}
        </div>
        <div className="skelton-set">
          <Skeleton.Input active style={{ width: "100%" }} />
          <Skeleton.Input active style={{ width: "90%" }} />
          {/* <Skeleton.Input active style={{ width: "100%" }} />
          <Skeleton.Input active style={{ width: "40%" }} /> */}
        </div>
      </div>
      <div className="message-content-skeleton">
        <div className="skelton-big">
          <span className="skeltion-circle"></span>
        </div>
        <div className="skelton-set">
          <Skeleton.Input active style={{ width: "100%" }} />
          <Skeleton.Input active style={{ width: "90%" }} />
          {/* <Skeleton.Input active style={{ width: "100%" }} />
          <Skeleton.Input active style={{ width: "40%" }} /> */}
        </div>
      </div>
    </div>
  );
};

export default LoadingChatConversation;
