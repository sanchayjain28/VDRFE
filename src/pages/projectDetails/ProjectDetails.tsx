import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Table, Avatar, Button, Spin } from "antd";
import SelectedSourcesDrawer from "../../component/selectedSourcesDrawer/SelectedSourcesDrawer";
import type { ColumnsType } from "antd/es/table";
import { IMAGES, PATHS } from "../../shared";
import { RecentActivity, ScopeFilterBar } from "../../component";
import { Activity } from "../../component/dashboard/recentActivity/RecentActivity";
import CustomPagination from "../../component/pagination/CustomPagination";
import { setSelectedProjectId } from "../../store/app/appSlice";
import { store } from "../../store/store";
import { useAppSelector } from "../../store/hooks";
import { getTopics } from "../../services/vdrAgent";
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
}

const PAGE_SIZE = 10;

const ProjectDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const reduxProjectId = useAppSelector((state) => state.app.selectedProjectId);
  const projectId = (location.state as { projectId?: string })?.projectId ?? reduxProjectId;
  const [isIngestDrawerOpen, setIsIngestDrawerOpen] = useState(false);

  // Sync projectId from navigation state into Redux store
  useEffect(() => {
    if (projectId) {
      store.dispatch(setSelectedProjectId(projectId));
    }
  }, [projectId]);

  const [scopeData, setScopeData] = useState<ScopeData[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);

  // Fetch topics from API
  useEffect(() => {
    if (!projectId) return;
    setIsTopicsLoading(true);
    getTopics(projectId)
      .then((topics) => {
        const data: ScopeData[] = (topics ?? []).map((topic, index) => ({
          key: topic.id,
          scope: `${index + 1}. ${topic.name}`,
          dueDate: "",
          assignedTo: { name: "", avatar: IMAGES.avatarImage },
          riskAssessment: { level: "-", color: "green" as const },
        }));
        setScopeData(data);
      })
      .finally(() => setIsTopicsLoading(false));
  }, [projectId]);

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
          <div className="risk-management-table-wrap">
            <div className="table-top-bar">
              <ScopeFilterBar isScopePage={true} />
              <Button
                className="primary-btn"
                type="primary"
                shape="round"
                onClick={() => setIsIngestDrawerOpen(true)}>
                <i className="erm-icon refresh-icon" /> INGEST
              </Button>
            </div>
            <Table<ScopeData>
              className="scope-table"
              columns={columns}
              dataSource={paginatedScopeData}
              rowKey="key"
              pagination={false}
              loading={isTopicsLoading}
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
      <SelectedSourcesDrawer
        open={isIngestDrawerOpen}
        onClose={() => setIsIngestDrawerOpen(false)}
        projectId={projectId || ""}
        onSelect={() => {}}
      />
    </div>
  );
};

export default ProjectDetails;
