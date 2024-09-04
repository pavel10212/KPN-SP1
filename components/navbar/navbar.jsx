"use client";

import { usePathname } from "next/navigation";
import { MdNotifications, MdMenu } from "react-icons/md";
import { useState, useEffect } from "react";

const Navbar = ({ className }) => {
  const pathname = usePathname();
  const pageName = pathname.split("/").pop();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update date once per day at midnight
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [currentDate]);

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <nav className={`bg-white shadow-md ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() =>
                document
                  .querySelector("aside")
                  .classList.toggle("-translate-x-full")
              }
            >
              <MdMenu size={24} />
            </button>
            <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-800 capitalize">
              {pageName}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-600 mr-4">
              {formatDate(currentDate)}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
