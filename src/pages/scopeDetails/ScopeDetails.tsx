import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Table, Tag } from "antd";
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
import SelectedSourcesDrawer from "../../component/selectedSourcesDrawer/SelectedSourcesDrawer";
import { useAppSelector } from "../../store/hooks";
import { getProjectDocuments } from "../../services/sharepoint";
import { getProjectDetails } from "../../services/projects";
import { IProjectDocument, ISharepointList } from "../../store/sharepoint/sharepoint.interface";
import { IDocumentListItem, getVdrDocuments } from "../../services/vdrAgent";

type RightPanelView = "comments" | "chat" | null;

const POLL_INTERVAL_MS = 12000;

const ScopeDetails = () => {
  const projectId = useAppSelector((state) => state.app.selectedProjectId);

  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
  const [isPdfViewerOpened, setIsPdfViewerOpened] = useState(false);

  const handleOpenReviewerModal = useCallback(() => {
    setIsReviewerModalOpen(true);
  }, []);

  const handleCloseReviewerModal = useCallback(() => {
    setIsReviewerModalOpen(false);
  }, []);

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

  const [isManageSyncOpen, setIsManageSyncOpen] = useState(false);

  const { projectDocuments, isProjectDocumentsLoading } = useAppSelector((state) => state.sharepoint);

  // VDR agent document data for status and fitment columns
  const [vdrDocuments, setVdrDocuments] = useState<IDocumentListItem[]>([]);

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId);
      getProjectDocuments(projectId);
    }
  }, [projectId]);

  // Polling useEffect — fetches vdr-agent document data every 12 seconds
  useEffect(() => {
    if (!projectId) return;

    const fetchVdrData = () => {
      getVdrDocuments(projectId).then((data) => {
        if (data !== undefined) setVdrDocuments(data);
      });
    };

    fetchVdrData(); // immediate fetch on mount / projectId change

    const intervalId = setInterval(fetchVdrData, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId); // cleanup prevents memory leak
  }, [projectId]);

  const handleFileClick = (item: IProjectDocument) => {
    if (item.is_folder) {
      // folder navigation - could be extended later
    } else {
      setIsPdfViewerOpened(true);
    }
  };

  const handleIngestToggle = () => {
    setIsManageSyncOpen(true);
  };

  const handleCloseManageSync = () => {
    setIsManageSyncOpen(false);
  };

  const handleSelectSources = (_selectedItems: ISharepointList[]) => {
    if (projectId) {
      getProjectDetails(projectId);
      getProjectDocuments(projectId);
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

  return (
    <>
      <div className="scope-page-container">
        <div className="inner-app-wrap">
          <div className="inner-app-row">
            {/* LEFT SIDEBAR */}
            <div className="scope-sidebar">
              <ScopeSidebar />
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
                onIngestToggle={handleIngestToggle}
              />

              <div className="scope-details-content">
                <ScopeFilterBar isScopePage={false} />

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
                      dataIndex: "fileSummary",
                      key: "fileSummary",
                      width: "20%",
                      render: () => <div className="table-two-line">-</div>,
                    },
                    {
                      title: "Scope Fitting",
                      dataIndex: "scopeFitting",
                      key: "scopeFitting",
                      width: "20%",
                      render: (_, record) => {
                        const vdrDoc = vdrDocuments.find((d) => d.id === record.id);
                        if (!vdrDoc) return <div className="table-two-line">-</div>;
                        return (
                          <div className="table-two-line">
                            {vdrDoc.fitment_done_count} / {vdrDoc.fitment_total_count}
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

      <SelectedSourcesDrawer
        open={isManageSyncOpen}
        onClose={handleCloseManageSync}
        projectId={projectId || ""}
        onSelect={handleSelectSources}
      />
    </>
  );
};

export default ScopeDetails;
