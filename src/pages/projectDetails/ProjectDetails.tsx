import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Table, Avatar, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IMAGES, PATHS } from "../../shared";
import { RecentActivity, ScopeFilterBar } from "../../component";
import { Activity } from "../../component/dashboard/recentActivity/RecentActivity";
import CustomPagination from "../../component/pagination/CustomPagination";
import { setSelectedProjectId } from "../../store/app/appSlice";
import { store } from "../../store/store";
import "./ProjectDetails.scss";

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

const PAGE_SIZE = 10;

const ProjectDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const projectId = (location.state as { projectId?: string })?.projectId ?? null;

  // Sync projectId from navigation state into Redux store
  useEffect(() => {
    if (projectId) {
      store.dispatch(setSelectedProjectId(projectId));
    }
  }, [projectId]);

  const [scopeData] = useState<ScopeData[]>([
    { key: "1", scope: "1. ESG Strategy", dueDate: "23/1/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Moderate", color: "yellow" }, redFlag: 3, openComments: 5, hasViewDetails: true },
    { key: "2", scope: "2. Organisation and Responsibility", dueDate: "2/2/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Very high", color: "red" }, redFlag: 0, openComments: 10, hasObservation: true, observationText: "Observation: Certain details could not be verified during the internal review process." },
    { key: "3", scope: "3. Policies and Business Ethics", dueDate: "23/1/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Low", color: "green" }, redFlag: 3, openComments: 3 },
    { key: "4", scope: "4. Disclosure and Reporting", dueDate: "23/1/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "High", color: "red" }, redFlag: 3, openComments: 6 },
    { key: "5", scope: "5. Risk Management & Assurance", dueDate: "15/2/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Moderate", color: "yellow" }, redFlag: 1, openComments: 4 },
    { key: "6", scope: "6. Customer Engagement", dueDate: "20/2/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Low", color: "green" }, redFlag: 0, openComments: 2 },
    { key: "7", scope: "7. Supply Chain Management", dueDate: "25/2/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "High", color: "red" }, redFlag: 2, openComments: 8 },
    { key: "8", scope: "8. Sustainable Products", dueDate: "1/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Moderate", color: "yellow" }, redFlag: 1, openComments: 5 },
    { key: "9", scope: "9. Labour Laws & Human Rights", dueDate: "5/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Very high", color: "red" }, redFlag: 4, openComments: 12 },
    { key: "10", scope: "10. Grievance Mechanisms and Monitoring", dueDate: "10/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Low", color: "green" }, redFlag: 0, openComments: 3 },
    { key: "11", scope: "11. Working Conditions & Terms of Employment", dueDate: "15/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Moderate", color: "yellow" }, redFlag: 2, openComments: 7 },
    { key: "12", scope: "12. Employee Engagement", dueDate: "20/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Low", color: "green" }, redFlag: 0, openComments: 4 },
    { key: "13", scope: "13. Diversity & Inclusion", dueDate: "25/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Moderate", color: "yellow" }, redFlag: 1, openComments: 6 },
    { key: "14", scope: "14. Stakeholder Engagement", dueDate: "30/3/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Low", color: "green" }, redFlag: 0, openComments: 3 },
    { key: "15", scope: "15. Energy Efficiency", dueDate: "5/4/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "High", color: "red" }, redFlag: 3, openComments: 9 },
    { key: "16", scope: "16. GHG Emissions & Carbon Footprint", dueDate: "10/4/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Very high", color: "red" }, redFlag: 5, openComments: 11 },
    { key: "17", scope: "17. Natural Hazards & Climate Change Risk", dueDate: "15/4/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Moderate", color: "yellow" }, redFlag: 2, openComments: 5 },
    { key: "18", scope: "18. Environmental Management", dueDate: "20/4/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "Low", color: "green" }, redFlag: 0, openComments: 4 },
    { key: "19", scope: "19. Health and Safety Management", dueDate: "25/4/2026", assignedTo: { name: "Sarah Chen", avatar: IMAGES.avatarImage }, riskAssessment: { level: "High", color: "red" }, redFlag: 2, openComments: 8 },
  ]);

  const paginatedScopeData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return scopeData.slice(start, start + PAGE_SIZE);
  }, [scopeData, currentPage]);

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
    navigate(PATHS.scopeDetails, { state: { projectId } });
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
          <span>Shell</span>
          <p>
            Shell is a global energy company operating across exploration,
            production, refining, and low-carbon solutions. With a presence in
            over 70 countries, Shell supports industries with fuels, lubricants,
            and advanced energy technologies.
          </p>
        </div>
        <div className="project-details-header-breadcrumb">
          <span>Service</span>
          <Breadcrumb 
            className="page-breadcrumb" 
            separator={<i className="erm-icon breadcrumb-separator-icon"></i>}
            items={[
              {
                title: "Mergers & Acquisitions",
              },
              {
                title: "Private Markets ESG/Value Creation",
              },
            ]}
          />
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
              dataSource={paginatedScopeData}
              rowKey="key"
              pagination={false}
            />
            <CustomPagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              total={scopeData.length}
              handlePagination={setCurrentPage}
              isHidePagination={scopeData.length <= PAGE_SIZE}
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
