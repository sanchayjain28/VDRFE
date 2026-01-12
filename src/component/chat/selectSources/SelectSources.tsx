import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Input, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { IMAGES } from "../../../shared";
import SourcesTableLoading from "./SourcesTableLoading";

// Local types
interface ISourceProjectDoc {
  id: string;
  file_name: string;
  file_path?: string;
  file_type?: string;
}

// Simple helper function
const getFileIcon = (fileType?: string): string => {
  if (fileType === "pdf" || fileType?.toLowerCase().includes("pdf")) {
    return IMAGES.pdfIcon;
  }
  if (fileType === "xls" || fileType?.toLowerCase().includes("xls")) {
    return IMAGES.xlsIcon;
  }
  return IMAGES.pdfIcon; // default
};

interface SelectSourcesProps {
  open: boolean;
  onClose: () => void;
  selectedProjectId?: string | null;
  selectedContextIds?: { project: string[]; knowledge: string[] };
  onContextIdsChange?: (contextIds: { project: string[]; knowledge: string[] }) => void;
}

type TabKey = "project" | "knowledge";

const SelectSources: React.FC<SelectSourcesProps> = ({
  open,
  onClose,
  selectedProjectId = null,
  selectedContextIds = { project: [], knowledge: [] },
  onContextIdsChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("knowledge");

  const [selectedFiles, setSelectedFiles] = useState<Record<TabKey, string[]>>({
    project: [],
    knowledge: [],
  });

  const [projectFiles, setProjectFiles] = useState<ISourceProjectDoc[]>([]);
  const [knowledgeFiles, setKnowledgeFiles] = useState<ISourceProjectDoc[]>([]);
  const [isLoading, setIsLoading] = useState<Record<TabKey, boolean>>({
    project: false,
    knowledge: false,
  });

  useEffect(() => {
    setSelectedFiles(selectedContextIds);
  }, [selectedContextIds]);

  useEffect(() => {
    if (open) {
      // Simulate loading and provide empty data (no API calls)
      setIsLoading({ project: true, knowledge: true });

      // Simulate API delay
      setTimeout(() => {
        // No API calls - using empty arrays
        setKnowledgeFiles([]);
        setProjectFiles([]);
        setIsLoading({ project: false, knowledge: false });
      }, 500);
    } else {
      // Reset when drawer closes
      setProjectFiles([]);
      setKnowledgeFiles([]);
      setSelectedFiles({ project: [], knowledge: [] });
    }
  }, [open, selectedProjectId]);

  const columns = [
    {
      title: "Title",
      dataIndex: "file_name",
      key: "title",
      width: "50%",
      render: (_: string, row: ISourceProjectDoc) => (
        <div className="file-info">
          <div className="doc-icon">
            <img src={getFileIcon(row?.file_type)} alt={"file"} />
          </div>
          <div className="file-title">
            <span className="file-title-text">{row?.file_name}</span>
            <span className="status active" hidden>
              <span className="status-icon" /> Active
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "SharePoint File Path",
      dataIndex: "file_path",
      key: "sharepointFilePath",
      render: (text: string, row: ISourceProjectDoc) => (
        <div className="file-path">{text ? text : `ERM/${row?.file_name}`}</div>
      ),
    },
  ];

  /* ------------------ ROW SELECTION ------------------ */
  const getRowSelection = (tab: TabKey) => ({
    selectedRowKeys: selectedFiles[tab],
    onChange: (keys: React.Key[]) => {
      setSelectedFiles((prev) => ({
        ...prev,
        [tab]: keys,
      }));
    },
  });

  const renderTable = (tab: TabKey) => {
    const files = tab === "project" ? projectFiles : knowledgeFiles;
    const loading = isLoading[tab];

    return (
      <Card
        className={`global-table-card ${!loading && files?.length === 0 ? "no-files-card" : ""}`}>
        {loading ? (
          <SourcesTableLoading skeletonLength={8} />
        ) : files?.length > 0 ? (
          <Table
            className="global-table"
            columns={columns}
            dataSource={files}
            rowSelection={getRowSelection(tab)}
            tableLayout="fixed"
            scroll={{ y: "calc(100vh - 240px)" }}
            pagination={false}
            rowKey="id"
          />
        ) : (
          <div className="no-record">No files available</div>
        )}
      </Card>
    );
  };

  const handleSubmit = () => {
    if (onContextIdsChange) {
      onContextIdsChange({
        project: selectedFiles.project,
        knowledge: selectedFiles.knowledge,
      });
    }
    onClose();
  };

  const totalSelected = selectedFiles.project.length + selectedFiles.knowledge.length;

  return (
    <Drawer className="source-drawer" width={549} closable={false} open={open} onClose={onClose}>
      {/* HEADER */}
      <div className="drawer-header">
        <div className="title">Sources</div>
        <div className="header-right">
          <Input
            className="header-search"
            placeholder="Search…"
            prefix={<i className="erm-icon search-icon" />}
            allowClear
          />
          <button className="close-btn" onClick={onClose}>
            <i className="erm-icon drawer-close-icon" />
          </button>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
        className="custom-tabs">
        {selectedProjectId && (
          <Tabs.TabPane
            tab={
              <>
                Project Files
                <span className="tab-count">
                  {activeTab === "project" && projectFiles?.length > 0
                    ? `(${projectFiles?.length})`
                    : null}
                </span>
              </>
            }
            key="project">
            {renderTable("project")}
          </Tabs.TabPane>
        )}

        <Tabs.TabPane
          tab={
            <>
              Knowledge Files
              <span className="tab-count">
                {activeTab === "knowledge" && knowledgeFiles?.length > 0
                  ? `(${knowledgeFiles?.length})`
                  : null}
              </span>
            </>
          }
          key="knowledge">
          {renderTable("knowledge")}
        </Tabs.TabPane>
      </Tabs>

      {/* FOOTER */}
      <div className="drawer-footer">
        <div className="drawer-footer-left">
          <span className="row-selected-count" hidden={!totalSelected}>
            {totalSelected} selected
          </span>
        </div>
        <div className="drawer-footer-right">
          <Button shape="round" className="secondary-btn" onClick={onClose}>
            Cancel
          </Button>
          <Button
            shape="round"
            type="primary"
            className="primary-btn"
            onClick={handleSubmit}
            disabled={totalSelected === 0}>
            Select <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default SelectSources;
