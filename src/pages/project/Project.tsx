import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Input, Button } from "antd";
import { ProjectCard, type ProjectCardData } from "../../component/dashboard";
import { PlusOutlined } from "@ant-design/icons";
import CustomPagination from "../../component/pagination/CustomPagination";
import { PATHS } from "../../shared";
import "./Project.scss";

const { Title } = Typography;

const Project = () => {
  const navigate = useNavigate();
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
          avatar: "https://i.pravatar.cc/150?img=1",
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=2",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=3",
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
          avatar: "https://i.pravatar.cc/150?img=1",
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=2",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=3",
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
          avatar: "https://i.pravatar.cc/150?img=1",
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=2",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Analyst",
        },
      ]
    },
    {
      id: "4",
      name: "Ford",
      status: "Inactive",
      date: "Mar 15, 2024",
      risk: "Low Risk",
      scope: { flagged: 3, completed: 5, total: 22 },
      documents: { completed: 981, inProgress: 200, total: 1556 },
      collaborators: [
        {
          id: "1",
          name: "Sarah Chen",
          avatar: "https://i.pravatar.cc/150?img=1",
          role: "Project Manager",
        },
        {
          id: "2",
          name: "James Whitmore",
          avatar: "https://i.pravatar.cc/150?img=2",
          role: "Technical Lead",
        },
        {
          id: "3",
          name: "Michael Anderson",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Analyst",
        },
      ],
    },
  ]);

  return (
    <div className="project-page-container">
      <div className="container">
        <Title level={2} className="section-title">
          <div className="section-title-left">My Projects</div>
          <div className="page-header-right">
            <div className="search-wrapper">
              <Input
                className="quick-search"
                placeholder="Search..."
                prefix={<i className="erm-icon search-icon" />}
              />
            </div>
            <Button type="primary" shape="round" className="primary-btn" icon={<PlusOutlined />} onClick={() => navigate(PATHS.createProject)}>
              CREATE PROJECT
            </Button>
          </div>
        </Title>
        <div className="project-list-wrapper">
          <Row gutter={[20, 20]}>
            {projects.map((project) => (
              <Col xs={24} sm={12} lg={6} key={project.id}>
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <CustomPagination
        currentPage={1}
        pageSize={10}
        total={50}
        handlePagination={(page) => console.log(page)}
        isHidePagination={false}
      />
    </div>
  );
};

export default Project;
