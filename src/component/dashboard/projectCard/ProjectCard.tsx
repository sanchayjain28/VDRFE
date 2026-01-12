import { Card, Progress, Row, Col, Space, Typography, Divider, Flex, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { Collaborators } from "../../";
import { PATHS } from "../../../shared";
import "./ProjectCard.scss";

const { Title, Text } = Typography;

export interface ProjectCardData {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  date: string;
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  scope: {
    flagged: number;
    completed: number;
    total: number;
  };
  documents: {
    completed: number;
    inProgress?: number;
    total: number;
  };
  collaborators: string[];
}

interface ProjectCardProps {
  project: ProjectCardData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  
  const scopePercent = (project.scope.completed / project.scope.total) * 100;
  const docsCompletedPercent = (project.documents.completed / project.documents.total) * 100;
  const docsInProgressPercent = ((project.documents.inProgress || 0) / project.documents.total) * 100;
  const docsTotalPercent = docsCompletedPercent + docsInProgressPercent;

  const handleCardClick = () => {
    navigate(PATHS.projectDetails, { state: { projectId: project.id } });
  };

  return (
    <Card className="project-card" onClick={handleCardClick}>
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {project.name}
            </Title>
          </Col>
          <Col>
            <div className="status-badge">
              <i className={`erm-icon ${project.status === "Active" ? "active-icon" : "inactive-icon"}`} />
              <span className="status-title">{project.status}</span>
            </div>
          </Col>
        </Row>

        <Flex justify="space-between" align="center">
          <Space size="small" className="date-wrapper">
            <i className="erm-icon calendar-icon" />
            <span>{project.date}</span>
          </Space>
          <Space className={`risk-tag ${project.risk.toLowerCase().replace(" ", "-")}`}>
            <i className="erm-icon warning-icon" />
            <span>{project.risk}</span>
          </Space>
        </Flex>

        <div>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size="small">
                <i className="erm-icon scope-icon" />
                <Text style={{ fontSize: 12, color: "var(--primary)" }}>Scope</Text>
                {project.scope.flagged > 0 && (
                  <div className="scope-tag">
                    <i className="erm-icon flag-icon" />
                    <Divider orientation="vertical" style={{ height: "14px" }} />
                    <span className="scope-tag-text">{project.scope.flagged}</span>
                  </div>
                )}
              </Space>
            </Col>
            <Col>
              <Text style={{ fontSize: 12, color: "var(--primary)" }}>
                {project.scope.completed}/{project.scope.total}
              </Text>
            </Col>
          </Row>
          <div className="custom-progress">
            <Tooltip title={`${project.scope.completed}`}>
              <Progress
                percent={scopePercent}
                showInfo={false}
                strokeLinecap="round"
                className="progress-bar scope-progress"

              />
            </Tooltip>
          </div>
        </div>

        <div>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size="small">
                <i className="erm-icon file-blue-icon " />
                <Text style={{ fontSize: 12, color: "var(--primary)" }}>Documents</Text>
              </Space>
            </Col>
            <Col>
              <Text style={{ fontSize: 12, color: "var(--primary)" }}>
                {project.documents.completed}/{project.documents.total}
              </Text>
            </Col>
          </Row>

          <div className="custom-progress">
            <Tooltip title={`${project.documents.completed}`}>
              <Progress
                percent={docsTotalPercent}
                showInfo={false}
                strokeLinecap="round"
                className="progress-bar docs-progress"
              />
            </Tooltip>
          </div>
        </div>

        <Collaborators
          collaborators={project.collaborators.map((collaborator) => ({
            user_id: collaborator,
            user_name: collaborator.charAt(0),
            role: "Collaborator",
          }))}
        />
      </Space>
    </Card>
  );
};

export default ProjectCard;

