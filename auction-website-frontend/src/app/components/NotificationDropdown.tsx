import React from "react";

const NotificationsDropdown = ({ notifications, isOpen, onClose }) => {
  console.log("_______DDDDDDDDDDDD");
  console.log(notifications);
  return (
    <div
      style={{ top: "2rem" }}
      className={`absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <ul className="p-2 max-h-60 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li
              key={notif.id}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '346px',
                lineHeight: '1.2em',
                height: '3.4em',
                textAlign: 'left',
            }}
              className="p-2 border-b last:border-b-0 mb-2"
            >
              {notif.message}
            </li>
          ))
        ) : (
          <li className="p-2">No notifications available</li>
        )}
      </ul>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-500"
      >
        X
      </button>
    </div>
  );
};

export default NotificationsDropdown;
