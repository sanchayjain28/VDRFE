import { useState } from "react";
import { Avatar, Breadcrumb, Button, Progress } from "antd";
import "./ScopeHeader.scss";
import { IMAGES, PATHS } from "../../../shared";
import { AddScopeDrawer } from "../../../component";
import { useNavigate } from "react-router-dom";

interface IScopeHeader {
  isScopePage: boolean;
  isCommentsOpen?: boolean;
  isChatOpen?: boolean;
  onCommentsToggle?: () => void;
  onChatToggle?: () => void;
  onOpenReviewerModal?: () => void;
}

const ScopeHeader = (props: IScopeHeader) => {
  const { isCommentsOpen, isChatOpen, onCommentsToggle, onChatToggle, onOpenReviewerModal } = props;
  const navigate = useNavigate();
  const [isAddScopeDrawerOpen, setIsAddScopeDrawerOpen] = useState(false);

  const handleOpenAddScopeDrawer = () => {
    setIsAddScopeDrawerOpen(true);
  };

  const handleCloseAddScopeDrawer = () => {
    setIsAddScopeDrawerOpen(false);
  };

  const handleAddScope = (description: string) => {
    console.log("Scope Added:", description);
  };

  return (
    <div className="scope-header-wrapper">
      <div className="scope-header">
        <div className="breadcrumb-wrapper">
          <Breadcrumb className="page-breadcrumb">
            <Breadcrumb.Item onClick={() => navigate(PATHS.home)} className="breadcrumb-clickable">Home</Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => navigate(PATHS.projectDetails)} className="breadcrumb-clickable">Shell - Air Quality</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="scope-actions">
          <Button
            className={`primary-btn ${isChatOpen ? "active" : ""}`}
            type="primary"
            shape="round"
            onClick={onChatToggle}>
            <i className="erm-icon ai-icon" /> CHAT
          </Button>

          <Button
            type="text"
            aria-label="flagIcon"
            className={isCommentsOpen ? "active" : ""}
            onClick={handleOpenAddScopeDrawer}>
            <img src={IMAGES.flagIcon} alt="flagIcon" />
          </Button>

          <Button
            type="text"
            aria-label="checkPrimaryIcon"
            className={isCommentsOpen ? "active" : ""}>
            <img src={IMAGES.checkPrimaryIcon} alt="checkPrimaryIcon" />
          </Button>

          <Button
            type="text"
            aria-label="Comments"
            onClick={onCommentsToggle}
            className={isCommentsOpen ? "active" : ""}>
            <img src={IMAGES.commentIcon} alt="Comments" />
          </Button>

          <Button type="text" aria-label="Export">
            <img src={IMAGES.exportIcon} alt="Export" />
          </Button>
        </div>
      </div>

      <div className="scope-page-header">
        <h2 className="page-heading">Air Quality</h2>
        <p>
          The category addresses management of air quality impacts resulting from stationary (e.g.,
          factories, power plants) and mobile sources...
        </p>

        <div className="meta-row">
          <div className="meta-row-left">
            <div className="collaborators-wrapper">
              <Avatar size={24} src={IMAGES.avatarImage} />

              <div className="collaborators-plus-more" onClick={onOpenReviewerModal}>
                <i className="erm-icon plus-icon" />
              </div>
            </div>

            <span className="date-wrap">
              <i className="erm-icon calendar-icon" />
              <span>
                Due :<span className="orange-text"> 20/01/2024</span>
              </span>
            </span>

            <span className="date-wrap">
              <i className="erm-icon refresh-double-icon" />
              <span>Last Synced : 20/01/2024, 2:30 pm</span>
            </span>
          </div>

          <div className="meta-row-right">
            <div className="custom-progress">
              <span className="progress-text">67% Completed</span>
              <Progress
                percent={67}
                showInfo={false}
                strokeLinecap="round"
                className="progress-bar"
              />
            </div>
          </div>
        </div>
      </div>

      <AddScopeDrawer
        open={isAddScopeDrawerOpen}
        onClose={handleCloseAddScopeDrawer}
        onAdd={handleAddScope}
      />
    </div>
  );
};

export default ScopeHeader;
