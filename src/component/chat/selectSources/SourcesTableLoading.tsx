import { Card, Col, Row, Skeleton, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface SkeletonTableProps {
  skeletonLength: number;
}
const SourcesTableLoading = (props: SkeletonTableProps) => {
  const { skeletonLength } = props;

  const columns: ColumnsType<any> = [
    {
      title: "Title",
      key: "name",
      width: "50%",
      render: () => (
        <div className="file-info">
          <div className="doc-icon">
            <Skeleton.Input style={{ width: 20, height: 20 }} active />
          </div>
        </div>
      ),
    },
    {
      title: "SharePoint File Path",
      key: "resource_path",
      render: () => (
        <div className="file-path">
          <Skeleton.Input style={{ width: "100%", height: 14 }} active />
        </div>
      ),
    },
  ];

  return (
    <div className="page-content top-container">
      <Row>
        <Col className="global-table-card table-ui" span={24}>
          <Card>
            <Table
              className="global-table responsive-table responsive-table-user-management"
              columns={columns}
              dataSource={Array.from({ length: skeletonLength || 8 })}
              tableLayout="fixed"
              scroll={{ y: "calc(100vh - 315px)" }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SourcesTableLoading;
