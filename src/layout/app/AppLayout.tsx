import { Outlet } from "react-router-dom";
import "./AppLayout.scss";
import { Header } from "../../component";

const AppLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
