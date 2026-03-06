import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Breadcrumb, Button, Form, Input, Modal, Progress, App } from "antd";
import { IMAGES, PATHS } from "../../../shared";
import AddFlagDrawer from "../addFlagDrawer/AddFlagDrawer";
import { ITopic, updateTopicInstruction } from "../../../services/vdrAgent";
import "./ScopeHeader.scss";

interface IScopeHeader {
  isScopePage: boolean;
  isCommentsOpen?: boolean;
  isChatOpen?: boolean;
  onCommentsToggle?: () => void;
  onChatToggle?: () => void;
  onOpenReviewerModal?: () => void;
  selectedTopic?: ITopic | null;
  onTopicUpdate?: (topic: ITopic) => void;
  isReclassifying?: boolean;
  onReclassify?: () => void;
  projectName?: string;
}

const ScopeHeader = (props: IScopeHeader) => {
  const { isChatOpen, onOpenReviewerModal, selectedTopic, onTopicUpdate, isReclassifying, onReclassify, projectName } = props;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [isAddFlagDrawerOpen, setIsAddFlagDrawerOpen] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructionForm] = Form.useForm<{ instruction: string }>();

  const handleOpenAddFlagDrawer = () => {
    setIsAddFlagDrawerOpen(true);
  };

  const handleCloseAddFlagDrawer = () => {
    setIsAddFlagDrawerOpen(false);
  };

  const handleAddFlag = (description: string) => {
    description
  };

  const handleOpenInstructionModal = () => {
    if (!selectedTopic) return;
    instructionForm.setFieldsValue({ instruction: selectedTopic.instruction ?? "" });
    setIsInstructionModalOpen(true);
  };

  const handleSubmitInstruction = async () => {
    if (!selectedTopic) return;
    try {
      const { instruction } = await instructionForm.validateFields();
      setIsSubmitting(true);
      const updated = await updateTopicInstruction(selectedTopic.id, instruction);
      if (updated) {
        onTopicUpdate?.(updated);
        message.success("Instruction updated successfully!");
      } else {
        message.error("Failed to update instruction. Please try again.");
      }
      setIsInstructionModalOpen(false);
    } catch {
      // validation error — do nothing
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="scope-header-wrapper">
      <div className="scope-header">
        <div className="breadcrumb-wrapper">
          <Breadcrumb
            className="page-breadcrumb"
            items={[
              {
                title: <span onClick={() => navigate(PATHS.home)} className="breadcrumb-clickable">Home</span>,
              },
              {
                title: <span onClick={() => navigate(PATHS.projectDetails)} className="breadcrumb-clickable">{projectName || "Project"}</span>,
              },
              ...(selectedTopic ? [{
                title: <span>{selectedTopic.name}</span>,
              }] : []),
            ]}
          />
        </div>

        <div className="scope-actions">
          <Button
            className="primary-btn"
            type="primary"
            shape="round"
            onClick={handleOpenInstructionModal}>
            <i className="erm-icon setting" /> SET INSTRUCTION
          </Button>

          <Button
            className="primary-btn"
            type="primary"
            shape="round"
            onClick={onReclassify}
            disabled={!selectedTopic || isReclassifying}>
            <i className="erm-icon refresh-double-icon" /> RE-CLASSIFY
          </Button>

          <Button
            className={`primary-btn ${isChatOpen ? "active" : ""}`}
            type="primary"
            shape="round"
            disabled>
            <i className="erm-icon ai-icon" /> CHAT
          </Button>

          <Button
            type="text"
            aria-label="flagIcon"
            onClick={handleOpenAddFlagDrawer}
            disabled>
            <img src={IMAGES.flagIcon} alt="flagIcon" />
          </Button>

          <Button
            type="text"
            aria-label="checkPrimaryIcon"
            disabled>
            <img src={IMAGES.checkPrimaryIcon} alt="checkPrimaryIcon" />
          </Button>

          <Button
            type="text"
            aria-label="Comments"
            disabled>
            <img src={IMAGES.commentIcon} alt="Comments" />
          </Button>

          <Button type="text" aria-label="Export" disabled>
            <img src={IMAGES.exportIcon} alt="Export" />
          </Button>
        </div>
      </div>

      <div className="scope-page-header">
        <h2 className="page-heading">{selectedTopic?.name ?? "Select a Scope"}</h2>
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

      <AddFlagDrawer
        open={isAddFlagDrawerOpen}
        onClose={handleCloseAddFlagDrawer}
        onAdd={handleAddFlag}
      />

      <Modal
        title={`Set Instruction — ${selectedTopic?.name ?? ""}`}
        open={isInstructionModalOpen}
        onCancel={() => setIsInstructionModalOpen(false)}
        onOk={handleSubmitInstruction}
        okText="Save"
        confirmLoading={isSubmitting}
        destroyOnClose>
        <Form form={instructionForm} layout="vertical">
          <Form.Item
            name="instruction"
            label="Instruction"
            rules={[{ max: 1000, message: "Instruction must not exceed 1000 characters" }]}>
            <Input.TextArea rows={5} maxLength={1000} placeholder="Enter instruction for this scope." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScopeHeader;
