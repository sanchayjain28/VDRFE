import { Breadcrumb, Table, Avatar, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./ProjectDetails.scss";
import { IMAGES, PATHS } from "../../shared";
import { RecentActivity, ScopeFilterBar } from "../../component";
import { useState, useMemo } from "react";
import { Activity } from "../../component/dashboard/recentActivity/RecentActivity";
import { useNavigate } from "react-router-dom";

interface ScopeData {
  key: string;
  scope: string;
  dueDate: string;
  assignedTo: {
    name: string;
    avatar?: string;
  };
  riskAssessment: {
    level: string;
    color: "yellow" | "red" | "green";
  };
  redFlag: number;
  openComments: number;
  hasViewDetails?: boolean;
  hasObservation?: boolean;
  observationText?: string;
}

const ProjectDetails = () => {
  const navigate = useNavigate();

  const [scopeData] = useState<ScopeData[]>([
    {
      key: "1",
      scope: "1. Air Quality",
      dueDate: "23/1/2026",
      assignedTo: {
        name: "Sarah Chen",
        avatar: IMAGES.avatarImage,
      },
      riskAssessment: {
        level: "Moderate",
        color: "yellow",
      },
      redFlag: 3,
      openComments: 5,
      hasViewDetails: true,
    },
    {
      key: "2",
      scope: "2. Business Ethics",
      dueDate: "2/2/2026",
      assignedTo: {
        name: "Sarah Chen",
        avatar: IMAGES.avatarImage,
      },
      riskAssessment: {
        level: "Very high",
        color: "red",
      },
      redFlag: 0,
      openComments: 10,
      hasObservation: true,
      observationText: "Observation: Certain details could not be verified during the internal review process.",
    },
    {
      key: "3",
      scope: "3. Critical Incident",
      dueDate: "23/1/2026",
      assignedTo: {
        name: "Sarah Chen",
        avatar: IMAGES.avatarImage,
      },
      riskAssessment: {
        level: "Low",
        color: "green",
      },
      redFlag: 3,
      openComments: 3,
    },
    {
      key: "4",
      scope: "4. Customer Welfare",
      dueDate: "23/1/2026",
      assignedTo: {
        name: "Sarah Chen",
        avatar: IMAGES.avatarImage,
      },
      riskAssessment: {
        level: "High",
        color: "red",
      },
      redFlag: 3,
      openComments: 6,
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: "1",
      type: "upload",
      title: "128 documents uploaded | Air Quality",
      subtitle: "Shell • 2 hours ago",
      project: "Shell",
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      type: "review",
      title: "Soil Report marked as reviewed",
      subtitle: "ExxonMobil • 4 hours ago",
      project: "ExxonMobil",
      timeAgo: "4 hours ago",
    },
    {
      id: "3",
      type: "assign",
      title: "Sarah Chen assigned to Groundwater Assessment",
      subtitle: "Ford • 5 hours ago",
      project: "Ford",
      timeAgo: "5 hours ago",
    },
    {
      id: "4",
      type: "due",
      title: "Due date approaching for Regulatory Compliance docs",
      subtitle: "Shell • 1 day ago",
      project: "Shell",
      timeAgo: "1 day ago",
    },
    {
      id: "5",
      type: "upload",
      title: "128 documents uploaded | Air Quality",
      subtitle: "Shell • 2 hours ago",
      project: "Shell",
      timeAgo: "2 hours ago",
    }
  ]);



  const handleViewDetails = () => {
    navigate(PATHS.scopeDetails);
  };

  const columns: ColumnsType<ScopeData> = useMemo(
    () => [
      {
        title: "Scope",
        dataIndex: "scope",
        key: "scope",
        width: "20%",
      },
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        width: "15%",
        render: (text: string, record: ScopeData) => (
          <span className={record.key === "4" ? "due-date-overdue" : ""}>{text}</span>
        ),
      },
      {
        title: "Assigned to",
        dataIndex: "assignedTo",
        key: "assignedTo",
        width: "20%",
        render: (assignedTo: ScopeData["assignedTo"]) => (
          <div className="assigned-to-cell">
            <Avatar src={assignedTo.avatar} size={26}>
              {assignedTo.name?.charAt(0)}
            </Avatar>
            <span className="assigned-name">{assignedTo.name}</span>
          </div>
        ),
      },
      {
        title: "Risk Assessment",
        dataIndex: "riskAssessment",
        key: "riskAssessment",
        width: "18%",
        render: (riskAssessment: ScopeData["riskAssessment"]) => (
          <div className="risk-assessment-cell">
            <span className={`risk-dot ${riskAssessment.level.toLowerCase()}`}></span>
            <span className="risk-level">{riskAssessment.level}</span>
          </div>
        ),
      },
      {
        title: "Red Flag",
        dataIndex: "redFlag",
        key: "redFlag",
        width: "12%",
        render: (redFlag: number, record: ScopeData) => (
          <Tooltip title={record.observationText || "No observation"}>
            <div className="red-flag-cell">
              <i className="erm-icon flag-icon" />
              <span className="flag-divider"></span>
              <span className="flag-count">{redFlag}</span>
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Open Comments",
        dataIndex: "openComments",
        key: "openComments",
        width: "15%",
        render: (openComments: number) => (
          <div className="open-comments-cell">
            <span className="comments-count">{openComments}</span>
          </div>
        ),
      },
      {
        title: "",
        key: "viewDetails",
        width: "10%",
        render: () => (
          <Button variant="outlined" shape="round" className="view-details-btn" onClick={handleViewDetails}>
            VIEW DETAILS
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="project-details-page-container">
      <div className="project-details-header">
        <div className="project-details-header-text-wrap">
          <span>shell</span>
          <p>
            Shell is a global energy company operating across exploration,
            production, refining, and low-carbon solutions. With a presence in
            over 70 countries, Shell supports industries with fuels, lubricants,
            and advanced energy technologies.
          </p>
        </div>
        <div className="project-details-header-breadcrumb">
          <span>Service</span>
          <Breadcrumb className="page-breadcrumb" separator={<i className="erm-icon breadcrumb-separator-icon"></i>}>
            <Breadcrumb.Item>Mergers & Acquisitions</Breadcrumb.Item>
            <Breadcrumb.Item>Private Markets ESG/Value Creation</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="project-details-wrap">
        <div className="project-table-matrix-wrap">
          <div className="flag-matrix-wrap">
            <div className="flag-count-wrap">
              <div className="flag-icon">
                <img src={IMAGES.redFlagIcon} alt="Red Flag" />
              </div>
              <div className="flag-text">Red Flags</div>
              <div className="flag-count">5</div>
            </div>
            <div className="risk-management-matrix-container">
              <div className="risk-management-header">
                Risk Assessment Matrix
                <span> 101 total risks identified</span>
              </div>
              <div className="risk-management-matrix-wrap">
                <div className="risk-management-matrix-text">Severity →</div>

                <div className="risk-management-matrix-grid">
                  {/* Empty cell for top-left corner */}
                  <div className="label-cell empty"></div>

                  {/* Column headers */}
                  <div className="label-cell col-header">Unlikely</div>
                  <div className="label-cell col-header">Possible</div>
                  <div className="label-cell col-header">Likely</div>
                  <div className="label-cell col-header">Certain</div>

                  {/* Row 1 - High */}
                  <div className="label-cell row-header">High</div>
                  <div className="risk-cell green-dark">
                    <span className="risk-number">7</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell yellow">
                    <span className="risk-number">12</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell red">
                    <span className="risk-number">15</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell red-dark">
                    <span className="risk-number">8</span>
                    <span className="risk-label">Risks</span>
                  </div>

                  {/* Row 2 - Medium */}
                  <div className="label-cell row-header">Medium</div>
                  <div className="risk-cell green-dark">
                    <span className="risk-number">5</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell yellow-light">
                    <span className="risk-number">3</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell red-light">
                    <span className="risk-number">0</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell orange">
                    <span className="risk-number">9</span>
                    <span className="risk-label">Risks</span>
                  </div>

                  {/* Row 3 - Low */}
                  <div className="label-cell row-header">Low</div>
                  <div className="risk-cell green-light">
                    <span className="risk-number">14</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell green-medium">
                    <span className="risk-number">8</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell green-teal">
                    <span className="risk-number">4</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell yellow-orange">
                    <span className="risk-number">5</span>
                    <span className="risk-label">Risks</span>
                  </div>

                  {/* Row 4 - Negligible */}
                  <div className="label-cell row-header">Negligible</div>
                  <div className="risk-cell green-pale">
                    <span className="risk-number">14</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell green-light">
                    <span className="risk-number">8</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell green-teal">
                    <span className="risk-number">4</span>
                    <span className="risk-label">Risks</span>
                  </div>
                  <div className="risk-cell green-bright">
                    <span className="risk-number">5</span>
                    <span className="risk-label">Risks</span>
                  </div>
                </div>
              </div>
              <div className="likelihood">Likelihood →</div>
            </div>
          </div>

          <div className="risk-management-table-wrap">
            <ScopeFilterBar isScopePage={true} />
            <Table<ScopeData>
              className="scope-table"
              columns={columns}
              dataSource={scopeData}
              pagination={false}
              rowKey="key"
            />
          </div>

        </div>
        <div className="recent-activity-wrap">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
