import { useState, useMemo } from "react";
import { Button, Input, Modal, Avatar } from "antd";
import "./SelectReviewerModal.scss";
import { IMAGES } from "../../../shared";

interface Reviewer {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface SelectReviewerModalProps {
  open: boolean;
  onClose: () => void;
  handleSubmit: (selectedReviewer: Reviewer | null) => void;
}

const mockReviewers: Reviewer[] = [
  {
    id: "1",
    name: "Oliver Bennett",
    role: "Technical Partner",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Sophie Harrington",
    role: "Partner",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "James Whitmore",
    role: "Project Coordinator",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Ethan Rowley",
    role: "Project Coordinator",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "5",
    name: "Charlotte Hughes",
    role: "Project Coordinator",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const SelectReviewerModal = ({ open, onClose, handleSubmit }: SelectReviewerModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(null);

  const filteredReviewers = useMemo(() => {
    if (!searchTerm.trim()) return mockReviewers;
    const term = searchTerm.toLowerCase();
    return mockReviewers.filter(
      (reviewer) =>
        reviewer.name.toLowerCase().includes(term) || reviewer.role.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleModalSubmit = () => {
    handleSubmit(selectedReviewer);
    setSelectedReviewer(null);
    setSearchTerm("");
    onClose();
  };

  const handleModalCancel = () => {
    setSelectedReviewer(null);
    setSearchTerm("");
    onClose();
  };

  return (
    <Modal
      className="select-reviewer-modal"
      title="Select Preparers"
      open={open}
      onCancel={handleModalCancel}
      footer={[
        <Button key="cancel" className="secondary-btn" shape="round" onClick={handleModalCancel}>
          CANCEL
        </Button>,
        <Button
          key="submit"
          className="primary-btn"
          type="primary"
          shape="round"
          onClick={handleModalSubmit}
          disabled={!selectedReviewer}>
          ADD
        </Button>,
      ]}
      width={480}>
      <div className="select-reviewer-content">
        <div className="search-wrapper">
          <Input
            className="quick-search"
            placeholder="Search by name or role..."
            prefix={<i className="erm-icon search-icon" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="reviewers-list">
          {filteredReviewers.map((reviewer) => {
            const isSelected = selectedReviewer?.id === reviewer.id;
            return (
              <div
                key={reviewer.id}
                className={`reviewer-item ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedReviewer(reviewer)}>
                <Avatar src={reviewer.avatar} size={40}>
                  {reviewer.name.charAt(0)}
                </Avatar>
                <div className="reviewer-info">
                  <div className="reviewer-name">{reviewer.name}</div>
                  <div className="reviewer-role">{reviewer.role}</div>
                </div>
                {isSelected && <img src={IMAGES.circleCheckIcon} alt="Checked" />}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default SelectReviewerModal;
