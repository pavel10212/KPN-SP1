"use client";

import { usePathname } from "next/navigation";
import { MdNotifications, MdMenu } from "react-icons/md";

const Navbar = ({ className }) => {
  const pathname = usePathname();
  const pageName = pathname.split("/").pop();

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
            <button className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full">
              <MdNotifications size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
