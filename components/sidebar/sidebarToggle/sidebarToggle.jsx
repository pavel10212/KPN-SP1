"use client";

import React, { useState, useCallback, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";

const SidebarToggle = ({ children, className }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
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
        closeSidebar();
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => document.removeEventListener("click", handleLinkClick);
  }, [closeSidebar]);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-indigo-500 text-white p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <MdClose className="text-2xl" />
        ) : (
          <MdMenu className="text-2xl" />
        )}
      </button>

      <aside
        className={`${className} transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {children}
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SidebarToggle;
