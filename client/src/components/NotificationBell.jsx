
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function NotificationBell() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const onConnect = () => {
      console.log("Socket.IO connected:", socket.id);
      setConnected(true);
    };

    const onDisconnect = () => {
      console.log("Socket.IO disconnected");
      setConnected(false);
    };

    const onNotification = (data) => {
      setNotifications((previous) => [
        {
          id: crypto.randomUUID(),
          message: data.message,
        },
        ...previous,
      ]);

      setUnread((count) => count + 1);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("bookNotification", onNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("bookNotification", onNotification);
      socket.disconnect();
    };
  }, []);

  const toggleNotifications = () => {
    setOpen((current) => !current);
    setUnread(0);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleNotifications}
        aria-label="Notifications"
        className="relative rounded-lg bg-slate-800 px-4 py-2 text-white"
      >
        🔔

        {unread > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 text-xs text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-xl bg-white p-4 text-slate-900 shadow-xl">
          <h3 className="mb-3 font-bold">
            Notifications
          </h3>

          {!connected && (
            <p className="text-sm text-red-600">
              Reconnecting to server...
            </p>
          )}

          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <p
                key={notification.id}
                className="border-b py-2 text-sm"
              >
                {notification.message}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
