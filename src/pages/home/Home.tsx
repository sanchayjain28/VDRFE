import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Statistic, Space, Typography } from "antd";
import { RecentActivity, ProjectCard, type Activity, type ProjectCardData } from "../../component/dashboard";
import { PATHS } from "../../shared/constants";
import { IMAGES } from "../../shared";
import "./Home.scss";

const { Title, Text } = Typography;


const Home = () => {
  const navigate = useNavigate();
  const [summaryData] = useState({
    redFlags: { current: 48, total: 60 },
    openScopeItems: { current: 48, total: 60 },
    reviewedDocuments: { current: 3, total: 100 },
  });

  const [projects] = useState<ProjectCardData[]>([
    {
      id: "1",
      name: "Shell",
      status: "Active",
      date: "Mar 15, 2024",
      risk: "Medium Risk",
      scope: { flagged: 13, completed: 5, total: 22 },
      documents: { completed: 981, inProgress: 200, total: 1556 },
      collaborators: [
        {
          id: "1",
          name: "Sarah Chen",
          avatar: IMAGES.avatarImage,
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=12",
          role: "Analyst",
        },
      ],
    },
    {
      id: "2",
      name: "ExxonMobil",
      status: "Active",
      date: "Mar 15, 2024",
      risk: "High Risk",
      scope: { flagged: 3, completed: 5, total: 22 },
      documents: { completed: 981, inProgress: 200, total: 1556 },
      collaborators: [
        {
          id: "1",
          name: "Sarah Chen",
          avatar: IMAGES.avatarImage,
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=12",
          role: "Analyst",
        },
      ],
    },
    {
      id: "3",
      name: "Ford",
      status: "Active",
      date: "Mar 15, 2024",
      risk: "Low Risk",
      scope: { flagged: 3, completed: 5, total: 22 },
      documents: { completed: 981, inProgress: 200, total: 1556 },
      collaborators: [
        {
          id: "1",
          name: "Sarah Chen",
          avatar: IMAGES.avatarImage,
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=12",
          role: "Analyst",
        },
        {
          id: "4",
          name: "Emily Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=47",
          role: "Designer",
        },
        {
          id: "5",
          name: "David Kim",
          avatar: "https://i.pravatar.cc/150?img=33",
          role: "Developer",
        },
        {
          id: "6",
          name: "Lisa Thompson",
          avatar: "https://i.pravatar.cc/150?img=45",
          role: "QA Engineer",
        },
        {
          id: "7",
          name: "Robert Martinez",
          avatar: "https://i.pravatar.cc/150?img=15",
          role: "Business Analyst",
        },
        {
          id: "8",
          name: "Jennifer Lee",
          avatar: "https://i.pravatar.cc/150?img=20",
          role: "Product Owner",
        },
      ],
    },
  ]);

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
                <Row gutter={[20, 20]}>
                  {projects.map((project) => (
                    <Col xs={24} sm={12} lg={8} key={project.id}>
                      <ProjectCard project={project} />
                    </Col>
                  ))}
                </Row>
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
