import { Outlet, useLocation, Navigate } from "react-router-dom";
import { LocalStorageName, PATHS } from "../../shared";

const PersistLogin = () => {
  const { pathname } = useLocation();

  const isLogin = localStorage.getItem(LocalStorageName.Token);

  const publicPages: string[] = [PATHS.login];

  const renderContent = () => {
    if (isLogin) {
      if (publicPages.includes(pathname)) {
        return <Navigate to={PATHS.home} />;
      } else {
        return <Outlet />;
      }
    }

    return <Outlet />;
  };

  return renderContent();
};

export default PersistLogin;
