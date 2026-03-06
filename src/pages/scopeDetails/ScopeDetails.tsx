import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { App, Button, Progress, Table, Tag } from "antd";
import { useLocation } from "react-router-dom";
import { IMAGES } from "../../shared";
import type { Comment } from "../../component/scope/comments/Comments";
import {
  ScopeFilterBar,
  ScopeHeader,
  ScopeSidebar,
  Comments,
} from "../../component";
import "./ScopeDetails.scss";
import ChatPanel from "../../component/chat/chatPanel/ChatPanel";
import SelectReviewerModal from "../../component/scope/SelectReviewerModal/SelectReviewerModal";
import PdfViewerDrawer from "../../component/pdfViewerDrawer";
import { useAppSelector } from "../../store/hooks";
import { setSelectedProjectId } from "../../store/app/appSlice";
import { store } from "../../store/store";
import { getProjectDocuments } from "../../services/sharepoint";
import { getProjectDetails } from "../../services/projects";
import { IProjectDocument } from "../../store/sharepoint/sharepoint.interface";
import {
  IDocumentListItem,
  ITopicDocumentItem,
  ITopic,
  getVdrDocuments,
  getDocumentsByTopic,
  getDocumentScopes,
  getTopics,
  reclassifyTopic,
} from "../../services/vdrAgent";

type RightPanelView = "comments" | "chat" | null;

const POLL_INTERVAL_MS = 12000;

const CONFIDENCE_COLOR_MAP: Record<string, string> = {
  HIGH: "green",
  MEDIUM: "orange",
  LOW: "red",
};

