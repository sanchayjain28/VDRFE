import { useState } from "react";
import { Avatar, Button, Popover } from "antd";
import "./CollaboratorsPopover.scss";

// Local interface definition
interface IAssignedUser {
  user_id?: string;
  user_name?: string;
  role?: string;
  avatar?: string;
}

interface CollaboratorsPopoverProps {
  collaborators: IAssignedUser[];
  children: React.ReactNode;
}

const CollaboratorsPopover = ({ collaborators, children }: CollaboratorsPopoverProps) => {
  const [open, setOpen] = useState(false);

  const dropdownContent = (
    <div className="collaborators-dropdown-content" style={{ width: "260px", maxHeight: "300px" }}>
      <div className="dropdown-header">
        <h3 className="dropdown-title">All Collaborators</h3>
        <Button
          type="text"
          className="dropdown-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Close">
          ✕
        </Button>
      </div>
      <div className="dropdown-body">
        <div className="collaborators-list">
          {collaborators.map((collaborator) => (
            <div key={collaborator.user_id} className="collaborator-item">
              <div className="collaborator-meta">
                <div className="collaborator-avatar-wrapper">
                  <Avatar src={collaborator.avatar} size={32} className="collaborator-avatar">
                    {collaborator.user_name?.charAt(0)}
                  </Avatar>
                </div>
                <div className="collaborator-content">
                  <div className="collaborator-name">{collaborator.user_name}</div>
                  {collaborator.role && <div className="collaborator-role">{collaborator.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover
        content={dropdownContent}
        trigger="click"
        placement="topLeft"
        rootClassName="collaborators-dropdown"
        open={open}
        onOpenChange={setOpen}>
        {children}
      </Popover>
    </div>
  );
};

export default CollaboratorsPopover;
