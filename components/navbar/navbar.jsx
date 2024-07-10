"use client";

import { usePathname } from "next/navigation";
import { MdNotifications, MdSearch } from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  const pageName = pathname.split("/").pop();

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {pageName}
          </h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <MdSearch className="absolute right-3 top-2.5 text-gray-500 text-xl" />
            </div>
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
