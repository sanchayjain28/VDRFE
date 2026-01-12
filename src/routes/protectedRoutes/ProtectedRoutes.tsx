import { Navigate, Outlet } from "react-router-dom";
import { LocalStorageName, PATHS } from "../../shared";

const ProtectedRoute = () => {
  const isLogin = localStorage.getItem(LocalStorageName.Token);

  const renderContent = () => {
    if (!isLogin) {
      return <Navigate to={PATHS.login} />;
    }

    return <Outlet />;
  };

  return renderContent();
};

export default ProtectedRoute;
