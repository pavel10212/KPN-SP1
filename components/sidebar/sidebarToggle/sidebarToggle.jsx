"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";

const SidebarToggle = ({ children, className }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleLinkClick = (e) => {
      if (window.innerWidth < 1024 && e.target.closest("a")) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-indigo-500 text-white p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        <MdMenu className="text-2xl" />
      </button>

      <aside
        className={`${className} transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed top-0 left-0 h-full z-40`}
      >
        <div className="relative h-full">
          {isSidebarOpen && (
            <button
              className="absolute top-4 right-4 z-50 lg:hidden bg-indigo-500 text-white p-2 rounded-full shadow-lg"
              onClick={toggleSidebar}
            >
              <MdClose className="text-2xl" />
            </button>
          )}
          {children}
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SidebarToggle;
