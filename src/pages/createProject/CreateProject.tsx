import { Breadcrumb, Button, Form, Input, Select, Radio } from "antd";
import { ScopeSidebar } from "../../component";
import "./CreateProject.scss";
import { IMAGES, PATHS } from "../../shared";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateProject = () => {
  const navigate = useNavigate();
  const [selectedVDR, setSelectedVDR] = useState<string>("firmex-1");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const handleCreateProject = () => {
    navigate(PATHS.projectDetails);
  };

  return (
    <>
      <div className="scope-page-container create-project-page">
        <div className="inner-app-wrap">
          <div className="inner-app-row">
            {/* LEFT SIDEBAR */}
            <div className="scope-sidebar">
              <ScopeSidebar
                showCheckboxes={true}
                selectedScopes={selectedScopes}
                onScopeSelectionChange={setSelectedScopes}
              />
            </div>

            {/* MAIN CONTENT */}
            <div className="content">
              <div className="scope-header-wrapper">
                <div className="scope-header">
                  <div className="breadcrumb-wrapper">
                    <Breadcrumb 
                      className="page-breadcrumb"
                      items={[
                        {
                          title: <span onClick={() => navigate(PATHS.home)} className="breadcrumb-clickable">Home</span>,
                        },
                        {
                          title: "Create Project",
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="scope-page-header">
                  <h2 className="page-heading">Create Project</h2>
                </div>
              </div>

              <div className="scope-details-content">
                <div className="create-project-form">
                  <Form layout="vertical" className="add-scope-form">
                    <Form.Item
                      name="scopeName"
                      label={<span>Project Name</span>}
                      required={false}
                      rules={[
                        { required: true, message: "Please enter project name" },
                        { min: 4, message: "project name must be at least 4 characters" },
                        { max: 100, message: "project name must not exceed 100 characters" },
                      ]}>
                      <Input className="input-field" placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[{ max: 500, message: "Description must not exceed 500 characters" }]}>
                      <Input.TextArea
                        className="textarea"
                        rows={3}
                        maxLength={500}
                        placeholder="Enter project description"
                      />
                    </Form.Item>

                    <Form.Item name="Services" label="Services">
                      <Select
                        className="dropdown-ui"
                        suffixIcon={
                          <>
                            <i className="erm-icon dropdown-arrow-icon" />
                            <i className="erm-icon dropdown-top-arrow-icon" />
                          </>
                        }>
                        <Select.Option value="Services">Services</Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
                <div className="project-card-wrapper">
                  <div className="project-card-header">
                    <h2 className="page-heading">Connect VDR</h2>
                    <p>Select your document source</p>
                  </div>
                  <Radio.Group
                    value={selectedVDR}
                    onChange={(e) => setSelectedVDR(e.target.value)}
                    className="vdr-radio-group"
                  >
                    <div className="project-card-row">
                      <label className={`project-card-label ${selectedVDR === "firmex-1" ? "selected" : ""}`}>
                        <Radio value="firmex-1" />
                        <div className="project-card">
                          <span className="project-card-icon">
                            <img src={IMAGES.firmexImg} alt="Firmex" />
                          </span>
                          <h5>Firmex Integration</h5>
                          <p>
                            Integrate Firmex with your M&A platform to automate document ingestion,
                            permissions, and downstream analysis.
                          </p>
                        </div>
                      </label>
                      <label className={`project-card-label ${selectedVDR === "ansarada-1" ? "selected" : ""}`}>
                        <Radio value="ansarada-1" />
                        <div className="project-card">
                          <span className="project-card-icon">
                            <img src={IMAGES.ansarada} alt="Ansarada" />
                          </span>
                          <h5>Ansarada Integration</h5>
                          <p>
                            Integrate Ansarada to support governed, view-only document workflows aligned
                            with its encryption and security model.
                          </p>
                        </div>
                      </label>
                      <label className={`project-card-label ${selectedVDR === "firmex-2" ? "selected" : ""}`}>
                        <Radio value="firmex-2" />
                        <div className="project-card">
                          <span className="project-card-icon">
                            <img src={IMAGES.firmexImg} alt="Firmex" />
                          </span>
                          <h5>Firmex Integration</h5>
                          <p>
                            Integrate Firmex with your M&A platform to automate document ingestion,
                            permissions, and downstream analysis.
                          </p>
                        </div>
                      </label>
                      <label className={`project-card-label ${selectedVDR === "ansarada-2" ? "selected" : ""}`}>
                        <Radio value="ansarada-2" />
                        <div className="project-card">
                          <span className="project-card-icon">
                            <img src={IMAGES.ansarada} alt="Ansarada" />
                          </span>
                          <h5>Ansarada Integration</h5>
                          <p>
                            Integrate Ansarada to support governed, view-only document workflows aligned
                            with its encryption and security model.
                          </p>
                        </div>
                      </label>
                      <label className={`project-card-label ${selectedVDR === "sharepoint" ? "selected" : ""}`}>
                        <Radio value="sharepoint" />
                        <div className="project-card">
                          <span className="project-card-icon">
                            <img src={IMAGES.sharepoint} alt="SharePoint" />
                          </span>
                          <h5>SharePoint Integration</h5>
                          <p>
                            Integrate SharePoint with your M&A platform to automate document ingestion,
                            permissions, and downstream analysis.
                          </p>
                        </div>
                      </label>
                    </div>
                  </Radio.Group>
                </div>
              </div>
              <div className="create-project-footer">
                <Button className="secondary-btn" size="large" shape="round">
                  Cancel
                </Button>
                <Button className="primary-btn" type="primary" size="large" shape="round" onClick={handleCreateProject}>
                  CREATE PROJECT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
