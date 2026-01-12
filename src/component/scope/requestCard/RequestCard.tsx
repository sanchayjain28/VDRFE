import { Card, Col, Dropdown, Progress, Row } from "antd";
import { IMAGES } from "../../../shared";

interface RequestCardProps {
  id: number;
  statusIcon: string;
  showProgress?: boolean;
  progress?: number;
}

const RequestCard = ({ id, statusIcon, showProgress = false, progress = 0 }: RequestCardProps) => {
  return (
    <Card className="request-card">
      <Row>
        <Col flex="62px">
          <div className="status-icon">
            <i className={`erm-icon ${statusIcon}`} />
          </div>
        </Col>

        <Col flex="auto">
          <div className="request-id">
            R-00{id}
            <Dropdown
              menu={{ items: [{ key: "1", label: "More" }] }}
              placement="bottomRight"
            >
              <i className="erm-icon more-icon" />
            </Dropdown>
          </div>

          <div className="request-desc">
            Provide documentation related to compliance and policies.
          </div>

          <div className="request-meta">
            <div className="request-meta-left">
              <div className="user-detail">
                <span className="user-image-span">
                  <img
                    src={IMAGES.avatarImage}
                    alt="Avatar"
                    className="avatar-img"
                  />
                </span>
                <span>John Anderson</span>
              </div>
              <span className="date-wrap">
                <i className="erm-icon file-icon" />
                <span>
                  1 Docs <span className="orange-dot"></span>
                </span>
              </span>
              <span className="date-wrap">
                <i className="erm-icon calendar-icon" />
                <span>Due: 20/01/2024</span>
              </span>
            </div>

            {showProgress && (
              <div className="request-meta-right">
                <div className="custom-progress">
                  <span className="progress-text">{progress}% Completed</span>
                  <Progress
                    percent={progress}
                    showInfo={false}
                    strokeLinecap="round"
                    className="progress-bar"
                  />
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default RequestCard;
