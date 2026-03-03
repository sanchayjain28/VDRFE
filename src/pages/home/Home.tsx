import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Statistic, Space, Typography, Spin } from "antd";
import { RecentActivity, ProjectCard, type Activity, type ProjectCardData } from "../../component/dashboard";
import { PATHS } from "../../shared/constants";
import { getProjects, type IProject } from "../../services/projects";
import "./Home.scss";

const { Title, Text } = Typography;

const mapProjectToCardData = (project: IProject): ProjectCardData => ({
  id: project.id,
  name: project.name,
  status: project.status === "inactive" ? "Inactive" : "Active",
  date: project.created_at
    ? new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "-",
  risk: project.risk_level === "high" ? "High Risk" : project.risk_level === "low" ? "Low Risk" : "Medium Risk",
  scope: {
    flagged: project.scope_flagged ?? 0,
    completed: project.scope_completed ?? 0,
    total: project.scope_total ?? 1,
  },
  documents: {
    completed: project.documents_completed ?? 0,
    inProgress: project.documents_in_progress ?? 0,
    total: project.documents_total ?? 1,
  },
  collaborators: (project.collaborators ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    avatar: c.avatar,
    role: c.role,
  })),
});

const Home = () => {
  const navigate = useNavigate();
  const [summaryData] = useState({
    redFlags: { current: 48, total: 60 },
    openScopeItems: { current: 48, total: 60 },
    reviewedDocuments: { current: 3, total: 100 },
  });

  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsProjectsLoading(true);
      const res = await getProjects({ limit: 12, page: 1, q: "" });
      if (res?.projects) {
        setProjects(res.projects.map(mapProjectToCardData));
      }
      setIsProjectsLoading(false);
    };
    fetchProjects();
  }, []);

  const [activities] = useState<Activity[]>([
    {
      id: "1",
      type: "upload",
      title: "128 documents uploaded | Air Quality",
      subtitle: "Shell • 2 hours ago",
      project: "Shell",
      timeAgo: "2 hours ago",
      isNew: true,
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
  ]);

  const handleCreateProject = () => {
    navigate(PATHS.createProject);
  };


  return (
    <div className="home-page">
      <div className="container">
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, marginBottom: 0 }}>
                Deal Room
              </Title>
              <Text type="secondary">
                Welcome back, Sarah. Here's what's happening with your projects.
              </Text>
            </Col>
            <Col>
              <Button type="primary" className="primary-btn" shape="round" onClick={handleCreateProject}>
                <i className="erm-icon plus-icon" />
                CREATE PROJECT
              </Button>
            </Col>
          </Row>

          {/* Summary Cards */}
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={8}>
              <div className="summary-card">
                <div className="summary-card-content">
                  <Statistic
                    title="Red Flags"
                    value={`${summaryData.redFlags.current}/${summaryData.redFlags.total}`}
                  />
                  <div className="summary-icon flag-icon">
                    <i className="erm-icon flag-icon" />
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div className="summary-card">
                <div className="summary-card-content">
                  <Statistic
                    title="Open Scope Items"
                    value={`${summaryData.openScopeItems.current}/${summaryData.openScopeItems.total}`}
                  />
                  <div className="summary-icon scope-icon">
                    <i className="erm-icon scope-icon" />
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div className="summary-card">
                <div className="summary-card-content">
                  <Statistic
                    title="Reviewed Documents"
                    value={`${summaryData.reviewedDocuments.current}/${summaryData.reviewedDocuments.total}`}
                  />
                  <div className="summary-icon check-icon">
                    <i className="erm-icon check-icon" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            {/* Projects Section */}
            <Col xs={24} sm={18}>

              <div>
                <Title level={4} className="section-title">
                  Projects ({projects.length})
                </Title>
                <Spin spinning={isProjectsLoading}>
                  <Row gutter={[20, 20]}>
                    {projects.map((project) => (
                      <Col xs={24} sm={12} lg={8} key={project.id}>
                        <ProjectCard project={project} />
                      </Col>
                    ))}
                  </Row>
                </Spin>
              </div>
            </Col>

            {/* Recent Activity Section */}
            <Col xs={24} sm={6}>
              <RecentActivity activities={activities} />
            </Col>
          </Row>
        </Space>
      </div>
    </div>
  );
};

export default Home;
