// import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { IMAGES } from "../../shared/images";
import Notifications from "./notifications/Notifications";
import UserProfile from "./userProfile/UserProfile";
import { Flex } from "antd";
import { PATHS } from "../../shared";
import "./Header.scss";

const Header = () => {
  // const { pathname } = useLocation();

  // const HIDE_LOGO_ROUTES = [
  //   PATHS.ReportGenerator,
  //   PATHS.projectDetails,
  //   PATHS.projects,
  //   PATHS.chat,
  // ];

  // const hideLogo = HIDE_LOGO_ROUTES.some(
  //   (route) => pathname === route || pathname.startsWith(`${route}/`)
  // );

  return (
    <div className="main-header">
      <div className="header-left">
        {/* {!hideLogo && ( */}
        <div className="logo-ai">
          <img src={IMAGES.logo} alt="Logo" loading="lazy" />
        </div>
        <span className="logo-ai-text">VDR AI</span>
        {/* )} */}
      </div>

      <div className="header-center">
        <Flex align="center" gap="25px" className="header-center-links">
          <Link to={PATHS.home}>Home</Link>
          <Link to={PATHS.projects}>My Projects</Link>
        </Flex>
      </div>

      <div className="header-right">
        <Notifications />
        <UserProfile />
      </div>
    </div>
  );
};

export default Header;
