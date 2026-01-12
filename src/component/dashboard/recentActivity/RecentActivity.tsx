import { Input, List, Avatar, Badge, Typography } from "antd";
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

        <List
          className="activity-list"
          dataSource={activities}
          renderItem={(activity) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Badge dot={activity.isNew} offset={[-6, 8]}>
                    <Avatar
                      icon={<i className={`erm-icon ${getActivityIcon(activity.type)}`} />}
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </Badge>
                }
                title={activity.title}
                description={activity.subtitle}
                className="activity-item"
              />
              {activity.isNew && (
                <div className="new-tag">
                  NEW
                </div>
              )}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default RecentActivity;

