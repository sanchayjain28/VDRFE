import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Drawer, Input, Breadcrumb, Button, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { IMAGES } from "../../shared";
import { useAppSelector } from "../../store/hooks";
import { getSharePointList, syncProject } from "../../services/sharepoint";
import { updateProjectSources } from "../../services/projects";
import type { ISharepointList, ISource } from "../../store/sharepoint/sharepoint.interface";
import "./SelectedSourcesDrawer.scss";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SelectedSourcesDrawerProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSelect?: (selectedItems: ISharepointList[]) => void;
}

const SelectedSourcesDrawer: React.FC<SelectedSourcesDrawerProps> = ({
  open,
  onClose,
  projectId,
  onSelect,
}) => {
  const { SharePointList, isSharepointListLoading, syncedFiles } = useAppSelector(
    (state) => state.sharepoint,
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: "Root", path: "/" }]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Build a set of already-synced item IDs and paths for matching
  const syncedItemIds = useMemo(() => new Set(syncedFiles.map((f) => f.id)), [syncedFiles]);
  const syncedItemPaths = useMemo(() => new Set(syncedFiles.map((f) => f.path)), [syncedFiles]);

  const isItemSynced = useCallback(
    (item: ISharepointList) => {
      if (syncedItemIds.has(item.id)) return true;
      if (syncedItemPaths.has(item.path)) return true;
      // Check if item is a child of a synced folder
      return syncedFiles.some(
        (sf) => sf.is_folder && item.path.startsWith(sf.path + "/"),
      );
    },
    [syncedFiles, syncedItemIds, syncedItemPaths],
  );

  useEffect(() => {
    if (open) {
      setBreadcrumbs([{ name: "Root", path: "/" }]);
      getSharePointList("/", false);
    }
  }, [open]);

  // Pre-check already-synced items when SharePoint list loads
  useEffect(() => {
    if (open && SharePointList.length > 0 && syncedFiles.length > 0) {
      const syncedKeys = SharePointList.filter((item) => isItemSynced(item)).map((item) => item.id);
      setSelectedRowKeys((prev) => {
        // Merge: keep user's manual selections + add synced ones
        const merged = new Set([...prev, ...syncedKeys]);
        return [...merged];
      });
    }
  }, [open, SharePointList, syncedFiles, isItemSynced]);

  const handleFolderClick = (item: ISharepointList) => {
    const newPath = item.path;
    const pathParts = newPath.split("/").filter(Boolean);
    const newBreadcrumbs: BreadcrumbItem[] = [{ name: "Root", path: "/" }];
    let currentBuildPath = "";
    pathParts.forEach((part) => {
      currentBuildPath += `/${part}`;
      newBreadcrumbs.push({ name: part, path: currentBuildPath });
    });
    setBreadcrumbs(newBreadcrumbs);
    getSharePointList(newPath, false);
  };

  const handleBreadcrumbClick = (path: string) => {
    const index = breadcrumbs.findIndex((b) => b.path === path);
    if (index !== -1) {
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
    getSharePointList(path, false);
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    onClose();
  };

  const handleSelect = async () => {
    // Get all selected items from the current SharePoint list
    const selected = SharePointList.filter((item) => selectedRowKeys.includes(item.id));

    // Build sources array: include previously synced + newly selected
    const allSources: ISource[] = [
      // Keep existing synced sources that aren't in current view
      ...syncedFiles
        .filter((sf) => !SharePointList.some((sp) => sp.id === sf.id))
        .map((sf) => ({
          type: (sf.is_folder ? "folder" : "file") as "folder" | "file",
          path: sf.path,
          recursive: sf.is_folder,
          file_pattern: "*",
          id: sf.id,
          last_modified_datetime: sf.last_modified_datetime || null,
          mime_type: sf.mime_type || null,
          name: sf.name || null,
          size: sf.size || null,
          web_url: sf.web_url || null,
        })),
      // Add all selected items from current view
      ...selected.map((item) => ({
        type: (item.is_folder ? "folder" : "file") as "folder" | "file",
        path: item.path,
        recursive: item.is_folder,
        file_pattern: "*",
        id: item.id,
        last_modified_datetime: item.last_modified_datetime || null,
        mime_type: item.mime_type || null,
        name: item.name || null,
        size: item.size || null,
        web_url: item.web_url || null,
      })),
    ];

    setIsSyncing(true);
    // Save sources to project via PATCH
    await updateProjectSources(projectId, allSources);
    // Trigger sync workflow
    await syncProject(projectId);
    setIsSyncing(false);
    onSelect?.(selected);
    setSelectedRowKeys([]);
    onClose();
  };

  // Count of newly selected items (not already synced)
  const newSelectedCount = useMemo(() => {
    return selectedRowKeys.filter((key) => !syncedItemIds.has(key as string)).length;
  }, [selectedRowKeys, syncedItemIds]);

  const columns: ColumnsType<ISharepointList> = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div
          className="file-title"
          style={record.is_folder ? { cursor: "pointer" } : {}}
          onClick={() => record.is_folder && handleFolderClick(record)}
        >
          <div className="file-icon">
            <img
              src={
                record.is_folder
                  ? IMAGES.sourceFolderIcon
                  : record.mime_type?.includes("spreadsheet")
                    ? IMAGES.xlsIcon
                    : IMAGES.pdfIcon
              }
              alt={record.is_folder ? "Folder" : "File"}
            />
          </div>
          <div className="file-content">
            <div className="file-name">{record.name}</div>
            <div className="file-path">{record.is_folder ? "Folder" : "File"}</div>
            {record.is_folder && <i className="erm-icon next-icon" />}
          </div>
        </div>
      ),
    },
    {
      title: "SharePoint Path",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified_datetime",
      key: "last_modified_datetime",
      render: (text: string) => {
        if (!text) return "-";
        const date = new Date(text);
        return (
          <>
            <div className="table-date">{date.toLocaleDateString()}</div>
            <div className="table-date">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          </>
        );
      },
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
            items={breadcrumbs.map((b) => ({
              title: (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBreadcrumbClick(b.path)}
                >
                  {b.name}
                </span>
              ),
            }))}
          />
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      size={550}
      footer={
        <div className="drawer-footer">
          <div className="selected-count">
            <CloseOutlined className="clear-icon" onClick={() => {
              // Only clear newly selected, keep synced ones
              const syncedKeys = SharePointList.filter((item) => isItemSynced(item)).map((item) => item.id);
              setSelectedRowKeys(syncedKeys);
            }} />
            <span>
              {newSelectedCount > 0
                ? `${newSelectedCount} new selected`
                : `${selectedRowKeys.length} selected`}
            </span>
          </div>
          <div className="footer-actions">
            <Button className="secondary-btn" shape="round" onClick={handleCancel} disabled={isSyncing}>
              CANCEL
            </Button>
            <Button
              className="primary-btn"
              shape="round"
              disabled={newSelectedCount === 0 || isSyncing}
              loading={isSyncing}
              onClick={handleSelect}
            >
              SYNC <i className="erm-icon arrow-right-icon" />
            </Button>
          </div>
        </div>
      }
    >
      <div className="sources-content">
        <Spin spinning={isSharepointListLoading}>
          <Table<ISharepointList>
            className="sources-table"
            rowSelection={{
              selectedRowKeys,
              onChange: (newSelectedRowKeys: React.Key[]) => setSelectedRowKeys(newSelectedRowKeys),
              getCheckboxProps: (record: ISharepointList) => ({
                disabled: isItemSynced(record),
              }),
            }}
            columns={columns}
            dataSource={SharePointList}
            pagination={false}
            rowKey="id"
          />
        </Spin>
      </div>
    </Drawer>
  );
};

export default SelectedSourcesDrawer;
