import { Input, Avatar, Badge, Typography } from "antd";
import "./RecentActivity.scss";

const { Title } = Typography;

export interface Activity {
  id: string;
  type: "upload" | "review" | "assign" | "due";
  title: string;
  subtitle: string;
  project: string;
  timeAgo: string;
  isNew?: boolean;
}

interface RecentActivityProps {
  activities: Activity[];
  onSearch?: (value: string) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onSearch }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return "file-blue-icon";
      case "review":
        return "check-icon";
      case "assign":
        return "assessment-icon";
      case "due":
        return "time-icon";
      default:
        return "file-blue-icon";
    }
  };

  return (
    <div>
      <Title level={4} className="section-title">
        Recent Activity
      </Title>

      <div className="activity-wrapper">
        <div className="search-container">
          <Input
            placeholder="Search..."
            prefix={<i className="erm-icon search-icon" />}
            className="search-input"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item-wrapper">
              <div className="activity-item">
                <Badge dot={activity.isNew} offset={[-6, 8]}>
                  <Avatar
                    icon={<i className={`erm-icon ${getActivityIcon(activity.type)}`} />}
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                </Badge>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.subtitle}</div>
                </div>
              </div>
              {activity.isNew && (
                <div className="new-tag">
                  NEW
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;

