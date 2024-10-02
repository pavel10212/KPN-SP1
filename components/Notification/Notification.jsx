import {useState, useRef, useEffect} from 'react';
import {MdNotifications, MdCheckCircle, MdClose} from "react-icons/md";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notification');
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    console.error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleNotifications = () => setIsOpen(!isOpen);

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch('/api/notification', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({notificationIds: [notificationId]}),
            });
            if (response.ok) {
                setNotifications(notifications.map(n =>
                    n.id === notificationId ? {...n, isRead: true} : n
                ));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={notificationRef}>
            <button
                className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                onClick={toggleNotifications}
            >
                <MdNotifications size={24}/>
                {unreadCount > 0 && (
                    <span
                        className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-96 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <MdClose size={20}/>
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${notification.isRead ? 'opacity-70' : ''}`}
                                >
                                    <div className="flex-grow">
                                        <div
                                            className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                                            {notification.title}
                                        </div>
                                        <div
                                            className={`mt-1 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
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
                                            <MdCheckCircle size={20}/>
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
        </div>
    );
};

export default Notification;