const ScopeDetails = () => {
  const { message } = App.useApp();
  const location = useLocation();

  // Sync projectId from navigation state into Redux (ensures correct project even after refresh path)
  useEffect(() => {
    const navProjectId = (location.state as { projectId?: string })?.projectId;
    if (navProjectId) {
      store.dispatch(setSelectedProjectId(navProjectId));
    }
  }, [location.state]);

  const projectId = useAppSelector((state) => state.app.selectedProjectId);

  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
  const [isPdfViewerOpened, setIsPdfViewerOpened] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ITopic | null>(null);
  const [projectName, setProjectName] = useState<string>("");

  // Topic document state
  const [topicDocuments, setTopicDocuments] = useState<ITopicDocumentItem[]>([]);
  const [topicDocTotal, setTopicDocTotal] = useState(0);
  const [topicDocPage, setTopicDocPage] = useState(1);
  const [isTopicDocsLoading, setIsTopicDocsLoading] = useState(false);
  const [categorisationStatus, setCategorisationStatus] = useState<string | null>(null);
  const prevCategorisationStatus = useRef<string | null>(null);

  // Uncategorised documents state
  const [uncategorisedDocs, setUncategorisedDocs] = useState<IDocumentListItem[]>([]);

  const handleOpenReviewerModal = useCallback(() => {
    setIsReviewerModalOpen(true);
  }, []);

  const handleCloseReviewerModal = useCallback(() => {
    setIsReviewerModalOpen(false);
  }, []);

  const handleReclassify = useCallback(async () => {
    if (!selectedTopic) return;
    try {
      const result = await reclassifyTopic(selectedTopic.id);
      if (result) {
        message.success("Re-classification started.");
        setCategorisationStatus("processing");
      }
    } catch (err: any) {
      if (err?.message?.includes("already in progress")) {
        message.error("Re-classification already in progress.");
      } else {
        message.error("Failed to start re-classification.");
      }
    }
  }, [selectedTopic, message]);

  const [rightPanelView, setRightPanelView] = useState<RightPanelView>(null);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Chen",
      text: "There are no applicable regulatory criteria against which these direct GHG",
      timestamp: "26/11/25, 2:47 PM",
      avatar: "S",
      replies: [],
      isResolved: false,
    },
  ]);

  const { projectDocuments, isProjectDocumentsLoading } = useAppSelector((state) => state.sharepoint);

  // VDR agent document data for status and fitment columns
  const [vdrDocuments, setVdrDocuments] = useState<IDocumentListItem[]>([]);


  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId).then((details) => {
        if (details?.name) setProjectName(details.name);
      });
      getProjectDocuments(projectId);
      getTopics(projectId).then((data) => {
        const topics = data ?? [];
        if (topics.length > 0) setSelectedTopic(topics[0]);
      });
    }
  }, [projectId]);

  // Reset page and clear topic docs when topic changes
  useEffect(() => {
    setTopicDocPage(1);
    setTopicDocuments([]);
    setTopicDocTotal(0);
    setCategorisationStatus(null);
    prevCategorisationStatus.current = null;
  }, [selectedTopic]);

  // Fetch topic documents when selectedTopic or topicDocPage changes
  useEffect(() => {
    if (!selectedTopic) return;
    // Sentinel guard: skip API call for the uncategorised virtual topic
    if (selectedTopic.id === "__uncategorised__") return;

    const fetchTopicDocs = async () => {
      setIsTopicDocsLoading(true);
      try {
        const res = await getDocumentsByTopic(selectedTopic.id, 20, (topicDocPage - 1) * 20);
        if (res !== undefined) {
          setTopicDocuments(res.documents);
          setTopicDocTotal(res.total_count);
        }
      } finally {
        setIsTopicDocsLoading(false);
      }
    };

    fetchTopicDocs();
  }, [selectedTopic, topicDocPage]);

  // Polling useEffect — fetches vdr-agent document data every 12 seconds
  useEffect(() => {
    if (!projectId) return;

    const fetchVdrData = async () => {
      const data = await getVdrDocuments(projectId);
      if (data !== undefined) setVdrDocuments(data);

      // If a real topic is selected (not the uncategorised sentinel), refresh topic docs and categorisation status
      if (selectedTopic && selectedTopic.id !== "__uncategorised__") {
        // Re-fetch topic documents on each poll cycle
        const topicRes = await getDocumentsByTopic(selectedTopic.id, 20, (topicDocPage - 1) * 20);
        if (topicRes !== undefined) {
          setTopicDocuments(topicRes.documents);
          setTopicDocTotal(topicRes.total_count);
        }

        // Check categorisation_status from any document's scopes endpoint
        if (data && data.length > 0) {
          const scopesRes = await getDocumentScopes(data[0].id);
          if (scopesRes !== undefined) {
            const newStatus = scopesRes.categorisation_status;
            // Detect transition from processing -> done and show toast
            if (
              prevCategorisationStatus.current === "processing" &&
              newStatus === "done"
            ) {
              message.success("Classification complete");
            }
            prevCategorisationStatus.current = newStatus;
            setCategorisationStatus(newStatus);
          }
        }
      }

      // Compute uncategorised documents via parallel getDocumentScopes calls (capped at 100)
      // Runs on every poll cycle regardless of selectedTopic so the count stays fresh in the sidebar
      if (data && data.length > 0) {
        const doneDocs = data.filter(d => d.summary_status === "done");
        const capped = doneDocs.slice(0, 100);
        const scopeResults = await Promise.all(
          capped.map(doc => getDocumentScopes(doc.id))
        );
        const uncategorised = capped.filter((_doc, idx) => {
          const res = scopeResults[idx];
          if (!res) return false;
          return (
            res.categorisation_status === "uncategorised" ||
            (res.scopes.length === 0 && res.categorisation_status === "done")
          );
        });
        setUncategorisedDocs(uncategorised);
      }
    };

    fetchVdrData(); // immediate fetch on mount / projectId change

    const intervalId = setInterval(fetchVdrData, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId); // cleanup prevents memory leak
  }, [projectId, selectedTopic, topicDocPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileClick = (item: IProjectDocument) => {
    if (item.is_folder) {
      // folder navigation - could be extended later
    } else {
      setIsPdfViewerOpened(true);
    }
  };

  const isRightPanelOpen = rightPanelView !== null;
  const isCommentsOpen = rightPanelView === "comments";
  const isChatOpen = rightPanelView === "chat";

  const handleCommentsToggle = () => {
    if (rightPanelView === "comments") {
      setRightPanelView(null);
    } else {
      setRightPanelView("comments");
    }
  };

  const handleChatToggle = () => {
    if (rightPanelView === "chat") {
      setRightPanelView(null);
    } else {
      setRightPanelView("chat");
    }
  };

  const handleClosePanel = () => {
    setRightPanelView(null);
  };

  const handleRowSelectionChange = useCallback(
    (_selectedRowKeys: React.Key[], _selectedRows: IProjectDocument[]) => {
      // selection handler — extend in future plans
    },
    [],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 300;
      const maxWidth = 800;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setRightPanelWidth(newWidth);
      }
    },
    [isResizing],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const rowSelection = useMemo(
    () => ({
      onChange: handleRowSelectionChange,
    }),
    [handleRowSelectionChange],
  );

  const handleSubmitReviewer = (reviewer: unknown) => {
    void reviewer;
    setIsReviewerModalOpen(false);
  };

  const isCategorisingInProgress =
    categorisationStatus === "pending" || categorisationStatus === "processing";

  const renderMainTable = () => {
    // Branch 1: Uncategorised virtual topic — simplified 3-column table
    if (selectedTopic?.id === "__uncategorised__") {
      return (
        <Table<IDocumentListItem>
          className="files-table"
          columns={[
            {
              title: "Document",
              key: "document",
              width: "30%",
              render: (_, record) => (
                <div className="file-title">
                  <div className="file-icon">
                    <img
                      src={
                        record.file_type?.includes("spreadsheet")
                          ? IMAGES.xlsIcon
                          : IMAGES.pdfIcon
                      }
                      alt="file"
                    />
                  </div>
                  <div className="file-content">
                    <div className="file-name">{record.file_name}</div>
                    <div className="file-path">{record.file_path}</div>
                  </div>
                </div>
              ),
            },
            {
              title: "Status",
              key: "status",
              width: "15%",
              render: (_, record) => {
                const status = record.summary_status ?? "pending";
                const colorMap: Record<string, string> = {
                  pending: "default",
                  processing: "processing",
                  done: "success",
                  failed: "error",
                  uncategorised: "warning",
                };
                return <Tag color={colorMap[status] ?? "default"}>{status}</Tag>;
              },
            },
            {
              title: "File Summary",
              key: "summary",
              width: "55%",
              render: (_, record) => {
                const text = record.summary_text;
                if (!text) return <div className="table-two-line">-</div>;
                const truncated = text.length > 120 ? text.slice(0, 120) + "\u2026" : text;
                return <div className="table-two-line" title={text}>{truncated}</div>;
              },
            },
          ]}
          dataSource={uncategorisedDocs}
          rowKey="id"
          tableLayout="fixed"
          pagination={false}
          locale={{ emptyText: "No uncategorised documents." }}
        />
      );
    }

    // Branch 2: Real topic selected — topic-filtered table with Confidence and Justification
    if (selectedTopic) {
      return (
        <Table<ITopicDocumentItem>
          loading={isTopicDocsLoading}
          className="files-table"
          columns={[
            {
              title: "Document",
              key: "document",
              width: "25%",
              render: (_, record) => (
                <div className="file-title">
                  <div className="file-icon">
                    <img
                      src={
                        record.file_type?.includes("spreadsheet")
                          ? IMAGES.xlsIcon
                          : IMAGES.pdfIcon
                      }
                      alt="file"
                    />
                  </div>
                  <div className="file-content">
                    <div className="file-name">{record.file_name}</div>
                    <div className="file-path">{record.file_path}</div>
                  </div>
                </div>
              ),
            },
            {
              title: "Status",
              key: "status",
              width: 130,
              className: "text-align-right",
              render: (_, record) => {
                const vdrDoc = vdrDocuments.find((d) => d.id === record.document_id);
                const status = vdrDoc?.summary_status ?? "pending";
                const colorMap: Record<string, string> = {
                  pending: "default",
                  processing: "processing",
                  done: "success",
                  failed: "error",
                };
                return <Tag color={colorMap[status] ?? "default"}>{status}</Tag>;
              },
            },
            {
              title: "File Summary",
              key: "fileSummary",
              width: "20%",
              render: (_, record) => {
                const text = record.summary_text;
                if (!text) return <div className="table-two-line">-</div>;
                const truncated = text.length > 120 ? text.slice(0, 120) + "…" : text;
                return (
                  <div className="table-two-line" title={text}>
                    {truncated}
                  </div>
                );
              },
            },
            {
              title: "Scope Matching Confidence",
              key: "confidence",
              width: 110,
              render: (_, record) => (
                <Tag color={CONFIDENCE_COLOR_MAP[record.confidence] ?? "default"}>
                  {record.confidence}
                </Tag>
              ),
            },
            {
              title: "Scope Matching Justification",
              key: "justification",
              render: (_, record) => {
                const text = record.justification;
                if (!text) return <div className="table-two-line">-</div>;
                return (
                  <div className="table-two-line" title={text}>
                    {text}
                  </div>
                );
              },
            },
          ]}
          dataSource={topicDocuments}
          rowKey="document_id"
          tableLayout="fixed"
          expandable={{
            expandedRowRender: (record: ITopicDocumentItem) => (
              <div className="expanded-justification">
                <p>
                  <strong>Full Justification:</strong>
                </p>
                <p>{record.justification || "No justification available."}</p>
              </div>
            ),
            expandIcon: () => null,
            expandRowByClick: true,
          }}
          pagination={{
            current: topicDocPage,
            pageSize: 20,
            total: topicDocTotal,
            onChange: (page: number) => setTopicDocPage(page),
            showSizeChanger: false,
          }}
          locale={{
            emptyText: isCategorisingInProgress
              ? "Classification in progress..."
              : "No documents classified under this topic yet.",
          }}
        />
      );
    }

    // Branch 3: Default — all project documents table
    return (
      <Table<IProjectDocument>
        loading={isProjectDocumentsLoading}
        className="files-table"
        rowSelection={rowSelection}
        columns={[
          {
            title: "Document",
            dataIndex: "name",
            key: "name",
            width: "30%",
            render: (_, record) => (
              <div className="file-title cursor-pointer" onClick={() => handleFileClick(record)}>
                <div className="file-icon">
                  <img src={record.is_folder ? IMAGES.sourceFolderIcon : record.file_type?.includes("spreadsheet") ? IMAGES.xlsIcon : IMAGES.pdfIcon} alt="file" />
                </div>
                <div className="file-content">
                  <div className="file-name">{record.name}</div>
                  <div className="file-path">{record.file_path}</div>
                </div>
              </div>
            ),
          },
          {
            title: "Status",
            key: "status",
            width: 160,
            className: "text-align-right",
            render: (_, record) => {
              const vdrDoc = vdrDocuments.find((d) => d.id === record.id);
              const status = vdrDoc?.summary_status ?? "pending";
              const colorMap: Record<string, string> = {
                pending: "default",
                processing: "processing",
                done: "success",
                failed: "error",
              };
              return <Tag color={colorMap[status] ?? "default"}>{status}</Tag>;
            },
          },
          {
            title: "File Summary",
            key: "fileSummary",
            width: "20%",
            render: (_, record) => {
              const vdrDoc = vdrDocuments.find((d) => d.id === record.id);
              const text = vdrDoc?.summary_text;
              if (!text) return <div className="table-two-line">-</div>;
              const truncated = text.length > 120 ? text.slice(0, 120) + "…" : text;
              return (
                <div className="table-two-line" title={text}>
                  {truncated}
                </div>
              );
            },
          },
        ]}
        dataSource={projectDocuments}
        rowKey="id"
        tableLayout="fixed"
        pagination={false}
      />
    );
  };

  return (
    <>
      <div className="scope-page-container">
        <div className="inner-app-wrap">
          <div className="inner-app-row">
            {/* LEFT SIDEBAR */}
            <div className="scope-sidebar">
              <ScopeSidebar
                onTopicSelect={setSelectedTopic}
                uncategorisedCount={uncategorisedDocs.length}
              />
            </div>

            {/* MAIN CONTENT */}
            <div className={`content ${isRightPanelOpen ? "panel-open" : ""}`}>
              <ScopeHeader
                isScopePage={true}
                isCommentsOpen={isCommentsOpen}
                isChatOpen={isChatOpen}
                onCommentsToggle={handleCommentsToggle}
                onChatToggle={handleChatToggle}
                onOpenReviewerModal={handleOpenReviewerModal}
                selectedTopic={selectedTopic}
                onTopicUpdate={setSelectedTopic}
                isReclassifying={categorisationStatus === "processing"}
                onReclassify={handleReclassify}
                projectName={projectName}
              />

              <div className="scope-details-content">
                <ScopeFilterBar isScopePage={false} />

                {/* Categorisation progress banner — shown while classification is running */}
                {selectedTopic && isCategorisingInProgress && (
                  <div className="categorisation-banner">
                    <span>Classifying documents...</span>
                    <Progress percent={0} status="active" showInfo={false} strokeColor="#82A78D" />
                  </div>
                )}

                {renderMainTable()}
              </div>
            </div>

            {/* RIGHT PANEL (COMMENTS OR CHAT) */}
            {isRightPanelOpen && (
              <div
                className={`right-panel ${isRightPanelOpen ? "open" : ""} ${isResizing ? "resizing" : ""
                  }`}
                style={{ width: `${rightPanelWidth}px` }}>
                <div className="right-panel-resizer" onMouseDown={handleMouseDown} />
                <div className="right-panel-header">
                  <h3 className="right-panel-title">
                    {isCommentsOpen ? "Comments" : isChatOpen ? "Chat" : ""}
                  </h3>
                  <Button
                    type="text"
                    className="close-btn"
                    onClick={handleClosePanel}
                    aria-label="Close Panel">
                    <i className="erm-icon close-icon" />
                  </Button>
                </div>
                <div className="right-panel-content">
                  {isCommentsOpen && (
                    <Comments comments={comments} onCommentsChange={setComments} />
                  )}
                  {isChatOpen && (
                    <ChatPanel
                      title="Deal Room AI"
                      subtitle="Leverage Request files to ask queries"
                      className="scope-chat-panel"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      <SelectReviewerModal
        open={isReviewerModalOpen}
        onClose={handleCloseReviewerModal}
        handleSubmit={handleSubmitReviewer}
      />
      <PdfViewerDrawer
        onClose={() => setIsPdfViewerOpened(false)}
        open={isPdfViewerOpened}
        pdfUrl="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
      />

    </>
  );
};

export default ScopeDetails;
