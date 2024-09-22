import {useState, useRef, useEffect} from 'react';
import {MdNotifications} from "react-icons/md";

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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications');
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

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={toggleNotifications}
            >
                <MdNotifications size={24}/>
            </button>
            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="px-4 py-2 text-sm text-gray-700 font-semibold">Notifications</div>
                        <div className="border-t border-gray-100"></div>
                        {notifications.map((notification) => (
                            <a
                                key={notification.id}
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                <div className="font-medium">{notification.message}</div>
                                <div
                                    className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</div>
                            </a>
                        ))}
                        {notifications.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;