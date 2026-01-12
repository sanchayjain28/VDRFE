import { Avatar } from "antd";
import CollaboratorsPopover from "./collaboratorsPopover/CollaboratorsPopover";
import "./Collaborators.scss";

// Local interface definition
interface IAssignedUser {
  user_id?: string;
  user_name?: string;
  role?: string;
  avatar?: string;
}

interface CollaboratorsProps {
  collaborators: IAssignedUser[];
  maxVisible?: number;
  showLabel?: boolean;
  labelText?: string;
}

const Collaborators = ({
  collaborators,
  maxVisible = 3,
  showLabel = true,
  labelText = "Collaborators",
}: CollaboratorsProps) => {
  // Show first N avatars, then "+X" for the rest
  const visibleCollaborators = collaborators?.slice(0, maxVisible);
  const remainingCount = collaborators?.length - maxVisible;

  return (
    <div className="collaborators-container">
      {showLabel && <span className="collaborators-heading">{labelText}</span>}
      <div className="collaborators-images">
        {collaborators?.length === 0 && <span className="no-collaborators">No collaborators</span>}
        {collaborators?.length > 0 && (
          <Avatar.Group size="default">
            {visibleCollaborators?.map((collaborator) => (
              <Avatar key={collaborator.user_id} src={collaborator.avatar}>
                {collaborator.user_name?.charAt(0)}
              </Avatar>
            ))}
            {remainingCount > 0 && (
              <CollaboratorsPopover collaborators={collaborators}>
                <span className="collaborators-plus-more" onClick={(e) => e.stopPropagation()}>
                  +{remainingCount}
                </span>
              </CollaboratorsPopover>
            )}
          </Avatar.Group>
        )}
      </div>
    </div>
  );
};

export default Collaborators;
