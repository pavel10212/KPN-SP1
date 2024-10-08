import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdCheckCircle,
  MdClose,
  MdChat,
} from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { database } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

dayjs.extend(relativeTime);

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsMessagesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notification");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchUser();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = fetchMessages();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (isMessagesOpen) {
      setIsMessagesOpen(false);
    }
  };

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const fetchMessages = () => {
    if (!user) return;

    console.log("Fetching messages for user:", user);

    const messagesRef = collection(database, "messages");
    const unreadMessagesQuery = query(
      messagesRef,
      where("teamId", "==", user.teamId),
      where("isRead", "==", false),
      where("senderId", "!=", user.id)
    );

    const unsub = onSnapshot(
      unreadMessagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched unread messages:", fetchedMessages);
        setMessages(fetchedMessages);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages: " + error.message);
        setIsLoading(false);
      }
    );

    return unsub;
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched user:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user: " + error.message);
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative" ref={notificationRef}>
      <div className="flex">
        <div className="flex">
          {/* Notifications Button Wrapper */}
          <div className="relative mr-2">
            <button
              className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={toggleNotifications}
            >
              <MdNotifications size={24} />
            </button>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </div>

          {/* Messages Button Wrapper */}
          <div className="relative">
            <button
              className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={toggleMessages}
            >
              <MdChat size={24} />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-0 top-auto mx-auto mt-2 w-full max-w-xs sm:w-96 sm:absolute sm:right-0 sm:left-auto sm:top-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
          <div
            className="py-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <MdClose size={20} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-10rem)] sm:max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                    notification.isRead ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex-grow">
                    <div
                      className={`font-medium ${
                        notification.isRead ? "text-gray-600" : "text-gray-800"
                      }`}
                    >
                      {notification.title}
                    </div>
                    <div
                      className={`mt-1 text-sm ${
                        notification.isRead ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {dayjs(notification.createdAt).fromNow()}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    >
                      <MdCheckCircle size={20} />
                    </button>
                  )}
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Dropdown */}
      {isMessagesOpen && (
        <div className="fixed inset-x-0 top-auto mx-auto mt-2 w-full max-w-xs sm:w-96 sm:absolute sm:right-0 sm:left-auto sm:top-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
          <div
            className="py-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
              <button
                onClick={() => setIsMessagesOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <MdClose size={20} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-10rem)] sm:max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800">
                      {message.senderName}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {message.message}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {dayjs(message.timestamp).fromNow()}
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  <p>No new messages</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
