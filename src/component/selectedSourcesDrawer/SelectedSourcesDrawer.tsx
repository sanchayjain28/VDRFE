import React, { useState } from "react";
import { Drawer, Input, Breadcrumb, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { IMAGES } from "../../shared";
import "./SelectedSourcesDrawer.scss";
import Table, { ColumnsType } from "antd/es/table";

interface DocumentItem {
  key: string;
  title: string;
  sharePointPath: string;
  lastSynced: string;
  isFolder?: boolean;
}

interface SelectedSourcesDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (selectedItems: DocumentItem[]) => void;
}

const SelectedSourcesDrawer: React.FC<SelectedSourcesDrawerProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const documents: DocumentItem[] = [
    {
      key: "1",
      title: "ESG Reports",
      sharePointPath: "ERM > Communities > Marine",
      lastSynced: "20/01/2024\n2:30 pm",
      isFolder: true,
    },
    {
      key: "2",
      title: "Compliance Files",
      sharePointPath: "ERM > Communities > Marine",
      lastSynced: "18/01/2024\n11:15 am",
      isFolder: true,
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleCancel = () => {
    setSelectedRowKeys([]);
    onClose();
  };

  const handleSelect = () => {
    const selected = documents.filter((doc) => selectedRowKeys.includes(doc.key));
    onSelect?.(selected);
    setSelectedRowKeys([]);
    onClose();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns: ColumnsType<DocumentItem> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div className="file-title">
          <div className="file-icon">
            <img src={IMAGES.sourceFolderIcon} alt="Folder" />
          </div>
          <div className="file-content">
            <div className="file-name">{record.title}</div>
            <div className="file-path">Folder</div>
            <i className="erm-icon next-icon" />
          </div>
        </div>
      ),
    },
    {
      title: "Sharepoint File Path",
      dataIndex: "sharePointPath",
      key: "sharePointPath",
    },
    {
      title: "Last Synced",
      dataIndex: "lastSynced",
      key: "lastSynced",
      render: (text: string) => (
        <>
          {text.split("\n").map((line, i) => (
            <div className="table-date" key={i}>
              {line}
            </div>
          ))}
        </>
      ),
    },
  ];

  return (
    <Drawer
      className="selected-sources-drawer"
      closeIcon={<i className="erm-icon close-icon" />}
      title={
        <div className="drawer-header">
          <div className="header-top">
            <h2>Select Sources</h2>
            <div className="sidebar-search-wrapper">
              <button type="button" className="status-trigger" aria-label="Filter by status">
                <i className="erm-icon filter-icon"></i>
              </button>
              <Input
                placeholder="Search..."
                prefix={<i className="erm-icon search-icon" />}
                className="quick-search"
              />
            </div>
          </div>
          <Breadcrumb
            className="breadcrumb"
            separator={<i className="erm-icon next-icon" />}
            items={[{ title: "ERM" }, { title: "Communities" }, { title: "Marine" }]}
          />
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={550}
      footer={
        <div className="drawer-footer">
          <div className="selected-count">
            <CloseOutlined className="clear-icon" onClick={() => setSelectedRowKeys([])} />
            <span>{selectedRowKeys.length} selected</span>
          </div>
          <div className="footer-actions">
            <Button className="secondary-btn" shape="round" onClick={handleCancel}>
              CANCEL
            </Button>

            <Button
              className="primary-btn"
              shape="round"
              disabled={selectedRowKeys.length === 0}
              onClick={handleSelect}>
              SELECT <i className="erm-icon arrow-right-icon" />
            </Button>
          </div>
        </div>
      }>
      <div className="sources-content">
        <Table<DocumentItem>
          className="sources-table"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={documents}
          pagination={false}
          rowKey="key"
        />
      </div>
    </Drawer>
  );
};

export default SelectedSourcesDrawer;
