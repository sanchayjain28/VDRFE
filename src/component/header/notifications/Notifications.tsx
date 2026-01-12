import { Popover } from "antd";
import { useState } from "react";
import "./Notifications.scss";
import { IMAGES } from "../../../shared/images";

const notifications = [
  {
    id: 1,
    avatar: null,
    text: "Shell’s CPD Impact Assessment report is ready for your review...",
    time: "10:45 PM",
    unread: true,
  },
  {
    id: 2,
    avatar: null,
    text: "James sent back the documents you requested, and they are now ready for review.",
    time: "10:45 PM",
    unread: true,
  },
  {
    id: 3,
    avatar: null,
    text: "Shell’s CPD Impact Assessment report is ready for your review...",
    time: "10:45 PM",
    unread: true,
  },
];

const Notifications = () => {
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  return (
    <Popover
      rootClassName="notification-popover"
      trigger="click"
      placement="bottomRight"
      open={isOpenNotification}
      onOpenChange={(visible) => setIsOpenNotification(visible)}
      content={
        <>
          <div className="notification-popover">
            {/* Header */}
            <div className="notification-header">
              <h4>Notifications</h4>
              <span className="unread-count">2 unread</span>
            </div>

            <div className="notification-section-title">TODAY</div>

            {/* Notification items */}
            <div className="notification-list">
              {notifications.map((item) => (
                <div key={item.id} className="notification-item">
                  {/* Avatar */}
                  {item.avatar ? (
                    <img src={item.avatar} alt="avatar" className="notification-avatar" />
                  ) : (
                    <div className="notification-avatar fallback">S</div>
                  )}

                  {/* Text + Time */}
                  <div className="notification-content">
                    <p className="notification-text">{item.text}</p>
                    <span className="notification-time">{item.time}</span>
                  </div>

                  {/* Green unread dot */}
                  {item.unread && <span className="notification-dot"></span>}
                </div>
              ))}
            </div>
          </div>
        </>
      }>
      <div className="notification-wrapper">
        <img
          src={IMAGES.notificationIcon}
          alt="Notification Icon"
          className="notification-header-icon"
        />
        <span className="notification-count"></span>
      </div>
    </Popover>
  );
};

export default Notifications;
