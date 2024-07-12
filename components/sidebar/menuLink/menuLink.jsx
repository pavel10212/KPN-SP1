"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuLink = ({ item, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`flex items-center py-3 px-8 text-base font-medium transition-colors duration-200 ${
        isActive
          ? "text-indigo-600 bg-indigo-50"
          : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
      onClick={onClick}
    >
      <span className="mr-4">{item.icon}</span>
      {item.title}
    </Link>
  );
};

export default MenuLink;
