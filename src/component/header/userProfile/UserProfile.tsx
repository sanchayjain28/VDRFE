import { Avatar, Dropdown, type MenuProps } from "antd";
import { persistStore } from "redux-persist";
import { store } from "../../../store";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../shared";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    persistStore(store).purge();
    navigate(PATHS.login);
  };

  const items: MenuProps["items"] = [
    {
      key: "configuration",
      label: "Configuration",
      icon: <i className="erm-icon settings"></i>,
      className: "common-dropdown-item",
    },
    {
      key: "guides",
      label: "Guides",
      icon: <i className="erm-icon guides"></i>,
      className: "common-dropdown-item",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <i className="erm-icon logout"></i>,
      className: "common-dropdown-item",
      onClick: () => handleLogout(),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} className="user-profile-dropdown">
      <Avatar className="userAvatar" style={{ cursor: "pointer" }}>
        S
      </Avatar>
    </Dropdown>
  );
};

export default UserProfile;
