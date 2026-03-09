import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Table, Avatar, Button } from "antd";
import SelectedSourcesDrawer from "../../component/selectedSourcesDrawer/SelectedSourcesDrawer";
import type { ColumnsType } from "antd/es/table";
import { IMAGES, PATHS } from "../../shared";
import { RecentActivity, ScopeFilterBar } from "../../component";
import { Activity } from "../../component/dashboard/recentActivity/RecentActivity";
import CustomPagination from "../../component/pagination/CustomPagination";
import { setSelectedProjectId } from "../../store/app/appSlice";
import { store } from "../../store/store";
import { useAppSelector } from "../../store/hooks";
import { getTopics, getVdrDocuments, getDocumentsByTopic, ITopic, IDocumentListItem } from "../../services/vdrAgent";
import { getSyncStatus } from "../../services/sharepoint";
import "./ProjectDetails.scss";

const PAGE_SIZE = 20;

const INGESTION_MESSAGES = [
  "Working on it...",
  "This may take a moment...",
  "Almost there...",
  "Hang tight...",
  "Getting things ready...",
  "Just a little longer...",
  "Still going...",
  "On it...",
];

const ProjectDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const reduxProjectId = useAppSelector((state) => state.app.selectedProjectId);
  const projectId = (location.state as { projectId?: string })?.projectId ?? reduxProjectId;
  const [isIngestDrawerOpen, setIsIngestDrawerOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestionMsgIndex, setIngestionMsgIndex] = useState(0);
  const ingestionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [vdrDocuments, setVdrDocuments] = useState<IDocumentListItem[]>([]);
  const [topicDocCounts, setTopicDocCounts] = useState<Record<string, number>>({});
  const [docDelta, setDocDelta] = useState<number | null>(null);
  const prevDocCountRef = useRef<number>(0);

  useEffect(() => {
    if (projectId) {
      store.dispatch(setSelectedProjectId(projectId));
    }
  }, [projectId]);

  const fetchTopicCounts = (topicList: ITopic[]) => {
    Promise.all(topicList.map((t) => getDocumentsByTopic(t.id, 1, 0))).then((results) => {
      const counts: Record<string, number> = {};
      topicList.forEach((t, i) => { counts[t.id] = results[i]?.total_count ?? 0; });
      setTopicDocCounts(counts);
    });
  };

  useEffect(() => {
    if (!projectId) return;
    getTopics(projectId).then((data) => {
      if (data) {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setTopics(sorted);
        fetchTopicCounts(sorted);
      }
    });
    getVdrDocuments(projectId).then((data) => {
      if (data) {
        prevDocCountRef.current = data.length;
        setVdrDocuments(data);
      }
    });
  }, [projectId]);

  // "completed" | "failed" | null — null means in-progress
  const [ingestionResult, setIngestionResult] = useState<"completed" | "failed" | null>(null);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [elapsedLabel, setElapsedLabel] = useState<string>("");
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (ingestionIntervalRef.current) {
      clearInterval(ingestionIntervalRef.current);
      ingestionIntervalRef.current = null;
    }
  };

  const formatElapsed = (since: Date): string => {
    const secs = Math.floor((Date.now() - since.getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr${hrs !== 1 ? "s" : ""} ago`;
  };

  const startElapsedTicker = (since: Date) => {
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    setElapsedLabel(formatElapsed(since));
    elapsedTimerRef.current = setInterval(() => {
      setElapsedLabel(formatElapsed(since));
    }, 10000);
  };

  const startSyncPolling = (pid: string) => {
    setIsIngesting(true);
    setIngestionMsgIndex(0);
    setIngestionResult(null);
    setCompletedAt(null);
    setElapsedLabel("");
    if (elapsedTimerRef.current) { clearInterval(elapsedTimerRef.current); elapsedTimerRef.current = null; }

    // Cycle messages every 5s
    const msgTimer = setInterval(() => {
      setIngestionMsgIndex((i) => (i + 1) % INGESTION_MESSAGES.length);
    }, 5000);

    // Poll sync status every 2s
    // Temporal WorkflowExecutionStatus: 1=RUNNING, 2=COMPLETED, 3=FAILED, 4=CANCELED, 5=TERMINATED
    const pollTimer = setInterval(async () => {
      const res = await getSyncStatus(pid);
      const status = res?.status;
      const isCompleted = status === "2" || status?.includes("COMPLETED");
      const isFailed = status === "3" || status === "4" || status === "5"
        || status?.includes("FAILED") || status?.includes("CANCELED") || status?.includes("TERMINATED");
      if (isCompleted) {
        clearInterval(msgTimer);
        clearInterval(pollTimer);
        ingestionIntervalRef.current = null;
        setIsIngesting(false);
        setIngestionResult("completed");
        const now = new Date();
        setCompletedAt(now);
        startElapsedTicker(now);
        // Refresh doc count and compute delta
        getVdrDocuments(pid).then((data) => {
          if (data) {
            const delta = data.length - prevDocCountRef.current;
            if (delta > 0) setDocDelta(delta);
            prevDocCountRef.current = data.length;
            setVdrDocuments(data);
          }
        });
        // Refresh per-topic matched counts
        if (topics.length > 0) fetchTopicCounts(topics);
      } else if (isFailed) {
        clearInterval(msgTimer);
        clearInterval(pollTimer);
        ingestionIntervalRef.current = null;
        setIsIngesting(false);
        setIngestionResult("failed");
        const now = new Date();
        setCompletedAt(now);
        startElapsedTicker(now);
      }
    }, 2000);

    // Store both timers — clear both on unmount
    ingestionIntervalRef.current = pollTimer;
    return () => { clearInterval(msgTimer); clearInterval(pollTimer); };
  };

  useEffect(() => {
    return () => {
      stopPolling();
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  const handleIngestClose = () => {
    setIsIngestDrawerOpen(false);
  };

  const handleIngestSelect = () => {
    setIsIngestDrawerOpen(false);
    if (projectId) startSyncPolling(projectId);
  };

  const handleRefreshDocs = () => {
    if (!projectId) return;
    getVdrDocuments(projectId).then((data) => {
      if (data) {
        const delta = data.length - prevDocCountRef.current;
        if (delta > 0) {
          setDocDelta(delta);
          setTimeout(() => setDocDelta(null), 8000);
        }
        prevDocCountRef.current = data.length;
        setVdrDocuments(data);
      }
    });
    if (topics.length > 0) fetchTopicCounts(topics);
  };

  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return topics.slice(start, start + PAGE_SIZE);
  }, [topics, currentPage]);

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

  const columns: ColumnsType<ITopic> = useMemo(
    () => [
      {
        title: "Scope",
        key: "name",
        width: "45%",
        render: (_: unknown, record: ITopic, index: number) => (
          <span>{(currentPage - 1) * PAGE_SIZE + index + 1}. {record.name}</span>
        ),
      },
      {
        title: "Assigned to",
        key: "assignedTo",
        width: "25%",
        render: () => (
          <div className="assigned-to-cell">
            <Avatar src={IMAGES.avatarImage} size={26} />
            <span className="assigned-name">Sarah Chen</span>
          </div>
        ),
      },
      {
        title: "Matched Documents",
        key: "matchedDocuments",
        width: "15%",
        render: (_: unknown, record: ITopic) => {
          const count = topicDocCounts[record.id] ?? 0;
          const total = vdrDocuments.length;
          return <span>{count}/{total}</span>;
        },
      },
      {
        title: "",
        key: "viewDetails",
        width: "15%",
        render: () => (
          <Button variant="outlined" shape="round" className="view-details-btn" onClick={handleViewDetails}>
            VIEW DETAILS
          </Button>
        ),
      },
    ],
    [vdrDocuments, topicDocCounts, currentPage]
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
              <div className="ingest-actions">
                {isIngesting && (
                  <span className="ingestion-status-msg">
                    <span className="ingestion-dot" />
                    {INGESTION_MESSAGES[ingestionMsgIndex]}
                  </span>
                )}
                {ingestionResult === "completed" && (
                  <span className="ingestion-status-msg ingestion-complete">
                    <span className="ingestion-dot dot-complete" />
                    Ingestion complete
                    {docDelta !== null && <span className="doc-delta-inline">+{docDelta} docs</span>}
                    {elapsedLabel && <span className="doc-delta-inline">{elapsedLabel}</span>}
                  </span>
                )}
                {ingestionResult === "failed" && (
                  <span className="ingestion-status-msg ingestion-failed">
                    <span className="ingestion-dot dot-failed" />
                    Ingestion failed
                    {elapsedLabel && <span className="ingestion-elapsed-failed">{elapsedLabel}</span>}
                  </span>
                )}
                <Button
                  className="primary-btn"
                  type="primary"
                  shape="round"
                  onClick={() => setIsIngestDrawerOpen(true)}>
                  <i className="erm-icon refresh-icon" /> INGEST
                </Button>
                <Button
                  type="text"
                  shape="circle"
                  className="refresh-icon-btn"
                  title="Refresh document counts"
                  onClick={handleRefreshDocs}>
                  <i className="erm-icon refresh-icon" />
                </Button>
              </div>
            </div>
            <Table<ITopic>
              className="scope-table"
              columns={columns}
              dataSource={paginatedTopics}
              rowKey="id"
              pagination={false}

            />
            <CustomPagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              total={topics.length}
              handlePagination={setCurrentPage}
              isHidePagination={topics.length <= PAGE_SIZE}
            />
          </div>
        </div>
        <div className="recent-activity-wrap">
          <RecentActivity activities={activities} />
        </div>
      </div>
      <SelectedSourcesDrawer
        open={isIngestDrawerOpen}
        onClose={handleIngestClose}
        projectId={projectId || ""}
        onSelect={handleIngestSelect}
      />
    </div>
  );
};

export default ProjectDetails;
