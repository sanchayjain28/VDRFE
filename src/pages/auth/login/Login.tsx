import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { IMAGES, PATHS } from "../../../shared";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      {/* LEFT SECTION */}
      <div className="login-left">
        <img src={IMAGES.logo} alt="ERM Logo" className="erm-logo" />
        <div className="content-wrapper">
          <h1 className="title">M&A Workflow & Intelligence Platform </h1>
          <p>
            A unified, AI-powered platform for M&A teams to manage deal
            workflows, documents, and insights seamlessly integrated with
            existing VDRs and data sources.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <div className="login-box">
          <h3>Login</h3>
          <Button
            type="default"
            className="login-btn"
            onClick={() => navigate(PATHS.home)}
          >
            <img src={IMAGES.microsoft} alt="microsoft" /> Continue with
            Microsoft
          </Button>
          <div className="links">
            <a href="#">Contact Support</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
